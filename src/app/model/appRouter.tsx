import { Chat } from '@/pages/chat';
import { ChatList } from '@/pages/chat-list';
import { Home } from '@/pages/home';
import { createBrowserRouter } from 'react-router-dom';

export const appRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/message/:chatID',
      element: <Chat />,
    },
    {
      path: '/message',
      element: <ChatList />,
    },
  ]);
