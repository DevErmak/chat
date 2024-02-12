import { Button, Typography } from '@/shared/ui';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import homerGif from '@/shared/images/homer.gif';

import cn from 'classnames';
import './rooms.scss';
import { socket } from '@/shared/api/socket';
import { useRoomStore } from '@/entities/room';
import uuid from 'react-uuid';

interface IRoomsProps {
  className?: string | string[];
  onClick?: () => void;
}
export const Rooms: React.FC<IRoomsProps> = ({ className, onClick }) => {
  const rooms = useRoomStore((state) => state.rooms);
  const navigate = useNavigate();
  const setRooms = useRoomStore((state) => state.setRooms);
  const addRoom = useRoomStore((state) => state.addRoom);

  const handleRoomClick = (roomId: number) => {
    navigate(`/rooms/${roomId}`);
  };
  useEffect(() => {
    // const socket = io('http://localhost:4000');
    // socket.connect();
    console.log('---------------->qqq');
    // socket.emit('get rooms');

    // console.log('---------------->wqqq');
    // socket.on('get rooms', (data) => {
    //   console.log('---------------->!!!rooms', data);
    //   if (data === 'not have room') {
    //     setRooms([]);
    //     console.log('---------------->!!!noroom', rooms);
    //   } else {
    //     setRooms(data);
    //   }
    //   console.log('---------------->wsqqq');
    // });

    // socket.on('add room', (room) => {
    //   console.log('--------------add room', room);
    //   addRoom(room);
    // });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);
  console.log('---------------->es', rooms);
  if (rooms === undefined || rooms.length === 0)
    return (
      <Typography type="text-md" isUnSelectable={true} className="not_rooms">
        комнат нет
      </Typography>
    );
  else
    return (
      <div className="rooms">
        {rooms.map((room: any, i) => (
          <Button type="outline" className={'button_room'} key={uuid()}>
            <Typography
              type="text-md"
              key={uuid()}
              onClick={() => handleRoomClick(room.id)}
              className={'rooms name_room'}
            >
              {room.name}
            </Typography>
          </Button>
        ))}
      </div>
    );
};
