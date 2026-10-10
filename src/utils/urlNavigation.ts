/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectType } from "../types";
import { ServiceItem } from "../components/ServicePreviewModal";
import { 
  SERVICES_CATALOG, 
  SERVICES_CATALOG_DATA, 
  ServiceCatalogItem, 
  PackageItem 
} from "../data/servicesCatalog";

export type ClientTabType = "catalog" | "quote" | "tracker";

export interface ParsedUrlNavigation {
  tab: ClientTabType;
  hasExplicitTab: boolean;
  serviceId?: string;
  projectType?: ProjectType;
  serviceItem?: ServiceItem;
  catalogItem?: ServiceCatalogItem;
  packageId?: string;
  packageItem?: PackageItem;
  variantId?: string;
  trackingCode?: string;
  shouldOpenOrderModal: boolean;
}

/**
 * Normaliza un string eliminando acentos, caracteres especiales y espacios innecesarios
 */
export function normalizeParam(val?: string | null): string {
  if (!val) return "";
  return val
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Mapeo de alias de pestañas
 */
export function resolveTabParam(tabParam?: string | null): { tab: ClientTabType; isExplicit: boolean } {
  const norm = normalizeParam(tabParam);
  if (!norm) {
    return { tab: "catalog", isExplicit: false };
  }

  if (["quote", "cotizar", "cotizador", "calculadora", "cotizacion", "presupuesto"].includes(norm)) {
    return { tab: "quote", isExplicit: true };
  }
  if (["tracker", "seguimiento", "rastreo", "tracking", "rastrear", "consulta", "consultar"].includes(norm)) {
    return { tab: "tracker", isExplicit: true };
  }
  if (["catalog", "catalogo", "servicios", "paquetes", "services", "modelos"].includes(norm)) {
    return { tab: "catalog", isExplicit: true };
  }

  // Si no coincide o es inválido, caer a catálogo por defecto
  return { tab: "catalog", isExplicit: false };
}

/**
 * Diccionario de alias para identificar el servicio exacto
 */
const SERVICE_ALIAS_MAP: Record<string, string> = {
  // Boda
  "boda": "boda",
  "bodas": "boda",
  "invitacion-boda": "boda",
  "invitacion-bodas": "boda",
  "invitacion-virtual-boda": "boda",
  "wedding": "boda",

  // XV Años
  "xv-anos": "xv-anos",
  "xv": "xv-anos",
  "15-anos": "xv-anos",
  "15anos": "xv-anos",
  "quinceanera": "xv-anos",
  "quinceanos": "xv-anos",
  "invitacion-xv": "xv-anos",

  // Cumpleaños
  "cumpleanos": "cumpleanos",
  "cumple": "cumpleanos",
  "cumple-express": "cumpleanos",
  "invitacion-cumpleanos": "cumpleanos",
  "birthday": "cumpleanos",

  // Carta & Menú Digital
  "carta-digital": "carta-digital",
  "carta": "carta-digital",
  "menu": "carta-digital",
  "menu-digital": "carta-digital",
  "carta-menu": "carta-digital",
  "restaurante": "carta-digital",

  // Landing Page
  "landing-page": "landing-page",
  "landing": "landing-page",
  "web": "landing-page",
  "pagina-web": "landing-page",
  "sitio-web": "landing-page",

  // Spot Publicitario
  "spot-publicitario": "spot-publicitario",
  "spot": "spot-publicitario",
  "locucion": "spot-publicitario",
  "audio-comercial": "spot-publicitario",

  // Producción Audiovisual / Video
  "produccion-audiovisual": "produccion-audiovisual",
  "audiovisual": "produccion-audiovisual",
  "video": "produccion-audiovisual",
  "foto-video": "produccion-audiovisual",

  // Identidad Gráfica / Branding
  "branding": "branding",
  "diseno-grafico": "branding",
  "logo": "branding",
  "logotipo": "branding",
  "identidad": "branding",

  // Diseño / Artes Multimedia
  "artes-multimedia": "artes-multimedia",
  "multimedia": "artes-multimedia",
  "diseno": "artes-multimedia",
  "flyer": "artes-multimedia",
  "post": "artes-multimedia",

  // Animación & Motion
  "animacion-motion": "animacion-motion",
  "motion": "animacion-motion",
  "motion-graphics": "animacion-motion",
  "animacion": "animacion-motion"
};

/**
 * Resuelve el servicio a partir del parámetro de URL
 */
export function resolveServiceParam(serviceParam?: string | null): {
  serviceId: string;
  projectType: ProjectType;
  serviceItem: ServiceItem;
  catalogItem: ServiceCatalogItem;
} | null {
  const norm = normalizeParam(serviceParam);
  if (!norm) return null;

  const canonicalId = SERVICE_ALIAS_MAP[norm] || norm;

  // Buscar en SERVICES_CATALOG
  const serviceItem = SERVICES_CATALOG.find((s) => s.id === canonicalId);
  const catalogItem = SERVICES_CATALOG_DATA.find((c) => c.id === canonicalId || c.type === serviceItem?.type);

  if (!catalogItem) {
    // Intento secundario por coincidencia parcial o por type
    const fallbackCatalog = SERVICES_CATALOG_DATA.find((c) => 
      c.id.includes(norm) || normalizeParam(c.title).includes(norm)
    );
    if (fallbackCatalog) {
      const fallbackService = SERVICES_CATALOG.find((s) => s.type === fallbackCatalog.type) || {
        id: fallbackCatalog.id,
        type: fallbackCatalog.type,
        title: fallbackCatalog.title,
        subtitle: fallbackCatalog.subtitle,
        deliveryTime: fallbackCatalog.deliveryTime,
        image: fallbackCatalog.image,
        itinerary: [],
        includes: fallbackCatalog.includes || [],
        notIncludes: [],
        difficulty: "Vanguardia Creativa"
      };
      return {
        serviceId: fallbackCatalog.id,
        projectType: fallbackCatalog.type,
        serviceItem: fallbackService,
        catalogItem: fallbackCatalog
      };
    }
    return null;
  }

  const resolvedServiceItem = serviceItem || {
    id: catalogItem.id,
    type: catalogItem.type,
    title: catalogItem.title,
    subtitle: catalogItem.subtitle,
    deliveryTime: catalogItem.deliveryTime,
    image: catalogItem.image,
    itinerary: [],
    includes: catalogItem.includes || [],
    notIncludes: [],
    difficulty: "Vanguardia Creativa"
  };

  return {
    serviceId: catalogItem.id,
    projectType: catalogItem.type,
    serviceItem: resolvedServiceItem,
    catalogItem
  };
}

/**
 * Resuelve el paquete adecuado para un catálogo dado
 */
export function resolvePackageParam(
  catalogItem: ServiceCatalogItem, 
  packageParam?: string | null
): { packageId: string; packageItem: PackageItem } | null {
  const norm = normalizeParam(packageParam);
  if (!norm || !catalogItem.packages || catalogItem.packages.length === 0) return null;

  // 1. Coincidencia exacta con ID de paquete
  let pkg = catalogItem.packages.find((p) => normalizeParam(p.id) === norm);
  if (pkg) return { packageId: pkg.id, packageItem: pkg };

  // 2. Coincidencia con nombre del paquete
  pkg = catalogItem.packages.find((p) => normalizeParam(p.name) === norm);
  if (pkg) return { packageId: pkg.id, packageItem: pkg };

  // 3. Coincidencia por sub-cadena o prefijos comunes (ej. "esencial" para "motion-esencial" o "arte-esencial")
  pkg = catalogItem.packages.find((p) => {
    const pId = normalizeParam(p.id);
    const pName = normalizeParam(p.name);
    return (
      pId.endsWith(`-${norm}`) ||
      pId.startsWith(`${norm}-`) ||
      pId.includes(norm) ||
      pName.includes(norm)
    );
  });
  if (pkg) return { packageId: pkg.id, packageItem: pkg };

  // 4. Mapeos de nivel / alias contextuales
  const levelAliases: Record<string, number> = {
    "1": 0, "uno": 0, "primer": 0, "primero": 0, "basico": 0, "basic": 0, "esencial": 0, "simple": 0,
    "2": 1, "dos": 1, "segundo": 1, "intermedio": 1, "comercial": 1, "identidad": 1, "pack": 1,
    "3": 2, "tres": 2, "tercer": 2, "tercero": 2, "pro": 2, "profesional": 2, "premium": 2, "completo": 2, "integral": 2, "cinematic": 2
  };

  if (levelAliases[norm] !== undefined) {
    const targetIdx = levelAliases[norm];
    if (catalogItem.packages[targetIdx]) {
      return { packageId: catalogItem.packages[targetIdx].id, packageItem: catalogItem.packages[targetIdx] };
    }
  }

  return null;
}

/**
 * Resuelve la variante para servicios que tienen variantes (ej. Spot Publicitario)
 */
export function resolveVariantParam(
  catalogItem: ServiceCatalogItem,
  variantParam?: string | null
): string | null {
  const norm = normalizeParam(variantParam);
  if (!norm || !catalogItem.variants || catalogItem.variants.length === 0) return null;

  const found = catalogItem.variants.find((v) => 
    normalizeParam(v.id) === norm || 
    normalizeParam(v.label) === norm ||
    normalizeParam(v.id).includes(norm) ||
    norm.includes(normalizeParam(v.id))
  );

  return found ? found.id : null;
}

/**
 * Lee y analiza todos los parámetros de la URL actual
 */
export function parseUrlNavigation(): ParsedUrlNavigation {
  if (typeof window === "undefined") {
    return {
      tab: "catalog",
      hasExplicitTab: false,
      shouldOpenOrderModal: false
    };
  }

  const params = new URLSearchParams(window.location.search);

  // 1. Tab parameter
  const tabRaw = params.get("tab") || params.get("seccion") || params.get("vista");
  const { tab, isExplicit: hasExplicitTab } = resolveTabParam(tabRaw);

  // 2. Service parameter
  const serviceRaw = params.get("service") || params.get("servicio") || params.get("s") || params.get("tipo");
  const serviceResolved = resolveServiceParam(serviceRaw);

  // 3. Package parameter
  let packageResolved: { packageId: string; packageItem: PackageItem } | null = null;
  let variantResolved: string | null = null;

  if (serviceResolved) {
    const packageRaw = params.get("package") || params.get("paquete") || params.get("plan") || params.get("pkg") || params.get("p") || params.get("nivel");
    packageResolved = resolvePackageParam(serviceResolved.catalogItem, packageRaw);

    const variantRaw = params.get("variant") || params.get("variante") || params.get("v");
    variantResolved = resolveVariantParam(serviceResolved.catalogItem, variantRaw);
  }

  // 4. Tracking code
  const codeRaw = params.get("code") || params.get("codigo") || params.get("track") || params.get("tracking");
  const trackingCode = codeRaw ? codeRaw.trim() : undefined;

  // 5. Action / Modal trigger
  const actionRaw = normalizeParam(params.get("action") || params.get("accion") || params.get("pedido") || params.get("order") || params.get("open"));
  const shouldOpenOrderModal = ["order", "pedido", "formulario", "cotizar-orden"].includes(actionRaw);

  return {
    tab,
    hasExplicitTab,
    serviceId: serviceResolved?.serviceId,
    projectType: serviceResolved?.projectType,
    serviceItem: serviceResolved?.serviceItem,
    catalogItem: serviceResolved?.catalogItem,
    packageId: packageResolved?.packageId,
    packageItem: packageResolved?.packageItem,
    variantId: variantResolved || undefined,
    trackingCode,
    shouldOpenOrderModal
  };
}

/**
 * Lista de parámetros de URL específicos de servicios, paquetes, variantes y acciones
 */
const SERVICE_SPECIFIC_QUERY_KEYS = [
  "service", "servicio", "s", "tipo",
  "package", "paquete", "plan", "pkg", "p", "nivel",
  "variant", "variante", "v",
  "action", "accion", "pedido", "order", "open"
];

/**
 * Limpia de la URL los parámetros de servicio, paquete, variante y acciones de modal
 */
export function removeServiceQueryParams(url: URL) {
  SERVICE_SPECIFIC_QUERY_KEYS.forEach((k) => url.searchParams.delete(k));
}

/**
 * Sincroniza la URL al cambiar de pestaña manualmente.
 * - tracker: ?tab=tracker (o con ?code= si ya se consultó)
 * - catalog: ?tab=catalog
 * - quote: ?tab=quote (sin parámetros de servicio)
 * Limpia automáticamente service, package, variant, action.
 */
export function syncTabNavigation(tab: ClientTabType, code?: string | null) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  // 1. Limpiar siempre parámetros de servicio/paquete/variante/acción al cambiar de pestaña manualmente
  removeServiceQueryParams(url);

  // 2. Manejo según la pestaña
  if (tab === "tracker") {
    url.searchParams.set("tab", "tracker");
    if (code && code.trim()) {
      url.searchParams.set("code", code.trim());
    } else {
      url.searchParams.delete("code");
      url.searchParams.delete("codigo");
      url.searchParams.delete("track");
      url.searchParams.delete("tracking");
    }
  } else if (tab === "quote") {
    url.searchParams.set("tab", "quote");
    url.searchParams.delete("code");
    url.searchParams.delete("codigo");
    url.searchParams.delete("track");
    url.searchParams.delete("tracking");
  } else {
    // catalog
    url.searchParams.set("tab", "catalog");
    url.searchParams.delete("code");
    url.searchParams.delete("codigo");
    url.searchParams.delete("track");
    url.searchParams.delete("tracking");
  }

  window.history.replaceState({}, "", url.toString());
}

