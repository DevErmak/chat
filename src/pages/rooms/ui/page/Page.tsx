import { useLayoutEffect } from 'react';
import './page.scss';
import { axiosServerChat } from '@/shared/api/v1';
import { useUserStore } from '@/entities/user';
import homerGif from '@/shared/images/homer.gif';
import { useCookies } from 'react-cookie';
import { useRoomStore } from '@/entities/room';
import { Typography } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';

type Props = {};
export const Rooms: React.FC<any> = ({}: Props) => {
  const userInfo = useUserStore((state) => {
    return { nickName: state.nickName, userId: state.id };
  });
  const setRooms = useRoomStore((state) => state.setRooms);
  const rooms = useRoomStore((state) => state.rooms);
  const [cookie, setCookie] = useCookies(['token']);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    async function getRooms() {
      try {
        const res = await axiosServerChat.post('/rooms', {
          token: cookie.token,
        });
        if (res.data === 'user not have room') {
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

  console.log('---------------->es', rooms);
  if (rooms === undefined || rooms.length === 0)
    return (
      <div className="chat-page">
        комнат нет <img src={homerGif} alt="not rooms" />
      </div>
    );
  else
    return (
      <div className="chat-page">
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
