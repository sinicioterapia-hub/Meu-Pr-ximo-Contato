import React from 'react';
import { Phone, Calendar, Clock, Edit2, Trash2, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Client } from '../types';
import { formatDateBR, getClientStatus } from '../utils/date';
import { formatPhoneForDisplay } from '../utils/whatsapp';

interface ClientCardProps {
  client: Client;
  onOpenWhatsApp: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onOpenWhatsApp,
  onEdit,
  onDelete,
}) => {
  const status = getClientStatus(client.nextContactDate);

  const getBorderHighlight = () => {
    if (status.type === 'overdue') return 'border-rose-300 shadow-rose-50/50';
    if (status.type === 'today') return 'border-amber-400 shadow-amber-50/50';
    return 'border-slate-200';
  };

  return (
    <div
      className={`bg-white rounded-2xl border ${getBorderHighlight()} p-4 sm:p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between gap-3 relative`}
    >
      {/* Top row: Client name, phone, and status badge */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 truncate">
              {client.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formatPhoneForDisplay(client.phone)}</span>
            </div>
          </div>

          <div className="shrink-0">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${status.colorClass}`}
            >
              {status.type === 'overdue' && <AlertCircle className="w-3 h-3 text-rose-600" />}
              {status.type === 'today' && <Sparkles className="w-3 h-3 text-amber-600" />}
              {status.type === 'upcoming' && <Clock className="w-3 h-3 text-slate-400" />}
              <span>{status.sublabel}</span>
            </span>
          </div>
        </div>

        {/* Dates Grid */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-xl p-2.5 border border-slate-100">
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">
              Último atendimento:
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {client.lastServiceDate ? formatDateBR(client.lastServiceDate) : 'Nenhum'}
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-medium">
              Próximo contato:
            </span>
            <span
              className={`font-bold flex items-center gap-1 mt-0.5 ${
                status.type === 'overdue'
                  ? 'text-rose-700'
                  : status.type === 'today'
                  ? 'text-amber-800'
                  : 'text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {formatDateBR(client.nextContactDate)}
            </span>
          </div>
        </div>

        {/* Notes (if any) */}
        {client.notes && (
          <div className="mt-2.5 bg-emerald-50/40 border border-emerald-100/70 rounded-xl p-2.5">
            <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-3">
              "{client.notes}"
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        {/* WhatsApp Button */}
        <button
          type="button"
          onClick={() => onOpenWhatsApp(client)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs sm:text-sm py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition shadow-xs active:scale-[0.98]"
          title="Preparar e enviar mensagem de WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Preparar WhatsApp</span>
        </button>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEdit(client)}
          className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
          title="Editar dados do cliente"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(client.id)}
          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition"
          title="Excluir cliente"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
