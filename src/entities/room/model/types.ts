export interface IRoomsState {
  rooms: Array<IRoomDataServer>;
  users: string[];
  nameRoom: string;
  isLoading: boolean;
  setRooms: (rooms: Array<IRoomDataServer>) => void;
  addRoom: (room: IRoomDataServer) => void;
  removeRoom: (room: IRoomDataServer) => void;
  setNameRoom: (nameRoom: string) => void;
  setUsers: (users: Array<string>) => void;
}

export interface IRoomDataServer {
  id: number;
  nameRoom: string;
}
