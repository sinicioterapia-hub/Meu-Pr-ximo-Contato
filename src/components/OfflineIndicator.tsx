import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md px-4 py-3 text-xs font-medium text-white shadow-xl border border-slate-700 animate-in slide-in-from-bottom">
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="font-semibold block text-slate-100">Modo Offline</span>
        <span className="text-[11px] text-slate-400">
          Você está desconectado, mas seus dados continuam salvos e acessíveis localmente.
        </span>
      </div>
    </div>
  );
};
