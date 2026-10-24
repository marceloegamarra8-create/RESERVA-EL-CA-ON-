/**
 * @file src/types/index.ts
 * @description Definiciones de tipos para el sistema de reserva de "El Cañón"
 * Escuela Especial N° 1429 "Dra. Sara Faisal"
 */

export interface Reservation {
  id: string; // Ej: "CN-8942"
  fullName: string; // Nombre y Apellido del solicitante
  date: string; // Fecha en formato "YYYY-MM-DD"
  startTime: string; // Horario de inicio "HH:mm"
  durationHours: number; // Cantidad de horas (1 a 4)
  endTime: string; // Horario de finalización calculado "HH:mm"
  registeredAt: string; // Fecha y hora en que se registró la reserva
  status: 'synced' | 'local_only' | 'pending_sync';
  notes?: string;
}

export interface WebhookPayload {
  id: string;
  fullName: string;
  date: string;
  startTime: string;
  durationHours: number;
  endTime: string;
  registeredAt: string;
  equipment: string;
  institution: string;
}

export interface AppConfig {
  webhookUrl: string;
  equipmentName: string;
  institutionName: string;
  schoolCode: string;
}
