/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  collection, 
  getDocFromServer, 
  getDoc,
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDocs,
  writeBatch
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { Project } from "./types";

// 1. Initialize Firebase App and Firestore
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

// 2. Structured Error Handler conforming to Firebase Skill
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 3. Test Connection on boot (Read-Only)
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore client is offline.");
    } else {
      console.info("Firestore connection verified.");
    }
    return false;
  }
}

// 4. Clean data helper (remove undefined fields which Firestore rejects)
function sanitizeForFirestore(obj: unknown): unknown {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    }
  }
  return clean;
}

// 5. Real-time Subscription to Projects (ADMIN ONLY)
export function subscribeToProjects(
  onUpdate: (projects: Project[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = collection(db, "projects");
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Project[] = [];
      snapshot.forEach((d) => {
        items.push({
          ...(d.data() as Project),
          id: d.id
        });
      });
      // Sort newest updated first
      items.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
      onUpdate(items);
    },
    (error) => {
      console.error("Error subscribing to projects in Firestore:", error);
      try {
        handleFirestoreError(error, OperationType.LIST, "projects");
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  );
}

// 6. Save or Update Project (Admin can update, Public can create with initial status "Pendiente")
export async function saveProjectToFirestore(project: Project): Promise<void> {
  const docPath = `projects/${project.id}`;
  try {
    const sanitized = sanitizeForFirestore(project) as Record<string, unknown>;
    await setDoc(doc(db, "projects", project.id), sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// 7. Delete Project (Admin Only)
export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  const docPath = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, "projects", projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// 8. Batch Sync / Migration (Admin Only)
export async function syncAllProjectsToFirestore(projects: Project[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const proj of projects) {
      const sanitized = sanitizeForFirestore(proj) as Record<string, unknown>;
      const ref = doc(db, "projects", proj.id);
      batch.set(ref, sanitized, { merge: true });
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "projects/batch");
  }
}

// 9. Fetch all once (Admin Only)
export async function fetchProjectsOnce(): Promise<Project[]> {
  try {
    const snapshot = await getDocs(collection(db, "projects"));
    const items: Project[] = [];
    snapshot.forEach((d) => {
      items.push({ ...(d.data() as Project), id: d.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "projects");
    return [];
  }
}

// 10. Clean-up of old compromised admin document (one-time safety)
export async function cleanCompromisedAdminRecord(): Promise<void> {
  try {
    await deleteDoc(doc(db, "admins", "Vlad01"));
  } catch {
    // Ignore if not present
  }
}

// 11. Secure Admin Authentication with Firebase Auth & Firestore RBAC
export function resolveAdminEmail(usernameOrEmail: string): string {
  const clean = usernameOrEmail.trim().toLowerCase();
  if (clean.includes("@")) {
    return clean;
  }
  return `${clean}@vaccreative.studio`;
}

/**
 * Validates admin login exclusively using signInWithEmailAndPassword.
 * Strictly forbids automatic user creation or auto-promotion to role: "admin".
 */
export async function signInAdminWithFirebaseAuth(
  usernameOrEmail: string,
  passInput: string
): Promise<{ success: boolean; error?: string }> {
  const email = resolveAdminEmail(usernameOrEmail);

  try {
    // 1. Authenticate against Firebase Authentication (NO user creation)
    const userCredential = await signInWithEmailAndPassword(auth, email, passInput);
    const user = userCredential.user;

    if (!user) {
      return { 
        success: false, 
        error: "No se pudo obtener la identidad de autenticación." 
      };
    }

    // 2. Consult Firestore users/{uid} for role authorization (NO auto-creation of role admin)
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      // User is in Firebase Auth but has no entry in users collection
      await signOut(auth);
      return { 
        success: false, 
        error: "Cuenta autenticada, pero no autorizada como administrador." 
      };
    }

    const userData = userSnap.data();
    if (userData?.role === "admin") {
      // Validated administrator
      cleanCompromisedAdminRecord().catch(() => {});
      return { success: true };
    } else {
      // Account exists but role is not admin
      await signOut(auth);
      return { 
        success: false, 
        error: "Cuenta autenticada, pero no autorizada como administrador." 
      };
    }
  } catch (err: any) {
    console.error("Admin Authentication Failure:", err);
    if (
      err.code === "auth/user-not-found" || 
      err.code === "auth/invalid-credential" || 
      err.code === "auth/wrong-password" ||
      err.code === "auth/invalid-login-credentials"
    ) {
      return { 
        success: false, 
        error: "Esta cuenta administrativa no está configurada en Firebase Authentication o las credenciales son incorrectas." 
      };
    }
    if (err.code === "auth/too-many-requests") {
      return { 
        success: false, 
        error: "Demasiados intentos fallidos. Intenta más tarde." 
      };
    }
    if (err.code === "auth/network-request-failed") {
      return { 
        success: false, 
        error: "Error de conexión. Verifica tu conexión a internet e intenta nuevamente." 
      };
    }
    return { 
      success: false, 
      error: "Credenciales incorrectas o acceso no autorizado." 
    };
  }
}

/**
 * Signs out admin and terminates any active Firebase session.
 */
export async function signOutAdmin(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out admin:", error);
  }
}

/**
 * Checks if the currently signed-in user has verified admin role in Firestore.
 */
export async function checkCurrentUserIsAdmin(): Promise<{ isAdmin: boolean; user: User | null; roleName?: string }> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { isAdmin: false, user: null };
  }
  try {
    const userDocRef = doc(db, "users", currentUser.uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists() && snap.data()?.role === "admin") {
      return { 
        isAdmin: true, 
        user: currentUser, 
        roleName: snap.data()?.name || "Administrador V.A.C." 
      };
    }
  } catch (error) {
    console.warn("Could not verify admin role:", error);
  }
  return { isAdmin: false, user: currentUser };
}
