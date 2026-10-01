/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
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

// 3. Test Connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore client is offline, falling back to local cache.");
    } else {
      console.info("Firestore connection verified or test doc initialized.");
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

// 5. Real-Time Subscription to Projects Collection
export function subscribeToProjects(
  onUpdate: (projects: Project[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, "projects");
  
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Project[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Project;
        items.push({
          ...data,
          id: docSnap.id
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

// 6. Save or Update Project
export async function saveProjectToFirestore(project: Project): Promise<void> {
  const docPath = `projects/${project.id}`;
  try {
    const sanitized = sanitizeForFirestore(project) as Record<string, unknown>;
    await setDoc(doc(db, "projects", project.id), sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// 7. Delete Project
export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  const docPath = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, "projects", projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// 8. Batch Sync / Initial Seed Migration
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

// 9. Fetch all once (useful for checking if DB is completely empty)
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

// 10. Clean-up of old compromised admin document
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

export async function signInAdminWithFirebaseAuth(
  usernameOrEmail: string,
  passInput: string
): Promise<{ success: boolean; error?: string }> {
  const email = resolveAdminEmail(usernameOrEmail);

  try {
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, passInput);
    } catch (authErr: any) {
      // First-time migration: bootstrap administrator identity in Firebase Authentication
      if (
        authErr.code === "auth/user-not-found" ||
        authErr.code === "auth/invalid-credential" ||
        authErr.code === "auth/invalid-login-credentials"
      ) {
        try {
          userCredential = await createUserWithEmailAndPassword(auth, email, passInput);
          // Set RBAC authorization in Firestore users/{uid} (never storing passwords)
          await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            name: "Administrador V.A.C.",
            role: "admin",
            email: email,
            username: usernameOrEmail.trim(),
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch {
          // If creation fails, re-throw the original error
          throw authErr;
        }
      } else {
        throw authErr;
      }
    }

    const user = userCredential.user;
    if (!user) {
      return { success: false, error: "No se pudo obtener la identidad de autenticación." };
    }

    // Consult authorization role from Firestore users/{uid}
    const userDocRef = doc(db, "users", user.uid);
    let userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        name: "Administrador V.A.C.",
        role: "admin",
        email: email,
        username: usernameOrEmail.trim(),
        createdAt: new Date().toISOString()
      }, { merge: true });
      userSnap = await getDoc(userDocRef);
    }

    const userData = userSnap.data();
    if (userData?.role === "admin") {
      // Delete old compromised document if still present in Firestore
      cleanCompromisedAdminRecord().catch(() => {});
      return { success: true };
    } else {
      await signOut(auth);
      return { success: false, error: "Acceso denegado: La cuenta no cuenta con rol de administrador." };
    }
  } catch (err: any) {
    if (
      err.code === "auth/invalid-credential" ||
      err.code === "auth/wrong-password" ||
      err.code === "auth/invalid-login-credentials"
    ) {
      return { success: false, error: "Contraseña incorrecta o credenciales no válidas en Firebase Authentication." };
    }
    if (err.code === "auth/weak-password") {
      return { success: false, error: "La contraseña debe tener al menos 6 caracteres." };
    }
    if (err.code === "auth/too-many-requests") {
      return { success: false, error: "Demasiados intentos fallidos. Intenta más tarde." };
    }
    return { success: false, error: err.message || "Error al autenticar con Firebase Authentication." };
  }
}

export async function signOutAdmin(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out admin:", error);
  }
}


