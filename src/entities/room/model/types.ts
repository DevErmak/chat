export interface IRoomsState {
  rooms: Array<number>;
  isLoading: boolean;
  setRooms: (idRooms: Array<number>) => void;
  removeRoom: (id: number) => void;
}

export interface IRoomDataServer {
  id: number;
}
