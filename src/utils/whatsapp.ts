/**
 * Utilitários de integração e formatação para WhatsApp no Brasil
 */

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function formatPhoneForDisplay(phone: string): string {
  const digits = cleanPhoneNumber(phone);
  if (digits.length === 11) {
    // (11) 98765-4321
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    // (11) 8765-4321
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function formatWhatsAppE164(phone: string): string {
  let digits = cleanPhoneNumber(phone);
  // Se digitou sem DDI (55), adiciona se tiver 10 ou 11 dígitos
  if (digits.length === 10 || digits.length === 11) {
    digits = `55${digits}`;
  }
  return digits;
}

export function generateFollowUpMessage(
  clientName: string,
  professionalName: string,
  templateType: 'followup' | 'checkin' | 'feedback' = 'followup'
): string {
  const firstName = clientName.split(' ')[0] || clientName;
  const profName = professionalName || 'seu profissional';

  switch (templateType) {
    case 'feedback':
      return `Olá, ${firstName}! Tudo bem? Aqui é ${profName}.\n\nEstou entrando em contato para saber como você está após o nosso atendimento. Ficou tudo certo com o serviço realizado? Estou à disposição se precisar de qualquer ajuste!`;
    case 'checkin':
      return `Olá, ${firstName}! Tudo bem por aí? Aqui é ${profName}.\n\nPassando para saber como você está e se já gostaria de agendar nosso próximo retorno. Como posso te ajudar hoje?`;
    case 'followup':
    default:
      return `Olá, ${firstName}! Tudo bem?\n\nAqui é ${profName}. Estou passando para acompanhar o nosso último atendimento e saber como você está. Podemos conversar sobre os próximos passos?`;
  }
}

export function createWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = formatWhatsAppE164(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
