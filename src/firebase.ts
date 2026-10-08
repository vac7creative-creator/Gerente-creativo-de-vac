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
import { Project, ProjectStatus } from "./types";
import { createOrGetDriveFolderForProject, DriveFolderResult } from "./services/driveService";

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

// 4. Clean data helper (remove undefined fields and strip large Base64 blobs from Firestore)
function sanitizeForFirestore(obj: unknown): unknown {
  if (obj === undefined) return null;
  if (obj === null) return null;

  if (typeof obj === "string") {
    // Defense-in-depth: Never persist heavy Base64 or Data URLs in Firestore
    if (obj.startsWith("data:") || (obj.length > 2048 && /^[A-Za-z0-9+/=]+$/.test(obj.substring(0, 100)))) {
      return "";
    }
    return obj;
  }

  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj
      .map(sanitizeForFirestore)
      .filter((item) => {
        if (typeof item === "string" && item.length === 0) return false;
        return true;
      });
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

// 6. Save or Update Project (Admin can update)
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

export async function signInAdminWithFirebaseAuth(
  usernameOrEmail: string,
  passInput: string
): Promise<{ success: boolean; error?: string }> {
  const email = resolveAdminEmail(usernameOrEmail);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, passInput);
    const user = userCredential.user;

    if (!user) {
      return { 
        success: false, 
        error: "No se pudo obtener la identidad de autenticación." 
      };
    }

    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      await signOut(auth);
      return { 
        success: false, 
        error: "Cuenta autenticada, pero no autorizada como administrador." 
      };
    }

    const userData = userSnap.data();
    if (userData?.role === "admin") {
      cleanCompromisedAdminRecord().catch(() => {});
      return { success: true };
    } else {
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

export async function signOutAdmin(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out admin:", error);
  }
}

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

// ==========================================
// 12. SECURE TRACKING SYSTEM FUNCTIONS
// ==========================================

export function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = 6;
  const segmentLength = 4;
  const parts: string[] = ["VAC"];
  
  for (let s = 0; s < segments; s++) {
    let seg = "";
    const randomValues = new Uint8Array(segmentLength);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
    } else {
      for (let i = 0; i < segmentLength; i++) {
        randomValues[i] = Math.floor(Math.random() * chars.length);
      }
    }
    for (let i = 0; i < segmentLength; i++) {
      seg += chars[randomValues[i] % chars.length];
    }
    parts.push(seg);
  }
  return parts.join("-");
}

export function normalizeTrackingCode(input: string): string {
  if (!input) return "";
  return input.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
}

export function isValidTrackingCodeFormat(code: string): boolean {
  const regex = /^VAC-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return regex.test(code);
}

