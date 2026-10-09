/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectType } from "../types";
import { ServiceItem } from "../components/ServicePreviewModal";

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  deliveryTime: string;
  image: string;
  iconName: "Palette" | "Video" | "Volume2" | "Sparkles" | "Smartphone";
  type: ProjectType;
  isSubCatalogTrigger: boolean;
  itinerary: { label: string; desc: string }[];
  includes: string[];
  notIncludes: string[];
  difficulty: string;
}

export const MAIN_CATEGORIES: CategoryItem[] = [
  {
    id: "artes-multimedia",
    title: "Diseño / Artes Multimedia",
    subtitle: "Flyers publicitarios, posts para redes, historias, banners y fotomontajes de alto impacto visual.",
    deliveryTime: "24-48 Horas",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513930/Arte_Esencial.png",
    iconName: "Palette",
    type: ProjectType.ARTES_MULTIMEDIA,
    isSubCatalogTrigger: false,
    itinerary: [
      { label: "Briefing Visual", desc: "Recopilamos copys, imágenes y objetivos de la pieza publicitaria." },
      { label: "Composición de Arte", desc: "Montaje, efectos visuales y tratamiento tipográfico de impacto." },
      { label: "Exportación & Entrega", desc: "Entrega en alta resolución lista para pautas, redes o impresión." }
    ],
    includes: [
      "Piezas gráficas publicitarias personalizadas de autor",
      "Composición tipográfica y jerarquía comercial persuasiva",
      "Formatos optimizados para Instagram, WhatsApp, Facebook y web"
    ],
    notIncludes: [
      "Campañas masivas de múltiples piezas (a cotizar)",
      "Modelado 3D de alta densidad"
    ],
    difficulty: "Impacto Visual Publicitario"
  },
  {
    id: "diseno-grafico",
    title: "Diseño Gráfico",
    subtitle: "Identidad visual disruptiva y comunicación de alto impacto que define marcas.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513924/Logo.png",
    iconName: "Palette",
    type: ProjectType.DISENO_GRAFICO,
    isSubCatalogTrigger: false,
    itinerary: [
      { label: "Briefing Creativo", desc: "Entendemos la personalidad, colores y público objetivo de tu proyecto comercial." },
      { label: "Bocetado de Propuestas", desc: "Presentación de rutas gráficas conceptuales independientes." },
      { label: "Refinamiento Gráfico", desc: "Ajustamos y pulimos tipografías, grosores vectoriales y contrastes." },
      { label: "Entrega de Master", desc: "Exportación organizada de archivos vectoriales listos para imprenta y redes (.AI, .SVG, .PNG)." }
    ],
    includes: [
      "Diseño de logotipos vectoriales originales (no plantillas)",
      "Manual básico de uso cromático y tipografías sugeridas",
      "Mockups comerciales premium para previsualización",
      "Formatos optimizados para perfiles y banners de redes sociales"
    ],
    notIncludes: [
      "Registro legal de patentes y marcas comerciales ante el estado",
      "Impresión física de tarjetas o empaques"
    ],
    difficulty: "Alta Fidelidad & Concepto Disruptivo"
  },
  {
    id: "audiovisual-video",
    title: "Audiovisual y Video",
    subtitle: "Producción cinemática para narrativas visuales que cautivan a tu audiencia.",
    deliveryTime: "3-5 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557403/Producci%C3%B3n_Audiovisual_Video_-Express.png",
    iconName: "Video",
    type: ProjectType.FOTO_VIDEO,
    isSubCatalogTrigger: false,
    itinerary: [
      { label: "Estructura & Guión", desc: "Planificación matemática del ritmo visual, intenciones comunicacionales y tomas." },
      { label: "Carga de Clips", desc: "Procesamiento de tus grabaciones en alta fidelidad o material digital." },
      { label: "Edición y Sincronización", desc: "Corte cinemático al ritmo de la banda sonora musical seleccionada." },
      { label: "Colorización & Exportado", desc: "Aplicación de look cinematográfico y exportado en alta resolución." }
    ],
    includes: [
      "Edición cinemática profesional (cortes limpios y dinámicos)",
      "Corrección de color artística de grado profesional",
      "Mezcla de efectos de sonido y diseño de audio ambiental",
      "Formatos listos para Reels, TikTok, YouTube Shorts o horizontal"
    ],
    notIncludes: [
      "Grabaciones físicas en locación con dron o camarógrafo presencial (disponible a cotizar)",
      "Locución presencial en estudio físico"
    ],
    difficulty: "Cinemático de Alto Impacto Audiovisual"
  },
  {
    id: "spots-publicitarios",
    title: "Spots Publicitarios",
    subtitle: "Estrategias de audio y locución orientadas a posicionamiento de mercado.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513923/Simple.png",
    iconName: "Volume2",
    type: ProjectType.SPOT,
    isSubCatalogTrigger: false,
    itinerary: [
      { label: "Redacción del Copy", desc: "Escritura de textos persuasivos con ganchos auditivos en los primeros segundos." },
      { label: "Selección de Locutor", desc: "Tú eliges el tono de voz ideal dentro de nuestro catálogo de locución profesional." },
      { label: "Grabación en Cabina", desc: "Registro acústico insonorizado de alta gama aplicando intenciones de venta." },
      { label: "Efectos & Limpieza", desc: "Masterización y mezcla con cortinas musicales libres de regalías comerciales." }
    ],
    includes: [
      "Locutor profesional con acento neutro o regional sugerido",
      "Redacción y pulido de guión publicitario persuasivo",
      "Limpieza acústica de ruidos y masterización de sonido",
      "Versión de audio optimizada para radio, Spotify, Instagram y perifoneo"
    ],
    notIncludes: [
      "Inversión económica de pauta publicitaria en plataformas de anuncios",
      "Cambios en el guion una vez grabada la voz final del locutor"
    ],
    difficulty: "Vanguardia Acústica Persuasiva"
  },
  {
    id: "animacion-motion",
    title: "Animación & Motion",
    subtitle: "Gráficos en movimiento y animación 2D para dar vida a tus ideas.",
    deliveryTime: "3-5 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791563016/Motion_Esencial.png",
    iconName: "Sparkles",
    type: ProjectType.ANIMACION_MOTION,
    isSubCatalogTrigger: false,
    itinerary: [
      { label: "Storyboard de Proceso", desc: "Esquemas para entender el flujo y movimientos de los elementos vectoriales." },
      { label: "Modelado / Ilustración", desc: "Diseño de los componentes o conversión de tu logotipo a formato animable." },
      { label: "Animación de Capas", desc: "Aplicación de curvas de aceleración suaves para lograr transiciones fascinantes." },
      { label: "Render con Transparencias", desc: "Compilación de vídeo en alta calidad con opción de fondo transparente." }
    ],
    includes: [
      "Animación de logotipos corporativos (Intro/Outro de alta gama)",
      "Explicador gráfico interactivo con motion design fluido",
      "Sincronización rítmica con efectos de sonido incidentales"
    ],
    notIncludes: [
      "Modelado 3D ultra-complejo de videojuegos densos",
      "Animación de personajes hiperrealistas"
    ],
    difficulty: "Fluidez Vectorial Avanzada"
  },
  {
    id: "diseno-digital-web",
    title: "Diseño Digital & Experiencias Web",
    subtitle: "Desarrollo de soluciones interactivas para bodas, quinceañeros, cartas gourmet y marcas con enlace directo al móvil.",
    deliveryTime: "Ver Modelos",
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop",
    iconName: "Smartphone",
    type: ProjectType.LANDING_PAGE,
    isSubCatalogTrigger: true,
    itinerary: [
      { label: "Selección del Modelo", desc: "Elige entre nuestras interfaces premium para Bodas, 15 Años, Menú Gourmet o Fiestas." },
      { label: "Introducción de Datos", desc: "Nos proporcionas los datos de tu festejo o menú a través del formulario interactivo." },
      { label: "Personalización Física", desc: "Configuramos tu música, paletas sofisticadas de color y confirmaciones directas." },
      { label: "Lanzamiento Online", desc: "El enlace se publica al instante optimizado para smartphones y compartible por WhatsApp o QR." }
    ],
    includes: [
      "Velocidad de carga instantánea optimizada para enlaces por chat",
      "Interactividad de botones, cronómetros y formularios de pases",
      "Música integrada con reproducción limpia en teléfonos",
      "Control de asistencia RSVP directo en tu chat personal"
    ],
    notIncludes: [
      "Servicios de fotografía presencial",
      "Papelería impresa física"
    ],
    difficulty: "Elegancia Digital de Última Generación"
  }
];

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: "boda",
    type: ProjectType.BODA,
    title: "Invitación Virtual de Bodas",
    subtitle: "Maquetación premium con confirmación RSVP inteligente, música personalizada, mapas y paleta de alta costura.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559267/BODA_-_BASICO.png",
    itinerary: [
      { label: "Alta de Datos", desc: "Comienza registrando vuestros nombres, fecha, hora e iglesias contratadas." },
      { label: "Borrador Digital", desc: "En 48h nuestro equipo genera un enlace con vuestra tipografía y fondos premium." },
      { label: "Ajuste de Música & Fotos", desc: "Selecciona el tema de fondo que iniciará al momento de abrir la invitación." },
      { label: "Integración RSVP", desc: "Pruebas de clic para confirmación directa al número de WhatsApp configurado." },
      { label: "Lanzamiento y Entrega", desc: "Enlace web optimizado listo para enviar o crear códigos QR." }
    ],
    includes: [
      "Invitación digital con enlace web propio",
      "Nombres de los novios, fecha, hora y ubicaciones",
      "Diseño responsive adaptado a móviles",
      "Correcciones según la política de V.A.C. Creative"
    ],
    notIncludes: [
      "Papelería física impresa o grabado físico",
      "Fotografías en estudio presenciales"
    ],
    difficulty: "Elegancia Luxury de Alta Fidelidad"
  },
  {
    id: "xv-anos",
    type: ProjectType.XV_ANOS,
    title: "Invitación de XV Años Princesa",
    subtitle: "Animaciones mágicas, lluvia de destellos, cronómetro y dress code para una fiesta inolvidable.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557513/XV_A%C3%91OS_-BASICO.png",
    itinerary: [
      { label: "Briefing", desc: "Datos de la quinceañera y temática elegida." },
      { label: "Diseño", desc: "Creación de la interfaz mágica con animaciones." },
      { label: "Revisión", desc: "Aprobación y entrega del enlace final." }
    ],
    includes: ["Diseño responsive", "Cronómetro", "Ubicación"],
    notIncludes: ["Impresión física"],
    difficulty: "Magia Digital Interactiva"
  },
  {
    id: "cumpleanos",
    type: ProjectType.CUMPLEANOS,
    title: "Invitación de Cumpleaños Express",
    subtitle: "Formato ágil de alta energía con botón de ubicación y confirmación.",
    deliveryTime: "24-48 Horas",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559607/EXPRESS.png",
    itinerary: [{ label: "Creación", desc: "Entrega rápida en 24h a 48h." }],
    includes: ["Enlace web", "WhatsApp", "Diseño responsive"],
    notIncludes: ["Impresión física"],
    difficulty: "Express de Alto Impacto"
  },
  {
    id: "carta-digital",
    type: ProjectType.CARTA_DIGITAL,
    title: "Carta & Menú Digital Gourmet",
    subtitle: "Catálogo de platillos con categorías, fotos y envío de comanda a WhatsApp.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559998/Carta_Y_Men%C3%BA_-_BASICO.png",
    itinerary: [{ label: "Maquetación", desc: "Carga de productos y precios." }],
    includes: ["Responsive", "WhatsApp de pedidos", "Actualización rápida"],
    notIncludes: ["Impresión física de cartas"],
    difficulty: "Gourmet Digital"
  },
  {
    id: "landing-page",
    type: ProjectType.LANDING_PAGE,
    title: "Landing Page Comercial",
    subtitle: "Página web de alta conversión para venta o captación de prospectos.",
    deliveryTime: "3-5 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513927/ECENCIAL.png",
    itinerary: [{ label: "Estructura", desc: "Diseño orientado a ventas y conversiones." }],
    includes: ["SEO básico", "Formulario de contacto", "WhatsApp"],
    notIncludes: ["Hosting corporativo anual", "Comercio electrónico masivo"],
    difficulty: "Conversión Comercial"
  },
  {
    id: "spot-publicitario",
    type: ProjectType.SPOT,
    title: "Spot Publicitario / Locución",
    subtitle: "Audio comercial con locución profesional y masterización de sonido.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513923/Simple.png",
    itinerary: [{ label: "Locución", desc: "Grabación en cabina insonorizada y edición." }],
    includes: ["WAV y MP3 en alta fidelidad", "Licencia de uso comercial"],
    notIncludes: ["Pauta publicitaria económica"],
    difficulty: "Acústica Comercial"
  },
  {
    id: "produccion-audiovisual",
    type: ProjectType.FOTO_VIDEO,
    title: "Producción Audiovisual / Video",
    subtitle: "Edición cinemática, corrección de color y formato vertical para redes.",
    deliveryTime: "3-5 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557403/Producci%C3%B3n_Audiovisual_Video_-Express.png",
    itinerary: [{ label: "Montaje", desc: "Edición y sincronización rítmica de audio." }],
    includes: ["Edición cinemática", "Color grading base", "Exportación optimizada"],
    notIncludes: ["Grabación presencial en locación con dron o camarógrafo (disponible a cotizar)"],
    difficulty: "Cinemático Alta Gama"
  },
  {
    id: "branding",
    type: ProjectType.DISENO_GRAFICO,
    title: "Identidad Gráfica & Branding",
    subtitle: "Diseño de logotipos vectoriales originales y paletas cromáticas.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513924/Logo.png",
    itinerary: [{ label: "Bocetado", desc: "Creación de propuestas gráficas conceptuales." }],
    includes: ["Vectores originales", "Guía cromática", "Derechos comerciales"],
    notIncludes: ["Registro de marca legal"],
    difficulty: "Identidad Exclusiva"
  },
  {
    id: "artes-multimedia",
    type: ProjectType.ARTES_MULTIMEDIA,
    title: "Diseño / Artes Multimedia",
    subtitle: "Diseño de flyers, posts, afiches, banners, historias y fotomontajes de alto impacto visual.",
    deliveryTime: "24-48 Horas",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513930/Arte_Esencial.png",
    itinerary: [
      { label: "Briefing Visual", desc: "Recopilación de textos, fotografías y objetivos comerciales de la pieza." },
      { label: "Composición & Arte", desc: "Montaje gráfico, tratamiento de tipografías y efectos visuales." },
      { label: "Ajuste & Entrega", desc: "Exportación en alta resolución en los formatos requeridos para redes o impresión." }
    ],
    includes: [
      "Diseño de piezas gráficas de autor (no plantillas genéricas)",
      "Composición tipográfica y jerarquía comercial persuasiva",
      "Formatos optimizados para Instagram, Facebook, WhatsApp y web",
      "Revisiones de estilo según política de V.A.C."
    ],
    notIncludes: [
      "Campañas masivas de múltiples piezas (disponible a cotizar)",
      "Ilustración 3D hiperrealista o modelado arquitectónico"
    ],
    difficulty: "Impacto Visual Publicitario"
  },
  {
    id: "animacion-motion",
    type: ProjectType.ANIMACION_MOTION,
    title: "Animación & Motion",
    subtitle: "Gráficos en movimiento, animación 2D y motion design de autor para marcas.",
    deliveryTime: "3-5 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791563016/Motion_Esencial.png",
    itinerary: [
      { label: "Briefing & Concepto", desc: "Definición del estilo gráfico, guion o storyboard de movimiento." },
      { label: "Diseño Vectorial", desc: "Preparación y separación de capas ilustradas o logotipos para animación." },
      { label: "Animación de Capas", desc: "Aplicación de curvas cinéticas, aceleraciones suaves y transiciones." },
      { label: "Render & Formatos", desc: "Exportación en alta calidad en formatos MP4/MOV listos para compartir." }
    ],
    includes: [
      "Animación digital personalizada según el paquete seleccionado",
      "Formatos optimizados para redes sociales o presentaciones",
      "Entrega en formato digital de alta resolución",
      "Revisiones incluidas según el plan de trabajo"
    ],
    notIncludes: [
      "Modelado 3D ultra complejo de alta densidad",
      "Grabación presencial en set con rodaje de cine"
    ],
    difficulty: "Cinética Visual & Motion Design"
  }
];

