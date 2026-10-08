/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ProjectType, ProjectStatus } from "../types";

export interface CompiledPrompts {
  aiStudio: string;
  gemini: string;
  claude: string;
  chatGpt: string;
  lovable: string;
}

export function compilePromptsForProject(project: Project): CompiledPrompts {
  const { type, clientName, clientPhone, clientEmail } = project;
  
  // Format variables depending on type
  let specificDataString = "";
  
  if (type === ProjectType.BODA && project.weddingDetails) {
    const w = project.weddingDetails;
    const activeExtras = Object.entries(w.extras)
      .filter(([_, value]) => value)
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
      .join(", ");

    specificDataString = `
[DATOS DE BODA]
- Novios: ${w.novioName} y ${w.noviaName}
- Fecha del Evento: ${w.fecha}
- Hora del Evento: ${w.hora}
- Frase Especial: "${w.fraseEspecial}"

[CEREMONIA EN IGLESIA]
- Templo: ${w.ceremoniaIglesia}
- Dirección: ${w.ceremoniaDireccion}
- Ubicación Maps: ${w.ceremoniaMapsUrl}

[RECEPCIÓN]
- Salón/Lugar: ${w.recepcionLocal}
- Dirección: ${w.recepcionDireccion}
- Ubicación Maps: ${w.recepcionMapsUrl}

[CONFIRMACIÓN / DIGITAL]
- WhatsApp de Confirmación: ${w.confirmacionWhatsapp}
- Fecha Límite: ${w.confirmacionFechaLimite}

[DISEÑO & ESTILO]
- Paleta de Colores: ${w.colorPalette} ${w.colorPaleteCustomValue ? `(${w.colorPaleteCustomValue})` : ''}
- Estilo Visual: ${w.visualStyle}
- Música de Fondo: ${w.multimediaMusicaNombre || "No especificado"}
- Video de YouTube: ${w.youtubeUrl || "No especificado"}
- Galería Multimedia (Fotos/Videos): ${w.multimediaFotos.length > 0 ? `${w.multimediaFotos.length} adjuntos` : 'Ninguno'}

[CARACTERÍSTICAS EXTRA SOLICITADAS]
- Extras Activos: ${activeExtras || "Ninguno"}
`;
  } else if (type === ProjectType.XV_ANOS && project.xvDetails) {
    const x = project.xvDetails;
    const activeExtras = Object.entries(x.extras)
      .filter(([_, value]) => value)
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
      .join(", ");

    specificDataString = `
[DATOS DE XV AÑOS]
- Quinceañera: ${x.quinceaneraName}
- Fecha del Evento: ${x.fecha}
- Hora: ${x.hora}
- Lugar: ${x.lugar}
- Ubicación Maps: ${x.mapsUrl}
- Música Preferida: ${x.musicaNombre}
- Video de Fondo: ${x.videoUrl || "No especificado"}
- Paleta de Colores: ${x.colorPalette}
- Temática del Evento: ${x.tematica}
- WhatsApp de Confirmación: ${x.confirmacionWhatsapp}
- Cuenta Regresiva Activa: ${x.cuentaRegresiva ? "Sí" : "No"}
- Galería Activa: ${x.galleryEnabled ? "Sí" : "No"}
- Video Activo: ${x.videoEnabled ? "Sí" : "No"}
- Extras Activos: ${activeExtras || "Ninguno"}
`;
  } else if (type === ProjectType.CARTA_DIGITAL && project.menuDetails) {
    const m = project.menuDetails;
    const categoriesSet = new Set(m.items.map(i => i.category));
    const categoriesString = Array.from(categoriesSet).join(", ");
    
    specificDataString = `
[DATOS DEL NEGOCIO / RESTAURANTE]
- Nombre comercial: ${m.businessName}
- Dirección: ${m.address}
- WhatsApp de Pedidos: ${m.whatsapp}
- Instagram: ${m.instagramUrl || "No especificado"}
- Facebook: ${m.facebookUrl || "No especificado"}

[CARTA / MENÚ]
- Temática de Diseño: ${m.designTheme}
- Categorías Activas: ${categoriesString || "Registradas en productos"}
- Total de Productos: ${m.items.length} productos registrados.

[LISTADO DE PRODUCTOS]
${m.items.map((item, index) => `${index + 1}. [${item.category}] ${item.name} - $${item.price}\n   Descripción: ${item.description}`).join("\n")}
`;
  } else {
    const o = project.otherDetails;
    specificDataString = `
[DATOS DEL PROYECTO GENERAL]
- Servicio: ${type}
- Descripción del Pedido: ${o?.description || project.generalNotes || "No se especificaron detalles generales."}
- Requerimientos Técnicos: ${o?.requirements || "No especificados."}
- Paleta de Colores Preferida: ${o?.colorPalette || "No especificado."}
- Archivos o Referencias: ${o?.attachmentsInfo || "No especificado."}
`;
  }

  // Compiler for AI Studio
  const aiStudioPrompt = `# INSTRUCCIÓN DE SISTEMA PARA GOOGLE AI STUDIO - MAQUETACIÓN V.A.C. CREATIVE
Actúa como un Desarrollador Frontend Experto en Tailwind CSS, React y Framer Motion de nivel Senior. Tu objetivo es generar el código de producción completo para una invitación digital interactiva basada en el siguiente brief de cliente recopilado automáticamente.

## INFORMACIÓN DEL PROYECTO:
- Cliente: ${clientName} (${clientEmail} / ${clientPhone})
- Tipo: ${type}
${specificDataString}

## PAUTAS DE DISEÑO EXIGIDAS:
1. **Paleta de Colores**: Respeta estrictamente los colores indicados. Crea degradados decorativos sutiles con bordes dorados, bronce o carbón según corresponda.
2. **Interactividad**: Incluye widgets jugables como cuenta regresiva real basada en la fecha del evento, botones táctiles optimizados para móviles para abrir Google Maps y enlace directo de WhatsApp con mensaje personalizado: "¡Hola! Confirmo mi asistencia al evento de ${clientName}."
3. **Música y Vídeo**: Autoplay silenciado con botón elegante de activación/desactivación para música de fondo, o contenedor de video responsivo de YouTube.
4. **Layout**: Estructura tipo Landing page premium con scroll vertical, animaciones de entrada staggered (intercaladas) usando Framer Motion, y tipografía elegante que transmita el concepto del evento.

## FORMATO DE RESPUESTA REQUERIDO:
Entrega un archivo React único o modular listo para usar con estilos integrados de Tailwind. No uses mocks vacíos, genera la historia real y la maquetación.`;

  // Compiler for Gemini
  const geminiPrompt = `# PROPUESTA DE DESARROLLO INTELIGENTE PARA GEMINI (PROMPT OPTIMIZADO)
Genera una interfaz web premium y responsive para un servicio de ${type}. Esta interfaz debe ser auto-contenida, con animaciones atractivas mediante Framer Motion y una paleta de colores cohesiva basada en la información recopilada por V.A.C. Creative.

## DATOS BASE PARA GENERACIÓN:
${specificDataString}

## MISMAS DIRECTRICES RESPONSIVE:
- **Mobile-first**: La mayoría de invitados consumen esta invitación o menú desde su dispositivo móvil. El touch panel debe ser enorme (mínimo 48px), botones pegajosos o de fácil acceso para "Guardar Fecha" (.ics) y "Confirmar por WhatsApp".
- **Visuales fluidos**: Utiliza imágenes de fondo con degradados sutiles para emular texturas de papel de lino, acuarelas boho o elegancia oscura gourmet según el diseño.
- **Lista de productos (Si aplica)**: Renderiza componentes de tarjeta tipo Grid con filtro interactivo por categoría para que el usuario pueda filtrar al instante.

## CÓDIGO REACT REQUERIDO:
Implementa de forma modular utilizando React Hooks, manejando estados de modals interactivos para confirmación u hojas de regalo.`;

  // Compiler for Claude
  const claudePrompt = `# CLAUDE SYSTEM & INTERACTIVE BLUEPRINT INSTRUCTIONS
You are Claude 3.5 Sonnet, a world-class UI visual engineer. Generate an absolute masterpiece single-page application for the V.A.C. Creative studio. The client has submitted a structured order request for "${type}".

<project_metatags>
client_name: "${clientName}"
service_requested: "${type}"
</project_metatags>

<client_event_specification>
${specificDataString}
</client_event_specification>

Please craft a fully responsive, pixel-perfect digital invitation or system module based on the specifications above.

Core Design Tokens to Use:
1. **Typography**: Pair sophisticated serif display headings (for elegant/luxury themes) or sleek sans-serif typography (for modern themes).
2. **Component Architecture**: 
   - Interactive Countdown: Timer updating every second showing Days, Hours, Minutes, and Seconds.
   - GPS Locator Map: Inline custom beautiful Mock Map card with actual dynamic addresses and ready outbound buttons linking to Google Maps.
   - Love Story / Business Timeline: Elegantly structured vertical timeline with fading entrance cues.
   - Gift Registry / Menu Board: Minimalist cards with fine drop shadows and crisp microcopy.
3. **Framer Motion Elements**:
   - Dynamic viewport-triggered fading.
   - Soft button hover states with scaling.

Provide the completed TypeScript React code. Utilize simple state definitions and optimize for speed and readability.`;

  // Compiler for ChatGPT
  const chatGptPrompt = `# PROMPT COMPLETO OPTIMIZADO PARA CHATGPT GPT-4
Diseña y programa una aplicación de una sola página (SPA) interactiva en React de alta fidelidad estética para el cliente: ${clientName}.
El servicio es: **${type}**.

### 📋 ESPECIFICACIONES AUTOMÁTICAS DE V.A.C. CREATIVE:
${specificDataString}

### 🛠️ REQUERIMIENTOS TÉCNICOS DE DESARROLLO Y CÓDIGO:
1. **Estructura limpia**: Usa TypeScript con componentes tipados.
2. **Estilo premium**: Usa Tailwind CSS de manera avanzada (utiliza capas sutiles de fondo, filtros con efecto desenfoque glassmorphism "backdrop-blur", bordes de 1px con opacidad, y tipografías imponentes).
3. **Interactividad total**:
   - Cuenta regresiva automática y precisa.
   - Modales elegantes para mostrar el "Dress Code" o los datos de la cuenta bancaria para regalos.
   - Filtros de categorías inmediatos (para menús y catálogos).
   - Enlace directo a WhatsApp de confirmación con mensajes preestablecidos que automaticen el flujo.

Entrega todo el código fuente organizado para que el equipo de V.A.C. Creative pueda ensamblar el proyecto del cliente en menos de 5 minutos, listo para producción.`;

  // Compiler for Lovable
  const lovablePrompt = `# LOVABLE DEVELOPMENT PROMPT - V.A.C. CREATIVE INSTANT APP
Create a beautiful, fully interactive client application for "${clientName}" who ordered a "${type}". Use React, Tailwind CSS, Lucide icons, and modern animations.

Here are the custom details submitted by the client:
${specificDataString}

Please construct the application layout following these instructions:
1. **Hero Screen**: Elegant introduction with big expressive fonts, subtle entry animation, and the main event/service statement (${type === ProjectType.BODA ? 'Wedding Announcement' : type === ProjectType.XV_ANOS ? '15th Birthday Showcase' : 'Digital Catalog Header'}).
2. **Interactive Elements**:
   - Active countdown tracker or custom interactive checkout menu.
   - Fast tab filters for items (if Carta Digital).
   - Smooth slide-over sheets or modals for additional features (Dress Code, Gift List, RSVP Confirmations).
3. **Color Theme**: Emulate the requested custom color palette: ${type === ProjectType.BODA || type === ProjectType.XV_ANOS ? 'elegant events standard' : 'gourmet food standards'}. Use custom warm tailwind grays, elegant whites, gold elements, or rich contrast dark.

Make it clean, responsive, with exceptional mobile layout priority. Ready to copy-paste.`;

  return {
    aiStudio: aiStudioPrompt.trim(),
    gemini: geminiPrompt.trim(),
    claude: claudePrompt.trim(),
    chatGpt: chatGptPrompt.trim(),
    lovable: lovablePrompt.trim()
  };
}

