import { Client, ProfessionalUser } from '../types';
import { addDaysToDate, getTodayDateString } from '../utils/date';

const STORAGE_KEY_USERS = 'mpc_registered_professionals_v1';
const STORAGE_KEY_SESSION = 'mpc_current_session_user_id_v1';

function getClientsStorageKey(userId: string): string {
  // Separação rigorosa de dados: chave de armazenamento única por usuário
  return `mpc_clients_user_${userId}_v1`;
}

// Inicializa dados de demonstração caso seja a primeira execução
export function seedInitialDataIfEmpty(): void {
  const existingUsers = getRegisteredUsers();
  if (existingUsers.length > 0) return;

  const today = getTodayDateString();
  const yesterday = addDaysToDate(today, -1);
  const fiveDaysAgo = addDaysToDate(today, -5);
  const inThreeDays = addDaysToDate(today, 3);
  const twoWeeksAgo = addDaysToDate(today, -14);

  // Criando profissional de exemplo 1
  const user1: ProfessionalUser = {
    id: 'usr_mariana',
    name: 'Dra. Mariana Costa',
    email: 'mariana@exemplo.com',
    profession: 'Fisioterapeuta & Terapeuta',
    password: '123',
    createdAt: new Date().toISOString(),
  };

  // Clientes exclusivos da Mariana
  const clientsUser1: Client[] = [
    {
      id: 'cli_1',
      userId: 'usr_mariana',
      name: 'Camila Ferreira',
      phone: '11987654321',
      lastServiceDate: twoWeeksAgo,
      nextContactDate: yesterday, // Atrasado
      notes: 'Realizou sessão para dores na coluna lombar. Verificar se os exercícios recomendados surtiram alívio.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cli_2',
      userId: 'usr_mariana',
      name: 'Roberto Souza',
      phone: '21976543210',
      lastServiceDate: fiveDaysAgo,
      nextContactDate: today, // Para Hoje
      notes: 'Pediu para entrar em contato hoje para confirmar o pacote de 10 sessões mensais.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cli_3',
      userId: 'usr_mariana',
      name: 'Juliana Barbosa',
      phone: '31998877665',
      lastServiceDate: yesterday,
      nextContactDate: inThreeDays, // Futuro
      notes: 'Primeira consulta realizada com sucesso. Próximo contato para avaliar adaptação à palmilha postural.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Criando profissional de exemplo 2 (para comprovar a separação estrita de dados)
  const user2: ProfessionalUser = {
    id: 'usr_carlos',
    name: 'Carlos Eduardo',
    email: 'carlos@exemplo.com',
    profession: 'Consultor Autônomo',
    password: '123',
    createdAt: new Date().toISOString(),
  };

  // Clientes exclusivos do Carlos
  const clientsUser2: Client[] = [
    {
      id: 'cli_4',
      userId: 'usr_carlos',
      name: 'Empresa Alpha Tech (Lucas)',
      phone: '19981234567',
      lastServiceDate: twoWeeksAgo,
      nextContactDate: today,
      notes: 'Reunião de alinhamento orçamentário. Enviar prévia da proposta de diagnóstico.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Salva usuários
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([user1, user2]));

  // Salva clientes em chaves totalmente separadas
  localStorage.setItem(getClientsStorageKey(user1.id), JSON.stringify(clientsUser1));
  localStorage.setItem(getClientsStorageKey(user2.id), JSON.stringify(clientsUser2));

  // Define sessão inicial na Mariana
  localStorage.setItem(STORAGE_KEY_SESSION, user1.id);
}

// ================= AUTENTICAÇÃO =================

export function getRegisteredUsers(): ProfessionalUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Erro ao ler usuários', err);
    return [];
  }
}

export function registerUser(name: string, email: string, password: string, profession?: string): ProfessionalUser {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
  if (exists) {
    throw new Error('Já existe um profissional cadastrado com este e-mail.');
  }

  const newUser: ProfessionalUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    profession: profession?.trim() || 'Profissional Autônomo',
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

  // Inicializa a lista de clientes deste usuário vazia em sua chave isolada
  localStorage.setItem(getClientsStorageKey(newUser.id), JSON.stringify([]));

  // Inicia a sessão com o novo usuário
  localStorage.setItem(STORAGE_KEY_SESSION, newUser.id);
  return newUser;
}

export function loginUser(email: string, password: string): ProfessionalUser {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail && u.password === password);

  if (!user) {
    throw new Error('E-mail ou senha incorretos.');
  }

  localStorage.setItem(STORAGE_KEY_SESSION, user.id);
  return user;
}

