/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Calculator, 
  Sparkles, 
  Check, 
  MessageCircle, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  Smartphone,
  Music,
  Camera,
  QrCode,
  Zap,
  MapPin
} from "lucide-react";
import { ProjectType } from "../types";
import CurrencySelector, { 
  ActiveCurrency, 
  convertPrice, 
  formatCurrency, 
  CURRENCY_OPTIONS 
} from "./CurrencySelector";

interface InstantQuoteCalculatorProps {
  onSelectServiceAndStartOrder: (type: ProjectType, prefilledNotes?: string) => void;
}

export interface AddonItem {
  id: string;
  label: string;
  priceInPEN: number;
  description: string;
  icon: "music" | "camera" | "qr" | "zap" | "msg";
}

export interface ServiceConfig {
  type: ProjectType;
  title: string;
  basePriceInPEN: number;
  delivery: string;
  description: string;
  benefits: string[];
  addons: AddonItem[];
}

// Master service configurations with tailored pricing, delivery, benefits, and add-ons
export const SERVICE_CONFIGURATIONS: ServiceConfig[] = [
  {
    type: ProjectType.BODA,
    title: "Invitación de Bodas Luxury",
    basePriceInPEN: 240,
    delivery: "3 a 5 días",
    description: "Diseño elegante para parejas con confirmación RSVP y enlace web propio.",
    benefits: [
      "Enlace web propio personalizado",
      "Compatibilidad total con móviles iOS y Android",
      "Confirmación de invitados por WhatsApp con conteo de pases",
      "Ubicación GPS interactiva para ceremonia y recepción"
    ],
    addons: [
      { id: "musica", label: "Música de Fondo Personalizada", priceInPEN: 30, description: "Canción romántica que se reproduce al abrir la invitación.", icon: "music" },
      { id: "galeria_fotos", label: "Galería de Fotografías HD", priceInPEN: 40, description: "Carrusel interactivo con imágenes de la sesión de compromiso.", icon: "camera" },
      { id: "rsvp_pases", label: "RSVP por WhatsApp con Control de Pases", priceInPEN: 35, description: "Sistema estructurado para control de adultos y niños.", icon: "msg" },
      { id: "qr_imprimible", label: "Código QR Imprimible en Alta Resolución", priceInPEN: 25, description: "Vector optimizado para tarjetas de invitación físicas.", icon: "qr" },
      { id: "mesa_regalos", label: "Mesa de Regalos Digital", priceInPEN: 30, description: "Enlaces directos a tiendas, cuentas bancarias o lluvia de sobres.", icon: "zap" },
      { id: "dress_code", label: "Sección de Código de Vestimenta", priceInPEN: 25, description: "Indicaciones de etiqueta, paleta de colores y sugerencias.", icon: "zap" },
      { id: "historia_amor", label: "Línea de Tiempo / Historia de la Pareja", priceInPEN: 40, description: "Sección especial relatando su historia de amor.", icon: "music" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Desarrollo en canal preferencial con prioridad absoluta.", icon: "zap" }
    ]
  },
  {
    type: ProjectType.XV_ANOS,
    title: "Invitación de XV Años Princesa",
    basePriceInPEN: 190,
    delivery: "3 a 4 días",
    description: "Animaciones mágicas, lluvia de destellos, cronómetro y dress code.",
    benefits: [
      "Enlace web propio interactivo",
      "Cuenta regresiva animada en tiempo real",
      "Confirmación de asistencia por WhatsApp",
      "Ubicación de salón y ceremonia"
    ],
    addons: [
      { id: "musica", label: "Música de Entrada Personalizada", priceInPEN: 30, description: "Tema musical favorito al ingresar a la invitación.", icon: "music" },
      { id: "galeria_fotos", label: "Galería de Fotos de Quinceañera", priceInPEN: 40, description: "Álbum fotográfico de sesión especial.", icon: "camera" },
      { id: "rsvp_pases", label: "RSVP por WhatsApp con Pases", priceInPEN: 35, description: "Confirmación exacta de invitados.", icon: "msg" },
      { id: "qr_imprimible", label: "Código QR para Recuerdos", priceInPEN: 25, description: "Diseño QR para imprimir en tarjetas o detalles.", icon: "qr" },
      { id: "dress_code", label: "Sección de Dress Code", priceInPEN: 25, description: "Indicaciones de vestimenta y colores sugeridos.", icon: "zap" },
      { id: "mesa_regalos", label: "Mesa de Regalos / Lluvia de Sobres", priceInPEN: 30, description: "Información de obsequios y transferencias.", icon: "zap" },
      { id: "animaciones_premium", label: "Animaciones Estelares Avanzadas", priceInPEN: 45, description: "Efectos visuales de partículas, destellos y confetti.", icon: "zap" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Atención prioritaria y entrega rápida.", icon: "zap" }
    ]
  },
  {
    type: ProjectType.CUMPLEANOS,
    title: "Invitación de Cumpleaños Express",
    basePriceInPEN: 130,
    delivery: "24 a 48 horas",
    description: "Formato ágil de alta energía con botón de ubicación y confirmación.",
    benefits: [
      "Diseño optimizado para compartir en WhatsApp",
      "Botón directo de ubicación GPS",
      "Confirmación rápida de invitados",
      "Compatibilidad total con smartphones"
    ],
    addons: [
      { id: "musica", label: "Música de Fondo Festiva", priceInPEN: 30, description: "Canción alegre que ameniza la invitación.", icon: "music" },
      { id: "galeria_fotos", label: "Mini Galería de Momentos", priceInPEN: 35, description: "Fotos destacadas del festejado.", icon: "camera" },
      { id: "ubicacion_gps", label: "Mapa de Ubicación Interactiva", priceInPEN: 20, description: "Acceso directo a Waze y Google Maps.", icon: "qr" },
      { id: "rsvp_pases", label: "Confirmación por WhatsApp", priceInPEN: 30, description: "Botón automatizado para recibir asistencias.", icon: "msg" },
      { id: "animaciones_premium", label: "Efectos Visuales Festivos", priceInPEN: 35, description: "Globos, animación de texto y colores vibrantes.", icon: "zap" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Prioridad máxima en cola de diseño.", icon: "zap" }
    ]
  },
  {
    type: ProjectType.CARTA_DIGITAL,
    title: "Carta & Menú Digital Gourmet",
    basePriceInPEN: 280,
    delivery: "4 a 6 días",
    description: "Catálogo de platillos con categorías, fotos y envío de comanda a WhatsApp.",
    benefits: [
      "Interfaz responsive sin descargas de apps",
      "Categorización fluida (Entradas, Platos, Bebidas)",
      "Envío directo de comandas a WhatsApp",
      "Actualización instantánea de precios o platos"
    ],
    addons: [
      { id: "qr_imprimible", label: "Diseño de Código QR para Mesas", priceInPEN: 25, description: "Arte vectorial listo para imprimir en acrílicos o portamenús.", icon: "qr" },
      { id: "productos_extra", label: "Bloque de Productos Adicionales (+10 ítems)", priceInPEN: 40, description: "Incorporación de una sección ampliada de especialidades.", icon: "zap" },
      { id: "categorias_extra", label: "Categorías Especiales o Vinos", priceInPEN: 35, description: "Sección dedicada a coctelería o cava.", icon: "zap" },
      { id: "pedidos_whatsapp", label: "Botón de Comandas y Pedidos Directos", priceInPEN: 45, description: "Generador automático de pedido estructurado para cocina.", icon: "msg" },
      { id: "galeria_fotos", label: "Galería Fotográfica de Platillos", priceInPEN: 40, description: "Imágenes en alta definición de las especialidades de la casa.", icon: "camera" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Prioridad en desarrollo y maquetación digital.", icon: "zap" }
    ]
  },
  {
    type: ProjectType.LANDING_PAGE,
    title: "Landing Page Comercial",
    basePriceInPEN: 360,
    delivery: "3 a 5 días",
    description: "Página web de alta conversión para venta o captación de prospectos.",
    benefits: [
      "Diseño responsive de alta conversión",
      "Formulario de contacto y llamadas a la acción",
      "Optimización SEO técnico básico",
      "Dominio temporal propio para pruebas"
    ],
    addons: [
      { id: "secciones_extra", label: "Secciones Adicionales de Contenido", priceInPEN: 60, description: "Bloques adicionales para testimonios, equipo o servicios.", icon: "zap" },
      { id: "formulario_avanzado", label: "Formulario de Leads Avanzado", priceInPEN: 50, description: "Campos personalizados con validación y alertas.", icon: "zap" },
      { id: "whatsapp_lead", label: "Botón Flotante de WhatsApp Business", priceInPEN: 35, description: "Acceso permanente de chat para clientes interesados.", icon: "msg" },
      { id: "mapa_interactivo", label: "Mapa y Sucursales", priceInPEN: 30, description: "Integración geolocalizada para tiendas o oficinas.", icon: "qr" },
      { id: "animaciones_premium", label: "Efectos de Animación Scroll", priceInPEN: 45, description: "Transiciones fluidas al deslizar la página.", icon: "zap" },
      { id: "faq_section", label: "Sección de Preguntas Frecuentes (FAQ)", priceInPEN: 30, description: "Acordeón interactivo para resolver dudas comunes.", icon: "zap" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Desarrollo acelerado en jornada continua.", icon: "zap" }
    ]
  },
  {
    type: ProjectType.SPOT,
    title: "Spot Publicitario / Locución",
    basePriceInPEN: 220,
    delivery: "3 a 5 días",
    description: "Audio comercial con locución profesional y masterización de sonido.",
    benefits: [
      "Locución profesional en estudio con voz comercial",
      "Masterización de audio profesional",
      "Formato de entrega en alta calidad WAV y MP3",
      "Derechos de uso comercial incluidos"
    ],
    addons: [
      { id: "guion_spot", label: "Desarrollo o Mejora de Guion Publicitario", priceInPEN: 50, description: "Redacción persuasiva adaptada a tu público objetivo.", icon: "zap" },
      { id: "locucion_adicional", label: "Locución Adicional / Segunda Voz", priceInPEN: 60, description: "Incorporación de voz complementaria (diálogo o contraste).", icon: "msg" },
      { id: "musicalizacion_spot", label: "Musicalización Comercial con Licencia", priceInPEN: 50, description: "Banda sonora instrumental idónea para el ritmo del spot.", icon: "music" },
      { id: "diseno_sonoro", label: "Diseño Sonoro y Efectos Especiales (SFX)", priceInPEN: 45, description: "Ambientación, transiciones y efectos de impacto.", icon: "zap" },
      { id: "version_vertical", label: "Versión Vertical 9:16 para Reels y TikTok", priceInPEN: 50, description: "Adaptación audiovisual optimizada para redes sociales.", icon: "camera" },
      { id: "subtitulos_spot", label: "Subtítulos Dinámicos Incrustados", priceInPEN: 40, description: "Texto animado ideal para reproducción sin audio.", icon: "qr" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Producción y entrega en jornada express.", icon: "zap" }
    ]
  },
  {
    type: ProjectType.FOTO_VIDEO,
    title: "Producción Audiovisual / Video",
    basePriceInPEN: 320,
    delivery: "5 a 7 días",
    description: "Edición cinemática, corrección de color y formato vertical para redes.",
    benefits: [
      "Edición cinemática profesional",
      "Corrección de color base adaptada al tono",
      "Exportación optimizada 4K y 1080p",
      "Sincronización perfecta de audio y ritmo"
    ],
    addons: [
      { id: "reel_adicional", label: "Reel Vertical Adicional para Redes", priceInPEN: 60, description: "Corte optimizado para Instagram Reels o TikTok.", icon: "camera" },
      { id: "subtitulos_avanzados", label: "Subtítulos Dinámicos Estilizados", priceInPEN: 50, description: "Subtitulado profesional con tipografía de marca.", icon: "qr" },
      { id: "color_grading", label: "Corrección de Color Cinemática Avanzada", priceInPEN: 60, description: "Look visual de cine con grading profesional.", icon: "zap" },
      { id: "motion_graphics", label: "Motion Graphics y Títulos Animados", priceInPEN: 65, description: "Rótulos dinámicos y gráficos en movimiento.", icon: "zap" },
      { id: "intro_outro", label: "Intro y Outro Personalizados", priceInPEN: 45, description: "Cortes de apertura y cierre con identidad propia.", icon: "music" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Prioridad absoluta en estación de edición.", icon: "zap" }
    ]
  },
  {
    type: ProjectType.DISENO_GRAFICO,
    title: "Identidad Gráfica & Branding",
    basePriceInPEN: 260,
    delivery: "2 a 4 días",
    description: "Diseño de logotipos vectoriales originales y paletas cromáticas.",
    benefits: [
      "Propuestas vectoriales originales y exclusivas",
      "Archivos finales en alta resolución",
      "Derechos de uso comercial plenos",
      "Asesoría en tipografías y colores"
    ],
    addons: [
      { id: "logotipo_variaciones", label: "Variaciones de Logotipo (Vertical / Sello)", priceInPEN: 60, description: "Versiones alternativas adaptadas a diferentes soportes.", icon: "zap" },
      { id: "archivos_editables", label: "Entrega de Archivos Fuente Editables (AI, EPS, SVG)", priceInPEN: 70, description: "Paquete completo con formatos vectoriales editables.", icon: "qr" },
      { id: "mockups_3d", label: "Mockups 3D de Presentación de Marca", priceInPEN: 50, description: "Visualización realista en papelería y productos.", icon: "camera" },
      { id: "paleta_avanzada", label: "Guía de Paleta Cromática y Códigos Pantone", priceInPEN: 35, description: "Especificaciones exactas para impresión y digital.", icon: "zap" },
      { id: "manual_marca", label: "Manual Básico de Identidad de Marca (PDF)", priceInPEN: 80, description: "Normas de uso, proporciones y aplicaciones correctas.", icon: "msg" },
      { id: "entrega_urgente", label: "Entrega Prioritaria (24 Horas)", priceInPEN: 70, description: "Desarrollo exprés en jornada preferencial.", icon: "zap" }
    ]
  }
];

const STORAGE_CURRENCY_KEY = "vac_cotizador_currency";

export default function InstantQuoteCalculator({
  onSelectServiceAndStartOrder
}: InstantQuoteCalculatorProps) {
  const [selectedType, setSelectedType] = useState<ProjectType>(ProjectType.BODA);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [currency, setCurrency] = useState<ActiveCurrency>("PEN");
  const [detectionOrigin, setDetectionOrigin] = useState<string>("");

  // Detect region on mount or load saved preference
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_CURRENCY_KEY);
    if (saved === "PEN" || saved === "USD") {
      setCurrency(saved as ActiveCurrency);
      setDetectionOrigin("preferencia guardada");
      return;
    }

    try {
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
      const languages = (navigator.languages || [navigator.language || ""]).map((l) => l.toLowerCase());
      
      if (tz.includes("lima") || languages.some((l) => l.includes("pe"))) {
        setCurrency("PEN");
        setDetectionOrigin("Perú (Soles)");
      } else {
        setCurrency("USD");
        setDetectionOrigin("Internacional (USD)");
      }
    } catch {
      setCurrency("PEN");
    }
  }, []);

  const currentService = SERVICE_CONFIGURATIONS.find((s) => s.type === selectedType) || SERVICE_CONFIGURATIONS[0];

  // Automatically clear selected addons that do not belong to the newly selected service
  useEffect(() => {
    const validAddonIds = currentService.addons.map((a) => a.id);
    setSelectedAddons((prev) => prev.filter((id) => validAddonIds.includes(id)));
  }, [selectedType]);

  const handleCurrencyChange = (newCurrency: ActiveCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem(STORAGE_CURRENCY_KEY, newCurrency);
    setDetectionOrigin("");
  };

  const currentBasePrice = convertPrice(currentService.basePriceInPEN, currency);

  const addonsTotalInCurrency = selectedAddons.reduce((sum, id) => {
    const addon = currentService.addons.find((a) => a.id === id);
    return sum + (addon ? convertPrice(addon.priceInPEN, currency) : 0);
  }, 0);

  const displayedTotalPrice = currentBasePrice + addonsTotalInCurrency;
  const currencyMeta = CURRENCY_OPTIONS[currency];

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const handleStartOrder = () => {
    const addonNames = selectedAddons
      .map((id) => currentService.addons.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const formattedAmount = formatCurrency(displayedTotalPrice, currency);
    const notes = `Cotización en V.A.C. Creative: ${currentService.title}. Inversión estimada: ${formattedAmount}. Extras incluidos: ${addonNames || "Ninguno"}.`;
    onSelectServiceAndStartOrder(selectedType, notes);
  };

  const handleContactWhatsApp = () => {
    const addonNames = selectedAddons
      .map((id) => currentService.addons.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const formattedAmount = formatCurrency(displayedTotalPrice, currency);

    const message = encodeURIComponent(
      `¡Hola V.A.C. Creative! 👋 Deseo cotizar el servicio de *${currentService.title}* con un estimado de *${formattedAmount}*.\n\n*Extras elegidos:* ${addonNames || "Paquete base"}.\n*Tiempo estimado de entrega:* ${currentService.delivery}.\n*Moneda elegida:* ${currencyMeta.name} (${currencyMeta.symbol} ${currency}).\n\n¿Podrían asesorarme para iniciar mi pedido?`
    );
    window.open(`https://wa.me/525512345678?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 animate-fade-in">
      
      {/* Title & Currency Selector Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200/60 dark:border-stone-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-space font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Cotizador Inteligente · V.A.C. Creative
            </span>
            {detectionOrigin && (
              <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <MapPin className="w-3.5 h-3.5" />
                <span>Región: {detectionOrigin}</span>
              </span>
            )}
          </div>

          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50 tracking-tight">
            Calcula la Inversión de tu Proyecto
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 font-normal">
            Alterna entre Soles (S/) y Dólares ($) con conversión instantánea para todo el catálogo.
          </p>
        </div>

        {/* Dedicated Currency Selector Component (Soles / Dólares) */}
        <CurrencySelector
          currency={currency}
          onChange={handleCurrencyChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Service Picker & Addons (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. SELECCIÓN DEL SERVICIO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-space uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                1. Selecciona el Tipo de Proyecto
              </label>
              <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                Precios en {currencyMeta.symbol} {currency}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_CONFIGURATIONS.map((service) => {
                const isSelected = service.type === selectedType;
                const convertedServicePrice = convertPrice(service.basePriceInPEN, currency);

                return (
                  <button
                    key={service.type}
                    type="button"
                    onClick={() => setSelectedType(service.type)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 dark:bg-amber-500/15 shadow-sm"
                        : "border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/50 hover:border-stone-300 dark:hover:border-stone-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-serif font-bold ${isSelected ? "text-amber-900 dark:text-amber-300" : "text-stone-900 dark:text-stone-100"}`}>
                          {service.title}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-normal mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono">
                      <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.delivery}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {formatCurrency(convertedServicePrice, currency)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. EXTRAS ESPECÍFICOS DEL SERVICIO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-space uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                2. Personaliza con Extras para {currentService.title}
              </label>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Opcional
              </span>
            </div>

            <div className="space-y-2.5">
              {currentService.addons.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                const addonPriceFormatted = formatCurrency(convertPrice(addon.priceInPEN, currency), currency);

                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isChecked
                        ? "border-amber-500/80 bg-amber-500/5 dark:bg-amber-500/10"
                        : "border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40 hover:border-stone-300 dark:hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-lg mt-0.5 border flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? "bg-amber-500 border-amber-500 text-stone-950"
                          : "border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 block">
                          {addon.label}
                        </span>
                        <p className="text-xs text-stone-600 dark:text-stone-300 font-normal leading-relaxed">
                          {addon.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 shrink-0">
                      + {addonPriceFormatted}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Dynamic Summary & Actions (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-stone-50 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            
            <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
              <span className="text-xs font-space font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Resumen de Inversión
              </span>
              <h4 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-50">
                {currentService.title}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-normal">
                Tiempo de entrega estimado: <strong className="text-stone-900 dark:text-stone-100">{currentService.delivery}</strong>
              </p>
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                <span>Precio Base ({currencyMeta.symbol})</span>
                <span className="font-mono font-semibold">{formatCurrency(currentBasePrice, currency)}</span>
              </div>

              {selectedAddons.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-400 block uppercase font-space">
                    Extras Seleccionados ({selectedAddons.length})
                  </span>
                  {selectedAddons.map((id) => {
                    const addon = currentService.addons.find((a) => a.id === id);
                    if (!addon) return null;
                    const addonCost = convertPrice(addon.priceInPEN, currency);
                    return (
                      <div key={id} className="flex items-center justify-between text-stone-600 dark:text-stone-300 text-xs">
                        <span className="truncate pr-2">• {addon.label}</span>
                        <span className="font-mono shrink-0">+ {formatCurrency(addonCost, currency)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Total display */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-space font-bold block">
                  Inversión Total Estimada
                </span>
                <span className="text-xs text-stone-400 font-light">
                  Impuestos incluidos
                </span>
              </div>
              <div className="text-right">
                <span className="font-serif font-bold text-3xl sm:text-4xl text-stone-950 dark:text-stone-50">
                  {formatCurrency(displayedTotalPrice, currency)}
                </span>
                <span className="text-xs font-mono text-amber-700 dark:text-amber-400 block font-bold">
                  {currencyMeta.symbol} {currency}
                </span>
              </div>
            </div>

            {/* Dynamic Included Benefits */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold font-space uppercase tracking-wider text-stone-800 dark:text-stone-200 block">
                Beneficios Incluidos:
              </span>
              <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300 font-normal">
                {currentService.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={handleStartOrder}
                className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-stone-950 font-bold font-space text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <span>Llenar Formulario con esta Cotización</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleContactWhatsApp}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-space text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </button>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 text-center font-normal pt-1">
              Atención personalizada y asesoría directa por directores de arte V.A.C.
            </p>

          </div>
        </div>

      </div>

    </div>
  );
}
