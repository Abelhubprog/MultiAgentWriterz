import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPrefsState {
  model: string;
  setModel: (model: string) => void;
}

export const usePrefsStore = create<UserPrefsState>()(
  persist(
    (set) => ({
      model: 'gemini-1.5-flash-preview-04-17',
      setModel: (model) => set({ model }),
    }),
    {
      name: 'user-preferences',
    }
  )
);