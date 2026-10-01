/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Project } from "../types";
import { compilePromptsForProject, CompiledPrompts } from "../utils/promptGenerators";
import { 
  Sparkles, 
  Copy, 
  Check, 
  HelpCircle, 
  Brain,
  Code,
  Compass,
  ArrowRight
} from "lucide-react";

interface AIPromptGeneratorProps {
  project: Project;
  onClose: () => void;
}

export default function AIPromptGenerator({
  project,
  onClose
}: AIPromptGeneratorProps) {
  
  const [prompts, setPrompts] = useState<CompiledPrompts | null>(null);
  const [activeTab, setActiveTab] = useState<keyof CompiledPrompts>("aiStudio");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (project) {
      const compiled = compilePromptsForProject(project);
      setPrompts(compiled);
    }
  }, [project]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      console.error("No se pudo copiar el texto", err);
    }
  };

  if (!project || !prompts) return null;

  const tabLabels: Record<keyof CompiledPrompts, { name: string; description: string; color: string }> = {
    aiStudio: {
      name: "Google AI Studio",
      description: "Optimizado para System Instructions y API tuning del SDK de Gemini.",
      color: "border-blue-500 text-blue-650 dark:text-blue-400 bg-blue-50/20"
    },
    gemini: {
      name: "Gemini",
      description: "Diseñado para conversaciones libres de maquetación y sugerencias creativas.",
      color: "border-indigo-500 text-indigo-650 dark:text-indigo-400 bg-indigo-50/20"
    },
    claude: {
      name: "Claude 3.5 Sonnet",
      description: "Optimizado usando XML tags para maximizar la calidad del código React y la precisión visual.",
      color: "border-orange-500 text-orange-650 dark:text-orange-400 bg-orange-50/20"
    },
    chatGpt: {
      name: "ChatGPT (GPT-4)",
      description: "Formateado para generación rápida de prototipos interactivos y layouts CSS Tailwind.",
      color: "border-emerald-500 text-emerald-650 dark:text-emerald-400 bg-emerald-50/20"
    },
    lovable: {
      name: "Lovable.dev",
      description: "Listo para dictar a Lovable e implementar instantáneamente un módulo en la nube.",
      color: "border-fuchsia-500 text-fuchsia-650 dark:text-fuchsia-400 bg-fuchsia-50/20"
    }
  };

  const getActiveTabContent = () => {
    switch (activeTab) {
      case "aiStudio": return prompts.aiStudio;
      case "gemini": return prompts.gemini;
      case "claude": return prompts.claude;
      case "chatGpt": return prompts.chatGpt;
      case "lovable": return prompts.lovable;
      default: return "";
    }
  };

  return (
    <div id="ai-prompt-generator-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header bar */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-550 border border-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-spin-slow text-indigo-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-space flex items-center gap-2">
                Generador de Prompts IA Inteligente
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Información estructurada para que la IA programe e implemente la invitación en segundos.
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

        {/* Client & Service context block */}
        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 border-b border-zinc-150 dark:border-zinc-850 flex flex-wrap gap-4 items-center justify-between text-xs text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Cliente:</span> {project.clientName}
          </div>
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Servicio solicitado:</span> {project.type}
          </div>
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Formulario ID:</span> <code className="font-mono bg-zinc-150 dark:bg-zinc-900 px-1 py-0.5 rounded text-amber-600 dark:text-amber-400">{project.id}</code>
          </div>
        </div>

        {/* Tabs sidebar & code contents layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* Tab Selector Column */}
          <div className="w-full md:w-64 bg-zinc-50/30 dark:bg-zinc-950/20 border-r border-zinc-100 dark:border-zinc-800 p-3 space-y-1.5 overflow-y-auto shrink-0">
            <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold px-2 block mb-2">Plataformas de IA</span>
            {Object.keys(tabLabels).map((key) => {
              const itemKey = key as keyof CompiledPrompts;
              const meta = tabLabels[itemKey];
              const isSelected = activeTab === itemKey;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(itemKey);
                    setCopied(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col gap-1 cursor-pointer ${
                    isSelected 
                      ? "bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 shadow-xs" 
                      : "border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-850/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{meta.name}</span>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </div>
                  <span className="text-[10px] text-zinc-400 leading-normal">{meta.description}</span>
                </button>
              );
            })}

            <div className="mt-6 p-3 bg-amber-50/40 dark:bg-amber-955/20 border border-amber-500/15 rounded-lg text-[11px] text-amber-800 dark:text-amber-400 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 shrink-0" /> ¿Cómo usar esto?
              </p>
              <p className="leading-relaxed">
                Copia este prompt y pégalo directamente en tu herramienta de IA generadora favorita. La IA estructurará el código sin omitir ninguna variable.
              </p>
            </div>
          </div>

          {/* Prompt Viewer Panel */}
          <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-300 overflow-hidden relative">
            {/* Copy Row action bar */}
            <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400 shrink-0">
              <span className="font-mono text-[11px] text-zinc-500 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-zinc-500" /> PROMPT_PROSTYLING_PARAMS
              </span>
              
              <button
                onClick={() => handleCopy(getActiveTabContent())}
                id="btn-copy-prompt-ai"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  copied 
                    ? "bg-green-600 text-white shadow-md shadow-green-900/20" 
                    : "bg-white hover:bg-zinc-100 text-zinc-900"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-650" />
                    <span>Copiar Prompt Inteligente</span>
                  </>
                )}
              </button>
            </div>

            {/* Code presentation output */}
            <div className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed max-w-full">
              <pre className="whitespace-pre-wrap select-all selection:bg-amber-500/30">
                {getActiveTabContent()}
              </pre>
            </div>
          </div>

        </div>

        {/* Bottom bar of prompt tool */}
        <div className="p-4 border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-between items-center gap-4 text-xs font-medium shrink-0">
          <span className="text-zinc-500 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            V.A.C. AI Prompt Compiler V2.4 • Listo para desplegar
          </span>

          <button
            onClick={() => handleCopy(getActiveTabContent())}
            className="text-zinc-800 dark:text-zinc-200 hover:underline flex items-center gap-1"
          >
            Copiar actual y continuar <ArrowRight className="w-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
