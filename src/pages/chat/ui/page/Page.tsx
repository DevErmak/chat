import { socket } from '@/shared/api/socket';
import './page.scss';

import { Messages } from '@/widgets/messages';
import { NameRoom } from '@/widgets/name-room';
import { SendMessage } from '@/widgets/send-message';
import { UserList } from '@/widgets/user-list';
import { useEffect } from 'react';

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
  // useEffect(() => {
  //   socket.connect();
  //   // return () => {
  //   //   socket.disconnect();
  //   // };
  // }, []);
  return (
    <div className="chat-page">
      <NameRoom sizeIcon={20} />
      <UserList />
      <Messages className={'chat-page'} />
      <SendMessage className={'chat-page'} />
    </div>
  );
};
