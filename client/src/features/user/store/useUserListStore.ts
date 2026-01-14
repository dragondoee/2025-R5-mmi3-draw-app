import { create } from 'zustand'
import type { User } from '../../../shared/types/user.type';

type UserState = {
  userList: User[];
  userDrawingList: Map<User['id'], boolean>; // Liste des utilisateurs qui dessinent ou pas
}

type UserAction = {
  setUserList: (users: User[]) => void,
  setUserDrawingList: (users: Map<User['id'], boolean>) => void,
};

export const useUserListStore = create<UserState & UserAction>((set) => ({
  userList: [],
  userDrawingList: new Map(),
  setUserList: (userList) => set({ userList }),
  setUserDrawingList: (userDrawingList) => set({ userDrawingList }),
}));