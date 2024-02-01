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
          console.log('---------------->messagestore', message);
          const aVoice = message.map((msg) => {
            if (isBuffer(msg.text)) {
              console.log('---------------->q1wwqq');
              return new Blob([msg.text], { type: 'audio/wav' });
            }
          });
          state.message = message;
          console.log('---------------->aVoice', aVoice);
          if (aVoice !== undefined) state.voice = aVoice as Blob[];
        }),
      addMessages: (message) =>
        set((state) => {
          console.log('---------------->12422message', message);
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
