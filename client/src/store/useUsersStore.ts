import { create } from 'zustand'

type UserState = {
  users: {username: string, avatar: string;}[];
}

type UserAction = {
  setUsers: (users: { username: string, avatar: string;}[]) => void,
  resetUsers: () => void
};

export const useUsersStore = create<UserState & UserAction>((set) => ({
  users: [],
  setUsers: (users) => set({ users: users }),
  resetUsers: () => set({ users: [] }),
}));