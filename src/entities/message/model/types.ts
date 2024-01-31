export interface IMessageState {
  message: Array<IMessage>;
  voice: Blob[];
  isLoading: boolean;
  setMessages: (message: Array<IMessage>) => void;
  addMessages: (message: IMessage) => void;
  removeMessage: (message: IMessage) => void;
}
export interface IMessage {
  text: string | Blob;
  id: number;
  nickName: string;
  date: Date;
}
