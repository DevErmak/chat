import { Chat } from '@/pages/chat';
import { Home } from '@/pages/home';
import { Rooms } from '@/pages/rooms';
import { UserList } from '@/pages/user-list';
import { createBrowserRouter } from 'react-router-dom';

export const appRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/rooms/:chatID',
      element: <Chat />,
    },
    {
      path: '/rooms',
      element: <Rooms />,
    },
    {
      path: '/users',
      element: <UserList />,
    },
  ]);
