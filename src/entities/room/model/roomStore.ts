import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IRoomDataServer, IRoomsState } from './types';

export const useRoomStore = create<IRoomsState>()(
  devtools(
    immer((set) => ({
      rooms: [],
      isLoading: false,
      setRooms: (rooms) =>
        set((state) => {
          state.rooms = rooms;
        }),
      addRoom: (room) =>
        set((state) => {
          state.rooms.push(room);
        }),
      removeRoom: (room) =>
        set((state) => {
          state.rooms = state.rooms.filter((roomsId: IRoomDataServer) => roomsId.id !== room.id);
        }),
    })),
  ),
);
