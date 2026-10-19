import React from 'react';
import { Calendar, LogOut, ShieldCheck, UserCheck, Download } from 'lucide-react';
import { ProfessionalUser } from '../types';

interface HeaderProps {
  currentUser: ProfessionalUser;
  onLogout: () => void;
  onSwitchUser?: () => void;
  onOpenInstall?: () => void;
  isInstalled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onSwitchUser,
  onOpenInstall,
  isInstalled = false,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
              Meu Próximo Contato
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-800 truncate">{currentUser.name}</span>
              {currentUser.profession && (
                <span className="hidden sm:inline text-slate-400">• {currentUser.profession}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Install, Security badge & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!isInstalled && onOpenInstall && (
            <button
              type="button"
              onClick={onOpenInstall}
              className="py-1.5 px-2.5 sm:px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              title="Baixar e instalar no iPhone ou Android"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Instalar App</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dados isolados</span>
          </div>

          {onSwitchUser && (
            <button
              type="button"
              onClick={onSwitchUser}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1"
              title="Trocar de profissional para testar isolamento de dados"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Trocar Conta</span>
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 hover:bg-rose-50/50 px-2.5 sm:px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
            title="Encerrar sessão deste profissional"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
