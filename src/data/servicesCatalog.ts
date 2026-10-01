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
    id: "diseno-grafico",
    title: "Diseño Gráfico",
    subtitle: "Identidad visual disruptiva y comunicación de alto impacto que define marcas.",
    deliveryTime: "2-4 Días",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
    iconName: "Palette",
    type: ProjectType.DISENO_GRAFICO,
    isSubCatalogTrigger: false,
    itinerary: [
      { label: "Briefing Creativo", desc: "Entendemos la personalidad, colores y público objetivo de tu proyecto comercial." },
      { label: "Bocetado de Propuestas", desc: "Presentación de 3 rutas gráficas conceptuales totalmente independientes." },
      { label: "Refinamiento Gráfico", desc: "Ajustamos y pulimos tipografías, grosores vectoriales y contrastes." },
      { label: "Entrega de Master", desc: "Exportación organizada de archivos vectoriales listos para imprenta y redes (.AI, .SVG, .PNG)." }
    ],
    includes: [
      "Diseño de logotipos vectoriales originales (no plantillas)",
      "Manual básico de uso cromático y tipografías sugeridas",
      "Mockups comerciales premium para previsualización",
      "Formatos optimizados para perfiles y banners de redes sociales",
      "Hasta 3 rondas de ajustes finos en la propuesta seleccionada"
    ],
    notIncludes: [
      "Registro legal de patentes y marcas comerciales ante el estado",
      "Impresión física de tarjetas o bolsas de empaque"
    ],
    difficulty: "Alta Fidelidad & Concepto Disruptivo"
  },
  {
    id: "audiovisual-video",
    title: "Audiovisual y Video",
    subtitle: "Producción cinemática para narrativas visuales que cautivan a tu audiencia.",
    deliveryTime: "5-7 Días",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
    iconName: "Video",
    type: ProjectType.FOTO_VIDEO,
    isSubCatalogTrigger: false,
    itinerary: [
      { label: "Estructura & Guión", desc: "Planificación matemática del ritmo visual, intenciones comunicacionales y tomas." },
      { label: "Carga de Clips", desc: "Procesamiento de tus grabaciones en alta fidelidad o selección de material de stock premium." },
      { label: "Edición y Sincronización", desc: "Corte cinemático al ritmo de la banda sonora musical seleccionada." },
      { label: "Colorización & Exportado", desc: "Aplicación de LUTS de grado cinematográfico y exportado en codec de alta densidad." }
    ],
    includes: [
      "Edición cinemática profesional (cortes limpios y dinámicos)",
      "Corrección de color artística de grado profesional",
      "Mezcla de efectos de sonido y diseño de audio ambiental",
      "Formatos listos para Reels, TikTok, YouTube Shorts u horizontal de alta definición",
      "Inclusión de subtítulos dinámicos de alto enganche"
    ],
    notIncludes: [
      "Grabaciones físicas en locación (esta modalidad asume envío de clips o stock digital)",
      "Locuciones o voces artificiales robotizadas en off sin alma"
    ],
    difficulty: "Cinemático de Alto Impacto Audiovisual"
  },
  {
    id: "spots-publicitarios",
    title: "Spots Publicitarios",
    subtitle: "Estrategias de audio orientadas a posicionamiento de mercado.",
    deliveryTime: "3-5 Días",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    iconName: "Volume2",
    type: ProjectType.SPOT,
    isSubCatalogTrigger: false,
    itinerary: [
      { label: "Redacción del Copy", desc: "Escritura de textos persuasivos con ganchos auditivos en los primeros 3 segundos." },
      { label: "Selección de Locutor", desc: "Tú eliges el tono de voz ideal dentro de nuestro catálogo de locución profesional." },
      { label: "Grabación en Cabina", desc: "Registro acústico insonorizado de alta gama aplicando intenciones de venta." },
      { label: "Efectos & Limpieza", desc: "Masterización y mezcla con cortinas musicales libres de regalías comerciales." }
    ],
    includes: [
      "Locutor profesional con acento neutro o regional sugerido",
      "Redacción y pulido de guión publicitario persuasivo",
      "Limpieza acústica de ruidos y masterización de sonido",
      "Efectos incidentales y sonidos especiales",
      "Versión de audio optimizada para radio, Spotify, pautas de Instagram y perifoneo"
    ],
    notIncludes: [
      "Inversión económica para colocar el anuncio en plataformas digitales",
      "Cambios en el guion una vez grabada la voz final del locutor"
    ],
    difficulty: "Vanguardia Acústica Persuasiva"
  },
  {
    id: "animacion-motion",
    title: "Animación & Motion",
    subtitle: "Gráficos en movimiento y animación 2D/3D para dar vida a tus ideas.",
    deliveryTime: "6-8 Días",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    iconName: "Sparkles",
    type: ProjectType.OTRO,
    isSubCatalogTrigger: false,
    itinerary: [
      { label: "Storyboard de Proceso", desc: "Esquemas estáticos para entender el flujo y movimientos de los elementos vectoriales." },
      { label: "Modelado / Ilustración", desc: "Diseño de los componentes o conversión de tu logotipo a formato vectorial animable." },
      { label: "Animación de Capas", desc: "Aplicación de curvas de aceleración suaves para lograr transiciones fascinantes." },
      { label: "Render con Transparencias", desc: "Compilación de vídeo en ProRes / WebM con opción de fondo transparente." }
    ],
    includes: [
      "Animación de logotipos corporativos (Intro/Outro de alta gama)",
      "Explicador gráfico interactivo con motion design fluido",
      "Sincronización rítmica con efectos de sonido incidentales",
      "Entrega en resolución Ultra HD o formato cuadrado/móvil",
      "Canal alfa transparente para superponer sobre otros clips sin problemas"
    ],
    notIncludes: [
      "Modelado ultra-complejo de entornos de videojuegos poligonales densos",
      "Animación de personajes hiperrealistas estilo Hollywood"
    ],
    difficulty: "Fluidez Vectorial Avanzada"
  },
  {
    id: "diseno-digital-web",
    title: "Diseño Digital & Experiencias Web",
    subtitle: "Desarrollo de soluciones digitales interactivas diseñadas para mostrar productos, servicios o eventos mediante enlaces profesionales compatibles con celular.",
    deliveryTime: "Ver Modelos",
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop",
    iconName: "Smartphone",
    type: ProjectType.LANDING_PAGE,
    isSubCatalogTrigger: true,
    itinerary: [
      { label: "Selección del Modelo", desc: "Elige entre nuestras interfaces premium para Bodas, 15 Años, Menú Gourmet o Fiestas." },
      { label: "Introducción de Datos", desc: "Nos proporcionas los datos de tu festejo o menú a través del formulario interactivo." },
      { label: "Personalización Física", desc: "Configuramos tu música, paletas sofisticadas de color y pasamos las confirmaciones directas." },
      { label: "Lanzamiento Online", desc: "El enlace se publica al instante optimizado para smartphones y compartible por WhatsApp o Códigos QR." }
    ],
    includes: [
      "Velocidad de carga instantánea optimizada para enlaces por chat",
      "Interactividad de botones, cronómetros y formularios de pases",
      "Música integrada con reproducción limpia en teléfonos",
      "Control de asistencia RSVP directo en tu chat personal",
      "Diseño responsive adaptado a pantallas táctiles modernas"
    ],
    notIncludes: [
      "Base de datos de pago mensual corporativa masiva",
      "Copias de seguridad impresas en papel"
    ],
    difficulty: "Elegancia Digital de Última Generación"
  }
];

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: "boda",
    type: ProjectType.BODA,
    title: "Invitación de Bodas Luxury",
    subtitle: "Maquetación premium con confirmación RSVP inteligente, música autoejecutable, mapas y paleta de alta costura.",
    deliveryTime: "3-5 Días",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=800&auto=format&fit=crop",
    itinerary: [
      { label: "Alta de Datos", desc: "Comienza registrando vuestros nombres, fecha, hora e iglesias contratadas." },
      { label: "Borrador Digital", desc: "En 48h nuestro equipo genera un enlace con vuestra tipografía y fondos premium." },
      { label: "Ajuste de Música & Fotos", desc: "Selecciona el tema de fondo que iniciará al momento de abrir la invitación." },
      { label: "Integración RSVP", desc: "Pruebas de clic para confirmación directa al número de WhatsApp configurado." },
      { label: "Lanzamiento y Entrega", desc: "Enlace web optimizado listo para enviar o crear códigos QR." }
    ],
    includes: [
      "Música y lista de reproducción autoejecutable de fondo",
      "Formulario RSVP interactivo integrado con pases",
      "Contador regresivo dinámico con micro-animaciones",
      "Paleta cromática sofisticada con contrastes elegantes",
      "Sugeridores de Dress Code con imágenes de ejemplo",
      "Mapeado interactivo de Templo y Salón con un toque"
    ],
    notIncludes: [
      "Papelería física impresa o grabado físico",
      "Modificaciones estructurales extras tras 30 días de entrega",
      "Fotografías en estudio presenciales"
    ],
    difficulty: "Elegancia Luxury de Alta Fidelidad"
  },
  {
    id: "xv-anos",
    type: ProjectType.XV_ANOS,
    title: "Invitación de XV Años Princesa",
    subtitle: "Animaciones mágicas, lluvia de destellos, cronómetro y dress code para una fiesta inolvidable.",
    deliveryTime: "3-4 Días",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
    itinerary: [{ label: "Creación", desc: "Entrega rápida en 24h." }],
    includes: ["Enlace web", "WhatsApp"],
    notIncludes: ["Impresión"],
    difficulty: "Express de Alto Impacto"
  },
  {
    id: "carta-digital",
    type: ProjectType.CARTA_DIGITAL,
    title: "Carta & Menú Digital Gourmet",
    subtitle: "Catálogo de platillos con categorías, fotos y envío de comanda a WhatsApp.",
    deliveryTime: "4-6 Días",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    itinerary: [{ label: "Maquetación", desc: "Carga de productos y precios." }],
    includes: ["Responsive", "WhatsApp"],
    notIncludes: ["Impresión física de cartas"],
    difficulty: "Gourmet Digital"
  },
  {
    id: "landing-page",
    type: ProjectType.LANDING_PAGE,
    title: "Landing Page Comercial",
    subtitle: "Página web de alta conversión para venta o captación de prospectos.",
    deliveryTime: "3-5 Días",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    itinerary: [{ label: "Estructura", desc: "Diseño orientado a ventas." }],
    includes: ["SEO básico", "Formulario"],
    notIncludes: ["Hosting corporativo anual"],
    difficulty: "Conversión Comercial"
  },
  {
    id: "spot-publicitario",
    type: ProjectType.SPOT,
    title: "Spot Publicitario / Locución",
    subtitle: "Audio comercial con locución profesional y masterización de sonido.",
    deliveryTime: "3-5 Días",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    itinerary: [{ label: "Locución", desc: "Grabación en cabina insonorizada." }],
    includes: ["WAV y MP3", "Licencia"],
    notIncludes: ["Pauta publicitaria"],
    difficulty: "Acústica Comercial"
  },
  {
    id: "produccion-audiovisual",
    type: ProjectType.FOTO_VIDEO,
    title: "Producción Audiovisual / Video",
    subtitle: "Edición cinemática, corrección de color y formato vertical para redes.",
    deliveryTime: "5-7 Días",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
    itinerary: [{ label: "Montaje", desc: "Edición y sincronización de audio." }],
    includes: ["Edición", "Color"],
    notIncludes: ["Grabación presencial"],
    difficulty: "Cinemático Alta Gama"
  },
  {
    id: "branding",
    type: ProjectType.DISENO_GRAFICO,
    title: "Identidad Gráfica & Branding",
    subtitle: "Diseño de logotipos vectoriales originales y paletas cromáticas.",
    deliveryTime: "2-4 Días",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
    itinerary: [{ label: "Bocetado", desc: "Creación de propuestas gráficas." }],
    includes: ["Vectores", "Guía cromática"],
    notIncludes: ["Registro de marca legal"],
    difficulty: "Identidad Exclusiva"
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
}

