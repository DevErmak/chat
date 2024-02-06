export interface IRoomsState {
  rooms: Array<IRoomDataServer>;
  users: Array<IUserDataServer>;
  nameRoom: string;
  isLoading: boolean;
  setRooms: (rooms: Array<IRoomDataServer>) => void;
  addRoom: (room: IRoomDataServer) => void;
  removeRoom: (room: IRoomDataServer) => void;
  setNameRoom: (nameRoom: string) => void;
  setUsers: (users: Array<IUserDataServer>) => void;
  addUser: (user: IUserDataServer) => void;
  removeUser: (user: IUserDataServer) => void;
}

export interface IRoomDataServer {
  id: number;
  nameRoom: string;
}
export interface IUserDataServer {
  id: number;
  nickName: string;
}