/**
 * Seed projects to make the application immediately interactive with high-fidelity examples
 */
export const seedProjects: Project[] = [
  {
    id: "proj-1",
    clientName: "Sofia Rodriguez & Alejandro Gomez",
    clientPhone: "+52 55 1234 5678",
    clientEmail: "sofia.alejandro@gmail.com",
    type: ProjectType.BODA,
    status: ProjectStatus.EN_DISENO,
    createdAt: "2026-06-10T10:00:00-07:00",
    updatedAt: "2026-06-15T15:30:00-07:00",
    weddingDetails: {
      novioName: "Alejandro Gomez",
      noviaName: "Sofia Rodriguez",
      fecha: "2026-10-17",
      hora: "18:00",
      fraseEspecial: "Por toda la vida y más allá, nuestro camino empieza hoy.",
      ceremoniaIglesia: "Catedral de la Inmaculada Concepción",
      ceremoniaDireccion: "Av. Independencia 402, Centro Histórico",
      ceremoniaMapsUrl: "https://maps.google.com/?q=Catedral+de+la+Inmaculada+Concepcion",
      recepcionLocal: "Jardín de Eventos Las Fuentecillas",
      recepcionDireccion: "Km 4.5 Carretera Real a las Haciendas",
      recepcionMapsUrl: "https://maps.google.com/?q=Jardin+Las+Fuentecillas",
      confirmacionWhatsapp: "+51932350348",
      confirmacionFechaLimite: "2026-09-15",
      multimediaFotos: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400"
      ],
      multimediaVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-among-trees-40334-large.mp4",
      multimediaMusicaNombre: "A Thousand Years - Christina Perri",
      youtubeUrl: "https://www.youtube.com/watch?v=rtOvBOTyX00",
      colorPalette: "Rose Gold",
      visualStyle: "Luxury",
      extras: {
        cuentaRegresiva: true,
        galeriaFotos: true,
        historiaAmor: true,
        confirmacionWhatsapp: true,
        mesaRegalos: true,
        dressCode: true,
        videoFondo: true,
        animacionesPremium: true
      }
    }
  },
  {
    id: "proj-2",
    clientName: "Valentina Fernandez Martinez",
    clientPhone: "+51 932 350 348",
    clientEmail: "valentina.xv.info@gmail.com",
    type: ProjectType.XV_ANOS,
    status: ProjectStatus.PENDIENTE,
    createdAt: "2026-06-12T11:45:00-07:00",
    updatedAt: "2026-06-12T12:00:00-07:00",
    xvDetails: {
      quinceaneraName: "Valentina Fernandez",
      fecha: "2026-08-22",
      hora: "19:30",
      lugar: "Salón Imperial de las Luces",
      mapsUrl: "https://maps.google.com/?q=Salon+Imperial+luces",
      musicaNombre: "Perfect - Ed Sheeran",
      galleryEnabled: true,
      videoEnabled: false,
      videoUrl: "",
      colorPalette: "Dorado",
      tematica: "Princesa de Ensueño en el Bosque Encantado",
      confirmacionWhatsapp: "+51932350348",
      cuentaRegresiva: true,
      extras: {
        mesaRegalos: true,
        dressCode: true,
        animacionesPremium: false
      }
    }
  },
  {
    id: "proj-3",
    clientName: "Bistro Gourmet & Gelato",
    clientPhone: "+51 932 350 348",
    clientEmail: "bistrogourmet@fastbusiness.com",
    type: ProjectType.CARTA_DIGITAL,
    status: ProjectStatus.EN_REVISION,
    createdAt: "2026-06-14T09:15:00-07:00",
    updatedAt: "2026-06-15T18:40:00-07:00",
    menuDetails: {
      businessName: "Bistro Gourmet & Gelato",
      logoUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200",
      address: "Av. La Mar 820, Miraflores, Lima",
      whatsapp: "+51932350348",
      instagramUrl: "https://instagram.com/bistrogourmet_pe",
      facebookUrl: "https://facebook.com/bistrogourmet_pe",
      designTheme: "Gourmet",
      items: [
        {
          id: "item-1",
          name: "Chilaquiles del Puerto",
          description: "Crujientes totopos de maíz bañados en salsa verde cremosa, con pollo orgánico, crema fresca y queso cotija.",
          price: 185,
          category: "Desayunos"
        },
        {
          id: "item-2",
          name: "Filete de Res Mignon con Sabor Trufado",
          description: "Jugoso filete high-choice bañado en reducción de vino tinto con puré de papas rústico trufado y espárragos.",
          price: 360,
          category: "Almuerzos"
        },
        {
          id: "item-3",
          name: "Carajillo Shake Shake",
          description: "Licor 43 batido a la perfección con café espresso italiano recién extraído y cubos de hielo gourmet.",
          price: 130,
          category: "Bebidas"
        },
        {
          id: "item-4",
          name: "Gelato Crocante de Pistacho",
          description: "Gelato de pistacho puro de Bronte, Italia, con trozos crujientes tostados y lluvia de chocolate belga.",
          price: 95,
          category: "Postres"
        }
      ]
    }
  }
];
