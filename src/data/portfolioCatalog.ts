/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectType } from "../types";

export interface PortfolioItem {
  id: string;
  title: string;
  conceptSubtitle: string;
  description: string;
  image: string;
  serviceType: ProjectType;
  packageId: string;
  packageName: string;
  tags?: string[];
  demoUrl?: string;
  featured?: boolean;
  colorHighlights?: string[];
}

/**
 * CATÁLOGO CENTRALIZADO DE MUESTRAS & ESTILOS DE REFERENCIA
 * 
 * NOTA EDITORIAL:
 * En V.A.C. Creative no vendemos plantillas prediseñadas idénticas.
 * Cada proyecto se concibe, diseña y programa a la medida de cada cliente.
 * Estas muestras representan líneas visuales de inspiración y referencias
 * de nivel de paquete para orientar al cliente.
 */
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // --- BODAS ---
  {
    id: "boda-borgona-luxury",
    title: "Boda Elegancia Borgoña & Oro",
    conceptSubtitle: "Experiencia completa con RSVP inteligente y banda sonora",
    description: "Línea visual sobria con tipografía serif romana, microanimaciones de destello y confirmación directa con pases.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.BODA,
    packageId: "pro",
    packageName: "Pro",
    tags: ["Romántico", "Luxury", "RSVP Avanzado", "Álbum Colaborativo"],
    featured: true,
    colorHighlights: ["#800020", "#D4AF37", "#FDFBF7"]
  },
  {
    id: "boda-botanica-minimal",
    title: "Boda Botánica Eucalipto",
    conceptSubtitle: "Interacción fluida con mapas y cuenta regresiva",
    description: "Inspiración floral moderna con fondos marfil, cuenta regresiva en tiempo real y botones directos a Google Maps.",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.BODA,
    packageId: "intermedio",
    packageName: "Intermedio",
    tags: ["Boho Chic", "Google Maps", "Música de Entrada"],
    featured: true,
    colorHighlights: ["#556B2F", "#EAE6DF", "#2F3E46"]
  },
  {
    id: "boda-marfil-esencial",
    title: "Boda Tradicional Champagne",
    conceptSubtitle: "Información pulcra y tipografía de alta costura",
    description: "Diseño editorial limpio con frase especial, ceremonia, recepción y enlace responsivo listo para WhatsApp.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.BODA,
    packageId: "basico",
    packageName: "Básico",
    tags: ["Minimalista", "Elegante", "Carga Rápida"],
    featured: false,
    colorHighlights: ["#F7E7CE", "#3D3A37"]
  },

  // --- XV AÑOS ---
  {
    id: "xv-rosas-glamour",
    title: "XV Años Golden Princess",
    conceptSubtitle: "Lluvia de destellos dorados y álbum colaborativo",
    description: "Composición mágica con animaciones premium, música de vals autoejecutable, dress code visual y código QR.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.XV_ANOS,
    packageId: "pro",
    packageName: "Pro",
    tags: ["Princesa", "Animaciones Premium", "QR Exclusivo", "Álbum Invitados"],
    featured: true,
    colorHighlights: ["#E0A96D", "#2C1B4D", "#FFFFFF"]
  },
  {
    id: "xv-lila-mistico",
    title: "XV Años Lavanda & Destellos",
    conceptSubtitle: "Interacción juvenil con cuenta regresiva y mapas",
    description: "Línea visual en tonos pastel con carrusel fotográfico de la quinceañera y confirmación directa a WhatsApp.",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.XV_ANOS,
    packageId: "intermedio",
    packageName: "Intermedio",
    tags: ["Pastel", "Galería de Fotos", "Cuenta Regresiva"],
    featured: false,
    colorHighlights: ["#B39DDB", "#F3E5F5", "#4A148C"]
  },
  {
    id: "xv-rosa-esencial",
    title: "XV Años Rose Classic",
    conceptSubtitle: "Tarjeta digital rápida y temática floral",
    description: "Línea visual fresca con fecha, hora, dirección del salón y fotografía principal en alta resolución.",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.XV_ANOS,
    packageId: "basico",
    packageName: "Básico",
    tags: ["Esencial", "Temática Rosa", "Compartir por Chat"],
    featured: false,
    colorHighlights: ["#F48FB1", "#FAFAFA"]
  },

  // --- CUMPLEAÑOS ---
  {
    id: "cumple-neon-party",
    title: "Cumpleaños Festival Glow",
    conceptSubtitle: "Animación rítmica, video slideshow y confirmación",
    description: "Estilo nocturno de alta vibración con música de fiesta, galería ampliada de recuerdos y geolocalización.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.CUMPLEANOS,
    packageId: "premium",
    packageName: "Premium",
    tags: ["Neón", "Fiesta", "Video Slideshow", "Animaciones"],
    featured: true,
    colorHighlights: ["#FF007F", "#00F0FF", "#121212"]
  },
  {
    id: "cumple-coctel-interactivo",
    title: "Celebración Cóctel & Brindis",
    conceptSubtitle: "Cuenta regresiva y botón de mapas",
    description: "Diseño moderno con música chill out, confirmación de asistencia por chat y botón de ubicación GPS.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.CUMPLEANOS,
    packageId: "interactivo",
    packageName: "Interactivo",
    tags: ["Cóctel", "Música Chill", "Ubicación GPS"],
    featured: false,
    colorHighlights: ["#D4AF37", "#1A1A1A"]
  },
  {
    id: "cumple-express-minimal",
    title: "Cumpleaños Express Visual",
    conceptSubtitle: "Invitación ágil lista en menos de 24 horas",
    description: "Composición alegre y directa con nombre, edad, fecha, horario y botón para abrir en smartphone.",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.CUMPLEANOS,
    packageId: "express",
    packageName: "Express",
    tags: ["Entrega Rápida", "Directo", "WhatsApp"],
    featured: false,
    colorHighlights: ["#FFB703", "#023047"]
  },

  // --- CARTA DIGITAL ---
  {
    id: "carta-bistro-gourmet",
    title: "Menú Bistro & Cocktails Signature",
    conceptSubtitle: "Navegación por categorías con fotos HD y pedido directo",
    description: "Interfaz gastronómica refinada con fotos de platillos, precios claros, filtros y comanda enviada directo a WhatsApp.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.CARTA_DIGITAL,
    packageId: "completo",
    packageName: "Completo",
    tags: ["Gastronomía", "Restaurante", "WhatsApp Pedidos"],
    featured: true,
    colorHighlights: ["#1F2421", "#DCE1DE", "#9CC5A1"]
  },
  {
    id: "carta-cafe-premium",
    title: "Carta Cafetería de Especialidad",
    conceptSubtitle: "Diseño minimalista con productos destacados",
    description: "Estilo escandinavo con categorías de café, pastelería y promociones del día con botones de pedido.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.CARTA_DIGITAL,
    packageId: "premium",
    packageName: "Premium",
    tags: ["Cafetería", "Especialidad", "Destacados"],
    featured: false,
    colorHighlights: ["#6F4E37", "#F5EBE0"]
  },

  // --- LANDING PAGE ---
  {
    id: "landing-inmobiliaria-pro",
    title: "Landing Residencial & Negocios",
    conceptSubtitle: "Estructura comercial de alta conversión",
    description: "Arquitectura web persuasiva con hero impactante, propuesta de valor, galería de amenidades, testimonios y formulario de leads.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.LANDING_PAGE,
    packageId: "comercial",
    packageName: "Comercial",
    tags: ["Alta Conversión", "Formulario", "Testimonios"],
    featured: true,
    colorHighlights: ["#0F172A", "#38BDF8", "#F8FAFC"]
  },
  {
    id: "landing-consultoria-esencial",
    title: "Landing Portafolio Profesional",
    conceptSubtitle: "Presencia digital ágil con botón directo",
    description: "Diseño sobrio orientado a captación rápida de contactos con presentación de servicios y enlace a WhatsApp.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.LANDING_PAGE,
    packageId: "esencial",
    packageName: "Esencial",
    tags: ["Corporativo", "Presencia Web", "WhatsApp"],
    featured: false,
    colorHighlights: ["#1E293B", "#F1F5F9"]
  },

  // --- ARTES MULTIMEDIA ---
  {
    id: "arte-evento-musica",
    title: "Flyer Promocional Festival Sonora",
    conceptSubtitle: "Fotomontaje complejo con tipografía cinética",
    description: "Composición de autor con integración de múltiples capas, efectos luminosos y jerarquía comercial para venta de tickets.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.ARTES_MULTIMEDIA,
    packageId: "arte-premium",
    packageName: "Arte Premium",
    tags: ["Flyer", "Fotomontaje", "Efectos Visuales", "Multiformato"],
    featured: true,
    colorHighlights: ["#7928CA", "#FF0080", "#000000"]
  },
  {
    id: "arte-promo-gastronomica",
    title: "Post Publicitario Gastro Experience",
    conceptSubtitle: "Retoque fotográfico profesional y composición de producto",
    description: "Tratamiento de color de alta apetitosidad con integración de tipografía elegante para lanzamiento de menú.",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.ARTES_MULTIMEDIA,
    packageId: "arte-profesional",
    packageName: "Arte Profesional",
    tags: ["Social Media", "Retoque Digital", "Tipografía"],
    featured: false,
    colorHighlights: ["#2B2B2B", "#E63946", "#F1FAEE"]
  },
  {
    id: "arte-banner-esencial",
    title: "Historia & Banner Promoción Flash",
    conceptSubtitle: "Composición básica y entrega en 24 horas",
    description: "Diseño limpio enfocado en anunciar descuento especial de fin de semana con exportación directa para stories de Instagram.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.ARTES_MULTIMEDIA,
    packageId: "arte-esencial",
    packageName: "Arte Esencial",
    tags: ["Story", "Banner", "Entrega Rápida"],
    featured: false,
    colorHighlights: ["#111827", "#F59E0B"]
  },

  // --- BRANDING ---
  {
    id: "brand-aurora-couture",
    title: "Identidad de Marca & Sistema Visual",
    conceptSubtitle: "Logotipo vectorial, manual de normas y paleta cromática",
    description: "Desarrollo conceptual de logotipo exclusivo con variaciones de sello, tipografías corporativas y guía de aplicaciones.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.DISENO_GRAFICO,
    packageId: "identidad",
    packageName: "Identidad",
    tags: ["Logotipo", "Manual PDF", "Vectorial"],
    featured: true,
    colorHighlights: ["#1B1B1E", "#C99700", "#F7F7F7"]
  },

  // --- AUDIOVISUAL & SPOT ---
  {
    id: "video-reel-dinamico",
    title: "Reel Cinemático de Marca",
    conceptSubtitle: "Edición rítmica vertical con sincronización sonora",
    description: "Cortes cinemáticos al ritmo de la música, corrección de color y subtítulos animados para retención de audiencia.",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.FOTO_VIDEO,
    packageId: "completo",
    packageName: "Completo",
    tags: ["Reel 9:16", "Color Grading", "Subtítulos Dinámicos"],
    featured: true,
    colorHighlights: ["#000000", "#FF6B6B"]
  },
  {
    id: "spot-locucion-comercial",
    title: "Spot Audiovisual con Locución",
    conceptSubtitle: "Voz en cabina profesional y masterización",
    description: "Guion publicitario estructurado con locución profesional cálida y cortina musical optimizada para redes y radio.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    serviceType: ProjectType.SPOT,
    packageId: "premium",
    packageName: "Premium",
    tags: ["Locución", "Audio Masterizado", "Comercial"],
    featured: false,
    colorHighlights: ["#1E1B18", "#E09F3E"]
  },
  {
    id: "motion-esencial-sample",
    title: "Motion Esencial · Animación Ágil de Marca",
    conceptSubtitle: "Animación de logotipo y textos directos",
    description: "Animación corta básica con movimientos limpios, ideal para presentaciones breves y reels de redes.",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791563016/Motion_Esencial.png",
    serviceType: ProjectType.ANIMACION_MOTION,
    packageId: "motion-esencial",
    packageName: "Motion Esencial",
    tags: ["Logo Motion", "2D", "Redes"],
    featured: true,
    colorHighlights: ["#000000", "#FF6B6B"]
  },
  {
    id: "motion-profesional-sample",
    title: "Motion Profesional · Composición Gráfica 2D",
    conceptSubtitle: "Composición elaborada y transiciones dinámicas",
    description: "Motion graphics con múltiples capas, tipografía cinética y transiciones personalizadas de alto ritmo.",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791563017/Motion_Profesional.png",
    serviceType: ProjectType.ANIMACION_MOTION,
    packageId: "motion-profesional",
    packageName: "Motion Profesional",
    tags: ["Motion 2D", "Tipografía Cinética", "Comercial"],
    featured: false,
    colorHighlights: ["#0B0B0C", "#9D4EDD"]
  },
  {
    id: "motion-premium-sample",
    title: "Motion Premium · Narrativa Cinematográfica",
    conceptSubtitle: "Múltiples escenas y máxima dirección visual",
    description: "Animación de alta gama con narrativa visual, acabados de autor y riqueza cinematográfica para campañas.",
    image: "https://res.cloudinary.com/yzpbyhox/image/upload/v1791563017/Motion_Premium.png",
    serviceType: ProjectType.ANIMACION_MOTION,
    packageId: "motion-premium",
    packageName: "Motion Premium",
    tags: ["Motion Premium", "Multi-escena", "Branding"],
    featured: true,
    colorHighlights: ["#000000", "#D97706"]
  }
];
