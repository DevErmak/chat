export interface IRoomsState {
  rooms: Array<IRoomDataServer>;
  isLoading: boolean;
  setRooms: (rooms: Array<IRoomDataServer>) => void;
  addRoom: (room: IRoomDataServer) => void;
  removeRoom: (room: IRoomDataServer) => void;
}

export interface IRoomDataServer {
  id: number;
  nameRoom: string;
}
