import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IMessageState } from './types';

export const useMessageStore = create<IMessageState>()(
  devtools(
    immer((set) => ({
      message: [],
      voice: [],
      UrlCurrentVoice: '',
      activeVoice: false,
      audioElement: new Audio(),
      isLoading: false,
      setMessages: (message) =>
        set((state) => {
          const aVoice = message.filter((msg) => typeof msg.text !== 'string');
          state.message = message;
          state.voice = aVoice;
        }),
      addMessages: (message) =>
        set((state) => {
          state.message.unshift(message);
          if (typeof message.text !== 'string') {
            state.voice.unshift(message);
          }
        }),
      removeMessage: (message) =>
        set((state) => {
          state.message = state.message.filter(
            (currentMessage) => currentMessage.id !== message.id,
          );
        }),
      setUrlCurrentVoice: (blob) =>
        set((state) => {
          state.UrlCurrentVoice = URL.createObjectURL(blob);
        }),
      setActiveVoice: (isActive: boolean) =>
        set((state) => {
          state.activeVoice = isActive;
        }),
    })),
  ),
);
