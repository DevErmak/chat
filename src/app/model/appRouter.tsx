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
  const clearMe = useUserStore((state) => state.clearMe);

  useEffect(() => {
    if (!(cookie.hasOwnProperty('token') && cookie.token !== 'undefined')) {
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
    // {
    //   path: '/users',
    //   element: (
    //     <GuestGuard>
    //       <UserList />
    //     </GuestGuard>
    //   ),
    // },
  ]);
