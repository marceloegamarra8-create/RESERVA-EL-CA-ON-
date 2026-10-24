/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @file src/App.tsx
 * @description Aplicación PWA para el Sistema de Reserva de "El Cañón" (Proyector)
 * Escuela Especial Particular Incorporada N° 1429 "Dra. Sara Faisal"
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { BookingForm } from './components/BookingForm';
import { ConfirmationTicket } from './components/ConfirmationTicket';
import { ScheduleView } from './components/ScheduleView';
import { QRPosterModal } from './components/QRPosterModal';
import { GoogleSheetsConfig } from './components/GoogleSheetsConfig';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Reservation } from './types';
import {
  getStoredReservations,
  saveReservation,
  updateReservationStatus,
  deleteReservation,
  getAppConfig,
} from './services/storage';
import { sendReservationToGoogleSheets } from './services/sheetsService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('booking');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [lastConfirmedReservation, setLastConfirmedReservation] = useState<Reservation | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string>('');
  const [isSyncedToSheets, setIsSyncedToSheets] = useState<boolean>(true);
  const [hasWebhookConfigured, setHasWebhookConfigured] = useState<boolean>(false);

  // Cargar reservas y configuración al inicio
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const list = getStoredReservations();
    setReservations(list);
    const config = getAppConfig();
    setHasWebhookConfigured(Boolean(config.webhookUrl?.trim()));
  };

  // Manejar el envío de una nueva reserva
  const handleReservationSuccess = async (reservation: Reservation) => {
    // 1. Guardar primero en la base de datos local para máxima seguridad y resiliencia offline
    saveReservation(reservation);
    setReservations(getStoredReservations());

    // 2. Enviar automáticamente al Webhook de Google Sheets
    const result = await sendReservationToGoogleSheets(reservation);

    if (result.success && !result.isSimulated) {
      updateReservationStatus(reservation.id, 'synced');
      setIsSyncedToSheets(true);
      setSyncFeedback('Sincronizado e impactado en Google Sheets');
    } else if (result.isSimulated) {
      updateReservationStatus(reservation.id, 'local_only');
      setIsSyncedToSheets(false);
      setSyncFeedback('Guardado en la base de datos del dispositivo (Modo Local)');
    } else {
      updateReservationStatus(reservation.id, 'pending_sync');
      setIsSyncedToSheets(false);
      setSyncFeedback('Guardado en el equipo. Pendiente de sincronización.');
    }

    // Actualizar la reserva confirmada para mostrar el ticket
    setLastConfirmedReservation({
      ...reservation,
      status: result.success && !result.isSimulated ? 'synced' : 'local_only',
    });
    setReservations(getStoredReservations());
    setActiveTab('booking');
  };

  // Manejar cancelación/eliminación de turno
  const handleDeleteReservation = (id: string) => {
    deleteReservation(id);
    refreshData();
    if (lastConfirmedReservation?.id === id) {
      setLastConfirmedReservation(null);
    }
  };

  // Reiniciar formulario para una nueva reserva
  const handleNewReservation = () => {
    setLastConfirmedReservation(null);
    setActiveTab('booking');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Encabezado Institucional con Logo */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Si el usuario cambia de pestaña, cerramos el ticket para volver al form cuando vuelva a 'booking'
          if (tab !== 'booking') {
            setLastConfirmedReservation(null);
          }
        }}
        reservationCount={reservations.length}
        hasWebhookConfigured={hasWebhookConfigured}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
        {/* Pestaña: Formulario de Reserva o Comprobante */}
        {activeTab === 'booking' && (
          <>
            {lastConfirmedReservation ? (
              <ConfirmationTicket
                reservation={lastConfirmedReservation}
                onNewReservation={handleNewReservation}
                syncMessage={syncFeedback}
                isSyncedToSheets={isSyncedToSheets}
              />
            ) : (
              <BookingForm
                onSuccess={handleReservationSuccess}
                onOpenSchedule={() => setActiveTab('schedule')}
              />
            )}
          </>
        )}

        {/* Pestaña: Agenda y Disponibilidad */}
        {activeTab === 'schedule' && (
          <ScheduleView
            reservations={reservations}
            onNewReservation={handleNewReservation}
            onDeleteReservation={handleDeleteReservation}
          />
        )}

        {/* Pestaña: Cartel Imprimible con Código QR */}
        {activeTab === 'qr-poster' && (
          <QRPosterModal onBackToBooking={handleNewReservation} />
        )}

        {/* Pestaña: Configuración de Google Sheets */}
        {activeTab === 'sheets-config' && (
          <GoogleSheetsConfig onSaved={refreshData} />
        )}
      </main>

      {/* Indicador flotante offline */}
      <OfflineIndicator />

      {/* Pie de página institucional */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-300 flex-shrink-0">
              <img
                src="/assets/aistudio/logo_escuela_png_e439e66e.png"
                alt="Logo Escuela"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-slate-700">
              Escuela Especial Particular Incorporada N° 1429 "Dra. Sara Faisal"
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Sistema PWA • "El Cañón"</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('sheets-config')}
              className="hover:text-sky-600 transition underline underline-offset-2"
            >
              Enlace Google Sheets
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
