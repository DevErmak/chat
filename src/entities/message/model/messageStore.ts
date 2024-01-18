import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IMessageState } from './types';

export const useMessageStore = create<IMessageState>()(
  devtools(
    immer((set) => ({
      message: [],
      isLoading: false,
      setMessages: (message) =>
        set((state) => {
          state.message = message;
        }),
      addMessages: (message) =>
        set((state) => {
          state.message.push(message);
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
