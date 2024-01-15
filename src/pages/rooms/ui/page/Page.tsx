import { useLayoutEffect } from 'react';
import './page.scss';
import { axiosServerChat } from '@/shared/api/v1';
import { useUserStore } from '@/entities/user';
import { useRoomStore } from '@/entities/room/model/roomStore';
import homerGif from '@/shared/images/homer.gif';

type Props = {};
export const Rooms: React.FC<any> = ({}: Props) => {
  const userInfo = useUserStore((state) => {
    return { nickName: state.nickName, userId: state.id };
  });
  const setRooms = useRoomStore((state) => state.setRooms);
  const rooms = useRoomStore((state) => state.rooms);

  useLayoutEffect(() => {
    async function getRooms() {
      try {
        const res = await axiosServerChat.post('/rooms', {
          id: userInfo.userId,
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
        {/* <div>
        {rooms.map((data, i) => (
          <div key={i}>{data.message}</div>
        ))}
      </div> */}
      </div>
    );
};
