import React, { Ref, useEffect, useRef, useState } from 'react';

import './user-list.scss';

import cn from 'classnames';
import { Button } from '../../../../shared/ui/button/Button';
import { SlActionUndo } from 'react-icons/sl';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '@/shared/api/socket';
import { useRoomStore } from '@/entities/room';
import { Typography } from '@/shared/ui';

interface INameRoomProps {
  className?: string | string[];
  sizeIcon?: number;
}

export const UserList: React.FC<INameRoomProps> = ({ className, sizeIcon = 25 }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const users = useRoomStore((state) => state.users);
  const setUsers = useRoomStore((state) => state.setUsers);

  useEffect(() => {
    socket.emit('get user in room', { roomId });
    console.log('---------------->sss');
    socket.on('get user in room', (users) => {
      console.log('---------------->nameRoom', users);
      setUsers(users);
    });
  }, []);

  return (
    <div className={cn('user-list', className)}>
      {users.map((user) => (
        <Typography type="display-sm">{user.nickName}</Typography>
      ))}
    </div>
  );
};
