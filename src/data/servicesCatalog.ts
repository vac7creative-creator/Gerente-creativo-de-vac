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
    subtitle: "Acabados juveniles mágicos, lluvia de confeti, galerías de alta definición, selección de canciones y dress code.",
    deliveryTime: "3-4 Días",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800&auto=format&fit=crop",
    itinerary: [
      { label: "Recopilación de Detalles", desc: "Añade temática (floral, neón, galáctica, etc.), fecha y enlaces del local." },
      { label: "Carga de Galería", desc: "Sube hasta 10 fotos artísticas para el carrusel de alta fidelidad." },
      { label: "Habilitación de Extras", desc: "Fijación del código de vestimenta y enlaces a mesa de regalos." },
      { label: "Lanzamiento RSVP", desc: "El botón enviará directamente la confirmación de pases al teléfono de la festejada." }
    ],
    includes: [
      "Galería fotográfica de alta definición deslizable",
      "Lluvia animada interactiva de confeti o destellos",
      "Enlace a mesa de regalos virtuales o Cuenta CLABE",
      "Cronómetro de cuenta regresiva",
      "Música de fondo elegible por la quinceañera",
      "Indicador de dress code personalizable"
    ],
    notIncludes: [
      "Videoinvitaciones en formato MP4 plano",
      "Sesión fotográfica presencial en locación"
    ],
    difficulty: "Estilo Mágico Interactivo Glamour"
  },
  {
    id: "menu-digital",
    type: ProjectType.CARTA_DIGITAL,
    title: "Carta & Menú Digital Gourmet",
    subtitle: "Para restaurantes y bistrots finos. Categorías de platos refinados, carrito interactivo de pedidos directo a WhatsApp.",
    deliveryTime: "4-6 Días",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
    itinerary: [
      { label: "Alta de Platillos", desc: "Introducción de categorías, ingredientes destacados, alérgenos e imágenes." },
      { label: "Personalización de Marca", desc: "Carga de logo comercial, paleta del restaurante y enlaces web." },
      { label: "Configuración WhatsApp", desc: "Conecta la comanda para que llegue directa al mesonero o supervisor." },
      { label: "Generación de Códigos QR", desc: "Enlace listo para imprimir en calcomanías para las mesas físicas." }
    ],
    includes: [
      "Maquetación premium Responsiva para smartphones",
      "Categorías y carga ilimitada de platillos gourmet con fotos",
      "Carrito inteligente con envío directo del pedido por WhatsApp",
      "Integración de Redes Sociales (Facebook, Instagram)",
      "Logotipo, dirección y mapas de llegada de los clientes",
      "Generación de código QR del menú digital"
    ],
    notIncludes: [
      "Sincronización con terminales punto de venta físicas",
      "Pasarela de pago de tarjeta directo en el menú"
    ],
    difficulty: "Sabor visual Premium Digital"
  },
  {
    id: "landing-page",
    type: ProjectType.LANDING_PAGE,
    title: "Landing Page & Web Comercial",
    subtitle: "Páginas web interactivas de conversión rápida optimizadas para celulares, captación de prospectos y venta directa por WhatsApp.",
    deliveryTime: "3-5 Días",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    itinerary: [
      { label: "Estructura de Ventas", desc: "Definición del flujo del usuario y llamados a la acción estratégicos." },
      { label: "Diseño UI/UX Personalizado", desc: "Maquetación adaptada a la identidad de tu marca o servicio." },
      { label: "Integración de Formularios", desc: "Conexión directa para recibir cotizaciones en tu WhatsApp o correo." },
      { label: "Lanzamiento y Dominio", desc: "Publicación en servidor de alta velocidad optimizado para móviles." }
    ],
    includes: [
      "Diseño responsive adaptado a smartphones y pantallas de escritorio",
      "Botones flotantes de llamado a la acción y contacto directo",
      "Formulario interactivo de solicitud de información o cotización",
      "Galería de productos, servicios o casos de éxito",
      "Carga ultrarrápida y optimización básica para motores de búsqueda"
    ],
    notIncludes: [
      "Pasarela de cobro bancario complejo multinivel",
      "Mantenimiento mensual de servidores externos de terceros"
    ],
    difficulty: "Alta Conversión Digital"
  },
  {
    id: "cumpleanos",
    type: ProjectType.CUMPLEANOS,
    title: "Invitación de Cumpleaños Express",
    subtitle: "Diseño moderno con confirmación rápida y ubicación interactiva. Ideal para fiestas modernas de alta energía.",
    deliveryTime: "2 Días",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop",
    itinerary: [
      { label: "Envío Express", desc: "Captura el nombre del festejo, hora y lugar de reunión rápido." },
      { label: "Compilación Veloz", desc: "En menos de 48 horas tienes la versión interactiva terminada." },
      { label: "RSVP al Instante", desc: "Botón de un solo toque para confirmar asistencia por SMS o mensajería." }
    ],
    includes: [
      "Mapa de Google Maps para fácil llegada",
      "Detalles de fecha, tema y hora en tipografía de alto impacto",
      "Confirmación RSVP rápida por mensajería",
      "Contador de cuenta regresiva interactivo"
    ],
    notIncludes: [
      "Efectos premium interactivos personalizados complejos",
      "Galería de fotos masiva de más de 3 archivos"
    ],
    difficulty: "Eficacia Express Moderna"
  }
];
