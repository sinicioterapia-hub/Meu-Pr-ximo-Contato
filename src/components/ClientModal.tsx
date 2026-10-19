import React, { useState, useEffect } from 'react';
import { X, Calendar, Phone, User, FileText, Check, Clock } from 'lucide-react';
import { Client } from '../types';
import { addDaysToDate, getTodayDateString } from '../utils/date';
import { formatPhoneForDisplay, cleanPhoneNumber } from '../utils/whatsapp';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, clientId?: string) => void;
  clientToEdit?: Client | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clientToEdit,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [nextContactDate, setNextContactDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const todayStr = getTodayDateString();

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setPhone(formatPhoneForDisplay(clientToEdit.phone));
      setLastServiceDate(clientToEdit.lastServiceDate || '');
      setNextContactDate(clientToEdit.nextContactDate || todayStr);
      setNotes(clientToEdit.notes || '');
    } else {
      // Default para novo cliente
      setName('');
      setPhone('');
      setLastServiceDate(todayStr); // Sugere hoje como último atendimento por conveniência
      setNextContactDate(addDaysToDate(todayStr, 7)); // Sugere retorno em 7 dias
      setNotes('');
    }
    setErrorMsg('');
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    // Aplica formatação visual suave
    const formatted = formatPhoneForDisplay(val);
    setPhone(formatted);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor, informe o nome do cliente.');
      return;
    }

    const cleanedDigits = cleanPhoneNumber(phone);
    if (!cleanedDigits || cleanedDigits.length < 8) {
      setErrorMsg('Por favor, informe um número de WhatsApp/telefone válido (com DDD).');
      return;
    }

    if (!nextContactDate) {
      setErrorMsg('Por favor, defina a data do próximo contato.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        phone: cleanedDigits,
        lastServiceDate,
        nextContactDate,
        notes: notes.trim(),
      },
      clientToEdit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {clientToEdit ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <p className="text-xs text-slate-500">
              {clientToEdit ? 'Atualize as datas e observações' : 'Cadastre os dados para acompanhar o próximo contato'}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do Cliente *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo de Oliveira"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Contato / WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp / Contato *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Ex: (11) 98765-4321"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Digite com DDD. O app prepara automaticamente a conversa do WhatsApp.
            </p>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Último Atendimento */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Último Atendimento
                </label>
                <button
                  type="button"
                  onClick={() => setLastServiceDate(todayStr)}
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Hoje
                </button>
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={lastServiceDate}
                  onChange={(e) => setLastServiceDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Próximo Contato */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Próximo Contato *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={nextContactDate}
                  onChange={(e) => setNextContactDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-emerald-800"
                />
              </div>
            </div>
          </div>

          {/* Atalhos para data do próximo contato */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
            <span className="block text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Atalhos rápidos para agendar o próximo contato:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setNextContactDate(todayStr)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                  nextContactDate === todayStr
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Para Hoje
              </button>
              <button
                type="button"
                onClick={() => setNextContactDate(addDaysToDate(todayStr, 7))}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-medium transition"
              >
                +7 dias
              </button>
              <button
                type="button"
                onClick={() => setNextContactDate(addDaysToDate(todayStr, 15))}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-medium transition"
              >
                +15 dias
              </button>
              <button
                type="button"
                onClick={() => setNextContactDate(addDaysToDate(todayStr, 30))}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-medium transition"
              >
                +30 dias
              </button>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações & Histórico
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Realizou serviço X, pediu para ligar no período da tarde, tem interesse em novo plano..."
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none placeholder-slate-400"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Anote o que foi combinado para não esquecer nada ao mandar a mensagem.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm transition shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{clientToEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