export interface PackageItem {
  id: string;
  name: string;
  priceInPEN: number;
  delivery: string;
  description: string;
  includedFeatureIds: string[];
  benefits: string[];
  upgradableFeatures?: string[];
  image?: string;
}

export interface AddonItem {
  id: string;
  label: string;
  priceInPEN: number;
  description: string;
  icon: "music" | "camera" | "qr" | "zap" | "msg";
}

export interface ServiceVariant {
  id: string;
  label: string;
  description: string;
}

export interface ServiceCatalogItem {
  id: string;
  type: ProjectType;
  title: string;
  subtitle: string;
  description: string;
  deliveryTime: string;
  image: string;
  iconName: "Palette" | "Video" | "Volume2" | "Sparkles" | "Smartphone";
  variants?: ServiceVariant[];
  quotesOnlyFeatures?: string[];
  packages: PackageItem[];
  addons: AddonItem[];
  itinerary: { label: string; desc: string }[];
  includes: string[];
  notIncludes: string[];
  difficulty: string;
}

/**
 * Normalización de equivalencias para IDs funcionales entre paquetes y extras.
 */
export const FEATURE_ALIASES: Record<string, string[]> = {
  galeria_fotos: ["galeria_fotos", "galeria", "galeria_ampliada"],
  musica: ["musica", "musica_fondo", "musica_personalizada"],
  cuenta_regresiva: ["cuenta_regresiva", "cronometro", "reloj_regresivo"],
  google_maps: ["google_maps", "ubicacion_gps", "mapa_interactivo", "botones_ubicacion"],
  confirmacion_whatsapp: ["confirmacion_whatsapp", "whatsapp_rsvp", "rsvp_whatsapp"],
  dress_code: ["dress_code", "dress_code_avanzado", "codigo_vestimenta"],
  mesa_regalos: ["mesa_regalos", "lluvia_sobres"],
  album_colaborativo: ["album_colaborativo", "qr_album", "carga_invitados"],
  qr_imprimible: ["qr_imprimible", "qr_acceso", "qr_exclusivo", "qr_album"],
  rsvp_pases: ["rsvp_pases", "control_pases", "rsvp_avanzado"],
  video_slideshow: ["video_slideshow", "video", "slideshow", "video_fondo"],
  animaciones_premium: ["animaciones_premium", "animaciones"]
};

/**
 * Determina de forma unificada si una característica está activa:
 * Regla: Activa ÚNICAMENTE si está incluida en el paquete O seleccionada como extra.
 */
export function isFeatureActive(
  canonicalOrAliasId: string,
  pkg?: PackageItem | null,
  selectedAddonIds: string[] = []
): boolean {
  const aliases = FEATURE_ALIASES[canonicalOrAliasId] || [canonicalOrAliasId];
  const inPackage = pkg?.includedFeatureIds?.some((fId) => aliases.includes(fId)) ?? false;
  const inAddons = selectedAddonIds.some((aId) => aliases.includes(aId));
  return inPackage || inAddons;
}

/**
 * CONFIGURACIÓN CENTRALIZADA DE PRECIOS V.A.C. CREATIVE
 *
 * NOTA IMPORTANTE:
 * - Los precios de Boda y XV años son PRECIOS REALES DEFINITIVOS establecidos por la dirección.
 * - Los precios de los demás servicios son precios iniciales sugeridos y están centralizados aquí
 *   para poder modificarse fácilmente en un solo lugar.
 */
