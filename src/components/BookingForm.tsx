/**
 * @file src/components/BookingForm.tsx
 * @description Formulario limpio, minimalista y adaptable a teléfonos móviles para la reserva
 * del equipo "El Cañón" de la Escuela Especial N° 1429 "Dra. Sara Faisal".
 */

import React, { useState, useId } from 'react';
import {
  User,
  Calendar as CalendarIcon,
  Clock,
  Hourglass,
  AlertCircle,
  CheckCircle2,
  Tv,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Reservation } from '../types';
import {
  calculateEndTime,
  checkSlotCollision,
  generateReservationId,
  getFormattedTimestamp,
  getTodayDateString,
} from '../services/storage';

interface BookingFormProps {
  onSuccess: (reservation: Reservation) => void;
  onOpenSchedule: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onOpenSchedule }) => {
  const formId = useId();

  // Estados de los campos obligatorios
  const [fullName, setFullName] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [startTime, setStartTime] = useState('08:00');
  const [durationHours, setDurationHours] = useState<number>(1);

  // Estados de validación y envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cálculo en vivo del horario de fin
  const endTime = calculateEndTime(startTime, durationHours);

  // Verificación en vivo de superposición con turnos existentes
  const collision = date && startTime ? checkSlotCollision(date, startTime, durationHours) : { hasConflict: false };

  // Horarios sugeridos rápidos habituales en el turno mañana y tarde de la escuela
  const quickTimePresets = ['08:00', '09:30', '11:00', '13:30', '15:00'];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Por favor ingresa tu Nombre y Apellido';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!date) {
      newErrors.date = 'Selecciona la fecha de uso del equipo';
    }

    if (!startTime) {
      newErrors.startTime = 'Selecciona el horario de inicio';
    }

    if (!durationHours || durationHours < 1 || durationHours > 6) {
      newErrors.durationHours = 'La cantidad de horas debe ser entre 1 y 6';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Advertencia si hay colisión
    if (collision.hasConflict && collision.conflictingWith) {
      const confirmOverlap = window.confirm(
        `Atención: El horario seleccionado se superpone con la reserva de ${collision.conflictingWith.fullName} (${collision.conflictingWith.startTime} - ${collision.conflictingWith.endTime} hs).\n\n¿Deseas continuar y registrarla de todos modos?`
      );
      if (!confirmOverlap) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const reservation: Reservation = {
        id: generateReservationId(),
        fullName: fullName.trim(),
        date,
        startTime,
        durationHours,
        endTime,
        registeredAt: getFormattedTimestamp(),
        status: 'pending_sync',
      };

      // Disparamos el callback de éxito
      onSuccess(reservation);
    } catch (err) {
      console.error('Error al procesar reserva:', err);
      setErrors({ form: 'Ocurrió un error al procesar la reserva. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Tarjeta de bienvenida y presentación del equipo */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-2xl p-5 mb-5 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <Tv className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Tv className="w-3.5 h-3.5" />
            <span>Equipo Audiovisual</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Reserva de "El Cañón"
          </h2>
          <p className="text-sky-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Completa el siguiente formulario para apartar el proyector en la fecha y horario que necesitas para tu clase o actividad escolar.
          </p>
        </div>
      </div>

      {/* Formulario Mobile-First */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5"
        noValidate
      >
        {errors.form && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* 1. NOMBRE Y APELLIDO (Obligatorio) */}
        <div>
          <label
            htmlFor={`${formId}-fullName`}
            className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-600" />
              <span>Nombre y Apellido de quien reserva</span>
              <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              id={`${formId}-fullName`}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              placeholder="Ej: Prof. María Fernández"
              autoComplete="name"
              className={`w-full px-4 py-3 rounded-xl border text-slate-800 text-sm sm:text-base focus:outline-none focus:ring-2 transition ${
                errors.fullName
                  ? 'border-red-400 bg-red-50/50 focus:ring-red-200'
                  : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-sky-100'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* 2. FECHA DE LA RESERVA (Obligatorio) */}
        <div>
          <label
            htmlFor={`${formId}-date`}
            className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-sky-600" />
              <span>Fecha de la reserva</span>
              <span className="text-red-500">*</span>
            </span>
            <button
              type="button"
              onClick={onOpenSchedule}
              className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold underline underline-offset-2"
            >
              Ver agenda del día
            </button>
          </label>
          <div className="relative">
            <input
              type="date"
              id={`${formId}-date`}
              min={getTodayDateString()}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors({ ...errors, date: '' });
              }}
              className={`w-full px-4 py-3 rounded-xl border text-slate-800 text-sm sm:text-base focus:outline-none focus:ring-2 transition ${
                errors.date
                  ? 'border-red-400 bg-red-50/50 focus:ring-red-200'
                  : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-sky-100'
              }`}
            />
          </div>
          {errors.date && (
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.date}</span>
            </p>
          )}
        </div>

        {/* 3. HORARIO DE INICIO (Obligatorio) */}
        <div>
          <label
            htmlFor={`${formId}-startTime`}
            className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Horario de inicio</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="time"
              id={`${formId}-startTime`}
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                if (errors.startTime) setErrors({ ...errors, startTime: '' });
              }}
              className={`w-full px-4 py-3 rounded-xl border text-slate-800 text-sm sm:text-base focus:outline-none focus:ring-2 transition ${
                errors.startTime
                  ? 'border-red-400 bg-red-50/50 focus:ring-red-200'
                  : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-sky-100'
              }`}
            />
          </div>

          {/* Accesos rápidos de horarios escolares */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Rápidos:</span>
            {quickTimePresets.map((time) => (
              <button
                type="button"
                key={time}
                onClick={() => setStartTime(time)}
                className={`px-2 py-1 rounded-md text-xs font-semibold transition ${
                  startTime === time
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {time} hs
              </button>
            ))}
          </div>

          {errors.startTime && (
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.startTime}</span>
            </p>
          )}
        </div>

        {/* 4. CANTIDAD DE HORAS DE USO (Obligatorio, 1 a 4 horas) */}
        <div>
          <label
            htmlFor={`${formId}-durationHours`}
            className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5"
          >
            <Hourglass className="w-4 h-4 text-sky-600" />
            <span>Cantidad de horas de uso</span>
            <span className="text-red-500">*</span>
          </label>

          {/* Selector táctil con botones grandes para celular */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[1, 2, 3, 4].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setDurationHours(hours)}
                className={`py-2.5 rounded-xl border text-center font-bold text-sm transition-all ${
                  durationHours === hours
                    ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-xs ring-2 ring-sky-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>{hours} {hours === 1 ? 'hora' : 'horas'}</div>
              </button>
            ))}
          </div>

          {/* Selector desplegable alternativo */}
          <select
            id={`${formId}-durationHours`}
            value={durationHours}
            onChange={(e) => setDurationHours(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            <option value={1}>1 hora de uso</option>
            <option value={2}>2 horas de uso</option>
            <option value={3}>3 horas de uso</option>
            <option value={4}>4 horas de uso</option>
          </select>

          {errors.durationHours && (
            <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.durationHours}</span>
            </p>
          )}
        </div>

        {/* RESUMEN DINÁMICO DEL TURNO */}
        <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                {durationHours}h
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-sky-800">
                  Resumen del Turno
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  {startTime} hs <span className="text-slate-400">→</span> {endTime} hs
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>Disponible</span>
              </span>
            </div>
          </div>

          {/* Alerta de colisión si otro docente ya reservó ese espacio */}
          {collision.hasConflict && collision.conflictingWith && (
            <div className="mt-2.5 pt-2 border-t border-amber-200 text-amber-800 text-xs flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Aviso de superposición:</strong> {collision.conflictingWith.fullName} tiene
                reservado de {collision.conflictingWith.startTime} a {collision.conflictingWith.endTime} hs.
              </div>
            </div>
          )}
        </div>

        {/* 5. BOTÓN DE CONFIRMAR RESERVA (Obligatorio con validación) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sky-600 hover:bg-sky-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-sky-600/20 text-sm sm:text-base transition flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Registrando turno...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Confirmar Reserva</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Escuela Especial Particular Incorporada N° 1429 "Dra. Sara Faisal"
        </p>
      </form>
    </div>
  );
};