export function getCurrentUser(): ProfessionalUser | null {
  try {
    const currentId = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!currentId) return null;

    const users = getRegisteredUsers();
    return users.find((u) => u.id === currentId) || null;
  } catch (err) {
    console.error('Erro ao buscar usuário atual', err);
    return null;
  }
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY_SESSION);
}

// ================= CLIENTES (ISOLAMENTO POR USUÁRIO) =================

export function getUserClients(userId: string): Client[] {
  if (!userId) return [];
  try {
    const key = getClientsStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const list: Client[] = JSON.parse(raw);
    
    // Regra de segurança dupla: garante que apenas registros com este userId retornem
    return list.filter((c) => c.userId === userId);
  } catch (err) {
    console.error(`Erro ao carregar clientes do usuário ${userId}`, err);
    return [];
  }
}

export function saveUserClient(userId: string, clientData: Omit<Client, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, existingId?: string): Client {
  if (!userId) throw new Error('Usuário não autenticado');

  const key = getClientsStorageKey(userId);
  const currentList = getUserClients(userId);
  const now = new Date().toISOString();

  if (existingId) {
    // Atualização
    const index = currentList.findIndex((c) => c.id === existingId && c.userId === userId);
    if (index === -1) {
      throw new Error('Cliente não encontrado ou você não tem permissão para editá-lo.');
    }

    const updatedClient: Client = {
      ...currentList[index],
      ...clientData,
      userId, // Mantém estritamente o id do usuário
      updatedAt: now,
    };

    currentList[index] = updatedClient;
    localStorage.setItem(key, JSON.stringify(currentList));
    return updatedClient;
  } else {
    // Novo cliente
    const newClient: Client = {
      id: `cli_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      ...clientData,
      createdAt: now,
      updatedAt: now,
    };

    currentList.unshift(newClient);
    localStorage.setItem(key, JSON.stringify(currentList));
    return newClient;
  }
}

export function deleteUserClient(userId: string, clientId: string): boolean {
  if (!userId) return false;
  const key = getClientsStorageKey(userId);
  const currentList = getUserClients(userId);

  const filtered = currentList.filter((c) => c.id !== clientId && c.userId === userId);
  localStorage.setItem(key, JSON.stringify(filtered));
  return true;
}

export function quickPostponeContact(userId: string, clientId: string, days: number): Client | null {
  const currentList = getUserClients(userId);
  const index = currentList.findIndex((c) => c.id === clientId && c.userId === userId);
  if (index === -1) return null;

  const target = currentList[index];
  const newNextDate = addDaysToDate(getTodayDateString(), days);
  
  target.nextContactDate = newNextDate;
  target.updatedAt = new Date().toISOString();
  
  localStorage.setItem(getClientsStorageKey(userId), JSON.stringify(currentList));
  return target;
}

export function markServiceDoneToday(userId: string, clientId: string, nextInDays = 15): Client | null {
  const currentList = getUserClients(userId);
  const index = currentList.findIndex((c) => c.id === clientId && c.userId === userId);
  if (index === -1) return null;

  const today = getTodayDateString();
  const target = currentList[index];
  
  target.lastServiceDate = today;
  target.nextContactDate = addDaysToDate(today, nextInDays);
  target.updatedAt = new Date().toISOString();

  localStorage.setItem(getClientsStorageKey(userId), JSON.stringify(currentList));
  return target;
}
