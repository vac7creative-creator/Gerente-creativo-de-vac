/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Serverless API endpoint para subida segura de archivos a Google Drive
 * mediante Google Apps Script.
 * 
 * Compatible con Vercel Serverless Functions y Express en Node.js.
 * El secreto VAC_API_SECRET solo reside en variables de entorno del servidor (DRIVE_APPS_SCRIPT_SECRET).
 * Nunca se expone al cliente ni se registra en logs.
 */

export interface DriveUploadRequestBody {
  folderId: string;
  fileName: string;
  mimeType?: string;
  fileData: string; // Base64 transitorio enviado desde el cliente
}

export interface DriveUploadSuccessResponse {
  ok: true;
  fileId: string;
  fileUrl: string;
  name: string;
  size?: number;
  mimeType?: string;
  downloadUrl?: string;
}

export interface DriveUploadErrorResponse {
  ok: false;
  error: string;
}

export type DriveUploadApiResponse = DriveUploadSuccessResponse | DriveUploadErrorResponse;

const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyiax2sHe06zL50YTY1yC-6qN5Bbbdq61q4UI26xDhTcke1WvL6KI2vj0_ajKqAnKiW/exec";

export async function processDriveUploadRequest(
  method: string | undefined,
  rawBody: unknown
): Promise<{ status: number; data: DriveUploadApiResponse }> {
  // 1. Validar método HTTP: Solo POST permitido
  if (method?.toUpperCase() !== "POST") {
    return {
      status: 405,
      data: {
        ok: false,
        error: "Método no permitido. Este endpoint solo admite solicitudes POST."
      }
    };
  }

  // 2. Normalizar y parsear cuerpo si es necesario
  let body: any = rawBody;
  if (typeof rawBody === "string") {
    try {
      body = JSON.parse(rawBody);
    } catch {
      return {
        status: 400,
        data: {
          ok: false,
          error: "El cuerpo de la solicitud no es un JSON válido."
        }
      };
    }
  }

  if (!body || typeof body !== "object") {
    return {
      status: 400,
      data: {
        ok: false,
        error: "Cuerpo de solicitud requerido."
      }
    };
  }

  const { folderId, fileName, mimeType, fileData } = body as Record<string, unknown>;

  // 3. Validaciones de entrada
  if (typeof folderId !== "string" || !folderId.trim()) {
    return {
      status: 400,
      data: {
        ok: false,
        error: "El campo 'folderId' es obligatorio."
      }
    };
  }

  if (typeof fileName !== "string" || !fileName.trim()) {
    return {
      status: 400,
      data: {
        ok: false,
        error: "El campo 'fileName' es obligatorio."
      }
    };
  }

  if (typeof fileData !== "string" || !fileData.trim()) {
    return {
      status: 400,
      data: {
        ok: false,
        error: "El contenido del archivo ('fileData' en Base64) es obligatorio."
      }
    };
  }

  // Limpiar posible cabecera data URI si viene incluida (ej: data:image/png;base64,...)
  let cleanBase64 = fileData.trim();
  const dataUriMatch = cleanBase64.match(/^data:([^;]+);base64,(.+)$/);
  let resolvedMimeType = (typeof mimeType === "string" && mimeType.trim()) ? mimeType.trim() : "application/octet-stream";
  
  if (dataUriMatch) {
    if (!mimeType || mimeType === "application/octet-stream") {
      resolvedMimeType = dataUriMatch[1];
    }
    cleanBase64 = dataUriMatch[2];
  }

  // 4. Obtener credenciales del servidor
  const scriptUrl = process.env.DRIVE_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
  const secret = process.env.DRIVE_APPS_SCRIPT_SECRET;

  if (!secret) {
    return {
      status: 500,
      data: {
        ok: false,
        error: "La integración con Google Drive no está configurada en el servidor (variable DRIVE_APPS_SCRIPT_SECRET no configurada)."
      }
    };
  }

  // 5. Invocar Google Apps Script de forma segura desde el servidor
  try {
    const payload = {
      secret,
      action: "uploadFile",
      folderId: folderId.trim(),
      fileName: fileName.trim(),
      mimeType: resolvedMimeType,
      fileData: cleanBase64
    };

    const scriptResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      redirect: "follow"
    });

    if (!scriptResponse.ok) {
      return {
        status: 502,
        data: {
          ok: false,
          error: `Google Apps Script respondió con un código HTTP no exitoso: ${scriptResponse.status}`
        }
      };
    }

    const scriptData = await scriptResponse.json() as any;

    if (!scriptData || scriptData.ok === false) {
      return {
        status: 502,
        data: {
          ok: false,
          error: scriptData?.error || "Google Apps Script no pudo procesar la subida del archivo."
        }
      };
    }

    const fileId = String(scriptData.fileId || scriptData.id || "");
    const fileUrl = String(scriptData.fileUrl || scriptData.url || scriptData.webViewLink || (fileId ? `https://drive.google.com/file/d/${fileId}/view` : ""));

    return {
      status: 200,
      data: {
        ok: true,
        fileId,
        fileUrl,
        name: fileName.trim(),
        mimeType: resolvedMimeType,
        downloadUrl: scriptData.downloadUrl ? String(scriptData.downloadUrl) : undefined
      }
    };
  } catch (err: any) {
    return {
      status: 502,
      data: {
        ok: false,
        error: "No se pudo establecer comunicación con el servicio de Google Apps Script para subir el archivo."
      }
    };
  }
}

/**
 * Standard Vercel Serverless Function & Express Request Handler
 */
export default async function handler(req: any, res: any) {
  try {
    const { status, data } = await processDriveUploadRequest(req.method, req.body);
    res.setHeader("Content-Type", "application/json");
    return res.status(status).json(data);
  } catch {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      ok: false,
      error: "Error interno en el servidor al subir el archivo."
    });
  }
}
