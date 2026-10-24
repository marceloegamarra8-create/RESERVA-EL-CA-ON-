/**
 * @file src/components/PWAInstallButton.tsx
 * @description Botón para instalar la PWA en el celular o computadora.
 */

import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Si ya está instalada en modo standalone, no mostrar el botón
  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">PWA Instalada</span>
        <span className="sm:hidden">Instalada</span>
      </div>
    );
  }

  // Flujo Android / Chrome / Edge
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
        title="Instalar como aplicación en el celular"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>
    );
  }

  // Flujo iOS Safari
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 border border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100 text-xs font-medium px-2.5 py-1.5 rounded-lg transition"
          title="Instalar en iPhone"
        >
          <Smartphone className="w-3.5 h-3.5 text-sky-600" />
          <span>Instalar en iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-sky-600" />
                  <h3 className="text-base font-bold text-slate-800">
                    Instalar en tu iPhone / iPad
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <p>
                    Toca el botón <strong>Compartir</strong> (ícono de cuadro con flecha hacia arriba) en la barra inferior de Safari.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <p>
                    Desliza hacia abajo y selecciona <strong>"Agregar a inicio"</strong> (o <em>"Add to Home Screen"</em>).
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <p>
                    Toca <strong>"Agregar"</strong> en la esquina superior derecha. ¡Listo! Tendrás el acceso directo con el icono de la escuela.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 shadow-sm transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
