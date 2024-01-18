import { useUserStore } from '@/entities/user';
import { Chat } from '@/pages/chat';
import { Home } from '@/pages/home';
import { Rooms } from '@/pages/rooms';
import { UserList } from '@/pages/user-list';
import { DefaultLayout } from '@/widgets/layout';
import { ReactElement, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { createBrowserRouter, useNavigate } from 'react-router-dom';

type GuestGuardProps = {
  children: ReactElement;
};

function GuestGuard({ children }: GuestGuardProps) {
  const [cookie] = useCookies(['token']);
  const navigate = useNavigate();
  console.log('---------------->cookUserId', cookie);
  const clearMe = useUserStore((state) => state.clearMe);

  useEffect(() => {
    console.log('---------------->cookUas');
    if (!(cookie.hasOwnProperty('token') && cookie.token !== 'undefined')) {
      console.log('---------------->asdasd');
      clearMe();
      navigate('/');
    }
  }, [cookie]);

  return children;
}

export const appRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/',
      element: <DefaultLayout />,
      children: [
        {
          path: '/rooms/:roomId',
          element: (
            <GuestGuard>
              <Chat />
            </GuestGuard>
          ),
        },
        {
          path: '/rooms',
          element: (
            <GuestGuard>
              <Rooms />
            </GuestGuard>
          ),
        },
        {
          path: '/users',
          element: (
            <GuestGuard>
              <UserList />
            </GuestGuard>
          ),
        },
      ],
    },
  ]);
