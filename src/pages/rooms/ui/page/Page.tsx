import { useEffect, useLayoutEffect, useState } from 'react';
import './page.scss';
import { axiosServerChat } from '@/shared/api/v1';
import { useUserStore } from '@/entities/user';
import homerGif from '@/shared/images/homer.gif';
import { useCookies } from 'react-cookie';
import { useRoomStore } from '@/entities/room';
import { Button, Typography } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
// import { io } from 'socket.io-client';
import { socket } from '@/shared/api/socket';
import { Rooms } from '@/widgets/rooms/ui/rooms/Rooms';
import { ReactComponent as SvgAddRoom } from '@/shared/ui/svg/add-box.svg';

interface IFormInput {
  roomName: string;
}
type Props = {};
export const RoomPage: React.FC<any> = ({}: Props) => {
  // const userInfo = useUserStore((state) => {
  //   return { nickName: state.nickName, userId: state.id };
  // });
  // const setRooms = useRoomStore((state) => state.setRooms);
  const rooms = useRoomStore((state) => state.rooms);
  // const addRoom = useRoomStore((state) => state.addRoom);
  const [cookie, setCookie] = useCookies(['token']);
  const setRooms = useRoomStore((state) => state.setRooms);
  const addRoom = useRoomStore((state) => state.addRoom);

  useEffect(() => {
    // const socket = io('http://localhost:4000');
    // socket.connect();
    console.log('---------------->qqq');
    socket.emit('get rooms');

    // console.log('---------------->wqqq');
    socket.on('get rooms', (data) => {
      console.log('---------------->!!!rooms', data);
      if (data === 'not have room') {
        setRooms([]);
        console.log('---------------->!!!noroom', rooms);
      } else {
        setRooms(data);
      }
      console.log('---------------->wsqqq');
    });

    socket.on('add room', (room) => {
      console.log('--------------add room', room);
      addRoom(room);
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  // const [socket, setSocket] = useState(io('http://localhost:4000'));

  // useLayoutEffect(() => {
  //   async function getRooms() {
  //     try {
  //       const res = await axiosServerChat.get('/rooms');
  //       if (res.data === 'not have room') {
  //         setRooms([]);
  //       } else {
  //         setRooms(res.data);
  //       }
  //     } catch {
  //       setRooms([]);
  //     }
  //   }
  //   getRooms();
  // }, []);

  // useEffect(() => {
  //   const newSocket = io('http://localhost:4000');

  //   setSocket(newSocket);
  //   console.log('---------------->qqq');
  //   newSocket.emit('get rooms');

  //   console.log('---------------->wqqq');
  //   newSocket.on('get rooms', (data) => {
  //     console.log('---------------->!!!rooms', data);
  //     if (data === 'not have room') {
  //       setRooms([]);
  //       console.log('---------------->!!!noroom', rooms);
  //     } else {
  //       setRooms(data);
  //     }
  //     console.log('---------------->wsqqq');
  //   });

  //   newSocket.on('add room', (room) => {
  //     console.log('--------------add room', room);
  //     addRoom(room);
  //   });

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);
  // useEffect(() => {
  //   socket.connect();
  //   // return () => {
  //   //   socket.disconnect();
  //   // };
  // }, []);
  // useEffect(() => {
  //   // const socket = io('http://localhost:4000');
  //   // socket.connect();
  //   console.log('---------------->qqq');
  //   socket.emit('get rooms');

  //   console.log('---------------->wqqq');
  //   socket.on('get rooms', (data) => {
  //     console.log('---------------->!!!rooms', data);
  //     if (data === 'not have room') {
  //       setRooms([]);
  //       console.log('---------------->!!!noroom', rooms);
  //     } else {
  //       setRooms(data);
  //     }
  //     console.log('---------------->wsqqq');
  //   });

  //   socket.on('add room', (room) => {
  //     console.log('--------------add room', room);
  //     addRoom(room);
  //   });

  //   // return () => {
  //   //   socket.disconnect();
  //   // };
  // }, []);

  const { register, handleSubmit, watch } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.roomName.trim())
      socket.emit('add room', { token: cookie.token, roomName: data.roomName });
    // const res = await axiosServerChat.post('/createRoom', {
    //   roomName: data.roomName,
    // });
    // console.log('---------------->res.data', res.data);
    // addRoom(res.data);
  };

  console.log('---------------->es', rooms);

  const isHaveText = (val: string): boolean => {
    console.log('---------------->val', val);
    if (val.trim() === '') {
      console.log('---------------->bubq');
      return true;
    }
    console.log('---------------->bq');
    return false;
  };
  const watchShow = watch('roomName', '');
  return (
    <div className="room-page">
      <form onSubmit={handleSubmit(onSubmit)} className="form_name_room">
        <input {...register('roomName')} className="input_name_room" />
        <Button
          ButtonType={'submit'}
          className="button_name_room"
          type={'outline'}
          disabled={isHaveText(watchShow)}
        >
          <SvgAddRoom width={25} height={25} />
        </Button>
      </form>
      <Rooms />
    </div>
  );
};