export const COMMERCIAL_PRICING_CONFIG = {
  boda: {
    basico: 100,      // PRECIO REAL DEFINITIVO
    intermedio: 180,  // PRECIO REAL DEFINITIVO
    pro: 250          // PRECIO REAL DEFINITIVO
  },
  xvAnos: {
    basico: 90,       // PRECIO REAL DEFINITIVO
    intermedio: 150,  // PRECIO REAL DEFINITIVO
    pro: 240          // PRECIO REAL DEFINITIVO
  },
  cumpleanos: {
    express: 60,      // Precio inicial sugerido
    interactivo: 100, // Precio inicial sugerido
    premium: 160      // Precio inicial sugerido
  },
  cartaDigital: {
    basico: 90,       // Precio inicial sugerido
    completo: 160,    // Precio inicial sugerido
    premium: 250      // Precio inicial sugerido
  },
  landingPage: {
    esencial: 300,    // Precio inicial sugerido
    comercial: 500,   // Precio inicial sugerido
    pro: 750          // Precio inicial sugerido
  },
  spot: {
    simple: 80,       // Precio inicial sugerido
    express: 110,     // Precio inicial sugerido
    premium: 150      // Precio inicial sugerido
  },
  audiovisual: {
    express: 100,     // Precio inicial sugerido
    completo: 200,    // Precio inicial sugerido
    premium: 350      // Precio inicial sugerido
  },
  branding: {
    logo: 150,        // Precio inicial sugerido
    identidad: 300,   // Precio inicial sugerido
    completo: 500     // Precio inicial sugerido
  },
  artesMultimedia: {
    esencial: 40,     // Precio inicial sugerido: S/ 40
    profesional: 70,  // Precio inicial sugerido: S/ 70
    premium: 120      // Precio inicial sugerido: S/ 120
  },
  animacionMotion: {
    esencial: 90,     // S/ 90
    profesional: 180, // S/ 180
    premium: 300      // S/ 300
  },
  otro: {
    aMedida: 120
  }
};

