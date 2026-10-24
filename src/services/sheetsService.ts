/**
 * @file src/services/sheetsService.ts
 * @description Servicio de envío de reservas a Google Sheets a través de Google Apps Script Webhook.
 * Escuela Especial N° 1429 "Dra. Sara Faisal"
 */

import { Reservation, WebhookPayload } from '../types';
import { getAppConfig } from './storage';

export interface SendResult {
  success: boolean;
  message: string;
  isSimulated?: boolean;
}

/**
 * Envía los datos de la reserva al Webhook de Google Sheets
 */
export async function sendReservationToGoogleSheets(
  reservation: Reservation
): Promise<SendResult> {
  const config = getAppConfig();
  const webhookUrl = config.webhookUrl?.trim();

  // Si no se configuró URL todavía, guardamos localmente en modo demostración
  if (!webhookUrl) {
    console.info(
      'Aviso: No hay URL de Webhook de Google Sheets configurada. La reserva se guarda en la base de datos local del dispositivo.'
    );
    return {
      success: true,
      isSimulated: true,
      message:
        'Reserva guardada exitosamente en la base de datos local. (Para sincronizar con tu Google Sheets, agrega el Webhook en "Configuración").',
    };
  }

  const payload: WebhookPayload = {
    id: reservation.id,
    fullName: reservation.fullName,
    date: reservation.date,
    startTime: reservation.startTime,
    durationHours: reservation.durationHours,
    endTime: reservation.endTime,
    registeredAt: reservation.registeredAt,
    equipment: config.equipmentName || 'El Cañón (Proyector)',
    institution: config.institutionName || 'Escuela Especial N° 1429 Dra. Sara Faisal',
  };

  try {
    // Para Google Apps Script, enviar con mode 'no-cors' para evitar restricciones de redirect 302
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Reserva enviada e impactada exitosamente en Google Sheets.',
    };
  } catch (error: any) {
    console.error('Error al enviar a Google Sheets Webhook:', error);
    return {
      success: false,
      message: `No se pudo conectar con el Webhook de Google Sheets: ${error.message || 'Error de red'}. La reserva quedó guardada localmente.`,
    };
  }
}

/**
 * Prueba la conexión con el Webhook de Google Sheets
 */
export async function testWebhookConnection(url: string): Promise<{ success: boolean; message: string }> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return { success: false, message: 'La URL está vacía.' };
  }

  if (!cleanUrl.startsWith('https://script.google.com/macros/s/')) {
    return {
      success: false,
      message:
        'La URL no parece ser de Google Apps Script. Debe comenzar con "https://script.google.com/macros/s/..."',
    };
  }

  try {
    // Enviamos una petición de prueba
    await fetch(cleanUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        id: 'TEST-000',
        fullName: 'Prueba de Conexión',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        durationHours: 1,
        endTime: '11:00',
        registeredAt: new Date().toLocaleString('es-AR'),
        equipment: 'El Cañón (Test)',
        institution: 'Escuela Especial N° 1429 Dra. Sara Faisal',
      }),
    });

    return {
      success: true,
      message: '¡Prueba enviada! Revisa si se registró la fila de prueba en tu planilla de Google Sheets.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Falló la conexión: ${err.message || 'Error desconocido'}`,
    };
  }
}
