import { useLayoutEffect } from 'react';
import './page.scss';
import { axiosServerChat } from '@/shared/api/v1';
import { useUserStore } from '@/entities/user';
import homerGif from '@/shared/images/homer.gif';
import { useCookies } from 'react-cookie';
import { useRoomStore } from '@/entities/room';
import { Button, Typography } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
interface IFormInput {
  roomName: string;
}
type Props = {};
export const Rooms: React.FC<any> = ({}: Props) => {
  const userInfo = useUserStore((state) => {
    return { nickName: state.nickName, userId: state.id };
  });
  const setRooms = useRoomStore((state) => state.setRooms);
  const rooms = useRoomStore((state) => state.rooms);
  const addRoom = useRoomStore((state) => state.addRoom);
  const [cookie, setCookie] = useCookies(['token']);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    async function getRooms() {
      try {
        const res = await axiosServerChat.get('/rooms');
        if (res.data === 'not have room') {
          setRooms([]);
        } else {
          setRooms(res.data);
        }
      } catch {
        setRooms([]);
      }
    }
    getRooms();
  }, []);

  const handleRoomClick = (roomId: number) => {
    navigate(`/rooms/${roomId}`);
  };

  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const res = await axiosServerChat.post('/createRoom', {
        roomName: data.roomName,
      });
      console.log('---------------->res.data', res.data);
      addRoom(res.data);
    } catch {
      return <Typography type="text-md">комната не создана</Typography>;
    }
  };

  console.log('---------------->es', rooms);
  if (rooms === undefined || rooms.length === 0)
    return (
      <div className="chat-page">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('roomName')} />
          <button type="submit">добавить комнату</button>
        </form>
        комнат нет <img src={homerGif} alt="not rooms" />
      </div>
    );
  else
    return (
      <div className="chat-page">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('roomName')} />
          <button type="submit">добавить комнату</button>
        </form>
        <div>
          {rooms.map((data: any, i) => (
            <Typography type="text-md" key={i} onClick={() => handleRoomClick(data.room_id)}>
              {data.room_id}
            </Typography>
          ))}
        </div>
      </div>
    );
};
