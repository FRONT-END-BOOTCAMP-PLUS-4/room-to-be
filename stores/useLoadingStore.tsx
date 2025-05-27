import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  setLoading: (loading: boolean, message?: string) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingMessage: undefined,
  setLoading: (loading, message) =>
    set({
      isLoading: loading,
      loadingMessage: message,
    }),
}));
