/**
 * @file src/components/OfflineIndicator.tsx
 * @description Indicador discreto cuando el usuario está sin conexión
 */

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>Modo sin conexión — Tus reservas se guardarán localmente</span>
    </div>
  );
};
