/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lock, Eye, EyeOff, X, KeyRound, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import { verifyAdminCredentials } from "../firebase";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  onLoginSuccess
}: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Introduce tu usuario y contraseña de administrador.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const isValid = await verifyAdminCredentials(username, password);
      if (isValid) {
        sessionStorage.setItem("vac_admin_logged", "true");
        localStorage.setItem("vac_admin_user", username.trim());
        onLoginSuccess();
        onClose();
      } else {
        setErrorMsg("Credenciales no válidas. Verifica usuario y contraseña.");
      }
    } catch {
      setErrorMsg("Error al conectar con el servidor de autenticación.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("Vlad01");
    setPassword("Dis321");
    setErrorMsg("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-[#FAF9F5] dark:bg-[#121110] text-stone-900 dark:text-stone-100 rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Subtle decorative gold top bar */}
        <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-space font-semibold text-amber-700 dark:text-amber-400 block pt-1">
              Acceso Restringido · Firebase
            </span>
            <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-50 tracking-tight">
              Consola de Dirección
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-light">
              Ingresa las credenciales autorizadas del estudio para gestionar proyectos, briefs y base de datos.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-space font-medium text-stone-700 dark:text-stone-300">
                Usuario Maestro
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. Vlad01"
                className="w-full px-4 py-2.5 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-space font-medium text-stone-700 dark:text-stone-300">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-2.5 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 rounded-xl text-xs font-bold font-space uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isLoading ? "Verificando en Firebase..." : "Ingresar a la Consola"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Helper */}
          <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800/80 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-mono inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Autocompletar acceso maestro (Vlad01 / Dis321)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
