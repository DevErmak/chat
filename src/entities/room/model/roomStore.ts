import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IRoomDataServer, IRoomsState } from './types';

export const useRoomStore = create<IRoomsState>()(
  devtools(
    immer((set) => ({
      rooms: [],
      users: [],
      nameRoom: '',
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
      setNameRoom: (nameRoom) =>
        set((state) => {
          state.nameRoom = nameRoom;
        }),
      setUsers: (users) =>
        set((state) => {
          state.users = users;
        }),
    })),
  ),
);
