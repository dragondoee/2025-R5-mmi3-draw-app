import { create } from 'zustand'

type DrawingState = {
  isConnectedToServer: boolean;
}

type DrawingAction = {
  setIsConnectedToServer: (isConnectedToServer: boolean) => void;
};

export const useDrawingStore = create<DrawingState & DrawingAction>((set) => ({
  isConnectedToServer: false,
  setIsConnectedToServer: (isConnectedToServer: boolean) => set({ isConnectedToServer }),
}));