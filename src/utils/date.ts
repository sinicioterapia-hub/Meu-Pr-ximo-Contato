/**
 * Utilitários de manipulação e formatação de datas
 * Trabalha com strings no formato ISO local YYYY-MM-DD para evitar problemas de fuso horário.
 */

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateBR(dateStr?: string): string {
  if (!dateStr) return 'Não informado';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function addDaysToDate(dateStr: string, daysToAdd: number): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return getTodayDateString();
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const target = new Date(year, month, day);
  target.setDate(target.getDate() + daysToAdd);

  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDaysDifference(targetDateStr: string, baseDateStr: string = getTodayDateString()): number {
  if (!targetDateStr) return 0;
  const p1 = targetDateStr.split('-').map(Number);
  const p2 = baseDateStr.split('-').map(Number);
  
  const d1 = new Date(p1[0], p1[1] - 1, p1[2]);
  const d2 = new Date(p2[0], p2[1] - 1, p2[2]);
  
  const diffTime = d1.getTime() - d2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export type ClientStatusType = 'overdue' | 'today' | 'upcoming';

export function getClientStatus(nextContactDate: string): {
  type: ClientStatusType;
  label: string;
  sublabel: string;
  colorClass: string;
} {
  const today = getTodayDateString();
  const diff = getDaysDifference(nextContactDate, today);

  if (nextContactDate < today) {
    const days = Math.abs(diff);
    return {
      type: 'overdue',
      label: 'Atrasado',
      sublabel: days === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${days} dias`,
      colorClass: 'bg-rose-100 text-rose-800 border-rose-300'
    };
  } else if (nextContactDate === today) {
    return {
      type: 'today',
      label: 'Hoje',
      sublabel: 'Contato previsto para hoje',
      colorClass: 'bg-amber-100 text-amber-900 border-amber-300'
    };
  } else {
    return {
      type: 'upcoming',
      label: 'Agendado',
      sublabel: diff === 1 ? 'Amanhã' : `Em ${diff} dias`,
      colorClass: 'bg-slate-100 text-slate-700 border-slate-300'
    };
  }
}