export const SERVICES_CATALOG_DATA: ServiceCatalogItem[] = [
  // 1. BODA (PRECIOS REALES DEFINITIVOS: Básico 100, Intermedio 180, Pro 250)
  {
    id: "boda",
    type: ProjectType.BODA,
    title: "Invitación Virtual de Boda",
    subtitle: "Maquetación premium con confirmación RSVP inteligente, música autoejecutable, mapas y paleta de alta costura.",
    description: "Diseño elegante para parejas con confirmación RSVP y enlace web propio.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559267/BODA_-_BASICO.png",
    iconName: "Smartphone",
    packages: [
      {
        id: "basico",
        name: "Básico",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.boda.basico,
        delivery: "3 a 5 días",
        description: "Información esencial y diseño elegante para compartir el gran día.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559267/BODA_-_BASICO.png",
        includedFeatureIds: [
          "enlace_web",
          "nombres_novios",
          "fecha_hora",
          "iglesia_recepcion",
          "direccion_escrita",
          "frase_especial",
          "fotos_basicas",
          "diseno_responsive",
          "paleta_predis",
          "enlace_compartir"
        ],
        benefits: [
          "Invitación digital mediante enlace web propio",
          "Nombres de los novios, fecha y hora",
          "Ceremonia y recepción con dirección escrita",
          "Frase especial y fotografías básicas",
          "Diseño responsive adaptado a celulares",
          "Paleta visual prediseñada elegante",
          "Enlace listo para compartir con correcciones de cortesía"
        ],
        upgradableFeatures: [
          "Música de fondo autoejecutable",
          "Cuenta regresiva animada",
          "Google Maps interactivo",
          "Galería fotográfica interactiva",
          "Confirmación directa por WhatsApp",
          "Sección Dress code",
          "Álbum colaborativo de invitados",
          "RSVP con control de pases"
        ]
      },
      {
        id: "intermedio",
        name: "Intermedio",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.boda.intermedio,
        delivery: "3 a 4 días",
        description: "Información e interacción avanzada con música, mapas y galería.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513924/INTERMEDDIO.png",
        includedFeatureIds: [
          "enlace_web",
          "nombres_novios",
          "fecha_hora",
          "iglesia_recepcion",
          "direccion_escrita",
          "frase_especial",
          "fotos_basicas",
          "diseno_responsive",
          "paleta_predis",
          "enlace_compartir",
          "musica",
          "cuenta_regresiva",
          "google_maps",
          "botones_ubicacion",
          "galeria_fotos",
          "confirmacion_whatsapp",
          "dress_code"
        ],
        benefits: [
          "Todo lo correspondiente al paquete Básico",
          "Música de fondo personalizada al abrir la invitación",
          "Cuenta regresiva animada en tiempo real",
          "Google Maps con botones directos de ubicación",
          "Galería fotográfica interactiva",
          "Confirmación de asistencia directa por WhatsApp",
          "Sección de código de vestimenta (Dress code)",
          "Mayor nivel de personalización visual"
        ],
        upgradableFeatures: [
          "Álbum colaborativo para fotos/videos de invitados",
          "Código QR exclusivo para álbum colaborativo",
          "RSVP avanzado con control de pases",
          "Mesa de regalos digital con cuentas bancarias",
          "Historia de amor y línea de tiempo",
          "Video o slideshow integrado",
          "Animaciones premium estelares"
        ]
      },
      {
        id: "pro",
        name: "Pro",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.boda.pro,
        delivery: "2 a 3 días",
        description: "Experiencia completa premium con álbum colaborativo, RSVP con pases y animaciones estelares.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513929/Pro.png",
        includedFeatureIds: [
          "enlace_web",
          "nombres_novios",
          "fecha_hora",
          "iglesia_recepcion",
          "direccion_escrita",
          "frase_especial",
          "fotos_basicas",
          "diseno_responsive",
          "paleta_predis",
          "enlace_compartir",
          "musica",
          "cuenta_regresiva",
          "google_maps",
          "botones_ubicacion",
          "galeria_fotos",
          "confirmacion_whatsapp",
          "dress_code",
          "album_colaborativo",
          "qr_album",
          "carga_invitados",
          "rsvp_pases",
          "mesa_regalos",
          "historia_amor",
          "linea_tiempo",
          "dress_code_avanzado",
          "video_slideshow",
          "animaciones_premium",
          "secciones_premium"
        ],
        benefits: [
          "Todo lo incluido en el paquete Intermedio",
          "Álbum colaborativo para que los invitados suban fotos y videos",
          "Código QR exclusivo para el álbum colaborativo",
          "RSVP avanzado con control detallado de pases de invitados",
          "Mesa de regalos digital y enlaces de transferencias",
          "Historia de amor y línea de tiempo de la pareja",
          "Dress code avanzado con guía visual de colores",
          "Video o slideshow integrado con animaciones premium",
          "Máximo nivel de personalización de autor V.A.C."
        ]
      }
    ],
    addons: [
      { id: "musica", label: "Música de Fondo Personalizada", priceInPEN: 30, description: "Canción romántica que se reproduce al abrir la invitación.", icon: "music" },
      { id: "galeria_fotos", label: "Galería de Fotografías HD", priceInPEN: 40, description: "Carrusel interactivo con imágenes de la sesión.", icon: "camera" },
      { id: "rsvp_pases", label: "RSVP por WhatsApp con Control de Pases", priceInPEN: 35, description: "Sistema estructurado para control de adultos y niños.", icon: "msg" },
      { id: "qr_imprimible", label: "Código QR Imprimible en Alta", priceInPEN: 25, description: "Vector optimizado para tarjetas físicas de invitación.", icon: "qr" },
      { id: "mesa_regalos", label: "Mesa de Regalos Digital", priceInPEN: 30, description: "Enlaces directos a tiendas, cuentas bancarias o sobres.", icon: "zap" },
      { id: "dress_code", label: "Sección de Código de Vestimenta", priceInPEN: 25, description: "Indicaciones de etiqueta y sugerencias cromáticas.", icon: "zap" },
      { id: "historia_amor", label: "Historia de la Pareja / Línea de Tiempo", priceInPEN: 40, description: "Sección romántica relatando su historia de amor.", icon: "music" },
      { id: "album_colaborativo", label: "Álbum Colaborativo de Invitados", priceInPEN: 50, description: "Recopilación interactiva de fotos subidas por invitados.", icon: "camera" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Desarrollo en canal preferencial con prioridad absoluta.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[0].itinerary,
    includes: SERVICES_CATALOG[0].includes,
    notIncludes: [
      "Papelería física impresa o grabado en papel",
      "Fotografías en estudio presenciales"
    ],
    difficulty: "Elegancia Luxury de Alta Fidelidad"
  },

  // 2. XV AÑOS (PRECIOS REALES DEFINITIVOS: Básico 90, Intermedio 150, Pro 240)
  {
    id: "xv-anos",
    type: ProjectType.XV_ANOS,
    title: "Invitación de XV Años Princesa",
    subtitle: "Animaciones mágicas, lluvia de destellos, cronómetro y dress code para una fiesta inolvidable.",
    description: "Animaciones mágicas, lluvia de destellos, cronómetro y dress code.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557513/XV_A%C3%91OS_-BASICO.png",
    iconName: "Sparkles",
    packages: [
      {
        id: "basico",
        name: "Básico",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.xvAnos.basico,
        delivery: "3 a 4 días",
        description: "Invitación esencial con diseño mágico, ubicación escrita y fotografías.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557513/XV_A%C3%91OS_-BASICO.png",
        includedFeatureIds: [
          "enlace_web",
          "quinceanera_nombre",
          "fecha_hora",
          "lugar_direccion",
          "frase_xv",
          "fotos_basicas",
          "tematica_colores",
          "diseno_responsive",
          "enlace_compartir"
        ],
        benefits: [
          "Invitación digital con enlace web propio",
          "Nombre de la quinceañera, fecha y hora",
          "Lugar y dirección escrita de la recepción",
          "Frase especial y fotografías básicas",
          "Temática de quinceañera y paleta de color",
          "Diseño responsive listo para compartir"
        ],
        upgradableFeatures: [
          "Música de entrada / vals",
          "Cuenta regresiva animada",
          "Google Maps con botón directo",
          "Galería de fotos de la quinceañera",
          "Confirmación de asistencia por WhatsApp",
          "Álbum colaborativo de invitados",
          "RSVP con control de pases"
        ]
      },
      {
        id: "intermedio",
        name: "Intermedio",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.xvAnos.intermedio,
        delivery: "2 a 3 días",
        description: "Experiencia interactiva con música, mapas, cuenta regresiva y confirmación.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557512/XV_A%C3%91OS_-_INTERMEDIO.png",
        includedFeatureIds: [
          "enlace_web",
          "quinceanera_nombre",
          "fecha_hora",
          "lugar_direccion",
          "frase_xv",
          "fotos_basicas",
          "tematica_colores",
          "diseno_responsive",
          "enlace_compartir",
          "musica",
          "cuenta_regresiva",
          "google_maps",
          "botones_ubicacion",
          "galeria_fotos",
          "confirmacion_whatsapp",
          "dress_code",
          "secciones_adicionales"
        ],
        benefits: [
          "Todo lo del paquete Básico",
          "Música de entrada / vals personalizada",
          "Cuenta regresiva en tiempo real",
          "Ubicación con botón directo de Google Maps",
          "Galería de fotos de la quinceañera",
          "Confirmación de asistencia por WhatsApp",
          "Dress code sugerido y secciones adicionales de temática"
        ],
        upgradableFeatures: [
          "Álbum colaborativo para fotos de amigos e invitados",
          "Código QR exclusivo imprimible",
          "RSVP avanzado con control de pases",
          "Video o slideshow animado integrado",
          "Galería ampliada y animaciones premium estelares"
        ]
      },
      {
        id: "pro",
        name: "Pro",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.xvAnos.pro,
        delivery: "24 a 48 horas",
        description: "Experiencia premium completa con álbum colaborativo, QR, video y RSVP avanzado.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557512/XV_A%C3%91OS_-_PRO.png",
        includedFeatureIds: [
          "enlace_web",
          "quinceanera_nombre",
          "fecha_hora",
          "lugar_direccion",
          "frase_xv",
          "fotos_basicas",
          "tematica_colores",
          "diseno_responsive",
          "enlace_compartir",
          "musica",
          "cuenta_regresiva",
          "google_maps",
          "botones_ubicacion",
          "galeria_fotos",
          "confirmacion_whatsapp",
          "dress_code",
          "secciones_adicionales",
          "album_colaborativo",
          "qr_imprimible",
          "rsvp_pases",
          "video_slideshow",
          "galeria_ampliada",
          "animaciones_premium",
          "secciones_especiales"
        ],
        benefits: [
          "Todo lo del paquete Intermedio",
          "Álbum colaborativo para fotos de amigos e invitados",
          "Código QR exclusivo imprimible para recuerdos o mesas",
          "RSVP avanzado con control de pases de invitados",
          "Video o slideshow integrado de la quinceañera",
          "Galería ampliada y animaciones premium estelares",
          "Secciones especiales de recuerdos y mesa de regalos"
        ]
      }
    ],
    addons: [
      { id: "musica", label: "Música de Entrada Personalizada", priceInPEN: 30, description: "Tema musical favorito al ingresar.", icon: "music" },
      { id: "galeria_fotos", label: "Galería de Fotos", priceInPEN: 40, description: "Álbum fotográfico de sesión.", icon: "camera" },
      { id: "rsvp_pases", label: "RSVP por WhatsApp con Pases", priceInPEN: 35, description: "Confirmación exacta con conteo de pases.", icon: "msg" },
      { id: "qr_imprimible", label: "Código QR Imprimible", priceInPEN: 25, description: "Vector para imprimir en recuerdos o tarjetas.", icon: "qr" },
      { id: "dress_code", label: "Sección de Dress Code", priceInPEN: 25, description: "Indicaciones de vestimenta y colores sugeridos.", icon: "zap" },
      { id: "mesa_regalos", label: "Mesa de Regalos / Lluvia de Sobres", priceInPEN: 30, description: "Información de obsequios y transferencias.", icon: "zap" },
      { id: "animaciones_premium", label: "Animaciones Estelares Avanzadas", priceInPEN: 45, description: "Efectos visuales de destellos y confetti.", icon: "zap" },
      { id: "album_colaborativo", label: "Álbum Colaborativo de Invitados", priceInPEN: 50, description: "Fotos subidas por amigos y familiares.", icon: "camera" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Atención exprés en jornada continua.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[1].itinerary,
    includes: SERVICES_CATALOG[1].includes,
    notIncludes: ["Impresión física de papelería"],
    difficulty: "Magia Digital Interactiva"
  },

  // 3. CUMPLEAÑOS (PRECIOS SUGERIDOS: Express 60, Interactivo 100, Premium 160)
  {
    id: "cumpleanos",
    type: ProjectType.CUMPLEANOS,
    title: "Invitación de Cumpleaños",
    subtitle: "Formato ágil de alta energía con botón de ubicación y confirmación.",
    description: "Formato ágil de alta energía con botón de ubicación y confirmación.",
    deliveryTime: "24-48 Horas",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559607/EXPRESS.png",
    iconName: "Sparkles",
    packages: [
      {
        id: "express",
        name: "Express",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.cumpleanos.express,
        delivery: "24 horas",
        description: "Invitación rápida y visual, ideal para compartir por WhatsApp.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559607/EXPRESS.png",
        includedFeatureIds: [
          "enlace_web",
          "festejado_nombre",
          "edad",
          "fecha_hora",
          "direccion",
          "tematica",
          "fotografia",
          "diseno_responsive",
          "enlace_compartir"
        ],
        benefits: [
          "Invitación digital exprés lista para compartir por WhatsApp",
          "Nombre del festejado, edad, fecha, hora y dirección",
          "Temática del festejo y fotografía principal",
          "Diseño dinámico optimizado para celulares"
        ],
        upgradableFeatures: [
          "Música de fondo festiva",
          "Cuenta regresiva al día del evento",
          "Botón de Google Maps",
          "Confirmación por WhatsApp",
          "Mini galería de fotos",
          "Video o animaciones festivas"
        ]
      },
      {
        id: "interactivo",
        name: "Interactivo",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.cumpleanos.interactivo,
        delivery: "24 a 48 horas",
        description: "Suma música, cuenta regresiva, botón de ubicación y confirmación por WhatsApp.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513926/INTERACTIVO.png",
        includedFeatureIds: [
          "enlace_web",
          "festejado_nombre",
          "edad",
          "fecha_hora",
          "direccion",
          "tematica",
          "fotografia",
          "diseno_responsive",
          "enlace_compartir",
          "musica",
          "cuenta_regresiva",
          "google_maps",
          "confirmacion_whatsapp",
          "galeria_fotos"
        ],
        benefits: [
          "Todo lo del paquete Express",
          "Música de fondo festiva y alegre",
          "Cuenta regresiva al día del evento",
          "Botón interactivo de ubicación Google Maps / Waze",
          "Confirmación directa de invitados por WhatsApp",
          "Mini galería de fotos destacadas"
        ],
        upgradableFeatures: [
          "Video o slideshow integrado",
          "Galería ampliada de momentos",
          "Código QR imprimible",
          "Animaciones premium festivas"
        ]
      },
      {
        id: "premium",
        name: "Premium",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.cumpleanos.premium,
        delivery: "24 a 48 horas",
        description: "Experiencia completa para grandes celebraciones con video, QR y animaciones.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559437/PREMIUN.png",
        includedFeatureIds: [
          "enlace_web",
          "festejado_nombre",
          "edad",
          "fecha_hora",
          "direccion",
          "tematica",
          "fotografia",
          "diseno_responsive",
          "enlace_compartir",
          "musica",
          "cuenta_regresiva",
          "google_maps",
          "confirmacion_whatsapp",
          "galeria_fotos",
          "video_slideshow",
          "galeria_ampliada",
          "qr_imprimible",
          "animaciones_premium",
          "secciones_especiales"
        ],
        benefits: [
          "Todo lo del paquete Interactivo",
          "Video o slideshow animado integrado",
          "Galería ampliada de momentos",
          "Código QR imprimible para recuerdos o detalles",
          "Efectos visuales festivos y micro-animaciones premium",
          "Secciones especiales de mesa de regalos o vestimenta"
        ]
      }
    ],
    addons: [
      { id: "musica", label: "Música de Fondo Festiva", priceInPEN: 30, description: "Canción alegre que ameniza la invitación.", icon: "music" },
      { id: "galeria_fotos", label: "Mini Galería de Momentos", priceInPEN: 35, description: "Fotos destacadas del festejado.", icon: "camera" },
      { id: "ubicacion_gps", label: "Mapa de Ubicación Interactiva", priceInPEN: 20, description: "Acceso directo a Waze y Google Maps.", icon: "qr" },
      { id: "confirmacion_whatsapp", label: "Confirmación por WhatsApp", priceInPEN: 30, description: "Botón estructurado para asistencias.", icon: "msg" },
      { id: "qr_imprimible", label: "Código QR Imprimible", priceInPEN: 25, description: "Vector para imprimir en detalles físicos.", icon: "qr" },
      { id: "animaciones_premium", label: "Efectos Visuales Festivos", priceInPEN: 35, description: "Animación de globos y confetti dinámico.", icon: "zap" },
      { id: "entrega_urgente", label: "Entrega Flash 24 Horas", priceInPEN: 70, description: "Prioridad máxima en cola de diseño.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[2].itinerary,
    includes: SERVICES_CATALOG[2].includes,
    notIncludes: ["Impresión física de tarjetas"],
    difficulty: "Express de Alto Impacto"
  },

  // 4. CARTA / MENÚ DIGITAL (PRECIOS SUGERIDOS: Básico 90, Completo 160, Premium 250)
  {
    id: "carta-digital",
    type: ProjectType.CARTA_DIGITAL,
    title: "Carta & Menú Digital Gourmet",
    subtitle: "Catálogo de platillos con categorías, fotos y envío de comanda a WhatsApp.",
    description: "Catálogo de platillos con categorías, fotos y envío de comanda a WhatsApp.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559998/Carta_Y_Men%C3%BA_-_BASICO.png",
    iconName: "Smartphone",
    packages: [
      {
        id: "basico",
        name: "Básico",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.cartaDigital.basico,
        delivery: "2 a 3 días",
        description: "Menú digital esencial con logo, categorías, productos, precios y WhatsApp.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559998/Carta_Y_Men%C3%BA_-_BASICO.png",
        includedFeatureIds: [
          "logo",
          "info_negocio",
          "categorias",
          "productos",
          "precios",
          "diseno_responsive",
          "boton_whatsapp",
          "enlace_digital"
        ],
        benefits: [
          "Carta digital con enlace web propio sin descargas de apps",
          "Logo e información principal del negocio",
          "Categorías estructuradas, platillos y precios",
          "Diseño responsive con botón de contacto a WhatsApp"
        ],
        upgradableFeatures: [
          "Mayor cantidad de categorías y platillos",
          "Fotografías en alta definición por plato",
          "Envío de comanda/pedido estructurado a WhatsApp",
          "Código QR de mesa para imprimir",
          "Sección de promociones del día"
        ]
      },
      {
        id: "completo",
        name: "Completo",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.cartaDigital.completo,
        delivery: "3 a 4 días",
        description: "Más productos, fotos en alta resolución, botón de pedidos a WhatsApp y QR para mesas.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791559999/CartaY_Men%C3%BA_-_COMPLETO.png",
        includedFeatureIds: [
          "logo",
          "info_negocio",
          "categorias",
          "productos",
          "precios",
          "diseno_responsive",
          "boton_whatsapp",
          "enlace_digital",
          "mas_categorias",
          "mas_productos",
          "galeria_fotos",
          "pedidos_whatsapp",
          "google_maps",
          "redes_sociales",
          "promociones",
          "qr_imprimible"
        ],
        benefits: [
          "Todo lo del paquete Básico",
          "Mayor cantidad de categorías y catálogo ampliado de platillos",
          "Fotografías en alta definición de las especialidades",
          "Generador automático de comandas directas a WhatsApp",
          "Ubicación en Google Maps y enlaces a redes sociales",
          "Sección de promociones y código QR listo para imprimir en mesas"
        ],
        upgradableFeatures: [
          "Experiencia visual gourmet de alta gama",
          "Productos destacados interactivos",
          "Filtros avanzados de navegación",
          "Personalización integral con identidad de marca"
        ]
      },
      {
        id: "premium",
        name: "Premium",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.cartaDigital.premium,
        delivery: "4 a 5 días",
        description: "Experiencia visual gourmet de alta gama, productos destacados y filtros.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791560000/Carta_Y_Men%C3%BA_-_PREMIUN.png",
        includedFeatureIds: [
          "logo",
          "info_negocio",
          "categorias",
          "productos",
          "precios",
          "diseno_responsive",
          "boton_whatsapp",
          "enlace_digital",
          "mas_categorias",
          "mas_productos",
          "galeria_fotos",
          "pedidos_whatsapp",
          "google_maps",
          "redes_sociales",
          "promociones",
          "qr_imprimible",
          "experiencia_visual",
          "secciones_promocionales",
          "productos_destacados",
          "filtros_navegacion",
          "personalizacion_premium"
        ],
        benefits: [
          "Todo lo del paquete Completo",
          "Experiencia visual gourmet de alta gama",
          "Secciones promocionales y productos destacados de la casa",
          "Filtros ágiles de navegación entre especialidades",
          "Máxima personalización con la paleta e identidad del restaurante"
        ]
      }
    ],
    addons: [
      { id: "qr_imprimible", label: "Diseño de Código QR para Mesas", priceInPEN: 25, description: "Arte vectorial listo para imprimir en acrílicos o portamenús.", icon: "qr" },
      { id: "productos_extra", label: "Bloque de Productos Adicionales (+10 ítems)", priceInPEN: 40, description: "Incorporación de sección ampliada de especialidades.", icon: "zap" },
      { id: "categorias_extra", label: "Categorías Especiales o Vinos", priceInPEN: 35, description: "Sección dedicada a coctelería o cava.", icon: "zap" },
      { id: "pedidos_whatsapp", label: "Botón de Comandas y Pedidos Directos", priceInPEN: 45, description: "Generador estructurado de pedido para cocina.", icon: "msg" },
      { id: "galeria_fotos", label: "Galería Fotográfica de Platillos", priceInPEN: 40, description: "Imágenes HD de las especialidades.", icon: "camera" },
      { id: "entrega_urgente", label: "Entrega Prioritaria", priceInPEN: 70, description: "Prioridad en maquetación digital.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[3].itinerary,
    includes: SERVICES_CATALOG[3].includes,
    notIncludes: ["Impresión física de cartas en papel"],
    difficulty: "Gourmet Digital"
  },

  // 5. LANDING PAGE / WEB COMERCIAL (PRECIOS SUGERIDOS: Esencial 300, Comercial 500, Pro 750)
  {
    id: "landing-page",
    type: ProjectType.LANDING_PAGE,
    title: "Landing Page / Web Comercial",
    subtitle: "Página web de alta conversión para venta o captación de prospectos.",
    description: "Página web de alta conversión para venta o captación de prospectos.",
    deliveryTime: "3-5 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513927/ECENCIAL.png",
    iconName: "Smartphone",
    quotesOnlyFeatures: [
      "Comercio electrónico transaccional masivo con pasarela de pago (A cotizar)",
      "Sistema de reservas complejas o membresías de usuarios (A cotizar)",
      "Dominio propio corporativo y hosting anual dedicado (A cotizar)"
    ],
    packages: [
      {
        id: "esencial",
        name: "Esencial",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.landingPage.esencial,
        delivery: "3 a 4 días",
        description: "Landing sencilla orientada a presencia digital y contacto directo.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513927/ECENCIAL.png",
        includedFeatureIds: [
          "portada_hero",
          "info_principal",
          "servicios",
          "contacto",
          "boton_whatsapp",
          "responsive",
          "redes_sociales"
        ],
        benefits: [
          "Landing page esencial optimizada para celulares y pantallas",
          "Portada atractiva con información principal de la empresa",
          "Presentación de servicios o productos clave",
          "Botón flotante de contacto directo a WhatsApp y enlaces a redes"
        ],
        upgradableFeatures: [
          "Estructura comercial de alta conversión",
          "Galería de proyectos o catálogo",
          "Mapa interactivo de sucursales",
          "Testimonios y llamados a la acción",
          "Formulario de prospectos (Leads)",
          "Animaciones scroll y analítica web"
        ]
      },
      {
        id: "comercial",
        name: "Comercial",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.landingPage.comercial,
        delivery: "4 a 5 días",
        description: "Estructura comercial completa con testimonios, galería, llamados a la acción y formulario.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513927/Comercial.png",
        includedFeatureIds: [
          "portada_hero",
          "info_principal",
          "servicios",
          "contacto",
          "boton_whatsapp",
          "responsive",
          "redes_sociales",
          "mas_secciones",
          "galeria_proyectos",
          "google_maps",
          "testimonios",
          "llamados_accion",
          "formulario_leads",
          "estructura_comercial"
        ],
        benefits: [
          "Todo lo del paquete Esencial",
          "Estructura comercial de alta conversión",
          "Galería de proyectos o catálogo fotográfico",
          "Mapa interactivo de ubicación y sucursales",
          "Bloque de testimonios y valoraciones de clientes",
          "Formulario personalizado de captación de prospectos (Leads)"
        ],
        upgradableFeatures: [
          "Mayor cantidad de secciones personalizadas",
          "Animaciones fluidas y efectos de scroll",
          "Preguntas frecuentes interactivas (FAQ)",
          "Integración de analítica web y píxeles",
          "Optimización SEO técnico básica"
        ]
      },
      {
        id: "pro",
        name: "Pro",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.landingPage.pro,
        delivery: "5 a 7 días",
        description: "Página web integral con secciones avanzadas, animaciones, integraciones y SEO técnico.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557128/Pro_Landing.png",
        includedFeatureIds: [
          "portada_hero",
          "info_principal",
          "servicios",
          "contacto",
          "boton_whatsapp",
          "responsive",
          "redes_sociales",
          "mas_secciones",
          "galeria_proyectos",
          "google_maps",
          "testimonios",
          "llamados_accion",
          "formulario_leads",
          "estructura_comercial",
          "secciones_avanzadas",
          "animaciones_scroll",
          "contenido_avanzado",
          "integraciones_analitica",
          "faq_interactivo",
          "seo_tecnico"
        ],
        benefits: [
          "Todo lo del paquete Comercial",
          "Arquitectura web premium con secciones ilimitadas recomendadas",
          "Animaciones fluidas y transiciones dinámicas al deslizar",
          "Acordeón interactivo de preguntas frecuentes (FAQ)",
          "Integración de analítica web y botones de conversión",
          "Optimización de velocidad y SEO técnico básico"
        ]
      }
    ],
    addons: [
      { id: "secciones_extra", label: "Secciones Adicionales de Contenido", priceInPEN: 60, description: "Bloques para testimonios, equipo o servicios.", icon: "zap" },
      { id: "formulario_avanzado", label: "Formulario de Leads Avanzado", priceInPEN: 50, description: "Campos personalizados con validación.", icon: "zap" },
      { id: "whatsapp_lead", label: "Botón Flotante de WhatsApp Business", priceInPEN: 35, description: "Acceso permanente de chat para clientes.", icon: "msg" },
      { id: "mapa_interactivo", label: "Mapa y Sucursales", priceInPEN: 30, description: "Integración geolocalizada para tiendas.", icon: "qr" },
      { id: "animaciones_premium", label: "Efectos de Animación Scroll", priceInPEN: 45, description: "Transiciones fluidas al deslizar la página.", icon: "zap" },
      { id: "faq_section", label: "Sección de Preguntas Frecuentes (FAQ)", priceInPEN: 30, description: "Acordeón interactivo para resolver dudas comunes.", icon: "zap" },
      { id: "entrega_urgente", label: "Entrega Prioritaria", priceInPEN: 70, description: "Desarrollo acelerado en jornada continua.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[4].itinerary,
    includes: SERVICES_CATALOG[4].includes,
    notIncludes: [
      "Hosting corporativo anual y dominio de pago propio (disponible a cotizar)",
      "Comercio electrónico transaccional masivo con pasarela de pago (disponible a cotizar)"
    ],
    difficulty: "Conversión Comercial"
  },

  // 6. SPOT PUBLICITARIO / LOCUCIÓN (PRECIOS SUGERIDOS: Simple 80, Premium 150)
  {
    id: "spot-publicitario",
    type: ProjectType.SPOT,
    title: "Spot Publicitario / Locución",
    subtitle: "Audio y piezas publicitarias con locución profesional y masterización de sonido.",
    description: "Audio y piezas publicitarias con locución profesional y masterización de sonido.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513923/Simple.png",
    iconName: "Volume2",
    variants: [
      { id: "audiovisual", label: "Spot Audiovisual", description: "Edición dinámica de video con música, rótulos animados y locución para redes o pantallas." },
      { id: "radial", label: "Spot Radial", description: "Cuña de audio masterizada y mezclada para radio difusión comercial, Spotify y perifoneo." },
      { id: "locucion", label: "Locución Comercial", description: "Registro vocal en cabina insonorizada de alta fidelidad para marcas y doblaje publicitario." }
    ],
    quotesOnlyFeatures: [
      "Inversión de pauta publicitaria en Meta Ads, Google Ads o radio difusión (A cotizar)"
    ],
    packages: [
      {
        id: "simple",
        name: "Simple",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.spot.simple,
        delivery: "2 a 3 días",
        description: "Edición básica, música de fondo, locución profesional y formato para redes.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513923/Simple.png",
        includedFeatureIds: [
          "locucion_basica",
          "edicion_basica",
          "musica_licencia",
          "formato_redes",
          "duracion_corta"
        ],
        benefits: [
          "Locución comercial profesional (hasta 30 segundos)",
          "Edición limpia y masterización básica de sonido",
          "Música de fondo libre de regalías comerciales",
          "Formato de entrega en alta calidad WAV y MP3"
        ],
        upgradableFeatures: [
          "Redacción y mejora de guion publicitario",
          "Diseño sonoro y efectos especiales (SFX)",
          "Opción de segunda voz o diálogo comercial",
          "Adaptación vertical 9:16 para Reels y TikTok",
          "Inclusión de subtítulos dinámicos de alto enganche"
        ]
      },
      {
        id: "express",
        name: "Express",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.spot.express,
        delivery: "24 a 48 horas",
        description: "Producción ágil de spot publicitario con locución comercial y entrega exprés.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513926/Express.png",
        includedFeatureIds: [
          "locucion_basica",
          "edicion_basica",
          "musica_licencia",
          "formato_redes",
          "duracion_corta",
          "entrega_rapida"
        ],
        benefits: [
          "Locución comercial profesional con entrega preferencial",
          "Edición ágil de audio y masterización limpia",
          "Música de fondo libre de regalías comerciales",
          "Formato optimizado para WhatsApp, radio y redes sociales",
          "Entrega rápida garantizada en 24 a 48 horas"
        ],
        upgradableFeatures: [
          "Diseño sonoro avanzado",
          "Adaptación audiovisual para Reels / TikTok",
          "Subtítulos dinámicos"
        ]
      },
      {
        id: "premium",
        name: "Premium",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.spot.premium,
        delivery: "3 a 4 días",
        description: "Edición avanzada, diseño sonoro, mezcla, subtítulos y adaptación para Reels/TikTok.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513923/Premium.png",
        includedFeatureIds: [
          "locucion_basica",
          "edicion_basica",
          "musica_licencia",
          "formato_redes",
          "duracion_corta",
          "guion_spot",
          "edicion_avanzada",
          "diseno_sonoro",
          "mezcla_audio",
          "segunda_voz",
          "version_vertical",
          "subtitulos_spot"
        ],
        benefits: [
          "Todo lo del paquete Simple",
          "Redacción y pulido persuasivo del guion comercial",
          "Diseño sonoro envolvente con efectos de impacto (SFX)",
          "Posibilidad de segunda voz o diálogo complementario",
          "Adaptación audiovisual vertical 9:16 para Reels y TikTok",
          "Subtítulos dinámicos incrustados para visualización sin audio"
        ]
      }
    ],
    addons: [
      { id: "guion_spot", label: "Mejora de Guion Publicitario", priceInPEN: 50, description: "Redacción persuasiva adaptada a tu público.", icon: "zap" },
      { id: "locucion_adicional", label: "Locución Adicional / Segunda Voz", priceInPEN: 60, description: "Incorporación de voz complementaria.", icon: "msg" },
      { id: "musicalizacion_spot", label: "Musicalización Comercial con Licencia", priceInPEN: 50, description: "Banda sonora idónea para el spot.", icon: "music" },
      { id: "diseno_sonoro", label: "Diseño Sonoro y Efectos Especiales (SFX)", priceInPEN: 45, description: "Ambientación y efectos de impacto.", icon: "zap" },
      { id: "version_vertical", label: "Versión Vertical 9:16 para Reels", priceInPEN: 50, description: "Adaptación audiovisual para redes.", icon: "camera" },
      { id: "subtitulos_spot", label: "Subtítulos Dinámicos Incrustados", priceInPEN: 40, description: "Texto animado para reproducción sin audio.", icon: "qr" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Producción exprés en jornada preferencial.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[5].itinerary,
    includes: SERVICES_CATALOG[5].includes,
    notIncludes: ["Inversión económica para colocar pauta en plataformas publicitarias"],
    difficulty: "Acústica Comercial"
  },

  // 7. PRODUCCIÓN AUDIOVISUAL / VIDEO (PRECIOS SUGERIDOS: Express 100, Completo 200, Premium 350)
  {
    id: "produccion-audiovisual",
    type: ProjectType.FOTO_VIDEO,
    title: "Producción Audiovisual / Video",
    subtitle: "Edición cinemática, corrección de color y formato vertical para redes.",
    description: "Edición cinemática, corrección de color y formato vertical para redes.",
    deliveryTime: "3-5 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557403/Producci%C3%B3n_Audiovisual_Video_-Express.png",
    iconName: "Video",
    quotesOnlyFeatures: [
      "Grabaciones presenciales en locación física con cámara de cine (A cotizar)",
      "Tomas aéreas y vuelos con dron profesional de alta resolución (A cotizar)",
      "Desplazamiento técnico para cobertura de eventos en directo (A cotizar)"
    ],
    packages: [
      {
        id: "express",
        name: "Express",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.audiovisual.express,
        delivery: "2 a 3 días",
        description: "Edición ágil de video corto para Reels o TikTok con música y cortes limpios.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557403/Producci%C3%B3n_Audiovisual_Video_-Express.png",
        includedFeatureIds: [
          "edicion_corta",
          "corte_dinamico",
          "musica_audio",
          "formato_vertical"
        ],
        benefits: [
          "Edición ágil de video corto (hasta 30-45 segundos)",
          "Cortes limpios y dinámicos al ritmo de la música",
          "Formato vertical optimizado para Reels o TikTok",
          "Exportación en alta definición 1080p"
        ],
        upgradableFeatures: [
          "Mayor duración y complejidad de montaje",
          "Corrección de color cinematográfica (Color Grading)",
          "Subtítulos dinámicos de alto impacto visual",
          "Títulos animados y motion graphics",
          "Exportación Ultra HD 4K y múltiples formatos"
        ]
      },
      {
        id: "completo",
        name: "Completo",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.audiovisual.completo,
        delivery: "3 a 5 días",
        description: "Mayor duración, color grading cinematográfico, subtítulos dinámicos y motion graphics.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557401/Producci%C3%B3n_Audiovisual_Video_-Completo.png",
        includedFeatureIds: [
          "edicion_corta",
          "corte_dinamico",
          "musica_audio",
          "formato_vertical",
          "color_grading",
          "subtitulos_dinamicos",
          "motion_graphics",
          "edicion_avanzada",
          "audio_limpieza"
        ],
        benefits: [
          "Todo lo del paquete Express",
          "Duración ampliada y mayor complejidad de montaje",
          "Corrección de color cinematográfica (Color Grading)",
          "Subtítulos dinámicos estilizados con tipografía propia",
          "Títulos animados y rótulos en movimiento",
          "Mezcla y limpieza acústica de audio ambiental"
        ],
        upgradableFeatures: [
          "Intro y outro personalizados con logotipo",
          "Exportación Ultra HD 4K",
          "Entrega de varias piezas adaptadas (Vertical + Horizontal)"
        ]
      },
      {
        id: "premium",
        name: "Premium",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.audiovisual.premium,
        delivery: "5 a 7 días",
        description: "Edición cinemática de alto nivel, múltiples piezas adaptadas, intro/outro y exportación 4K.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791557402/Producci%C3%B3n_Audiovisual_Video_-Premium.png",
        includedFeatureIds: [
          "edicion_corta",
          "corte_dinamico",
          "musica_audio",
          "formato_vertical",
          "color_grading",
          "subtitulos_dinamicos",
          "motion_graphics",
          "edicion_avanzada",
          "audio_limpieza",
          "intro_outro",
          "reel_adicional",
          "exportacion_4k",
          "varias_piezas",
          "derechos_comerciales"
        ],
        benefits: [
          "Todo lo del paquete Completo",
          "Edición cinemática de alto nivel narrativo",
          "Entrega de múltiples piezas adaptadas (Vertical 9:16 + Horizontal 16:9)",
          "Intro y outro personalizados con identidad de marca",
          "Exportación en máxima fidelidad Ultra HD 4K",
          "Licencia de uso comercial y musical plena"
        ]
      }
    ],
    addons: [
      { id: "reel_adicional", label: "Reel Vertical Adicional para Redes", priceInPEN: 60, description: "Corte optimizado para Instagram Reels o TikTok.", icon: "camera" },
      { id: "subtitulos_avanzados", label: "Subtítulos Dinámicos Estilizados", priceInPEN: 50, description: "Subtitulado profesional con tipografía de marca.", icon: "qr" },
      { id: "color_grading", label: "Corrección de Color Cinemática Avanzada", priceInPEN: 60, description: "Look visual de cine con grading profesional.", icon: "zap" },
      { id: "motion_graphics", label: "Motion Graphics y Títulos Animados", priceInPEN: 65, description: "Rótulos dinámicos y gráficos en movimiento.", icon: "zap" },
      { id: "intro_outro", label: "Intro y Outro Personalizados", priceInPEN: 45, description: "Cortes de apertura y cierre con identidad propia.", icon: "music" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Prioridad absoluta en estación de edición.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[6].itinerary,
    includes: SERVICES_CATALOG[6].includes,
    notIncludes: [
      "Grabaciones presenciales en locación física con dron o camarógrafo (disponible a cotizar)"
    ],
    difficulty: "Cinemático Alta Gama"
  },

  // 8. DISEÑO GRÁFICO / BRANDING (PRECIOS SUGERIDOS: Logo 150, Identidad 300, Branding completo 500)
  {
    id: "branding",
    type: ProjectType.DISENO_GRAFICO,
    title: "Identidad Gráfica & Branding",
    subtitle: "Diseño de logotipos vectoriales originales y paletas cromáticas.",
    description: "Diseño de logotipos vectoriales originales y paletas cromáticas.",
    deliveryTime: "2-4 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513924/Logo.png",
    iconName: "Palette",
    quotesOnlyFeatures: [
      "Registro legal de marcas y patentes comerciales ante el estado (A cotizar)",
      "Impresión física de papelería, empaques o tarjetas de presentación (A cotizar)"
    ],
    packages: [
      {
        id: "logo",
        name: "Logo",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.branding.logo,
        delivery: "2 a 3 días",
        description: "Diseño de logotipo original con propuestas conceptuales y formatos vectoriales.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513924/Logo.png",
        includedFeatureIds: [
          "propuestas_logo",
          "logotipo_vectorial",
          "archivos_alta",
          "derechos_comerciales"
        ],
        benefits: [
          "Diseño de logotipo original (hasta 3 propuestas conceptuales)",
          "Exportación vectorial (.AI, .SVG, .PNG transparente)",
          "Versiones adaptadas para fondos claros y oscuros",
          "Cesión plena de derechos de uso comercial"
        ],
        upgradableFeatures: [
          "Variaciones secundarias del logotipo (isotipo, sello, vertical)",
          "Guía cromática con códigos Pantone, CMYK y RGB",
          "Selección de fuentes tipográficas corporativas",
          "Mockups 3D hiperrealistas de aplicación de marca",
          "Manual completo de identidad visual de marca en PDF"
        ]
      },
      {
        id: "identidad",
        name: "Identidad",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.branding.identidad,
        delivery: "3 a 5 días",
        description: "Logotipo con variaciones, paleta Pantone, tipografías corporativas y mockups 3D.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513930/Identidad.png",
        includedFeatureIds: [
          "propuestas_logo",
          "logotipo_vectorial",
          "archivos_alta",
          "derechos_comerciales",
          "variantes_logo",
          "paleta_pantone",
          "tipografias",
          "aplicaciones_basicas",
          "mockups_3d"
        ],
        benefits: [
          "Todo lo del paquete Logo",
          "Variaciones del logotipo (isotipo, sello y versión vertical)",
          "Guía cromática con especificaciones Pantone, CMYK y RGB",
          "Selección y jerarquía de fuentes tipográficas de marca",
          "Mockups 3D hiperrealistas de visualización de marca",
          "Adaptación para fotos de perfil y portadas en redes sociales"
        ],
        upgradableFeatures: [
          "Manual completo de identidad visual de marca en PDF",
          "Diseño de patrones gráficos, texturas e iconografía propia",
          "Plantillas de papelería corporativa digital y firmas de email",
          "Paquete master organizado de archivos fuente editables"
        ]
      },
      {
        id: "branding-completo",
        name: "Branding Completo",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.branding.completo,
        delivery: "5 a 7 días",
        description: "Identidad completa con manual de marca en PDF, papelería digital y archivos editables.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513930/Branding_Complet.png",
        includedFeatureIds: [
          "propuestas_logo",
          "logotipo_vectorial",
          "archivos_alta",
          "derechos_comerciales",
          "variantes_logo",
          "paleta_pantone",
          "tipografias",
          "aplicaciones_basicas",
          "mockups_3d",
          "manual_marca",
          "elementos_graficos",
          "papeleria_digital",
          "piezas_presentacion",
          "archivos_fuente"
        ],
        benefits: [
          "Todo lo del paquete Identidad",
          "Manual completo de identidad visual de marca en PDF",
          "Diseño de patrones gráficos, texturas e iconografía propia",
          "Plantillas de papelería corporativa digital y firmas de email",
          "Piezas de presentación para clientes y dossiers comerciales",
          "Paquete master organizado de archivos fuente editables (AI, EPS, SVG)"
        ]
      }
    ],
    addons: [
      { id: "logotipo_variaciones", label: "Variaciones de Logotipo (Vertical / Sello)", priceInPEN: 60, description: "Versiones alternativas adaptadas a diferentes soportes.", icon: "zap" },
      { id: "archivos_editables", label: "Entrega de Archivos Fuente Editables (AI, EPS, SVG)", priceInPEN: 70, description: "Paquete completo con formatos vectoriales editables.", icon: "qr" },
      { id: "mockups_3d", label: "Mockups 3D de Presentación de Marca", priceInPEN: 50, description: "Visualización realista en papelería y productos.", icon: "camera" },
      { id: "paleta_avanzada", label: "Guía de Paleta Cromática y Códigos Pantone", priceInPEN: 35, description: "Especificaciones exactas para impresión y digital.", icon: "zap" },
      { id: "manual_marca", label: "Manual Básico de Identidad de Marca (PDF)", priceInPEN: 80, description: "Normas de uso, proporciones y aplicaciones correctas.", icon: "msg" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Desarrollo exprés en jornada preferencial.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[7].itinerary,
    includes: SERVICES_CATALOG[7].includes,
    notIncludes: [
      "Registro legal de patentes y marcas comerciales ante el estado (a cotizar)",
      "Impresión física de papelería"
    ],
    difficulty: "Identidad Exclusiva"
  },

  // 9. DISEÑO / ARTES MULTIMEDIA (PRECIOS INICIALES SUGERIDOS: Esencial 40, Profesional 70, Premium 120)
  {
    id: "artes-multimedia",
    type: ProjectType.ARTES_MULTIMEDIA,
    title: "Diseño / Artes Multimedia",
    subtitle: "Diseño de flyers, posts, afiches, banners, historias y fotomontajes de alto impacto visual.",
    description: "Creación de piezas gráficas publicitarias y artes digitales de alto impacto para redes o impresos.",
    deliveryTime: "24-48 Horas",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513930/Arte_Esencial.png",
    iconName: "Palette",
    quotesOnlyFeatures: [
      "Campañas publicitarias masivas de más de 10 piezas simultáneas (A cotizar)",
      "Ilustración digital compleja y renderizado 3D (A cotizar)",
      "Gigantografías y rotulaciones de gran escala para vía pública (A cotizar)"
    ],
    packages: [
      {
        id: "arte-esencial",
        name: "Arte Esencial",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.artesMultimedia.esencial,
        delivery: "24 a 48 horas",
        description: "Ideal para flyer sencillo, publicación en redes, historia o banner básico.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513930/Arte_Esencial.png",
        includedFeatureIds: [
          "pieza_grafica_individual",
          "textos_cliente",
          "imagenes_proporcionadas",
          "composicion_basica",
          "formato_digital",
          "exportacion_redes"
        ],
        benefits: [
          "Una pieza gráfica publicitaria o promocional",
          "Adaptación de textos y copys entregados por el cliente",
          "Uso e integración de imágenes y logotipos proporcionados",
          "Composición visual básica optimizada para captar atención",
          "Formato digital de alta resolución (JPG/PNG)",
          "Exportación lista para compartir en WhatsApp, historias o feed"
        ],
        upgradableFeatures: [
          "Retoque fotográfico avanzado e integración multicapa",
          "Efectos visuales y fotomontaje artístico de autor",
          "Adaptaciones a múltiples formatos (Story, Feed, Banner)",
          "Entrega de archivos fuente abiertos editables"
        ]
      },
      {
        id: "arte-profesional",
        name: "Arte Profesional",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.artesMultimedia.profesional,
        delivery: "24 a 48 horas",
        description: "Composición profesional con retoque fotográfico, integración de varias imágenes y efectos.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513924/Arte_Profesional.png",
        includedFeatureIds: [
          "pieza_grafica_individual",
          "textos_cliente",
          "imagenes_proporcionadas",
          "composicion_basica",
          "formato_digital",
          "exportacion_redes",
          "composicion_profesional",
          "retoque_fotografico",
          "integracion_multicapa",
          "efectos_visuales",
          "tipografia_elaborada",
          "adaptacion_formatos"
        ],
        benefits: [
          "Todo lo del paquete Esencial",
          "Composición gráfica profesional de nivel comercial",
          "Retoque fotográfico digital para iluminación y colorimetría",
          "Integración de múltiples imágenes y elementos visuales",
          "Tratamiento y efectos visuales sobre el arte",
          "Composición tipográfica y jerarquía de texto elaborada",
          "Adaptación a un formato alternativo de cortesía (Feed + Story)"
        ],
        upgradableFeatures: [
          "Fotomontaje complejo y manipulación digital de alta gama",
          "Múltiples variantes de color o promocionales",
          "Entrega de archivos fuente abiertos editables"
        ]
      },
      {
        id: "arte-premium",
        name: "Arte Premium",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.artesMultimedia.premium,
        delivery: "24 a 48 horas",
        description: "Fotomontaje avanzado, retoque de autor, composición compleja, efectos y variantes.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791513930/Arte_Premium.png",
        includedFeatureIds: [
          "pieza_grafica_individual",
          "textos_cliente",
          "imagenes_proporcionadas",
          "composicion_basica",
          "formato_digital",
          "exportacion_redes",
          "composicion_profesional",
          "retoque_fotografico",
          "integracion_multicapa",
          "efectos_visuales",
          "tipografia_elaborada",
          "adaptacion_formatos",
          "fotomontaje_avanzado",
          "retoque_avanzado",
          "composicion_compleja",
          "efectos_cinematicos",
          "multiples_imagenes",
          "variantes_promocionales",
          "mayor_desarrollo_artistico"
        ],
        benefits: [
          "Todo lo del paquete Profesional",
          "Fotomontaje avanzado y manipulación digital creativa",
          "Retoque de pieles y fondos de grado publicitario",
          "Composición visual compleja con profundidad y texturas",
          "Efectos visuales cinematográficos y destellos luminosos",
          "Integración armónica de múltiples imágenes de alta densidad",
          "Variantes promocionales adaptadas a todas las plataformas",
          "Máximo nivel de desarrollo artístico de autor V.A.C."
        ]
      }
    ],
    addons: [
      { id: "adaptacion_formato", label: "Adaptación a Formato Adicional (Story / Banner)", priceInPEN: 20, description: "Ajuste de dimensiones y composición para otra red social.", icon: "zap" },
      { id: "retoque_extra", label: "Retoque Fotográfico Avanzado Adicional", priceInPEN: 25, description: "Mejora de iluminación, recorte y corrección cromática.", icon: "camera" },
      { id: "archivos_editables", label: "Archivos Fuente Editables (.PSD / .AI)", priceInPEN: 30, description: "Capas organizadas y tipografías para edición futura.", icon: "qr" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (En menos de 24 horas)", priceInPEN: 35, description: "Desarrollo exprés en cola prioritaria.", icon: "zap" }
    ],
    itinerary: [
      { label: "Recepción de Material", desc: "Envío de textos, logos e imágenes por el cliente." },
      { label: "Composición de Arte", desc: "Montaje, efectos y retoque gráfico profesional." },
      { label: "Revisión & Entrega", desc: "Aprobación y exportación en alta calidad para redes o imprenta." }
    ],
    includes: [
      "Pieza gráfica diseñada a medida (no plantillas genéricas)",
      "Alta resolución en formatos digitales (PNG, JPG)",
      "Optimización para pantalla y compresión sin pérdida",
      "Soporte y correcciones de estilo"
    ],
    notIncludes: [
      "Campañas masivas de múltiples piezas (a cotizar)",
      "Modelado o renderizado 3D de alta complejidad"
    ],
    difficulty: "Impacto Visual Publicitario"
  },

  // 10. ANIMACIÓN & MOTION (PRECIOS: Esencial 90, Profesional 180, Premium 300)
  {
    id: "animacion-motion",
    type: ProjectType.ANIMACION_MOTION,
    title: "Animación & Motion",
    subtitle: "Gráficos en movimiento, animación 2D y motion design de autor para marcas.",
    description: "Animaciones y motion graphics profesionales para logotipos, textos, marcas y piezas publicitarias dinámicas.",
    deliveryTime: "3-5 Días",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791563016/Motion_Esencial.png",
    iconName: "Sparkles",
    quotesOnlyFeatures: [
      "Animación de personajes complejos con rigging facial (A cotizar)",
      "Piezas cinematográficas 3D de alta densidad con render de granja (A cotizar)",
      "Campañas masivas animadas para televisión o circuitos de pantallas públicas (A cotizar)"
    ],
    packages: [
      {
        id: "motion-esencial",
        name: "Motion Esencial",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.animacionMotion.esencial,
        delivery: "2 a 3 días",
        description: "Animación básica para logo, texto o pieza corta en movimiento con acabado profesional y ágil.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791563016/Motion_Esencial.png",
        includedFeatureIds: [
          "animacion_corta_basica",
          "movimientos_limpios",
          "animacion_logo_tipografia",
          "duracion_breve",
          "composicion_simple",
          "formato_digital",
          "una_correccion"
        ],
        benefits: [
          "Ideal para animaciones breves, limpias y directas",
          "Animación corta básica con movimientos limpios y sencillos",
          "Animación de logo o tipografía",
          "Duración breve orientativa",
          "Una composición simple y clara",
          "Entrega en formato digital listo para compartir",
          "1 corrección básica"
        ],
        upgradableFeatures: [
          "Mayor desarrollo visual y composición 2D multicapa",
          "Múltiples escenas y narrativa cinematográfica",
          "Transiciones personalizadas y más capas gráficas",
          "Canal alfa (fondo transparente) y archivos editables"
        ]
      },
      {
        id: "motion-profesional",
        name: "Motion Profesional",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.animacionMotion.profesional,
        delivery: "3 a 4 días",
        description: "Motion graphic profesional con mejor composición, más elementos en pantalla y transiciones más elaboradas.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791563017/Motion_Profesional.png",
        includedFeatureIds: [
          "animacion_corta_basica",
          "movimientos_limpios",
          "animacion_logo_tipografia",
          "duracion_breve",
          "composicion_simple",
          "formato_digital",
          "mayor_desarrollo_visual",
          "composicion_2d_elaborada",
          "mas_capas_graficas",
          "tipografia_en_movimiento",
          "transiciones_personalizadas",
          "mejor_acabado_general",
          "duracion_mayor_orientativa",
          "dos_correcciones"
        ],
        benefits: [
          "Todo lo del paquete Motion Esencial",
          "Mayor desarrollo visual",
          "Composición 2D más elaborada",
          "Más capas gráficas en pantalla",
          "Tipografía en movimiento",
          "Transiciones personalizadas",
          "Mejor acabado general",
          "Duración mayor orientativa",
          "2 correcciones"
        ],
        upgradableFeatures: [
          "Múltiples escenas y narrativa visual avanzada",
          "Acabado de autor con máxima dirección visual",
          "Modelado o integración 3D",
          "Archivos fuente editables abiertos"
        ]
      },
      {
        id: "motion-premium",
        name: "Motion Premium",
        priceInPEN: COMMERCIAL_PRICING_CONFIG.animacionMotion.premium,
        delivery: "4 a 5 días",
        description: "Animación avanzada de alto nivel con múltiples escenas, narrativa visual más sólida y mejor acabado de autor.",
        image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791563017/Motion_Premium.png",
        includedFeatureIds: [
          "animacion_corta_basica",
          "movimientos_limpios",
          "animacion_logo_tipografia",
          "duracion_breve",
          "composicion_simple",
          "formato_digital",
          "mayor_desarrollo_visual",
          "composicion_2d_elaborada",
          "mas_capas_graficas",
          "tipografia_en_movimiento",
          "transiciones_personalizadas",
          "mejor_acabado_general",
          "duracion_mayor_orientativa",
          "multiples_escenas",
          "mejor_direccion_visual",
          "composicion_cinematografica",
          "mas_detalle_animaciones",
          "mayor_complejidad_grafica",
          "acabado_premium_autor",
          "duracion_superior_orientativa",
          "dos_correcciones"
        ],
        benefits: [
          "Todo lo del paquete Motion Profesional",
          "Múltiples escenas",
          "Mejor dirección visual",
          "Composición más rica y cinematográfica",
          "Más detalle en animaciones",
          "Mayor complejidad gráfica",
          "Acabado premium",
          "Duración superior orientativa",
          "2 correcciones"
        ]
      }
    ],
    addons: [
      { id: "animacion_3d", label: "Animación 3D", priceInPEN: 80, description: "Integración de componentes o profundidad tridimensional.", icon: "zap" },
      { id: "fondo_transparente", label: "Fondo Transparente", priceInPEN: 40, description: "Exportación lista para superponer sobre cualquier video o web.", icon: "camera" },
      { id: "archivo_editable", label: "Archivo Editable", priceInPEN: 70, description: "Proyecto abierto con composiciones y recursos organizados.", icon: "qr" },
      { id: "entrega_urgente", label: "Entrega Urgente", priceInPEN: 60, description: "Desarrollo acelerado en cola preferencial.", icon: "zap" },
      { id: "formatos_extra", label: "Formatos Extra", priceInPEN: 45, description: "Reencuadre y adaptación de motion a múltiples redes (9:16, 16:9, 1:1).", icon: "qr" },
      { id: "exportacion_especial", label: "Resolución o Exportación Especial", priceInPEN: 35, description: "Render en máxima definición (4K o 60fps) y compresión optimizada.", icon: "zap" }
    ],
    itinerary: [
      { label: "Briefing & Guion", desc: "Definición del estilo visual, objetivo de la animación y storyboard." },
      { label: "Diseño Vectorial", desc: "Preparación y separación de capas gráficas listas para animación." },
      { label: "Animación Cinética", desc: "Desarrollo de curvas de velocidad, transiciones y efectos dinámicos." },
      { label: "Render & Entrega", desc: "Exportación en formatos finales de alta fidelidad listos para compartir." }
    ],
    includes: [
      "Animación personalizada según el paquete elegido",
      "Formatos optimizados para redes, publicidad o web",
      "Sincronización rítmica y transiciones limpias",
      "Revisiones según el plan seleccionado"
    ],
    notIncludes: [
      "Modelado 3D hiperrealista de grado industrial",
      "Producción presencial en set con rodaje de cine"
    ],
    difficulty: "Cinética Visual & Motion Design"
  },

  // 11. OTROS SERVICIOS / PROYECTOS ESPECIALES
  {
    id: "otro",
    type: ProjectType.OTRO,
    title: "Proyectos Especiales / Animación",
    subtitle: "Soluciones a medida, animación 2D y requerimientos creativos especiales.",
    description: "Soluciones creativas personalizadas para requerimientos no estándar.",
    deliveryTime: "3-5 Días",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    iconName: "Sparkles",
    packages: [
      {
        id: "a-medida",
        name: "Proyecto a Medida",
        priceInPEN: 120,
        delivery: "3 a 5 días",
        description: "Desarrollo creativo según especificaciones y requerimientos especiales.",
        includedFeatureIds: [
          "asesoria_creativa",
          "propuesta_personalizada",
          "revisiones",
          "entrega_digital"
        ],
        benefits: [
          "Asesoría directa con directores creativos de V.A.C.",
          "Desarrollo adaptado a las especificaciones técnicas del cliente",
          "Formatos de entrega de alta definición",
          "Garantía de calidad y soporte directo"
        ]
      }
    ],
    addons: [
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Atención prioritaria y entrega rápida.", icon: "zap" },
      { id: "archivos_editables", label: "Archivos Fuente Editables", priceInPEN: 70, description: "Entrega de archivos fuente abiertos.", icon: "qr" }
    ],
    itinerary: [
      { label: "Briefing", desc: "Definición de requerimientos específicos del proyecto." },
      { label: "Propuesta", desc: "Presentación del desarrollo inicial." },
      { label: "Entrega", desc: "Exportación y entrega final organizada." }
    ],
    includes: ["Desarrollo a medida", "Soporte V.A.C."],
    notIncludes: ["Servicios presenciales"],
    difficulty: "Personalización Creativa"
  }
];

export function getServiceConfigByType(type: ProjectType): ServiceCatalogItem {
  return SERVICES_CATALOG_DATA.find((s) => s.type === type) || SERVICES_CATALOG_DATA[0];
}
