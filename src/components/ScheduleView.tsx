/**
 * @file src/components/ScheduleView.tsx
 * @description Agenda interactiva y visualización de disponibilidad de "El Cañón"
 * Escuela Especial N° 1429 "Dra. Sara Faisal"
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Tv,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Reservation } from '../types';
import { getTodayDateString, timeToMinutes } from '../services/storage';

interface ScheduleViewProps {
  reservations: Reservation[];
  onNewReservation: () => void;
  onDeleteReservation: (id: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  reservations,
  onNewReservation,
  onDeleteReservation,
}) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  // Filtrar reservas por la fecha seleccionada
  const dayReservations = reservations
    .filter((r) => r.date === selectedDate)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // Bloques de horas escolares para la visualización de la línea de tiempo (07:30 a 17:30)
  const schoolSlots = [
    '07:30',
    '08:30',
    '09:30',
    '10:30',
    '11:30',
    '12:30',
    '13:30',
    '14:30',
    '15:30',
    '16:30',
  ];

  const isToday = selectedDate === getTodayDateString();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Selector de fecha y encabezado */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-sky-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Disponibilidad de "El Cañón"
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Consulta los turnos ocupados para organizar tu clase sin superposiciones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          {isToday && (
            <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-1 rounded-lg">
              Hoy
            </span>
          )}
        </div>
      </div>

      {/* Línea de tiempo visual del día */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Cronograma del día</span>
          <span>{dayReservations.length} {dayReservations.length === 1 ? 'reserva' : 'reservas'}</span>
        </h3>

        {/* Resumen rápido de bloques */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          {schoolSlots.map((slot) => {
            const slotMin = timeToMinutes(slot);
            const slotEndMin = slotMin + 60;
            const booking = dayReservations.find((r) => {
              const start = timeToMinutes(r.startTime);
              const end = timeToMinutes(r.endTime);
              return slotMin < end && slotEndMin > start;
            });

            return (
              <div
                key={slot}
                className={`p-2 rounded-xl border text-center transition ${
                  booking
                    ? 'border-sky-300 bg-sky-50/80 text-sky-900 ring-1 ring-sky-300'
                    : 'border-slate-100 bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-[11px] font-mono font-bold text-slate-400">
                  {slot} hs
                </div>
                {booking ? (
                  <div className="text-xs font-bold text-sky-800 truncate mt-0.5" title={booking.fullName}>
                    {booking.fullName.split(' ')[0]}
                  </div>
                ) : (
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    Libre
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lista de reservas detalladas del día */}
        {dayReservations.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              ¡Equipo 100% disponible este día!
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              No hay reservas programadas para el día seleccionado. Puedes apartarlo en el horario que prefieras.
            </p>
            <button
              onClick={onNewReservation}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Reservar ahora</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dayReservations.map((res) => (
              <div
                key={res.id}
                className="p-3.5 sm:p-4 rounded-xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50/80 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {res.fullName}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-sky-200 text-sky-800">
                        #{res.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-sky-700">
                        <Clock className="w-3.5 h-3.5" />
                        {res.startTime} a {res.endTime} hs
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>
                        {res.durationHours} {res.durationHours === 1 ? 'hora' : 'horas'} de uso
                      </span>
                    </div>

                    {res.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        "{res.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `¿Estás seguro de que deseas cancelar la reserva de ${res.fullName} (${res.startTime} hs)?`
                        )
                      ) {
                        onDeleteReservation(res.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition hover:bg-red-50"
                    title="Cancelar turno"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón flotante para reservar */}
      <div className="text-center pt-2">
        <button
          onClick={onNewReservation}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold py-3 px-6 rounded-xl shadow-md text-sm transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Solicitar nuevo turno de El Cañón</span>
        </button>
      </div>
    </div>
  );
};
