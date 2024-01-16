export interface IUserState {
  nickName: string;
  id: number;
  isLoading: boolean;
  setUserInfo: (nickName: string, id: number) => void;
  clearMe: (id: number) => void;
}

export interface IUserDataServer {
  user_id: number;
  nickname: string;
  createdAt?: string;
  updatedAt?: string;
}
