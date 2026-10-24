/**
 * @file src/components/QRPosterModal.tsx
 * @description Cartel institucional imprimible con Código QR para colocar
 * junto al proyector "El Cañón" o en la sala de profesores.
 * Escuela Especial N° 1429 "Dra. Sara Faisal"
 */

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Printer,
  Copy,
  Check,
  Download,
  Smartphone,
  Tv,
  CheckCircle2,
} from 'lucide-react';

interface QRPosterModalProps {
  onBackToBooking: () => void;
}

export const QRPosterModal: React.FC<QRPosterModalProps> = ({ onBackToBooking }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (currentAppUrl) {
      QRCode.toDataURL(currentAppUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0369a1', // Azul institucional
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generando QR:', err));
    }
  }, [currentAppUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Botones de acción superiores */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-sky-600" />
            <span>Cartel con Código QR para Imprimir</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Imprime este cartel y pégalo en el armario o cerca de "El Cañón".
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Enlace</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Cartel</span>
          </button>
        </div>
      </div>

      {/* CARTEL INSTITUCIONAL OFICIAL (A4 / FÁCIL IMPRESIÓN) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-sky-600 shadow-lg text-center space-y-5 print:shadow-none print:border-4 print:border-black print:m-0">
        {/* Cabecera institucional */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-1 border-2 border-sky-600 shadow-xs flex items-center justify-center">
            <img
              src="/assets/aistudio/logo_escuela_png_e439e66e.png"
              alt="Escuela Especial N° 1429 Dra. Sara Faisal"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Escuela Especial Particular Inc. N° 1429
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">
              "Dra. Sara Faisal"
            </h1>
          </div>
        </div>

        {/* Título del cartel */}
        <div className="py-2 px-4 bg-sky-600 text-white rounded-2xl shadow-sm">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-200">
            <Tv className="w-4 h-4" />
            <span>Equipo Audiovisual</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
            RESERVA DE "EL CAÑÓN"
          </h2>
        </div>

        {/* Mensaje de escaneo */}
        <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-md mx-auto">
          ¿Vas a utilizar el proyector? Escanea este código QR con la cámara de tu celular para apartarlo:
        </p>

        {/* Código QR grande */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="p-4 bg-white border-2 border-slate-200 rounded-3xl shadow-sm inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Código QR de Reserva El Cañón"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-2xl">
                <QrCode className="w-16 h-16 text-slate-400 animate-pulse" />
              </div>
            )}
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2">
            {currentAppUrl}
          </p>
        </div>

        {/* 3 Pasos sencillos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-1.5">
              1
            </div>
            <p className="text-xs font-bold text-slate-800">Escanea el código</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Apunta la cámara de tu teléfono móvil sin necesidad de instalar nada.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-1.5">
              2
            </div>
            <p className="text-xs font-bold text-slate-800">Indica tu horario</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Coloca tu nombre, la fecha de tu clase y la cantidad de horas.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-1.5">
              3
            </div>
            <p className="text-xs font-bold text-slate-800">¡Turno asegurado!</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Recibirás tu comprobante digital y quedará registrado automáticamente.
            </p>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 uppercase tracking-wider pt-2">
          Sistema Institucional de Gestión y Préstamo de Material Didáctico
        </p>
      </div>

      <div className="text-center print:hidden">
        <button
          onClick={onBackToBooking}
          className="text-xs font-semibold text-sky-600 hover:text-sky-800 underline underline-offset-2"
        >
          ← Volver al formulario de reserva
        </button>
      </div>
    </div>
  );
};
