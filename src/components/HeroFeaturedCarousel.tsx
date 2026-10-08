/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Clock, Tag } from "lucide-react";
import { SERVICES_CATALOG, SERVICES_CATALOG_DATA } from "../data/servicesCatalog";
import { ServiceItem } from "./ServicePreviewModal";

interface HeroFeaturedCarouselProps {
  onSelectService: (service: ServiceItem) => void;
}

/**
 * 5 a 7 Servicios representativos seleccionados del catálogo real para el carrusel
 * Muestra imagen, nombre, categoría, precio "desde S/ X" y tiempo de entrega.
 */
interface CarouselSlide {
  service: ServiceItem;
  categoryLabel: string;
  minPrice: number | null;
}

export default function HeroFeaturedCarousel({ onSelectService }: HeroFeaturedCarouselProps) {
  // Construimos las slides usando los servicios existentes
  const slides: CarouselSlide[] = React.useMemo(() => {
    // IDs de servicios destacados seleccionados del catálogo
    const featuredIds = [
      "boda",
      "xv-anos",
      "artes-multimedia",
      "spot-publicitario",
      "produccion-audiovisual",
      "branding",
      "landing-page",
      "carta-digital"
    ];

    return featuredIds
      .map((id) => {
        const s = SERVICES_CATALOG.find((item) => item.id === id);
        if (!s) return null;

        // Buscamos el precio mínimo entre los paquetes de SERVICES_CATALOG_DATA
        const data = SERVICES_CATALOG_DATA.find((item) => item.type === s.type);
        let minPrice: number | null = null;
        if (data && data.packages && data.packages.length > 0) {
          const prices = data.packages.map((p) => p.priceInPEN).filter((pr) => typeof pr === "number" && pr > 0);
          if (prices.length > 0) {
            minPrice = Math.min(...prices);
          }
        }

        // Etiqueta de categoría legible
        let categoryLabel = "Producción Digital";
        if (s.id === "boda") categoryLabel = "Invitación Virtual";
        else if (s.id === "xv-anos") categoryLabel = "Invitación de 15 Años";
        else if (s.id === "artes-multimedia") categoryLabel = "Flyers & Multimedia";
        else if (s.id === "spot-publicitario") categoryLabel = "Audio Comercial & Locución";
        else if (s.id === "produccion-audiovisual") categoryLabel = "Audiovisual & Video";
        else if (s.id === "branding") categoryLabel = "Identidad & Marca";
        else if (s.id === "landing-page") categoryLabel = "Web Comercial & Móvil";
        else if (s.id === "carta-digital") categoryLabel = "Carta & Menú Digital";

        return {
          service: s,
          categoryLabel,
          minPrice
        };
      })
      .filter((slide): slide is CarouselSlide => slide !== null);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Avance automático cada 5 segundos si no está pausado
  useEffect(() => {
    if (isPaused || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Soporte de swipe táctil en móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden bg-stone-950 border border-stone-800/80 shadow-2xl group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Carrusel de servicios destacados"
    >
      {/* Contenedor de la Imagen con zoom muy suave y transición fade */}
      <div className="relative h-80 sm:h-96 md:h-[420px] w-full overflow-hidden bg-stone-950">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.service.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.service.image}
                alt={slide.service.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
              {/* Degradados cinemáticos para legibilidad editorial */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-transparent to-stone-950/20" />
            </div>
          );
        })}

        {/* Badge superior: Categoría y Tiempo de Entrega */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            <Tag className="w-3 h-3 text-amber-400" />
            <span>{currentSlide.categoryLabel}</span>
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-stone-300 font-mono text-[10px] uppercase">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{currentSlide.service.deliveryTime}</span>
          </div>
        </div>

        {/* Flechas de navegación (Anterior / Siguiente) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-stone-200 hover:text-white border border-stone-700/80 backdrop-blur-md transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-md"
          aria-label="Servicio anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-stone-200 hover:text-white border border-stone-700/80 backdrop-blur-md transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-md"
          aria-label="Servicio siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Contenido inferior de la slide actual */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-7 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-amber-400 block">
                  Destacado V.A.C.
                </span>
                <span className="text-stone-500 text-xs">·</span>
                <span className="font-serif italic text-xs text-amber-200/90 tracking-wide">
                  Historias que inspiran
                </span>
              </div>
              <h3 className="font-extrabold text-white text-xl sm:text-2xl md:text-3xl tracking-tight leading-tight">
                {currentSlide.service.title}
              </h3>
              <p className="text-xs text-stone-300 font-normal line-clamp-1 hidden sm:block">
                {currentSlide.service.subtitle}
              </p>
            </div>

            {/* Precio & CTA "Ver paquetes" */}
            <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
              {currentSlide.minPrice !== null && (
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-space uppercase tracking-wider text-stone-400 block">
                    Desde
                  </span>
                  <span className="text-lg sm:text-xl font-bold font-space text-amber-300">
                    S/ {currentSlide.minPrice}
                  </span>
                </div>
              )}

              <button
                onClick={() => onSelectService(currentSlide.service)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-space text-xs uppercase tracking-wider rounded-full transition-all shadow-md shadow-amber-500/20 cursor-pointer inline-flex items-center gap-1.5 hover:gap-2.5"
              >
                <span>Ver paquetes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Indicadores de posición (Dots) */}
          <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-white/10">
            {slides.map((slide, index) => (
              <button
                key={slide.service.id}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  index === currentIndex
                    ? "w-7 bg-amber-400"
                    : "w-2 bg-stone-600 hover:bg-stone-400"
                }`}
                aria-label={`Ir al servicio ${slide.service.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
