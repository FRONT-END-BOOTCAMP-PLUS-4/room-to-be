// src/store/useLoginRedirectModalStore.ts
import { create } from 'zustand';

interface LoginRedirectModalState {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useLoginRedirectModalStore = create<LoginRedirectModalState>(
  (set) => ({
    open: false,
    openModal: () => set({ open: true }),
    closeModal: () => set({ open: false }),
  }),
);
