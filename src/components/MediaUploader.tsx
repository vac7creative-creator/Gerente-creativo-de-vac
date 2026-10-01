/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Upload, X, File, Image, Film, Music, Link, Check, AlertCircle } from "lucide-react";
import { ProjectMediaFile, ProjectType } from "../types";

interface MediaUploaderProps {
  serviceType: ProjectType;
  files: ProjectMediaFile[];
  onChangeFiles: (files: ProjectMediaFile[]) => void;
  googleDriveUrl: string;
  onChangeGoogleDriveUrl: (url: string) => void;
}

export function getMediaSectionTitle(type: ProjectType): string {
  switch (type) {
    case ProjectType.BODA:
      return "Fotografías de los novios y material de la invitación";
    case ProjectType.XV_ANOS:
      return "Fotografías de la quinceañera";
    case ProjectType.DISENO_GRAFICO:
      return "Logotipo actual, referencias y material de marca";
    case ProjectType.SPOT:
      return "Guion, audios y referencias";
    case ProjectType.FOTO_VIDEO:
      return "Videos, audios, fotografías y material audiovisual";
    case ProjectType.CARTA_DIGITAL:
      return "Logo, fotografías de productos y carta actual";
    case ProjectType.CUMPLEANOS:
      return "Fotografías del festejado y referencias";
    case ProjectType.LANDING_PAGE:
      return "Manual de marca, logotipo y contenido de la web";
    default:
      return "Fotografías y material del proyecto";
  }
}

export default function MediaUploader({
  serviceType,
  files,
  onChangeFiles,
  googleDriveUrl,
  onChangeGoogleDriveUrl
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sectionTitle = getMediaSectionTitle(serviceType);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setUploadError("");

    const newMediaItems: ProjectMediaFile[] = [];

    Array.from(incomingFiles).forEach((file) => {
      // 25MB max per client-side file
      if (file.size > 25 * 1024 * 1024) {
        setUploadError(`El archivo "${file.name}" supera los 25MB. Puedes usar el enlace a Google Drive para archivos de gran tamaño.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const mediaFile: ProjectMediaFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: result || ""
        };
        onChangeFiles([...files, mediaFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    onChangeFiles(files.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type?: string) => {
    if (!type) return <File className="w-5 h-5 text-stone-400" />;
    if (type.startsWith("image/")) return <Image className="w-5 h-5 text-amber-500" />;
    if (type.startsWith("video/")) return <Film className="w-5 h-5 text-purple-500" />;
    if (type.startsWith("audio/")) return <Music className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-stone-400" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-px bg-amber-500" />
          <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
            {sectionTitle}
          </h3>
        </div>
        <span className="text-xs font-mono text-stone-500">
          {files.length} {files.length === 1 ? "archivo" : "archivos"}
        </span>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* DRAG & DROP ZONE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-amber-500 bg-amber-500/10 scale-[0.99]"
            : "border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 hover:border-amber-400 dark:hover:border-amber-500/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-space font-bold text-stone-900 dark:text-stone-100">
          Arrastra y suelta tus archivos aquí
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          o haz clic para explorar en tu dispositivo (imágenes, audios, documentos o videos)
        </p>
      </div>

      {/* THUMBNAILS & UPLOADED FILES LIST */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {files.map((file) => {
            const isImage = file.type?.startsWith("image/") || file.url.startsWith("data:image/");
            return (
              <div
                key={file.id}
                className="relative group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-2 flex flex-col justify-between shadow-xs overflow-hidden"
              >
                <div className="w-full h-24 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 flex items-center justify-center relative">
                  {isImage ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getFileIcon(file.type)
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-stone-950/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    title="Eliminar archivo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="pt-2 px-1">
                  <p className="text-xs font-medium text-stone-800 dark:text-stone-200 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <span className="text-[10px] text-stone-400 font-mono block">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GOOGLE DRIVE FOLDER OPTIONAL INPUT */}
      <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
            Tengo una carpeta de Google Drive o Dropbox (Opcional)
          </label>
        </div>
        <input
          type="url"
          value={googleDriveUrl}
          onChange={(e) => onChangeGoogleDriveUrl(e.target.value)}
          placeholder="https://drive.google.com/drive/folders/..."
          className="w-full h-11 px-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-mono text-stone-900 dark:text-stone-100 focus:ring-1 focus:ring-amber-500 focus:outline-none"
        />
        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
          Si tienes videos en alta resolución, clips pesados o carpetas organizadas, pega el enlace con permisos de lectura.
        </p>
      </div>
    </div>
  );
}
