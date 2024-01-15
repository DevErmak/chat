export interface IUserState {
  nickName: string;
  id: number;
  isLoading: boolean;
  setUserInfo: (nickName: string, id: number) => void;
  clearMe: (id: number) => void;
}

export interface IUserDataServer {
  nickName: string;
  id: number;
}
