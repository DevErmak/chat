export interface IMessageState {
  message: Array<IMessage>;
  isLoading: boolean;
  setMessages: (message: Array<IMessage>) => void;
  addMessages: (message: IMessage) => void;
  removeMessage: (message: IMessage) => void;
}
export interface IMessage {
  text: string;
  id: number;
  nickName: string;
}
