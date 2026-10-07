/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Serverless API endpoint para creación segura de carpetas en Google Drive
 * mediante Google Apps Script.
 * 
 * Compatible con Vercel Serverless Functions y Express en Node.js.
 * El secreto VAC_API_SECRET solo reside en variables de entorno del servidor (DRIVE_APPS_SCRIPT_SECRET).
 * Nunca se expone al cliente ni se registra en logs.
 */

export interface DriveFolderRequestBody {
  serviceType: string;
  projectName: string;
  trackingCode?: string;
}

export interface DriveFolderSuccessResponse {
  ok: true;
  folderId: string;
  folderUrl: string;
  uploadsFolderId?: string;
  referencesFolderId?: string;
  finalFilesFolderId?: string;
}

export interface DriveFolderErrorResponse {
  ok: false;
  error: string;
}

export type DriveFolderApiResponse = DriveFolderSuccessResponse | DriveFolderErrorResponse;

const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyiax2sHe06zL50YTY1yC-6qN5Bbbdq61q4UI26xDhTcke1WvL6KI2vj0_ajKqAnKiW/exec";

export async function processDriveFolderRequest(
  method: string | undefined,
  rawBody: unknown
): Promise<{ status: number; data: DriveFolderApiResponse }> {
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

  const { serviceType, projectName, trackingCode } = body as Record<string, unknown>;

  // 3. Validaciones de tipos y longitudes de entrada
  if (typeof serviceType !== "string" || !serviceType.trim()) {
    return {
      status: 400,
      data: {
        ok: false,
        error: "El campo 'serviceType' es obligatorio y debe ser un texto válido."
      }
    };
  }

  if (serviceType.length > 200) {
    return {
      status: 400,
      data: {
        ok: false,
        error: "El campo 'serviceType' excede la longitud máxima permitida."
      }
    };
  }

  if (typeof projectName !== "string" || !projectName.trim()) {
    return {
      status: 400,
      data: {
        ok: false,
        error: "El campo 'projectName' es obligatorio y debe ser un texto válido."
      }
    };
  }

  if (projectName.length > 300) {
    return {
      status: 400,
      data: {
        ok: false,
        error: "El campo 'projectName' excede la longitud máxima permitida."
      }
    };
  }

  if (trackingCode !== undefined && trackingCode !== null) {
    if (typeof trackingCode !== "string" || trackingCode.length > 100) {
      return {
        status: 400,
        data: {
          ok: false,
          error: "El formato de 'trackingCode' no es válido."
        }
      };
    }
  }

  // 4. Obtener credenciales de servidor
  const scriptUrl = process.env.DRIVE_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
  const secret = process.env.DRIVE_APPS_SCRIPT_SECRET;

  if (!secret) {
    // Error 500 seguro sin exponer detalles de configuración sensible
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
      serviceType: serviceType.trim(),
      projectName: projectName.trim(),
      trackingCode: trackingCode ? (trackingCode as string).trim() : ""
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
          error: `Google Apps Script respondió con un código de estado HTTP no exitoso: ${scriptResponse.status}`
        }
      };
    }

    const scriptData = await scriptResponse.json() as any;

    if (!scriptData || scriptData.ok === false) {
      return {
        status: 502,
        data: {
          ok: false,
          error: scriptData?.error || "Google Apps Script no pudo procesar la solicitud de carpeta."
        }
      };
    }

    return {
      status: 200,
      data: {
        ok: true,
        folderId: String(scriptData.folderId || ""),
        folderUrl: String(scriptData.folderUrl || ""),
        uploadsFolderId: scriptData.uploadsFolderId ? String(scriptData.uploadsFolderId) : undefined,
        referencesFolderId: scriptData.referencesFolderId ? String(scriptData.referencesFolderId) : undefined,
        finalFilesFolderId: scriptData.finalFilesFolderId ? String(scriptData.finalFilesFolderId) : undefined
      }
    };
  } catch (err: any) {
    return {
      status: 502,
      data: {
        ok: false,
        error: "No se pudo establecer comunicación con el servicio de Google Apps Script."
      }
    };
  }
}

/**
 * Standard Vercel Serverless Function & Express Request Handler
 */
export default async function handler(req: any, res: any) {
  try {
    const { status, data } = await processDriveFolderRequest(req.method, req.body);
    res.setHeader("Content-Type", "application/json");
    return res.status(status).json(data);
  } catch {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      ok: false,
      error: "Error interno en el servidor al procesar la solicitud."
    });
  }
}
