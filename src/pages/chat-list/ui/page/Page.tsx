import { useUserStore } from '@/pages/home/ui/page/Page';
import './page.scss';
import axios from 'axios';

type Props = {};
export const ChatList: React.FC<any> = ({}: Props) => {
  const nickName = useUserStore((state) => state.nickName);
  // axios.post(
  //   'http://localhost:4000/message',
  //   {
  //     nickName: nickName,
  //   },
  //   {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   },
  // );
  return (
    <div className="chat-page">
      chatlist
      {/* <div>
        {rooms.map((data, i) => (
          <div key={i}>{data.message}</div>
        ))}
      </div> */}
    </div>
  );
};
