/**
 * @file src/services/storage.ts
 * @description Gestión de persistencia local, detección de colisiones horarias
 * y sincronización para el sistema de reservas de El Cañón.
 */

import { Reservation, AppConfig } from '../types';

const RESERVATIONS_KEY = 'dra_sara_faisal_canon_reservations_v1';
const CONFIG_KEY = 'dra_sara_faisal_canon_config_v1';

export const DEFAULT_CONFIG: AppConfig = {
  webhookUrl: '',
  equipmentName: 'El Cañón (Proyector)',
  institutionName: 'Escuela Especial Particular N° 1429 "Dra. Sara Faisal"',
  schoolCode: '1429',
};

/**
 * Calcula la hora de finalización sumando horas a la hora de inicio (HH:mm)
 */
export function calculateEndTime(startTime: string, durationHours: number): string {
  if (!startTime) return '';
  const [hoursStr, minutesStr] = startTime.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  hours += durationHours;
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`;
}

/**
 * Convierte un horario "HH:mm" a minutos totales desde la medianoche para comparaciones
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

/**
 * Genera un código de reserva único con prefijo institucional
 */
export function generateReservationId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CN-${randomNum}`;
}

/**
 * Formatea la fecha y hora de registro en formato local argentino
 */
export function getFormattedTimestamp(dateObj = new Date()): string {
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Semillas de ejemplo para primera carga
 */
function getInitialSeedReservations(): Reservation[] {
  const today = getTodayDateString();
  return [
    {
      id: 'CN-1429',
      fullName: 'Prof. Claudia Rossi',
      date: today,
      startTime: '08:30',
      durationHours: 2,
      endTime: '10:30',
      registeredAt: `${getFormattedTimestamp()} (Ejemplo)`,
      status: 'synced',
      notes: 'Taller de estimulación visual y multimedia',
    },
    {
      id: 'CN-1830',
      fullName: 'Lic. Fernando Gutiérrez',
      date: today,
      startTime: '13:30',
      durationHours: 1,
      endTime: '14:30',
      registeredAt: `${getFormattedTimestamp()} (Ejemplo)`,
      status: 'synced',
      notes: 'Capacitación docente institucional',
    },
  ];
}

/**
 * Obtiene la lista de reservas almacenadas
 */
export function getStoredReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(RESERVATIONS_KEY);
    if (!raw) {
      const initial = getInitialSeedReservations();
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo reservas locales:', err);
    return [];
  }
}

/**
 * Guarda una nueva reserva en almacenamiento local
 */
export function saveReservation(reservation: Reservation): void {
  try {
    const list = getStoredReservations();
    // Guardar al inicio
    const updated = [reservation, ...list.filter((r) => r.id !== reservation.id)];
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error guardando reserva:', err);
  }
}

/**
 * Actualiza el estado de una reserva (ej. tras sincronizar con Google Sheets)
 */
export function updateReservationStatus(id: string, status: Reservation['status']): void {
  try {
    const list = getStoredReservations();
    const updated = list.map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error actualizando estado de reserva:', err);
  }
}

/**
 * Elimina una reserva
 */
export function deleteReservation(id: string): void {
  try {
    const list = getStoredReservations();
    const updated = list.filter((r) => r.id !== id);
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error eliminando reserva:', err);
  }
}

/**
 * Verifica si hay superposición horaria para un nuevo turno
 */
export function checkSlotCollision(
  date: string,
  startTime: string,
  durationHours: number,
  excludeId?: string
): { hasConflict: boolean; conflictingWith?: Reservation } {
  const newStartMin = timeToMinutes(startTime);
  const newEndMin = newStartMin + durationHours * 60;
  const list = getStoredReservations();

  const sameDayReservations = list.filter((r) => r.date === date && r.id !== excludeId);

  for (const item of sameDayReservations) {
    const itemStartMin = timeToMinutes(item.startTime);
    const itemEndMin = timeToMinutes(item.endTime);

    // Condición de solapamiento: (StartA < EndB) y (EndA > StartB)
    if (newStartMin < itemEndMin && newEndMin > itemStartMin) {
      return {
        hasConflict: true,
        conflictingWith: item,
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Lee la configuración de la aplicación
 */
export function getAppConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_CONFIG;
  }
}

/**
 * Guarda la configuración de la aplicación
 */
export function saveAppConfig(config: Partial<AppConfig>): void {
  try {
    const current = getAppConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error guardando configuración:', err);
  }
}
