// stores/useConfigStore.ts
import { create } from "zustand";

type Config = any; // or define your config type

interface ConfigState {
  config: Config | null;
  setConfig: (data: Config) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  setConfig: (data) => set({ config: data }),
}));
