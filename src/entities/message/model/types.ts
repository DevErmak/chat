export interface IMessageState {
  message: Array<IMessage>;
  voice: Array<IMessage>;
  isLoading: boolean;
  activeVoice: boolean;
  UrlCurrentVoice: string;
  activeComponentIndex: string;
  audioElement: HTMLAudioElement;
  setMessages: (message: Array<IMessage>) => void;
  addMessages: (message: IMessage) => void;
  removeMessage: (message: IMessage) => void;
  setUrlCurrentVoice: (blob: Blob) => void;
  setActiveVoice: (isActive: boolean) => void;
  setActiveComponentIndex: (id: string) => void;
}
export interface IMessage {
  text: string | Blob;
  id: number;
  nickName: string;
  date: Date;
}