export interface AddonItem {
  id: string;
  label: string;
  priceInPEN: number;
  description: string;
  icon: "music" | "camera" | "qr" | "zap" | "msg";
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
  packages: PackageItem[];
  addons: AddonItem[];
  itinerary: { label: string; desc: string }[];
  includes: string[];
  notIncludes: string[];
  difficulty: string;
}

export const SERVICES_CATALOG_DATA: ServiceCatalogItem[] = [
  {
    id: "boda",
    type: ProjectType.BODA,
    title: "Invitación de Bodas Luxury",
    subtitle: "Maquetación premium con confirmación RSVP inteligente, música autoejecutable, mapas y paleta de alta costura.",
    description: "Diseño elegante para parejas con confirmación RSVP y enlace web propio.",
    deliveryTime: "3-5 Días",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=800&auto=format&fit=crop",
    iconName: "Smartphone",
    packages: [
      {
        id: "basico",
        name: "Básico",
        priceInPEN: 240,
        delivery: "4 a 5 días",
        description: "Información esencial y diseño elegante para compartir el gran día.",
        includedFeatureIds: ["enlace_web", "nombres_novios", "fecha_hora", "iglesia_recepcion", "frase_especial", "fotos_basicas", "paleta_predis"],
        benefits: [
          "Invitación digital con enlace web propio",
          "Nombres, fecha, hora y ubicaciones escritas",
          "Frase especial y fotografías básicas",
          "Diseño responsive adaptado a móviles"
        ]
      },
      {
        id: "intermedio",
        name: "Intermedio",
        priceInPEN: 340,
        delivery: "3 a 4 días",
        description: "Información e interacción avanzada con música, mapas y galería.",
        includedFeatureIds: ["enlace_web", "nombres_novios", "fecha_hora", "iglesia_recepcion", "frase_especial", "fotos_basicas", "paleta_predis", "musica", "cuenta_regresiva", "google_maps", "galeria_fotos", "confirmacion_whatsapp", "dress_code"],
        benefits: [
          "Todo lo del paquete Básico",
          "Música de fondo autoejecutable",
          "Cuenta regresiva animada",
          "Mapas interactivos de ubicación (Google Maps)",
          "Galería de fotografías y confirmación por WhatsApp"
        ]
      },
      {
        id: "pro",
        name: "Pro",
        priceInPEN: 460,
        delivery: "2 a 3 días",
        description: "Experiencia completa premium con álbum colaborativo y RSVP avanzado.",
        includedFeatureIds: ["enlace_web", "nombres_novios", "fecha_hora", "iglesia_recepcion", "frase_especial", "fotos_basicas", "paleta_predis", "musica", "cuenta_regresiva", "google_maps", "galeria_fotos", "confirmacion_whatsapp", "dress_code", "album_colaborativo", "rsvp_pases", "mesa_regalos", "historia_amor", "animaciones_premium"],
        benefits: [
          "Todo lo del paquete Intermedio",
          "Álbum colaborativo para que los invitados suban fotos",
          "Código QR para álbum colaborativo",
          "RSVP avanzado con control detallado de pases",
          "Mesa de regalos digital e historia de amor"
        ]
      }
    ],
    addons: [
      { id: "musica", label: "Música de Fondo Personalizada", priceInPEN: 30, description: "Canción romántica que se reproduce al abrir la invitación.", icon: "music" },
      { id: "galeria_fotos", label: "Galería de Fotografías HD", priceInPEN: 40, description: "Carrusel interactivo con imágenes de la sesión.", icon: "camera" },
      { id: "rsvp_pases", label: "RSVP por WhatsApp con Control de Pases", priceInPEN: 35, description: "Sistema estructurado para control de adultos y niños.", icon: "msg" },
      { id: "qr_imprimible", label: "Código QR Imprimible en Alta", priceInPEN: 25, description: "Vector optimizado para tarjetas físicas.", icon: "qr" },
      { id: "mesa_regalos", label: "Mesa de Regalos Digital", priceInPEN: 30, description: "Enlaces directos a tiendas y cuentas.", icon: "zap" },
      { id: "dress_code", label: "Sección de Código de Vestimenta", priceInPEN: 25, description: "Indicaciones de etiqueta y colores.", icon: "zap" },
      { id: "historia_amor", label: "Historia de la Pareja", priceInPEN: 40, description: "Línea de tiempo de su relación.", icon: "music" },
      { id: "album_colaborativo", label: "Álbum Colaborativo de Invitados", priceInPEN: 50, description: "Recopilación de fotos de la boda subidas por invitados.", icon: "camera" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Desarrollo en canal preferencial.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[0].itinerary,
    includes: SERVICES_CATALOG[0].includes,
    notIncludes: SERVICES_CATALOG[0].notIncludes,
    difficulty: SERVICES_CATALOG[0].difficulty
  },
  {
    id: "xv-anos",
    type: ProjectType.XV_ANOS,
    title: "Invitación de XV Años Princesa",
    subtitle: "Animaciones mágicas, lluvia de destellos, cronómetro y dress code para una fiesta inolvidable.",
    description: "Animaciones mágicas, lluvia de destellos, cronómetro y dress code.",
    deliveryTime: "3-4 Días",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    iconName: "Sparkles",
    packages: [
      {
        id: "esencial",
        name: "Esencial",
        priceInPEN: 190,
        delivery: "3 a 4 días",
        description: "Invitación de XV años con diseño de princesa, cuenta regresiva y ubicación.",
        includedFeatureIds: ["enlace_web", "quinceanera_nombre", "fecha_hora", "lugar", "cuenta_regresiva"],
        benefits: ["Enlace web personalizado", "Cuenta regresiva", "Ubicación GPS"]
      },
      {
        id: "pro",
        name: "Pro Completo",
        priceInPEN: 290,
        delivery: "2 a 3 días",
        description: "Versión completa con música, galería, dress code, mesa de regalos y RSVP.",
        includedFeatureIds: ["enlace_web", "quinceanera_nombre", "fecha_hora", "lugar", "cuenta_regresiva", "musica", "galeria_fotos", "dress_code", "mesa_regalos", "rsvp_pases"],
        benefits: ["Todo lo del Esencial", "Música de entrada", "Galería de fotos", "RSVP y Dress code"]
      }
    ],
    addons: [
      { id: "musica", label: "Música de Entrada Personalizada", priceInPEN: 30, description: "Tema musical favorito al ingresar.", icon: "music" },
      { id: "galeria_fotos", label: "Galería de Fotos", priceInPEN: 40, description: "Álbum fotográfico de sesión.", icon: "camera" },
      { id: "rsvp_pases", label: "RSVP por WhatsApp", priceInPEN: 35, description: "Confirmación exacta.", icon: "msg" },
      { id: "qr_imprimible", label: "Código QR", priceInPEN: 25, description: "Vector para imprimir.", icon: "qr" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Atención exprés.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[1].itinerary,
    includes: SERVICES_CATALOG[1].includes,
    notIncludes: SERVICES_CATALOG[1].notIncludes,
    difficulty: SERVICES_CATALOG[1].difficulty
  },
  {
    id: "cumpleanos",
    type: ProjectType.CUMPLEANOS,
    title: "Invitación de Cumpleaños Express",
    subtitle: "Formato ágil de alta energía con botón de ubicación y confirmación.",
    description: "Formato ágil de alta energía con botón de ubicación y confirmación.",
    deliveryTime: "24-48 Horas",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
    iconName: "Sparkles",
    packages: [
      {
        id: "estandar",
        name: "Estándar Express",
        priceInPEN: 130,
        delivery: "24 a 48 horas",
        description: "Invitación digital dinámica para fiestas.",
        includedFeatureIds: ["enlace_web", "ubicacion_gps", "confirmacion_whatsapp"],
        benefits: ["Diseño optimizado para WhatsApp", "Ubicación GPS"]
      }
    ],
    addons: [
      { id: "musica", label: "Música de Fondo Festiva", priceInPEN: 30, description: "Canción alegre.", icon: "music" },
      { id: "galeria_fotos", label: "Mini Galería", priceInPEN: 35, description: "Fotos destacadas.", icon: "camera" },
      { id: "entrega_urgente", label: "Entrega 24 Horas", priceInPEN: 70, description: "Prioridad máxima.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[2].itinerary,
    includes: SERVICES_CATALOG[2].includes,
    notIncludes: SERVICES_CATALOG[2].notIncludes,
    difficulty: SERVICES_CATALOG[2].difficulty
  },
  {
    id: "carta-digital",
    type: ProjectType.CARTA_DIGITAL,
    title: "Carta & Menú Digital Gourmet",
    subtitle: "Catálogo de platillos con categorías, fotos y envío de comanda a WhatsApp.",
    description: "Catálogo de platillos con categorías, fotos y envío de comanda a WhatsApp.",
    deliveryTime: "4-6 Días",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    iconName: "Smartphone",
    packages: [
      {
        id: "menu_standard",
        name: "Menú Digital Completo",
        priceInPEN: 280,
        delivery: "4 a 6 días",
        description: "Carta digital interactiva con categorías y pedidos por WhatsApp.",
        includedFeatureIds: ["categorias", "productos", "pedidos_whatsapp", "qr_imprimible"],
        benefits: ["Sin descargas de apps", "Comandas automáticas a WhatsApp", "Actualización instantánea"]
      }
    ],
    addons: [
      { id: "qr_imprimible", label: "Diseño de Código QR para Mesas", priceInPEN: 25, description: "Arte vectorial para imprimir.", icon: "qr" },
      { id: "productos_extra", label: "Bloque de Productos Adicionales (+10 ítems)", priceInPEN: 40, description: "Sección ampliada.", icon: "zap" },
      { id: "entrega_urgente", label: "Entrega Prioritaria", priceInPEN: 70, description: "Desarrollo express.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[3].itinerary,
    includes: SERVICES_CATALOG[3].includes,
    notIncludes: SERVICES_CATALOG[3].notIncludes,
    difficulty: SERVICES_CATALOG[3].difficulty
  },
  {
    id: "landing-page",
    type: ProjectType.LANDING_PAGE,
    title: "Landing Page Comercial",
    subtitle: "Página web de alta conversión para venta o captación de prospectos.",
    description: "Página web de alta conversión para venta o captación de prospectos.",
    deliveryTime: "3-5 Días",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    iconName: "Smartphone",
    packages: [
      {
        id: "landing_pro",
        name: "Landing Page Pro",
        priceInPEN: 360,
        delivery: "3 a 5 días",
        description: "Página web orientada a resultados y conversiones.",
        includedFeatureIds: ["responsive", "formulario", "whatsapp_lead", "seo_basico"],
        benefits: ["Alta conversión", "Formulario de leads", "Optimización SEO"]
      }
    ],
    addons: [
      { id: "secciones_extra", label: "Secciones Adicionales", priceInPEN: 60, description: "Bloques extra.", icon: "zap" },
      { id: "formulario_avanzado", label: "Formulario Avanzado", priceInPEN: 50, description: "Campos custom.", icon: "zap" },
      { id: "entrega_urgente", label: "Entrega Prioritaria", priceInPEN: 70, description: "Express.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[4].itinerary,
    includes: SERVICES_CATALOG[4].includes,
    notIncludes: SERVICES_CATALOG[4].notIncludes,
    difficulty: SERVICES_CATALOG[4].difficulty
  },
  {
    id: "spot-publicitario",
    type: ProjectType.SPOT,
    title: "Spot Publicitario / Locución",
    subtitle: "Audio comercial con locución profesional y masterización de sonido.",
    description: "Audio comercial con locución profesional y masterización de sonido.",
    deliveryTime: "3-5 Días",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    iconName: "Volume2",
    packages: [
      {
        id: "spot_audio",
        name: "Spot Profesional",
        priceInPEN: 220,
        delivery: "3 a 5 días",
        description: "Spot de audio con locutor profesional y masterización.",
        includedFeatureIds: ["locucion", "masterizacion", "derechos_comerciales"],
        benefits: ["Locución en estudio", "Masterización WAV/MP3", "Derechos comerciales"]
      }
    ],
    addons: [
      { id: "guion_spot", label: "Mejora de Guion Publicitario", priceInPEN: 50, description: "Redacción persuasiva.", icon: "zap" },
      { id: "locucion_adicional", label: "Segunda Voz", priceInPEN: 60, description: "Voz complementaria.", icon: "msg" },
      { id: "version_vertical", label: "Versión Vertical para Reels", priceInPEN: 50, description: "Adaptación audiovisual.", icon: "camera" },
      { id: "entrega_urgente", label: "Entrega Prioritaria", priceInPEN: 70, description: "Express.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[2].itinerary, // fallback or appropriate
    includes: ["WAV y MP3", "Licencia"],
    notIncludes: ["Pauta publicitaria"],
    difficulty: "Acústica Comercial"
  },
  {
    id: "produccion-audiovisual",
    type: ProjectType.FOTO_VIDEO,
    title: "Producción Audiovisual / Video",
    subtitle: "Edición cinemática, corrección de color y formato vertical para redes.",
    description: "Edición cinemática, corrección de color y formato vertical para redes.",
    deliveryTime: "5-7 Días",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
    iconName: "Video",
    packages: [
      {
        id: "video_cinematic",
        name: "Edición Cinemática Pro",
        priceInPEN: 320,
        delivery: "5 a 7 días",
        description: "Edición de video con look cinemático y color grading.",
        includedFeatureIds: ["edicion_pro", "color_grading", "exportacion_4k"],
        benefits: ["Corte cinemático", "Corrección de color", "Exportación 4K"]
      }
    ],
    addons: [
      { id: "reel_adicional", label: "Reel Vertical Adicional", priceInPEN: 60, description: "Corte para Instagram.", icon: "camera" },
      { id: "subtitulos_avanzados", label: "Subtítulos Dinámicos", priceInPEN: 50, description: "Estilo profesional.", icon: "qr" },
      { id: "entrega_urgente", label: "Entrega Prioritaria", priceInPEN: 70, description: "Express.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[1].itinerary,
    includes: ["Edición", "Color"],
    notIncludes: ["Grabación presencial"],
    difficulty: "Cinemático Alta Gama"
  },
  {
    id: "branding",
    type: ProjectType.DISENO_GRAFICO,
    title: "Identidad Gráfica & Branding",
    subtitle: "Diseño de logotipos vectoriales originales y paletas cromáticas.",
    description: "Diseño de logotipos vectoriales originales y paletas cromáticas.",
    deliveryTime: "2-4 Días",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
    iconName: "Palette",
    packages: [
      {
        id: "branding_identidad",
        name: "Identidad Visual",
        priceInPEN: 260,
        delivery: "2 a 4 días",
        description: "Logotipo profesional y paleta de colores.",
        includedFeatureIds: ["logotipo_vectorial", "manual_basico", "derechos_comerciales"],
        benefits: ["Logotipos originales", "Manual básico", "Archivos vectoriales"]
      }
    ],
    addons: [
      { id: "archivos_editables", label: "Archivos Fuente (AI, EPS, SVG)", priceInPEN: 70, description: "Paquete vectorial completo.", icon: "qr" },
      { id: "mockups_3d", label: "Mockups 3D de Presentación", priceInPEN: 50, description: "Visualización realista.", icon: "camera" },
      { id: "entrega_urgente", label: "Entrega Prioritaria", priceInPEN: 70, description: "Express.", icon: "zap" }
    ],
    itinerary: SERVICES_CATALOG[0].itinerary,
    includes: ["Vectores", "Guía cromática"],
    notIncludes: ["Registro de marca legal"],
    difficulty: "Identidad Exclusiva"
  }
];

export function getServiceConfigByType(type: ProjectType): ServiceCatalogItem {
  return SERVICES_CATALOG_DATA.find((s) => s.type === type) || SERVICES_CATALOG_DATA[0];
}
