import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IMessageState } from './types';
import isBuffer from 'is-buffer';

export const useMessageStore = create<IMessageState>()(
  devtools(
    immer((set) => ({
      message: [],
      voice: [],
      isLoading: false,
      setMessages: (message) =>
        set((state) => {
          const aVoice: Array<Blob> = [];
          const sortMessage = message.sort((a, b) => {
            if (isBuffer(b.text)) {
              aVoice.push(new Blob([b.text], { type: 'audio/wav' }));
            }
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          state.message = sortMessage;
          state.voice = aVoice;
        }),
      addMessages: (message) =>
        set((state) => {
          state.message.push(message);
          if (isBuffer(message.text)) {
            state.voice.push(new Blob([message.text], { type: 'audio/wav' }));
          }
        }),
      removeMessage: (message) =>
        set((state) => {
          state.message = state.message.filter(
            (currentMessage) => currentMessage.id !== message.id,
          );
        }),
    })),
  ),
);
