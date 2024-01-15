import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IRoomsState } from './types';

export const useRoomStore = create<IRoomsState>()(
  devtools(
    immer((set) => ({
      rooms: [],
      isLoading: false,
      setRooms: (idRooms) =>
        set((state) => {
          state.rooms = idRooms;
        }),
      removeRoom: (id) =>
        set((state) => {
          state.rooms = state.rooms.filter((roomsId) => roomsId !== id);
        }),
    })),
  ),
);
