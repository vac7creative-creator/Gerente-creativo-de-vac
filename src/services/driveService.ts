/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from "../types";
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
