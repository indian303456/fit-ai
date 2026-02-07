
import { UserBiometrics, HistoryItem, ChatMessage } from "../types";

const KEYS = {
  AUTH: 'fitfeast_auth',
  BIOMETRICS: 'fitfeast_user_biometrics',
  HISTORY: 'fitfeast_history',
  CHATS: 'fitfeast_chat_history'
};

export const database = {
  // Auth
  isLoggedIn: (): boolean => {
    return localStorage.getItem(KEYS.AUTH) === 'true';
  },
  login: () => {
    localStorage.setItem(KEYS.AUTH, 'true');
  },
  logout: () => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  },

  // Biometrics
  getBiometrics: (): UserBiometrics | null => {
    const data = localStorage.getItem(KEYS.BIOMETRICS);
    return data ? JSON.parse(data) : null;
  },
  saveBiometrics: (data: UserBiometrics) => {
    localStorage.setItem(KEYS.BIOMETRICS, JSON.stringify(data));
  },

  // Meal History
  getHistory: (): HistoryItem[] => {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },
  saveHistory: (history: HistoryItem[]) => {
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  },

  // Chat History
  getChats: (): ChatMessage[] => {
    const data = localStorage.getItem(KEYS.CHATS);
    return data ? JSON.parse(data) : [];
  },
  saveChats: (chats: ChatMessage[]) => {
    localStorage.setItem(KEYS.CHATS, JSON.stringify(chats));
  }
};
