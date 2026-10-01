/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Project, 
  ProjectType, 
  ProjectStatus 
} from "../types";
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  Trash2, 
  Edit, 
  Phone, 
  Mail, 
  Heart, 
  Palette, 
  CheckCircle, 
  FileText, 
  Clock, 
  ExternalLink, 
  Utensils,
  MessageCircle,
  X
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onViewSummary: (project: Project) => void;
  onGeneratePrompts: (project: Project) => void;
  onStatusChange: (id: string, newStatus: ProjectStatus) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onViewSummary,
  onGeneratePrompts,
  onStatusChange
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { id, clientName, clientPhone, clientEmail, type, status, createdAt } = project;

  const handleNotifyClientWhatsApp = () => {
    const cleanPhone = clientPhone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `¡Hola ${clientName}! 👋 Te saludamos de *V.A.C. Creative Atelier*.\n\nTe informamos que tu proyecto de *${type}* (ID: ${id}) actualmente se encuentra en estado: *${status}*.\n\nPuedes consultar el avance en nuestra plataforma en cualquier momento. ¡Seguimos trabajando con excelencia!`
    );
    const targetUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="group relative bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800/90 rounded-3xl p-6 shadow-sm transition-all hover:shadow-xl hover:border-amber-500/40 space-y-5">
      
      {/* Top Row: Type kicker & Status selector */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
          {type}
        </span>

        {/* Change status action */}
        <select
          value={status}
          onChange={(e) => onStatusChange(id, e.target.value as ProjectStatus)}
          className="text-xs font-space font-semibold px-3 py-1 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
        >
          {Object.values(ProjectStatus).map((state) => (
            <option key={state} value={state} className="bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100">
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Client main details */}
      <div className="space-y-1.5">
        <h3 className="font-serif font-bold text-stone-950 dark:text-stone-50 text-2xl tracking-tight leading-tight group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
          {clientName}
        </h3>
        <div className="flex flex-col gap-1 text-xs text-stone-500 dark:text-stone-400 font-light">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{clientPhone || "Sin teléfono"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-stone-400" />
            <span className="truncate max-w-[220px]">{clientEmail || "Sin email"}</span>
          </div>
        </div>
      </div>

      {/* Tracking Code badge */}
      {project.trackingCode && (
        <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-2 rounded-xl text-xs font-mono">
          <div className="truncate pr-2">
            <span className="text-[10px] text-stone-400 block uppercase font-space">Código de Seguimiento</span>
            <span className="text-amber-700 dark:text-amber-400 font-bold">{project.trackingCode}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(project.trackingCode!);
              alert("¡Código de seguimiento copiado al portapapeles!");
            }}
            className="px-2.5 py-1 bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950 rounded-lg text-[10px] font-bold font-space uppercase cursor-pointer shrink-0"
          >
            Copiar
          </button>
        </div>
      )}

      {/* Event description summary */}
      <div className="pt-2 text-xs">
        {project.type === ProjectType.BODA && project.weddingDetails && (
          <div className="space-y-1.5 text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-800/50">
            <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
              Novios: <span className="font-normal italic">{project.weddingDetails.novioName} & {project.weddingDetails.noviaName}</span>
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              ⛪ {project.weddingDetails.ceremoniaIglesia} · 📅 {project.weddingDetails.fecha}
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-amber-700 dark:text-amber-400 font-mono pt-1">
              <span>Paleta: {project.weddingDetails.colorPalette}</span>
              <span>·</span>
              <span>Estilo: {project.weddingDetails.visualStyle}</span>
            </div>
          </div>
        )}

        {project.type === ProjectType.XV_ANOS && project.xvDetails && (
          <div className="space-y-1.5 text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-800/50">
            <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
              Quinceañera: <span className="font-normal italic">{project.xvDetails.quinceaneraName}</span>
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              👑 {project.xvDetails.tematica} · 📅 {project.xvDetails.fecha}
            </p>
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
              Salón: {project.xvDetails.lugar}
            </p>
          </div>
        )}

        {project.type === ProjectType.CARTA_DIGITAL && project.menuDetails && (
          <div className="space-y-1.5 text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-800/50">
            <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
              Negocio: <span className="font-normal italic">{project.menuDetails.businessName}</span>
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
              📍 {project.menuDetails.address}
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-amber-700 dark:text-amber-400 font-mono pt-1">
              <span>{project.menuDetails.items.length} Platillos</span>
              <span>·</span>
              <span>Tema: {project.menuDetails.designTheme}</span>
            </div>
          </div>
        )}

        {!project.weddingDetails && !project.xvDetails && !project.menuDetails && (
          <div className="bg-stone-50 dark:bg-stone-900/40 p-3.5 rounded-2xl text-stone-500 text-[11px] italic min-h-[60px] flex items-center justify-center border border-stone-100 dark:border-stone-800/40 font-light">
            {project.generalNotes || project.otherDetails?.description || "Sin descripción adicional de formulario."}
          </div>
        )}
      </div>

      {/* Footer Details: Date and Action Buttons */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
        <span className="text-[10px] uppercase font-mono tracking-wider">
          {formatDate(createdAt)}
        </span>

        <div className="flex items-center gap-1.5">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 p-1 rounded-xl border border-red-200 dark:border-red-900/50">
              <span className="text-[10px] text-red-700 dark:text-red-300 font-bold px-1">¿Eliminar?</span>
              <button
                onClick={() => {
                  onDelete(id);
                  setConfirmDelete(false);
                }}
                className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
              >
                Sí
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-1.5 py-0.5 text-stone-500 hover:text-stone-700 dark:text-stone-400 rounded text-[10px] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <>
              {/* WhatsApp notification shortcut */}
              <button
                onClick={handleNotifyClientWhatsApp}
                title="Notificar Estado al Cliente por WhatsApp"
                className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              {/* View Summary / Brief Card */}
              <button
                onClick={() => onViewSummary(project)}
                title="Ver Resumen de Pedido"
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
              </button>

              {/* AI Prompts block */}
              <button
                onClick={() => onGeneratePrompts(project)}
                title="Generar Prompts IA"
                className="p-1.5 px-2.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1 text-[11px] font-space font-bold cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Prompt</span>
              </button>

              {/* Edit */}
              <button
                onClick={() => onEdit(project)}
                title="Editar Pedido"
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <Edit className="w-4 h-4" />
              </button>

              {/* Delete trigger */}
              <button
                onClick={() => setConfirmDelete(true)}
                title="Eliminar Proyecto"
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
