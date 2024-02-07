import React, { Ref, useEffect, useRef, useState } from 'react';

import './name-room.scss';

import cn from 'classnames';
import { Button } from '../../../../shared/ui/button/Button';
import { SlActionUndo } from 'react-icons/sl';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoomStore } from '@/entities/room';
import { Typography } from '@/shared/ui';
import { socket } from '@/shared/api/socket';

interface INameRoomProps {
  className?: string | string[];
  sizeIcon?: number;
}

export const NameRoom: React.FC<INameRoomProps> = ({ className, sizeIcon = 25 }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const nameRoom = useRoomStore((state) => state.nameRoom);
  const setNameRoom = useRoomStore((state) => state.setNameRoom);

  useEffect(() => {
    // socket.connect();
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
          socket.disconnect();
          // navigate('/rooms');
        }}
      >
        <SlActionUndo size={sizeIcon} />
      </Button>
      <Typography type="display-sm">{nameRoom}</Typography>
    </div>
  );
};
