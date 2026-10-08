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
 * Helper para optimizar imágenes muy pesadas (>6MB) antes del transporte en Base64
 * sin deformar la imagen ni degradar agresivamente la calidad (0.92 JPEG).
 */
export async function optimizeImageFileIfNeeded(file: File): Promise<File> {
  // Si no es imagen o pesa menos de 5MB, mantener intacto el original
  if (!file.type.startsWith("image/") || file.size <= 5 * 1024 * 1024) {
    return file;
  }

  // Si es GIF o SVG, no comprimir con canvas
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDimension = 3840; // 4K resolution limit
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const optimizedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.92
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    } catch {
      resolve(file);
    }
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
    const fileToUpload = await optimizeImageFileIfNeeded(file);
    const fileBase64 = await readFileAsBase64(fileToUpload);

    const response = await fetch("/api/drive-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        folderId,
        fileName: fileToUpload.name,
        mimeType: fileToUpload.type || "application/octet-stream",
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

    const realFileId = typeof data.fileId === "string" ? data.fileId.trim() : "";
    if (!realFileId || realFileId === "undefined" || realFileId === "null") {
      return {
        ok: false,
        error: `No se recibió un fileId real de Google Drive para "${file.name}".`
      };
    }

    const uploadedMedia: ProjectMediaFile = {
      id: fileCustomId || `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: data.fileUrl || `https://drive.google.com/file/d/${realFileId}/view`,
      driveFileId: realFileId
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
 * Sube un lote de archivos pendientes a la carpeta de Drive del proyecto uno por uno
 */
export async function uploadPendingFilesToDrive(
  folderId: string,
  pendingFiles: PendingUploadFile[],
  onFileStatusUpdate?: (fileId: string, status: "pending" | "uploading" | "success" | "error", errorMsg?: string, uploadedFile?: ProjectMediaFile) => void,
  onProgressStep?: (current: number, total: number, fileName: string) => void
): Promise<{ successfulFiles: ProjectMediaFile[]; failedCount: number }> {
  const successfulFiles: ProjectMediaFile[] = [];
  let failedCount = 0;
  const total = pendingFiles.length;

  for (let i = 0; i < total; i++) {
    const item = pendingFiles[i];

    // Si ya fue subido exitosamente en un intento previo con fileId real, reutilizarlo sin volver a subir
    if (item.status === "success" && item.uploadedResult?.driveFileId) {
      if (!successfulFiles.some(f => f.driveFileId === item.uploadedResult!.driveFileId || f.id === item.uploadedResult!.id)) {
        successfulFiles.push(item.uploadedResult);
      }
      continue;
    }

    if (onProgressStep) {
      onProgressStep(i + 1, total, item.name);
    }

    if (onFileStatusUpdate) {
      onFileStatusUpdate(item.id, "uploading");
    }

    const result = await uploadFileToDrive(folderId, item.file, item.id);

    if (result.ok && result.file && result.file.driveFileId) {
      if (!successfulFiles.some(f => f.driveFileId === result.file!.driveFileId || f.id === result.file!.id)) {
        successfulFiles.push(result.file);
      }
      if (onFileStatusUpdate) {
        onFileStatusUpdate(item.id, "success", undefined, result.file);
      }
    } else {
      failedCount++;
      if (onFileStatusUpdate) {
        onFileStatusUpdate(item.id, "error", result.error || "No se obtuvo un fileId válido de Google Drive");
      }
    }
  }

  return { successfulFiles, failedCount };
}

