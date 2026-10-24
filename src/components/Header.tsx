/**
 * @file src/components/Header.tsx
 * @description Encabezado institucional con el logo oficial de la Escuela Dra. Sara Faisal,
 * selector de pestañas mobile-friendly y botón de instalación PWA.
 */

import React from 'react';
import { Calendar, PlusCircle, QrCode, FileSpreadsheet } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab = 'booking' | 'schedule' | 'qr-poster' | 'sheets-config';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  reservationCount: number;
  hasWebhookConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  reservationCount,
  hasWebhookConfigured,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Barra superior institucional */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div
          onClick={() => onTabChange('booking')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo institucional oficial */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-0.5 border-2 border-sky-500 shadow-xs flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src="/assets/aistudio/logo_escuela_png_e439e66e.png"
              alt="Logo Escuela Especial N° 1429 Dra. Sara Faisal"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Escuela Especial N° 1429
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="hidden sm:inline text-xs font-semibold text-slate-500">
                "Dra. Sara Faisal"
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight mt-0.5 flex items-center gap-1.5">
              <span>Reserva de "El Cañón"</span>
              <span className="inline-block text-[11px] font-medium text-slate-500 font-normal">
                (Proyector)
              </span>
            </h1>
          </div>
        </div>

        {/* Acciones del encabezado */}
        <div className="flex items-center gap-2">
          <PWAInstallButton />
        </div>
      </div>

      {/* Navegación por pestañas móvil/escritorio */}
      <div className="max-w-4xl mx-auto px-2 border-t border-slate-100 flex overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 sm:space-x-2 py-1.5 text-xs sm:text-sm font-medium w-full">
          <button
            onClick={() => onTabChange('booking')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'booking'
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Reservar Turno</span>
          </button>

          <button
            onClick={() => onTabChange('schedule')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda del Equipo</span>
            {reservationCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  activeTab === 'schedule'
                    ? 'bg-white/20 text-white'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                {reservationCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('qr-poster')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'qr-poster'
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Cartel con QR</span>
          </button>

          <button
            onClick={() => onTabChange('sheets-config')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap relative ${
              activeTab === 'sheets-config'
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheets</span>
            {!hasWebhookConfigured && (
              <span
                className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2 animate-pulse"
                title="Google Sheets pendiente de conectar"
              />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
