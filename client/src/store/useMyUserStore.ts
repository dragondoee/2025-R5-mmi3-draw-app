import { create } from 'zustand'

type UserState = {
  myUser: { username: string; avatar: string } | null;
}

type UserAction = {
  setMyUser: (user: { username: string; avatar: string } | null) => void,
  resetMyUser: () => void
};

export const useMyUserStore = create<UserState & UserAction>((set) => ({
  myUser: null,
  setMyUser: (user) => set({ myUser: user }),
  resetMyUser: () => set({ myUser: null }),
}));