/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Project, ProjectType } from "../types";
import { 
  FileText, 
  Copy, 
  Check, 
  Share2, 
  Printer, 
  Phone,
  Calendar,
  MapPin,
  Heart,
  Palette,
  Briefcase,
  CheckCircle,
  ExternalLink,
  Folder
} from "lucide-react";

interface ProjectSummaryProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectSummary({
  project,
  onClose
}: ProjectSummaryProps) {
  
  const [copied, setCopied] = useState<boolean>(false);

  // Compile a beautiful whatsapp / clip summary
  const compileTextSummary = () => {
    const { type, clientName, clientPhone, clientEmail, id } = project;
    let header = `*RESUMEN PROFESIONAL DE PROYECTO - V.A.C. CREATIVE*\n----------------------------------------\n`;
    header += `*ID Proyecto:* ${id}\n`;
    header += `*Cliente:* ${clientName}\n`;
    header += `*Teléfono:* ${clientPhone}\n`;
    header += `*Email:* ${clientEmail}\n`;
    header += `*Servicio:* ${type}\n`;
    if (project.packageName) header += `*Paquete:* ${project.packageName}\n`;
    if (project.serviceVariant) header += `*Variante:* ${project.serviceVariant}\n`;
    if (project.totalPrice) header += `*Inversión Total:* S/ ${project.totalPrice}\n`;
    header += `\n`;

    let details = "";
    if (type === ProjectType.BODA && project.weddingDetails) {
      const w = project.weddingDetails;
      details += `*💖 DETALLES DE LA BODA*\n`;
      details += `- Novia: ${w.noviaName}\n`;
      details += `- Novio: ${w.novioName}\n`;
      details += `- Fecha: ${w.fecha}\n`;
      details += `- Hora: ${w.hora}\n`;
      details += `- Frase: "${w.fraseEspecial}"\n\n`;
      
      details += `*⛪ CEREMONIA*\n`;
      details += `- Lugar: ${w.ceremoniaIglesia}\n`;
      details += `- Dirección: ${w.ceremoniaDireccion}\n`;
      details += `- Maps: ${w.ceremoniaMapsUrl}\n\n`;
      
      details += `*🎉 RECEPCIÓN*\n`;
      details += `- Lugar: ${w.recepcionLocal}\n`;
      details += `- Dirección: ${w.recepcionDireccion}\n`;
      details += `- Maps: ${w.recepcionMapsUrl}\n\n`;
      
      details += `*📞 CONFIRMACIÓN Y CONTACTO*\n`;
      details += `- WhatsApp: ${w.confirmacionWhatsapp}\n`;
      details += `- Fecha Límite: ${w.confirmacionFechaLimite}\n\n`;
      
      details += `*🎨 ESTILO & DISEÑO*\n`;
      details += `- Paleta de Colores: ${w.colorPalette} ${w.colorPaleteCustomValue ? `(${w.colorPaleteCustomValue})` : ''}\n`;
      details += `- Estilo Visual: ${w.visualStyle}\n`;
      details += `- Música de fondo: ${w.multimediaMusicaNombre || 'No especificada'}\n`;
      details += `- Video YouTube: ${w.youtubeUrl || 'No especificado'}\n\n`;

      const activeExtras = Object.entries(w.extras)
        .filter(([_, val]) => val)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
        .join(", ");
      details += `*✨ CARACTERÍSTICAS EXTRAS*\n`;
      details += `- Extras solicitados: ${activeExtras || 'Ninguno'}\n`;

    } else if (type === ProjectType.XV_ANOS && project.xvDetails) {
      const x = project.xvDetails;
      details += `*👑 DETALLES DE 15 AÑOS*\n`;
      details += `- Quinceañera: ${x.quinceaneraName}\n`;
      details += `- Fecha: ${x.fecha}\n`;
      details += `- Hora: ${x.hora}\n`;
      details += `- Lugar: ${x.lugar}\n`;
      details += `- Maps: ${x.mapsUrl}\n`;
      details += `- Música: ${x.musicaNombre}\n`;
      details += `- Temática del evento: ${x.tematica}\n`;
      details += `- Paleta de Colores: ${x.colorPalette}\n`;
      details += `- WhatsApp Confirmación: ${x.confirmacionWhatsapp}\n`;
      details += `- Cuenta Regresiva: ${x.cuentaRegresiva ? "Sí" : "No"}\n`;
      details += `- Galería Fotos habilitada: ${x.galleryEnabled ? "Sí" : "No"}\n\n`;
      
      const activeExtras = Object.entries(x.extras)
        .filter(([_, val]) => val)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
        .join(", ");
      details += `*✨ EXTRAS SELECCIONADOS*\n`;
      details += `- Extras: ${activeExtras || 'Ninguno'}\n`;

    } else if (type === ProjectType.CARTA_DIGITAL && project.menuDetails) {
      const m = project.menuDetails;
      details += `*🍔 DETALLES DE CARTA DIGITAL*\n`;
      details += `- Nombre del Negocio: ${m.businessName}\n`;
      details += `- Dirección: ${m.address}\n`;
      details += `- WhatsApp Pedidos: ${m.whatsapp}\n`;
      details += `- Tema del Menú: ${m.designTheme}\n\n`;
      
      details += `*PRODUCTS REGISTRADOS:* (${m.items.length})\n`;
      m.items.forEach((item, index) => {
        details += ` ${index + 1}. [${item.category}] ${item.name} - $${item.price}\n    Desc: ${item.description}\n`;
      });
    } else {
      const o = project.otherDetails;
      details += `*📋 DETALLES GENERALES*\n`;
      details += `- Descripción del Proyecto: ${o?.description || project.generalNotes || 'No especificada'}\n`;
      details += `- Requerimientos: ${o?.requirements || 'No especificados'}\n`;
      details += `- Paleta de Colores: ${o?.colorPalette || 'No especificada'}\n`;
      details += `- Archivos o Fotografías: ${o?.attachmentsInfo || 'Ninguno especificado'}\n`;
    }

    details += `\n----------------------------------------\n*V.A.C. Creative Studio • Gestión Automatizada*`;
    return header + details;
  };

  const handleCopy = async () => {
    try {
      const text = compileTextSummary();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("No se pudo copiar el texto del resumen", err);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(compileTextSummary());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handlePrint = () => {
    // Elegant browser print trigger
    window.print();
  };

  return (
    <div id="project-summary-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header (No print) */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-850 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center text-white">
              <FileText className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white font-space">
                Resumen Profesional de Pedido
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Ficha técnica estructurada y lista para entregar al equipo de diseño.
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cerrar
          </button>
        </div>

        {/* Action Buttons (No print) */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-850 flex flex-wrap gap-2.5 items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied 
                  ? "bg-green-650 text-white" 
                  : "bg-white hover:bg-zinc-150 border border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:text-zinc-300 dark:border-zinc-800"
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "¡Copiado al Portapapeles!" : "Copiar Resumen Texto"}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-emerald-950/15 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-50" />
              Compartir WhatsApp
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar PDF
          </button>
        </div>

        {/* Printable/Scrollable Layout Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white dark:bg-zinc-920" id="print-area">
          {/* Brief Logo */}
          <div className="flex justify-between items-start gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="font-mono text-xs text-zinc-400">FICHA TÉCNICA DE RECOPILACIÓN AUTOMÁTICA</span>
              <h3 className="text-xl font-bold font-space text-zinc-900 dark:text-white mt-1">
                {project.type}
              </h3>
              {(project.packageName || project.packageId || project.totalPrice) && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold font-space px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400">
                    Paquete: {project.packageName || (project.packageId ? project.packageId.toUpperCase() : "Paquete no definido")}
                  </span>
                  {project.serviceVariant && (
                    <span className="text-xs text-zinc-500">
                      • {project.serviceVariant}
                    </span>
                  )}
                  {project.totalPrice && (
                    <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      • Inversión: S/ {project.totalPrice}
                    </span>
                  )}
                </div>
              )}
              <p className="text-xs text-zinc-500 mt-1 uppercase font-mono">
                Orden ID: {project.id} • Creada el {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-sm font-black tracking-wider text-amber-500 block font-space">
                V.A.C. CREATIVE
              </span>
              <span className="text-[10px] text-zinc-400">STUDIO GESTIÓN</span>
            </div>
          </div>

          {/* Client contact section */}
          <div className="mt-6">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 font-mono">DATOS DEL CLIENTE</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-150 dark:border-zinc-850/80">
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-mono">Nombre</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{project.clientName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-mono">Teléfono de contacto</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{project.clientPhone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-mono">E-mail registrado</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate block">{project.clientEmail}</span>
              </div>
            </div>
          </div>

          {/* Google Drive Folder Banner (if available) */}
          {project.driveFolderUrl && (
            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Folder className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold font-space uppercase block">Carpeta de Google Drive</span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">Archivos, referencias y entregables vinculados</span>
                </div>
              </div>
              <a
                href={project.driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-space uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Abrir Carpeta</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Dynamic Details block */}
          <div className="mt-8">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 font-mono">INFORMACIÓN DEL EVENTO</h4>
            
            {/* 1. Wedding Details */}
            {project.type === ProjectType.BODA && project.weddingDetails && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/10 dark:border-rose-900/20 dark:bg-zinc-950/25 space-y-1">
                    <span className="text-[10px] text-rose-500 uppercase font-mono font-bold">La Novia</span>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">{project.weddingDetails.noviaName}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/10 dark:border-rose-900/20 dark:bg-zinc-950/25 space-y-1">
                    <span className="text-[10px] text-rose-500 uppercase font-mono font-bold">El Novio</span>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">{project.weddingDetails.novioName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Fecha</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{project.weddingDetails.fecha}</span>
                  </div>
                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Hora</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{project.weddingDetails.hora}</span>
                  </div>
                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">WhatsApp Invitados</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{project.weddingDetails.confirmacionWhatsapp}</span>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-155 dark:border-zinc-800 rounded-xl italic">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block not-italic font-bold">Frase Especial/Verso</span>
                  "{project.weddingDetails.fraseEspecial}"
                </div>

                {/* Ceremonias & Localidades */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-zinc-150 dark:border-zinc-800 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-bold text-zinc-400 font-mono">⛪ DETALLES DE CEREMONIA</span>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-1">{project.weddingDetails.ceremoniaIglesia}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">📍 {project.weddingDetails.ceremoniaDireccion}</p>
                    {project.weddingDetails.ceremoniaMapsUrl && (
                      <a href={project.weddingDetails.ceremoniaMapsUrl} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline text-xs flex items-center gap-1 mt-1 font-medium">
                        Ver ubicación en Google Maps <ExternalLink className="w-3" />
                      </a>
                    )}
                  </div>

                  <div className="border border-zinc-150 dark:border-zinc-800 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-bold text-zinc-400 font-mono">🎉 DETALLES DE RECEPCIÓN</span>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-1">{project.weddingDetails.recepcionLocal}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">📍 {project.weddingDetails.recepcionDireccion}</p>
                    {project.weddingDetails.recepcionMapsUrl && (
                      <a href={project.weddingDetails.recepcionMapsUrl} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline text-xs flex items-center gap-1 mt-1 font-medium">
                        Ver ubicación en Google Maps <ExternalLink className="w-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Palette y Estilo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Paleta de Colores</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block mt-1">🎨 {project.weddingDetails.colorPalette}</span>
                    {project.weddingDetails.colorPaleteCustomValue && (
                      <span className="text-xs text-zinc-500">Valor: {project.weddingDetails.colorPaleteCustomValue}</span>
                    )}
                  </div>

                  <div className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Estilo Visual</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block mt-1">✨ {project.weddingDetails.visualStyle}</span>
                  </div>

                  <div className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Música Solicitada</span>
                    <span className="text-sm font-semibold text-zinc-850 dark:text-zinc-300 block mt-1 truncate">🎵 {project.weddingDetails.multimediaMusicaNombre || "No registrada"}</span>
                  </div>
                </div>

                {/* Extras seleccionados */}
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold block mb-2">EXTRAS ADICIONALES CONTRATADOS</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {Object.entries(project.weddingDetails.extras).map(([key, val]) => (
                      <div 
                        key={key} 
                        className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                          val 
                            ? "border-amber-200 bg-amber-500/5 text-amber-900 dark:border-amber-900/30 dark:text-amber-300" 
                            : "border-zinc-100 bg-zinc-50/50 text-zinc-400 dark:border-zinc-850 dark:bg-zinc-950/20"
                        }`}
                      >
                        <CheckCircle className={`w-3.5 h-3.5 ${val ? "text-amber-500" : "text-zinc-300 dark:text-zinc-800"}`} />
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. 15 years Details */}
            {project.type === ProjectType.XV_ANOS && project.xvDetails && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">La Quinceañera</span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">👑 {project.xvDetails.quinceaneraName}</span>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Temática Elegida</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">✨ {project.xvDetails.tematica}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Fecha del Evento</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{project.xvDetails.fecha}</span>
                  </div>
                  <div className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Hora</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{project.xvDetails.hora}</span>
                  </div>
                  <div className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Lugar / Salón</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate block">{project.xvDetails.lugar}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Paleta de Colores</span>
                    <span className="text-sm font-semibold text-zinc-805 dark:text-zinc-350 block">🎨 {project.xvDetails.colorPalette}</span>
                  </div>
                  <div className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Música de fondo</span>
                    <span className="text-sm font-semibold text-zinc-805 dark:text-zinc-350 block truncate">🎵 {project.xvDetails.musicaNombre || "No registrada"}</span>
                  </div>
                  <div className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Confirmación Whatsapp</span>
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block">{project.xvDetails.confirmacionWhatsapp}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border rounded-xl flex items-center justify-between text-xs text-zinc-500">
                    <span>Cuenta Regresiva Activa:</span>
                    <span className="font-bold">{project.xvDetails.cuentaRegresiva ? "Sí" : "No"}</span>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border rounded-xl flex items-center justify-between text-xs text-zinc-500">
                    <span>Galería de fotos:</span>
                    <span className="font-bold">{project.xvDetails.galleryEnabled ? "Sí" : "No"}</span>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border rounded-xl flex items-center justify-between text-xs text-zinc-500">
                    <span>Video interactivo:</span>
                    <span className="font-bold">{project.xvDetails.videoEnabled ? "Sí" : "No"}</span>
                  </div>
                </div>

                {project.xvDetails.videoUrl && (
                  <div className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl text-xs text-zinc-500 truncate">
                    <span className="text-[10px] uppercase font-mono block">Video link</span>
                    📹 {project.xvDetails.videoUrl}
                  </div>
                )}
              </div>
            )}

            {/* 3. Digital Menu / Carta Details */}
            {project.type === ProjectType.CARTA_DIGITAL && project.menuDetails && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Nombre Comercial del Negocio</span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">🍔 {project.menuDetails.businessName}</span>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Concepto / Estilo de Diseño</span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">🍽️ {project.menuDetails.designTheme}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Dirección Física</span>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block truncate">{project.menuDetails.address}</span>
                  </div>
                  <div className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">WhatsApp de Pedidos</span>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">{project.menuDetails.whatsapp}</span>
                  </div>
                  <div className="p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Redes Sociales</span>
                    <span className="text-xs text-zinc-500 block">
                      IG: {project.menuDetails.instagramUrl ? "Sí" : "No"} | FB: {project.menuDetails.facebookUrl ? "Sí" : "No"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-zinc-100 pb-1.5">
                    <span className="text-xs font-bold text-zinc-400 uppercase font-mono">PRODUCTOS REGISTRADOS ({project.menuDetails.items.length})</span>
                    <span className="text-xs text-zinc-400">Total de categorías activas</span>
                  </div>
                  
                  <div className="space-y-2.5">
                    {project.menuDetails.items.length === 0 ? (
                      <p className="text-xs italic text-zinc-500">Ningún producto registrado en el menú todavía.</p>
                    ) : (
                      project.menuDetails.items.map((item) => (
                        <div key={item.id} className="p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-150 dark:border-zinc-850 rounded-xl flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                {item.category}
                              </span>
                              <h5 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{item.name}</h5>
                            </div>
                            <p className="text-xs text-zinc-500 leading-normal">{item.description}</p>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">S/ {item.price}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Other Details */}
            {project.type !== ProjectType.BODA && project.type !== ProjectType.XV_ANOS && project.type !== ProjectType.CARTA_DIGITAL && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block mb-1">Descripción General del Pedido</span>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-800 rounded-xl text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                    {project.otherDetails?.description || project.generalNotes || "No se ha ingresado descripción."}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Requerimientos Técnicos</span>
                    <p className="text-xs text-zinc-650 dark:text-zinc-350 whitespace-pre-wrap">{project.otherDetails?.requirements || "No especificados."}</p>
                  </div>

                  <div className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-405 uppercase font-mono block">Preferencias de Paleta / Estilo</span>
                    <p className="text-xs text-zinc-650 dark:text-zinc-100 font-bold">🎨 {project.otherDetails?.colorPalette || "No especificada."}</p>
                  </div>
                </div>

                {project.otherDetails?.attachmentsInfo && (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 rounded-xl">
                    <span className="text-[10.5px] uppercase text-zinc-400 font-mono block mb-1">Archivos Adjuntos o Enlaces de Referencia</span>
                    <p className="text-xs text-zinc-650 font-mono break-all">{project.otherDetails.attachmentsInfo}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-[10px] text-zinc-400 uppercase font-mono">
            SISTEMA DE GESTIÓN V.A.C. CREATIVE • REDUCE UN 80% EL TIEMPO DE CAPTURA DE CLIENTES
          </div>
        </div>

      </div>
    </div>
  );
}