/**
 * Sincroniza la URL en el navegador de manera limpia y sin recargar la página
 */
export function syncUrlParams(updates: {
  tab?: ClientTabType;
  service?: string | null;
  package?: string | null;
  variant?: string | null;
  code?: string | null;
  cleanServiceParams?: boolean;
}) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  if (updates.cleanServiceParams) {
    removeServiceQueryParams(url);
  }

  if (updates.tab !== undefined) {
    url.searchParams.set("tab", updates.tab);
  }

  if (updates.service !== undefined) {
    if (updates.service) {
      url.searchParams.set("service", updates.service);
    } else {
      url.searchParams.delete("service");
      url.searchParams.delete("servicio");
      url.searchParams.delete("s");
      url.searchParams.delete("tipo");
    }
  }

  if (updates.package !== undefined) {
    if (updates.package) {
      url.searchParams.set("package", updates.package);
    } else {
      url.searchParams.delete("package");
      url.searchParams.delete("paquete");
      url.searchParams.delete("plan");
      url.searchParams.delete("pkg");
      url.searchParams.delete("p");
      url.searchParams.delete("nivel");
    }
  }

  if (updates.variant !== undefined) {
    if (updates.variant) {
      url.searchParams.set("variant", updates.variant);
    } else {
      url.searchParams.delete("variant");
      url.searchParams.delete("variante");
      url.searchParams.delete("v");
    }
  }

  if (updates.code !== undefined) {
    if (updates.code) {
      url.searchParams.set("code", updates.code);
    } else {
      url.searchParams.delete("code");
      url.searchParams.delete("codigo");
      url.searchParams.delete("track");
      url.searchParams.delete("tracking");
    }
  }

  window.history.replaceState({}, "", url.toString());
}

