/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ProjectMediaFile, PendingUploadFile } from "../types";
import { getDescriptiveProjectName } from "../utils/projectUtils";

export interface DriveFolderResult {
  ok: boolean;
  folderId?: string;
  folderUrl?: string;
  uploadsFolderId?: string;
  referencesFolderId?: string;
  finalFilesFolderId?: string;
  error?: string;
}

export interface DriveUploadResult {
  ok: boolean;
  file?: ProjectMediaFile;
  error?: string;
}

/**
 * Solicita de forma segura la creación o recuperación de la carpeta en Google Drive
 * a través del endpoint serverless del backend (/api/drive-folder).
 * 
 * NUNCA envía ni maneja secretos en el navegador cliente.
 */
export async function createOrGetDriveFolderForProject(
  project: Project
): Promise<DriveFolderResult> {
  // Si el proyecto ya tiene carpeta de Drive configurada, reutilizarla sin duplicar llamadas
  if (project.driveFolderId && project.driveFolderUrl) {
    return {
      ok: true,
      folderId: project.driveFolderId,
      folderUrl: project.driveFolderUrl,
      uploadsFolderId: project.driveUploadsFolderId,
      referencesFolderId: project.driveReferencesFolderId,
      finalFilesFolderId: project.driveFinalFilesFolderId
    };
  }

  const projectName = getDescriptiveProjectName(project);
  const serviceType = project.type || "Servicio Digital";
  const trackingCode = project.trackingCode || "";

  try {
    const response = await fetch("/api/drive-folder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        serviceType,
        projectName,
        trackingCode
      })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data?.error || `Error del servidor (${response.status}) al crear la carpeta en Google Drive.`
      };
    }

    return {
      ok: true,
      folderId: data.folderId,
      folderUrl: data.folderUrl,
      uploadsFolderId: data.uploadsFolderId,
      referencesFolderId: data.referencesFolderId,
      finalFilesFolderId: data.finalFilesFolderId
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "No se pudo conectar con el endpoint de creación de carpeta."
    };
  }
}

/**
 * Helper para leer un File como Base64 transitorio en memoria
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extraer solo la parte base64 sin el prefijo data:...;base64,
      const commaIndex = result.indexOf(",");
      if (commaIndex !== -1) {
        resolve(result.substring(commaIndex + 1));
      } else {
        resolve(result);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Sube un archivo a Google Drive a través del endpoint seguro /api/drive-upload
 * El Base64 es solo transitorio y NUNCA se persiste en Firestore.
 */
export async function uploadFileToDrive(
  folderId: string,
  file: File,
  fileCustomId?: string
): Promise<DriveUploadResult> {
  try {
    const fileBase64 = await readFileAsBase64(file);

    const response = await fetch("/api/drive-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        folderId,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileData: fileBase64
      })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data?.error || `Error del servidor (${response.status}) al subir ${file.name} a Drive.`
      };
    }

    const uploadedMedia: ProjectMediaFile = {
      id: fileCustomId || `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: data.fileUrl || (data.fileId ? `https://drive.google.com/file/d/${data.fileId}/view` : ""),
      driveFileId: data.fileId
    };

    return {
      ok: true,
      file: uploadedMedia
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || `Fallo de conexión al subir ${file.name} a Google Drive.`
    };
  }
}

/**
 * Sube un lote de archivos pendientes a la carpeta de Drive del proyecto
 */
export async function uploadPendingFilesToDrive(
  folderId: string,
  pendingFiles: PendingUploadFile[],
  onFileStatusUpdate?: (fileId: string, status: "uploading" | "success" | "error", errorMsg?: string) => void
): Promise<{ successfulFiles: ProjectMediaFile[]; failedCount: number }> {
  const successfulFiles: ProjectMediaFile[] = [];
  let failedCount = 0;

  for (const item of pendingFiles) {
    if (item.status === "success" && item.uploadedResult) {
      successfulFiles.push(item.uploadedResult);
      continue;
    }

    if (onFileStatusUpdate) {
      onFileStatusUpdate(item.id, "uploading");
    }

    const result = await uploadFileToDrive(folderId, item.file, item.id);

    if (result.ok && result.file) {
      successfulFiles.push(result.file);
      if (onFileStatusUpdate) {
        onFileStatusUpdate(item.id, "success");
      }
    } else {
      failedCount++;
      if (onFileStatusUpdate) {
        onFileStatusUpdate(item.id, "error", result.error);
      }
    }
  }

  return { successfulFiles, failedCount };
}

