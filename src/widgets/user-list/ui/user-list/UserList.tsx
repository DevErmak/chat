import React, { Ref, useEffect, useRef, useState } from 'react';

import './user-list.scss';

import cn from 'classnames';
import { Button } from '../../../../shared/ui/button/Button';
import { SlActionUndo } from 'react-icons/sl';
import { useNavigate, useParams } from 'react-router-dom';
// import { socket } from '@/shared/api/socket';
import { useRoomStore } from '@/entities/room';
import { Typography } from '@/shared/ui';
import { useCookies } from 'react-cookie';
import { socket } from '@/shared/api/socket';

interface INameRoomProps {
  className?: string | string[];
  sizeIcon?: number;
}

export const UserList: React.FC<INameRoomProps> = ({ className, sizeIcon = 25 }) => {
  const [cookie] = useCookies(['token']);
  console.log('---------------->cookie', cookie);
  const { roomId } = useParams();
  const users = useRoomStore((state) => state.users);
  const setUsers = useRoomStore((state) => state.setUsers);

  useEffect(() => {
    // socket.connect();

    socket.emit('get user in room', { roomId, token: cookie.token });
    console.log('---------------->sss');
    socket.on('get user in room', (users) => {
      console.log('---------------->nameUser', users);
      setUsers(users);
    });
    socket.on('user leave room', (users) => {
      console.log('---------------->123nameRoom', users);
      setUsers(users);
    });
    // return () => {
    //   socket.disconnect();
    // };
  }, []);
  console.log('---------------->users', users);
  return (
    <div className={cn('user-list', className)}>
      {users.map((user) => (
        <Typography key={user} type="display-xs">
          {user}
        </Typography>
      ))}
    </div>
  );
};
