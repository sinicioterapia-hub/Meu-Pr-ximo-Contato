import React, { useState } from 'react';
import { Download, Smartphone, X, Sparkles, Apple } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Se já está instalado e rodando em modo standalone, esconde o banner
  if (isInstalled || dismissed) {
    return null;
  }

  const handleBannerClick = () => {
    if (isInstallable) {
      install();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white px-4 py-2.5 shadow-sm text-xs relative">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white truncate text-xs sm:text-sm">
                Baixar Meu Próximo Contato no celular
              </p>
              <p className="text-[11px] text-emerald-100 hidden sm:block">
                Instale no seu iPhone ou Android para ter acesso rápido direto da sua tela inicial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleBannerClick}
              className="py-1.5 px-3 bg-white text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 font-bold rounded-lg text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isIOS ? 'Instalar no iPhone' : 'Instalar App'}</span>
            </button>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-1 text-emerald-200 hover:text-white rounded-md transition"
              title="Dispensar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onInstallAndroid={install}
        canInstallAndroid={isInstallable}
        isIOS={isIOS}
      />
    </>
  );
};
