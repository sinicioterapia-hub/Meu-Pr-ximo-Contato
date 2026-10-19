import React, { useState } from 'react';
import { X, Smartphone, Download, Share2, PlusSquare, CheckCircle, Apple, HelpCircle, Sparkles } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallAndroid?: () => void;
  canInstallAndroid?: boolean;
  isIOS?: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstallAndroid,
  canInstallAndroid,
  isIOS = false,
}) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(isIOS ? 'ios' : 'android');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between bg-emerald-50/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                Instalar no Celular
              </h2>
              <p className="text-xs text-slate-600">
                Acesse como um aplicativo nativo no iPhone ou Android
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: iPhone vs Android */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('ios')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'ios'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>🍎 iPhone (iOS)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('android')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'android'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>🤖 Android</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'ios' ? (
            /* Guia Passo a Passo para iPhone */
            <div className="space-y-3.5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No iPhone, a instalação é feita pelo navegador <strong>Safari</strong> em 3 toques rápidos:</span>
              </div>

              <ol className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 block">Toque em Compartilhar</span>
                    <span className="text-xs text-slate-500">
                      Na barra inferior do Safari, clique no ícone de <strong>Compartilhar</strong> (quadrado com seta para cima ⎋).
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 block">Adicionar à Tela de Início</span>
                    <span className="text-xs text-slate-500">
                      Role o menu de opções para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 block">Confirmar "Adicionar"</span>
                    <span className="text-xs text-slate-500">
                      Toque em <strong>"Adicionar"</strong> no canto superior direito.
                    </span>
                  </div>
                </li>
              </ol>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                ✅ O app <strong>Meu Próximo Contato</strong> abrirá direto na tela do seu iPhone, em tela cheia, com ícone próprio e sem a barra do Safari!
              </div>
            </div>
          ) : (
            /* Guia Passo a Passo para Android */
            <div className="space-y-3.5">
              {canInstallAndroid && onInstallAndroid ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <p className="text-xs sm:text-sm font-semibold text-emerald-900">
                    Seu aparelho é compatível com instalação direta!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onInstallAndroid();
                      onClose();
                    }}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Instalar App no Android Agora</span>
                  </button>
                </div>
              ) : null}

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No Google Chrome ou Samsung Internet:</span>
              </div>

              <ol className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 block">Abra o menu do navegador</span>
                    <span className="text-xs text-slate-500">
                      Toque no menu de <strong>3 pontinhos (⋮)</strong> no canto superior direito do Chrome.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 block">Instalar aplicativo</span>
                    <span className="text-xs text-slate-500">
                      Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 block">Confirmar instalação</span>
                    <span className="text-xs text-slate-500">
                      Toque em <strong>Instalar</strong>. O app aparecerá junto com seus outros aplicativos!
                    </span>
                  </div>
                </li>
              </ol>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                ✅ O app funciona de forma independente, com ícone próprio e respostas instantâneas mesmo sem internet.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
