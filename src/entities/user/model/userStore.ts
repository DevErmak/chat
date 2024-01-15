import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IUserState } from './types';

export const useUserStore = create<IUserState>()(
  devtools(
    immer((set) => ({
      nickName: '',
      id: -1,
      isLoading: false,
      setUserInfo: (nickName, id) =>
        set((state) => {
          state.nickName = nickName;
          state.id = id;
        }),
      clearMe: () =>
        set((state) => {
          state.nickName = '';
          state.id = -1;
        }),
    })),
  ),
);