export async function createPublicOrderWithTracking(project: Project): Promise<{ trackingCode: string; driveFolderUrl?: string; driveError?: boolean }> {
  const projectId = project.id || (typeof crypto !== "undefined" && crypto.randomUUID ? `proj_${crypto.randomUUID()}` : `proj_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
  const trackingCode = project.trackingCode || generateTrackingCode();
  const now = new Date().toISOString();

  // 1. Intentar creación segura de carpeta en Google Drive usando el trackingCode idéntico
  let driveResult: DriveFolderResult | null = null;
  if (!project.driveFolderId) {
    try {
      driveResult = await createOrGetDriveFolderForProject({
        ...project,
        id: projectId,
        trackingCode
      });
    } catch (driveErr) {
      console.warn("Integración con Drive diferida o inaccesible temporalmente:", driveErr);
    }
  }

  // 2. Componer el proyecto con los datos de Drive si estuvieron disponibles
  const projectData: Project = {
    ...project,
    id: projectId,
    trackingCode,
    status: ProjectStatus.PENDIENTE,
    createdAt: project.createdAt || now,
    updatedAt: now,
    driveStatus: project.driveStatus || (driveResult?.ok && driveResult.folderId ? "ready" : (project.driveFolderId ? "ready" : "pending")),
    ...(driveResult?.ok && driveResult.folderId ? {
      driveFolderId: driveResult.folderId,
      driveFolderUrl: driveResult.folderUrl,
      driveUploadsFolderId: driveResult.uploadsFolderId,
      driveReferencesFolderId: driveResult.referencesFolderId,
      driveFinalFilesFolderId: driveResult.finalFilesFolderId
    } : (project.driveFolderId ? {
      driveFolderId: project.driveFolderId,
      driveFolderUrl: project.driveFolderUrl,
      driveUploadsFolderId: project.driveUploadsFolderId,
      driveReferencesFolderId: project.driveReferencesFolderId,
      driveFinalFilesFolderId: project.driveFinalFilesFolderId
    } : {}))
  };

  const trackingData = {
    trackingCode,
    projectId,
    serviceType: projectData.type,
    status: ProjectStatus.PENDIENTE,
    createdAt: projectData.createdAt,
    updatedAt: now,
    publicMessage: "Pedido recibido en cola de diseño del atelier."
  };

  // 3. Guardar pedido en Firestore (NUNCA bloquear el pedido si Drive falla)
  try {
    const batch = writeBatch(db);
    const projRef = doc(db, "projects", projectId);
    const trackRef = doc(db, "tracking", trackingCode);

    batch.set(projRef, sanitizeForFirestore(projectData), { merge: true });
    batch.set(trackRef, sanitizeForFirestore(trackingData), { merge: true });

    await batch.commit();
    return {
      trackingCode,
      driveFolderUrl: projectData.driveFolderUrl,
      driveError: driveResult ? !driveResult.ok : false
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `projects/${projectId}`);
    throw error;
  }
}

/**
 * Función administrativa para crear o reintentar la creación de carpeta en Google Drive
 * para un proyecto existente desde el panel de administración.
 */
export async function createDriveFolderForExistingProject(
  project: Project
): Promise<{ ok: boolean; folderUrl?: string; error?: string }> {
  if (project.driveFolderId && project.driveFolderUrl) {
    return { ok: true, folderUrl: project.driveFolderUrl };
  }

  const result = await createOrGetDriveFolderForProject(project);
  if (!result.ok || !result.folderId) {
    return { 
      ok: false, 
      error: result.error || "No se pudo generar la carpeta en Google Drive." 
    };
  }

  const updatedProject: Project = {
    ...project,
    driveFolderId: result.folderId,
    driveFolderUrl: result.folderUrl,
    driveUploadsFolderId: result.uploadsFolderId,
    driveReferencesFolderId: result.referencesFolderId,
    driveFinalFilesFolderId: result.finalFilesFolderId,
    driveStatus: "ready",
    updatedAt: new Date().toISOString()
  };

  await saveProjectToFirestore(updatedProject);
  return { ok: true, folderUrl: result.folderUrl };
}

export async function getPublicTrackingByCode(code: string): Promise<any> {
  const normalized = normalizeTrackingCode(code);
  if (!isValidTrackingCodeFormat(normalized)) {
    throw new Error("El formato del código de seguimiento no es válido.");
  }

  try {
    const trackDocRef = doc(db, "tracking", normalized);
    const snap = await getDoc(trackDocRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `tracking/${normalized}`);
    throw error;
  }
}

export async function updateProjectAndTracking(project: Project): Promise<Project> {
  if (!project.id) throw new Error("El ID del proyecto es requerido para guardar.");
  const trackingCode = project.trackingCode || generateTrackingCode();
  const now = new Date().toISOString();

  const updatedProject: Project = {
    ...project,
    trackingCode,
    updatedAt: now
  };

  const trackingData = {
    trackingCode,
    projectId: project.id,
    serviceType: project.type,
    status: project.status,
    createdAt: project.createdAt || now,
    updatedAt: now,
    publicMessage: `Actualizado a estado: ${project.status}`
  };

  try {
    const batch = writeBatch(db);
    const projRef = doc(db, "projects", project.id);
    const trackRef = doc(db, "tracking", trackingCode);

    batch.set(projRef, sanitizeForFirestore(updatedProject), { merge: true });
    batch.set(trackRef, sanitizeForFirestore(trackingData), { merge: true });

    await batch.commit();
    return updatedProject;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `projects/${project.id}`);
    throw error;
  }
}

export async function deleteProjectAndTracking(projectId: string, trackingCode?: string): Promise<void> {
  try {
    const batch = writeBatch(db);
    const projRef = doc(db, "projects", projectId);
    batch.delete(projRef);

    if (trackingCode) {
      const trackRef = doc(db, "tracking", trackingCode);
      batch.delete(trackRef);
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `projects/${projectId}`);
  }
}

export async function generateMissingTrackingCodesForAdmin(projects: Project[]): Promise<number> {
  let count = 0;
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  for (const proj of projects) {
    if (!proj.trackingCode) {
      const trackingCode = generateTrackingCode();
      const updatedProj = { ...proj, trackingCode, updatedAt: now };
      const trackingData = {
        trackingCode,
        projectId: proj.id,
        serviceType: proj.type,
        status: proj.status,
        createdAt: proj.createdAt || now,
        updatedAt: now,
        publicMessage: "Código de seguimiento generado por dirección."
      };

      const projRef = doc(db, "projects", proj.id);
      const trackRef = doc(db, "tracking", trackingCode);

      batch.set(projRef, sanitizeForFirestore(updatedProj), { merge: true });
      batch.set(trackRef, sanitizeForFirestore(trackingData), { merge: true });
      count++;
    }
  }

  if (count > 0) {
    await batch.commit();
  }
  return count;
}
