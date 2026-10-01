/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

// 10. Admin Authentication & Management in Firebase
export async function ensureAdminUserCreated(): Promise<void> {
  try {
    const adminRef = doc(db, "admins", "Vlad01");
    await setDoc(adminRef, {
      username: "Vlad01",
      password: "Dis321",
      role: "admin",
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.info("Admin user Vlad01 verified in Firestore.");
  } catch (err) {
    console.warn("Could not ensure admin in Firestore", err);
  }
}

export async function verifyAdminCredentials(user: string, pass: string): Promise<boolean> {
  const trimmedUser = user.trim();
  const trimmedPass = pass.trim();
  try {
    const adminSnap = await getDoc(doc(db, "admins", trimmedUser));
    if (adminSnap.exists()) {
      const data = adminSnap.data();
      return data.password === trimmedPass;
    }
  } catch (err) {
    console.warn("Error verifying admin against Firestore, checking fallback", err);
  }
  // Fallback if offline
  return trimmedUser.toLowerCase() === "vlad01" && trimmedPass === "Dis321";
}

