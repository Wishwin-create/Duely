import { create } from 'zustand';
import api from '../../lib/api';

export const useAuth = create((set) => ({
  user: null,
  loading: true,

  async init() {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    set({ user: data.user });
  },

  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    set({ user: data.user });
  },

  async logout() {
    await api.post('/auth/logout');
    set({ user: null });
  },
}));
