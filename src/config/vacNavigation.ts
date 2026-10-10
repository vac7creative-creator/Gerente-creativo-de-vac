/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectType } from "../types";

/**
 * CONFIGURACIÓN CENTRALIZADA DE ENLACES Y NAVEGACIÓN EXTERNA HACIA V.A.C. CREATIVE
 *
 * La web principal pública de V.A.C. Creative presenta la marca, portafolio y
 * proyectos reales. Gerente Creativo actúa como catálogo comercial, cotizador y seguimiento.
 *
 * REGLAS FUNDAMENTALES:
 * 1. Toda navegación hacia V.A.C. Creative debe ser en LA MISMA PESTAÑA (sin target="_blank", sin window.open).
 * 2. Rutas 100% verificadas contra la estructura pública de V.A.C. Creative.
 * 3. Permite sobreescritura limpia mediante VITE_VAC_MAIN_SITE_URL si se requiere en diferentes entornos.
 */

export const VAC_MAIN_SITE_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_VAC_MAIN_SITE_URL) ||
  "https://pagina-web-vac-creative.vercel.app";

/**
 * Rutas públicas verificadas dentro de V.A.C. Creative
 */
export const VAC_PUBLIC_ROUTES = {
  home: "/",
  proyectos: "/proyectos",
  servicios: "/servicios",
  invitacionesDigitales: "/servicios/diseno-digital/invitaciones-digitales",
  menusDigitales: "/servicios/diseno-digital/menus-digitales",
  landingPages: "/servicios/diseno-digital/landing-pages",
  logos: "/servicios/diseno-grafico/logos",
  flyers: "/servicios/diseno-grafico/flyers",
  spotsRadiales: "/servicios/spots-publicitarios/spots-radiales",
  edicionVideo: "/servicios/audiovisual/edicion-video",
  logosAnimados: "/servicios/animacion/logos-animados"
} as const;

/**
 * Retorna la URL pública de la página principal de V.A.C. Creative
 */
export function getVacMainSiteHomeUrl(): string {
  const base = VAC_MAIN_SITE_BASE_URL.replace(/\/+$/, "");
  return `${base}/`;
}

/**
 * Mapeo estricto por servicio hacia la sección de muestras y proyectos reales en V.A.C. Creative.
 * Prioridad:
 * 1. Ruta específica del servicio en V.A.C. Creative (ej. /servicios/diseno-digital/invitaciones-digitales para Bodas, XV y Cumpleaños).
 * 2. Si no hay ruta específica, ruta general de proyectos (/proyectos).
 */
export function getVacServiceProjectsUrl(type?: ProjectType, sampleDemoUrl?: string): string {
  // Si la muestra particular posee una URL de demo real y confirmada, se puede utilizar
  if (sampleDemoUrl && sampleDemoUrl.startsWith("http")) {
    return sampleDemoUrl;
  }

  const base = VAC_MAIN_SITE_BASE_URL.replace(/\/+$/, "");

  if (!type) {
    return `${base}${VAC_PUBLIC_ROUTES.proyectos}`;
  }

  switch (type) {
    case ProjectType.BODA:
    case ProjectType.XV_ANOS:
    case ProjectType.CUMPLEANOS:
      return `${base}${VAC_PUBLIC_ROUTES.invitacionesDigitales}`;

    case ProjectType.CARTA_DIGITAL:
      return `${base}${VAC_PUBLIC_ROUTES.menusDigitales}`;

    case ProjectType.LANDING_PAGE:
      return `${base}${VAC_PUBLIC_ROUTES.landingPages}`;

    case ProjectType.DISENO_GRAFICO:
      return `${base}${VAC_PUBLIC_ROUTES.logos}`;

    case ProjectType.ARTES_MULTIMEDIA:
      return `${base}${VAC_PUBLIC_ROUTES.flyers}`;

    case ProjectType.SPOT:
      return `${base}${VAC_PUBLIC_ROUTES.spotsRadiales}`;

    case ProjectType.FOTO_VIDEO:
      return `${base}${VAC_PUBLIC_ROUTES.edicionVideo}`;

    case ProjectType.ANIMACION_MOTION:
      return `${base}${VAC_PUBLIC_ROUTES.logosAnimados}`;

    default:
      return `${base}${VAC_PUBLIC_ROUTES.proyectos}`;
  }
}
