import React, { Ref, useEffect, useRef, useState } from 'react';

import './name-room.scss';

import cn from 'classnames';
import { Button } from '../../../../shared/ui/button/Button';
import { SlActionUndo } from 'react-icons/sl';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoomStore } from '@/entities/room';
import { Typography } from '@/shared/ui';
import { socket } from '@/shared/api/socket';
import { useCookies } from 'react-cookie';

interface INameRoomProps {
  className?: string | string[];
  sizeIcon?: number;
}

export const NameRoom: React.FC<INameRoomProps> = ({ className, sizeIcon = 25 }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const nameRoom = useRoomStore((state) => state.nameRoom);
  const setNameRoom = useRoomStore((state) => state.setNameRoom);
  const setUsers = useRoomStore((state) => state.setUsers);
  const [cookie] = useCookies(['token']);

  useEffect(() => {
    // socket.connect();
    socket.emit('join room', { token: cookie.token, roomId: roomId });

    socket.emit('get name room', { roomId });

    socket.on('get name room', (nameRoom) => {
      console.log('---------------->nameRoom', nameRoom);
      setNameRoom(nameRoom);
    });
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <div className={cn('name-room', className)}>
      <Button
        type={'outline'}
        onClick={() => {
          // socket.disconnect();
          console.log('---------------->sss');
          // socket.on('disconnect user in room', (users) => {
          //   console.log('---------------->123nameRoom', users);
          //   setUsers(users);
          // });
          console.log('---------------->www');
          navigate('/rooms');
        }}
      >
        <SlActionUndo size={sizeIcon} />
        <Typography type="display-sm" isUnSelectable={true}>
          {nameRoom}
        </Typography>
      </Button>
    </div>
  );
};
