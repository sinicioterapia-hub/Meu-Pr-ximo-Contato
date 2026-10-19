import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { Client, ProfessionalUser } from '../types';
import { generateFollowUpMessage, createWhatsAppUrl, formatPhoneForDisplay } from '../utils/whatsapp';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  currentUser: ProfessionalUser;
  onPostponeContact: (clientId: string, days: number) => void;
  onMarkServiceDoneToday: (clientId: string, nextInDays: number) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  client,
  currentUser,
  onPostponeContact,
  onMarkServiceDoneToday,
}) => {
  const [template, setTemplate] = useState<'followup' | 'checkin' | 'feedback'>('followup');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Sincroniza mensagem sempre que cliente ou template mudar
  React.useEffect(() => {
    if (client) {
      const msg = generateFollowUpMessage(client.name, currentUser.name, template);
      setMessage(msg);
      setActionFeedback(null);
      setCopied(false);
    }
  }, [client, template, currentUser.name, isOpen]);

  if (!isOpen || !client) return null;

  const handleTemplateChange = (newTemplate: 'followup' | 'checkin' | 'feedback') => {
    setTemplate(newTemplate);
    setMessage(generateFollowUpMessage(client.name, currentUser.name, newTemplate));
  };

  const handleOpenWhatsApp = () => {
    const url = createWhatsAppUrl(client.phone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback simples
      const textArea = document.createElement('textarea');
      textArea.value = message;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuickPostpone = (days: number) => {
    onPostponeContact(client.id, days);
    setActionFeedback(`Próximo contato remarcado para daqui a ${days} dias!`);
    setTimeout(() => {
      setActionFeedback(null);
    }, 2500);
  };

  const handleDoneToday = () => {
    onMarkServiceDoneToday(client.id, 15);
    setActionFeedback('Atendimento de hoje registrado! Próximo retorno sugerido para daqui a 15 dias.');
    setTimeout(() => {
      setActionFeedback(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Preparar WhatsApp
              </h2>
              <p className="text-xs text-slate-600">
                Para: <span className="font-semibold text-slate-900">{client.name}</span> ({formatPhoneForDisplay(client.phone)})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-emerald-100/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {actionFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* Modelos rápidos */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Escolha o tom da mensagem:
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleTemplateChange('followup')}
                className={`py-2 px-2.5 rounded-xl border text-center font-medium transition ${
                  template === 'followup'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Acompanhamento
              </button>
              <button
                type="button"
                onClick={() => handleTemplateChange('checkin')}
                className={`py-2 px-2.5 rounded-xl border text-center font-medium transition ${
                  template === 'checkin'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Retorno
              </button>
              <button
                type="button"
                onClick={() => handleTemplateChange('feedback')}
                className={`py-2 px-2.5 rounded-xl border text-center font-medium transition ${
                  template === 'feedback'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Pós-serviço
              </button>
            </div>
          </div>

          {/* Editor de mensagem */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Texto da Mensagem (pode editar à vontade):
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar texto</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 leading-relaxed font-sans"
            />
          </div>

          {/* Botão de Envio Principal */}
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Abrir no WhatsApp Agora</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Ações pós contato */}
          <div className="pt-3 border-t border-slate-200">
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Após entrar em contato com o cliente:
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleDoneToday}
                className="w-full py-2 px-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Registrar <strong>atendimento realizado hoje</strong></span>
                </div>
                <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Próximo em 15 dias
                </span>
              </button>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="block text-[11px] font-medium text-slate-600 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Ou remarque a data do próximo contato:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickPostpone(7)}
                    className="py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-center transition"
                  >
                    +7 dias
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPostpone(15)}
                    className="py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-center transition"
                  >
                    +15 dias
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPostpone(30)}
                    className="py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-center transition"
                  >
                    +30 dias
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-100 transition"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
