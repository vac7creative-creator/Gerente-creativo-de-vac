/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ProjectType {
  BODA = "Invitación Virtual de Boda",
  XV_ANOS = "Invitación Virtual de 15 Años",
  CUMPLEANOS = "Invitación Virtual de Cumpleaños",
  CARTA_DIGITAL = "Carta / Menú Digital",
  SPOT = "Spot Publicitario",
  FOTO_VIDEO = "Fotografía y Video",
  DISENO_GRAFICO = "Diseño Gráfico",
  LANDING_PAGE = "Landing Page",
  ARTES_MULTIMEDIA = "Diseño / Artes Multimedia",
  OTRO = "Otro"
}

export enum ProjectStatus {
  PENDIENTE = "Pendiente",
  EN_DISENO = "En Diseño",
  EN_REVISION = "En Revisión",
  APROBADO = "Aprobado",
  ENTREGADO = "Entregado"
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Desayunos" | "Almuerzos" | "Bebidas" | "Postres" | "Otros";
  photoUrl?: string;
}

export interface WeddingDetails {
  novioName: string;
  noviaName: string;
  fecha: string;
  hora: string;
  fraseEspecial: string;
  
  // Ceremonia
  ceremoniaIglesia: string;
  ceremoniaDireccion: string;
  ceremoniaMapsUrl: string;

  // Recepción
  recepcionLocal: string;
  recepcionDireccion: string;
  recepcionMapsUrl: string;

  // Confirmación
  confirmacionWhatsapp: string;
  confirmacionFechaLimite: string;

  // Multimedia
  multimediaFotos: string[]; // URLs or Base64 / info text
  multimediaVideoUrl: string;
  multimediaMusicaNombre: string;
  youtubeUrl: string;

  // Diseño
  colorPalette: "Dorado" | "Rose Gold" | "Azul Marino" | "Verde Eucalipto" | "Terracota" | "Blanco" | "Personalizado";
  colorPaleteCustomValue?: string;
  visualStyle: "Floral" | "Elegante" | "Moderno" | "Minimalista" | "Luxury" | "Boho";

  // Extras
  extras: {
    cuentaRegresiva: boolean;
    galeriaFotos: boolean;
    historiaAmor: boolean;
    confirmacionWhatsapp: boolean;
    mesaRegalos: boolean;
    dressCode: boolean;
    videoFondo: boolean;
    animacionesPremium: boolean;
  };
}

export interface XvDetails {
  quinceaneraName: string;
  fecha: string;
  hora: string;
  lugar: string;
  mapsUrl: string;
  musicaNombre: string;
  galleryEnabled: boolean;
  videoEnabled: boolean;
  videoUrl: string;
  colorPalette: string;
  tematica: string;
  confirmacionWhatsapp: string;
  cuentaRegresiva: boolean;
  extras: {
    mesaRegalos: boolean;
    dressCode: boolean;
    animacionesPremium: boolean;
  };
}

export interface DigitalMenuDetails {
  businessName: string;
  logoUrl?: string;
  address: string;
  whatsapp: string;
  instagramUrl?: string;
  facebookUrl?: string;
  
  // Productos y Categorías
  items: MenuItem[];
  
  // Diseño
  designTheme: "Moderno" | "Premium" | "Gourmet" | "Fast Food" | "Cafetería";
}

export interface OtherDetails {
  description: string;
  requirements: string;
  colorPalette: string;
  attachmentsInfo: string;
}

export interface ProjectMediaFile {
  id: string;
  name: string;
  size?: number;
  type?: string;
  url: string;
}

export interface Project {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  type: ProjectType;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  trackingCode?: string;
  packageId?: string;
  packageName?: string;
  totalPrice?: number;
  selectedAddonIds?: string[];
  serviceVariant?: string;
  uploadedFiles?: ProjectMediaFile[];
  googleDriveUrl?: string;
  
  // Dynamic fields based on type
  weddingDetails?: WeddingDetails;
  xvDetails?: XvDetails;
  menuDetails?: DigitalMenuDetails;
  otherDetails?: OtherDetails;
  
  // General notes or attachments description
  generalNotes?: string;
}
