import { socket } from '@/shared/api/socket';
import './page.scss';

import { Messages } from '@/widgets/messages';
import { NameRoom } from '@/widgets/name-room';
import { SendMessage } from '@/widgets/send-message';
import { UserList } from '@/widgets/user-list';
import { useEffect } from 'react';
import { useBeforeUnload, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

// const MicRecorder = require('mic-recorder-to-mp3');

// import { MicRecorder  from 'mic-recorder-to-mp3';
// import {
//   ReactMediaRecorder,
//   ReactMediaRecorderRenderProps,
//   useReactMediaRecorder,
// } from 'react-media-recorder';

// interface IFormInput {
//   message: string;
// }

type Props = {};
export const Chat: React.FC<any> = ({}: Props) => {
  const { roomId } = useParams();
  const [cookie] = useCookies(['token']);

  // useEffect(() => {
  //   console.log('---------------->join');
  //   // socket.emit('join room', { token: cookie.token, roomId: roomId });
  //   return () => {
  //     console.log('---------------->leave');
  //     socket.emit('user leave room', { roomId, token: cookie.token });
  //   };
  // }, []);

  useBeforeUnload(() => {
    socket.emit('user leave room', { roomId, token: cookie.token });
  });
  return (
    <div className="chat-page">
      <NameRoom sizeIcon={20} />
      <UserList />
      <Messages />
      <SendMessage />
    </div>
  );
};
