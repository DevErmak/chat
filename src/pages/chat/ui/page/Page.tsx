import { socket } from '@/shared/api/socket';
import './page.scss';

import { Messages } from '@/widgets/messages';
import { NameRoom } from '@/widgets/name-room';
import { SendMessage } from '@/widgets/send-message';
import { UserList } from '@/widgets/user-list';
import { useEffect, useLayoutEffect } from 'react';
import { useBeforeUnload, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useRoomStore } from '@/entities/room';
import { useMessageStore } from '@/entities/message';

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
  const setUsers = useRoomStore((state) => state.setUsers);
  const setMessages = useMessageStore((state) => state.setMessages);
  const addMessages = useMessageStore((state) => state.addMessages);
  const setNameRoom = useRoomStore((state) => state.setNameRoom);

  useLayoutEffect(() => {
    console.log('---------------->join chat page use effect');
    socket.emit('join room', { token: cookie.token, roomId: roomId });

    socket.emit('get name room', { roomId });

    socket.on('get name room', (nameRoom) => {
      console.log('---------------->nameRoom', nameRoom);
      setNameRoom(nameRoom);
    });

    socket.emit('get user in room', { roomId, token: cookie.token });
    console.log('---------------->sss');
    socket.on('get user in room', (users) => {
      console.log('---------------->nameUser', users);
      setUsers(users);
    });
    socket.emit('get prev message', { roomId });

    socket.on('get prev message', (msg) => {
      setMessages(msg);
    });

    socket.on('send message', (msg) => {
      console.log('--------------qwemsg', msg);
      addMessages(msg);
    });

    
    return () => {
      console.log('---------------->leave');
      socket.emit('user leave room', { roomId, token: cookie.token });
    };
  }, []);

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
