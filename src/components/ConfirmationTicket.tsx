/**
 * @file src/components/ConfirmationTicket.tsx
 * @description Comprobante y resumen visual digital del turno reservado
 * Escuela Especial N° 1429 "Dra. Sara Faisal"
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Tv,
  Printer,
  Share2,
  PlusCircle,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { Reservation } from '../types';

interface ConfirmationTicketProps {
  reservation: Reservation;
  onNewReservation: () => void;
  syncMessage?: string;
  isSyncedToSheets?: boolean;
}

export const ConfirmationTicket: React.FC<ConfirmationTicketProps> = ({
  reservation,
  onNewReservation,
  syncMessage,
  isSyncedToSheets = true,
}) => {
  useEffect(() => {
    // Disparar confetti festivo al confirmar la reserva
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#008cd2', '#38bdf8', '#10b981'],
      });
    } catch (e) {
      // Ignorar si el navegador no soporta canvas
    }
  }, []);

  // Formatear fecha para lectura humana en español
  const formatReadableDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Generar link de Google Calendar
  const getGoogleCalendarUrl = () => {
    try {
      const [year, month, day] = reservation.date.split('-');
      const [startH, startM] = reservation.startTime.split(':');
      const [endH, endM] = reservation.endTime.split(':');

      const startIso = `${year}${month}${day}T${startH}${startM}00`;
      const endIso = `${year}${month}${day}T${endH}${endM}00`;

      const title = encodeURIComponent(
        `Reserva: El Cañón - ${reservation.fullName}`
      );
      const details = encodeURIComponent(
        `Reserva del proyector "El Cañón" de la Escuela Especial N° 1429 Dra. Sara Faisal.\nSolicitante: ${reservation.fullName}\nID Reserva: ${reservation.id}\nRegistrado: ${reservation.registeredAt}`
      );
      const location = encodeURIComponent('Escuela Especial N° 1429 "Dra. Sara Faisal"');

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    } catch {
      return '#';
    }
  };

  // Compartir por WhatsApp
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📌 *COMPROBANTE DE RESERVA - EL CAÑÓN*\n` +
        `🏫 *Escuela Especial N° 1429 "Dra. Sara Faisal"*\n\n` +
        `👤 *Solicitante:* ${reservation.fullName}\n` +
        `📅 *Fecha:* ${formatReadableDate(reservation.date)}\n` +
        `⏰ *Horario:* ${reservation.startTime} a ${reservation.endTime} hs (${reservation.durationHours} ${reservation.durationHours === 1 ? 'hora' : 'horas'})\n` +
        `🔖 *ID de Turno:* ${reservation.id}\n` +
        `🕒 *Registrado el:* ${reservation.registeredAt}\n\n` +
        `✅ _Reserva confirmada en el sistema institucional._`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Banner de Confirmación */}
      <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-sm text-center relative overflow-hidden">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
          <CheckCircle2 className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          ¡Reserva Confirmada!
        </h2>
        <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
          El equipo "El Cañón" ha quedado apartado para ti.
        </p>

        {/* Indicador de impacto en Google Sheets */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-800/60 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold">
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
          <span>{syncMessage || 'Registrado con éxito'}</span>
        </div>
      </div>

      {/* TICKET DIGITAL / COMPROBANTE INSTITUCIONAL */}
      <div className="bg-white rounded-2xl border-2 border-sky-100 shadow-md overflow-hidden print:border-none print:shadow-none">
        {/* Cabecera del ticket con logo */}
        <div className="bg-gradient-to-r from-sky-50 to-sky-100/60 px-5 py-4 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 border border-sky-300 shadow-xs flex items-center justify-center">
              <img
                src="/assets/aistudio/logo_escuela_png_e439e66e.png"
                alt="Logo Escuela Especial N° 1429 Dra. Sara Faisal"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-sky-800">
                Comprobante Oficial de Reserva
              </p>
              <h3 className="text-sm font-extrabold text-slate-800 leading-tight">
                Escuela Especial N° 1429 "Dra. Sara Faisal"
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              ID Reserva
            </span>
            <span className="text-xs sm:text-sm font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md font-mono">
              #{reservation.id}
            </span>
          </div>
        </div>

        {/* Cuerpo del ticket */}
        <div className="p-5 sm:p-6 space-y-4 text-slate-700">
          {/* Persona */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Docente / Solicitante
              </span>
              <p className="text-base font-bold text-slate-900">
                {reservation.fullName}
              </p>
            </div>
          </div>

          {/* Equipo */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Tv className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Equipo Solicitado
              </span>
              <p className="text-sm font-semibold text-slate-900">
                El Cañón <span className="text-slate-500 font-normal">(Proyector Multimedia)</span>
              </p>
            </div>
          </div>

          {/* Fecha y Horario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Fecha del Turno
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-800 capitalize">
                  {formatReadableDate(reservation.date)}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {reservation.date}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Horario y Duración
                </span>
                <p className="text-xs sm:text-sm font-bold text-sky-700">
                  {reservation.startTime} a {reservation.endTime} hs
                </p>
                <p className="text-[11px] text-slate-500">
                  {reservation.durationHours} {reservation.durationHours === 1 ? 'hora de uso' : 'horas de uso'}
                </p>
              </div>
            </div>
          </div>

          {/* Fecha y hora de registro */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Fecha/Hora de registro:</span>
            <span className="font-semibold text-slate-700 font-mono">
              {reservation.registeredAt}
            </span>
          </div>
        </div>

        {/* Separador tipo ticket recortable */}
        <div className="relative py-2 bg-slate-50 border-t border-b border-dashed border-slate-300 flex items-center justify-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          <span>Escuela N° 1429 Dra. Sara Faisal</span>
        </div>
      </div>

      {/* Botones de acción rápida */}
      <div className="space-y-2.5 pt-1">
        {/* Agregar a Google Calendar */}
        <a
          href={getGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>Agregar a Google Calendar</span>
        </a>

        <div className="grid grid-cols-2 gap-2">
          {/* Compartir por WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 px-3 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir WhatsApp</span>
          </button>

          {/* Imprimir o Guardar PDF */}
          <button
            onClick={handlePrint}
            className="w-full bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold py-3 px-3 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar</span>
          </button>
        </div>

        {/* Botón para realizar otra reserva */}
        <button
          onClick={onNewReservation}
          className="w-full mt-3 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Hacer otra reserva</span>
        </button>
      </div>
    </div>
  );
};
