import { useParams } from 'react-router-dom';
import './page.scss';

import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/entities/user';
import { useMessageStore } from '@/entities/message';
import { useCookies } from 'react-cookie';
import { SubmitHandler, useForm } from 'react-hook-form';

interface IFormInput {
  message: string;
}

type Props = {};
export const Chat: React.FC<any> = ({}: Props) => {
  const [message, setMessage] = useState('');

  const messages = useMessageStore((state) => state.message);
  const setMessages = useMessageStore((state) => state.setMessages);
  const addMessages = useMessageStore((state) => state.addMessages);

  // const [messages, setMessages] = useState([{ nickName: 'sd', message: 'freeBSD' }]);
  const [socket, setSocket] = useState(io('http://localhost:4000'));
  const [cookie, setCookie] = useCookies(['token']);

  const { roomId } = useParams();
  console.log('---------------->roomId', roomId);
  const userInfo = useUserStore((state) => {
    return { nickName: state.nickName, userId: state.id };
  });

  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.message.trim()) {
      console.log('---------------->aassss cookie.token', cookie.token);
      socket.emit('send message', { token: cookie.token, roomId: roomId, message: data.message });
      reset();
    }
  };

  useEffect(() => {
    const newSocket = io('http://localhost:4000');

    setSocket(newSocket);
    console.log('---------------->qqqwww');
    newSocket.emit('get prev message', { roomId });

    newSocket.on('get prev message', (msg) => {
      console.log('---------------->!!!msg', msg);
      setMessages(msg);
      console.log('---------------->222messages', messages);
    });

    newSocket.on('send message', (msg) => {
      console.log('--------------qwemsg', msg);
      addMessages(msg);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // const handleSendMessage = (e: any) => {
  //   e.preventDefault();
  //   console.log('---------------->ssss');
  //   if (message.trim()) {
  //     console.log('---------------->aassss cookie.token', cookie.token);
  //     socket.emit('send message', { token: cookie.token, roomId: roomId, message });
  //     setMessage('');
  //   }
  // };
  console.log('---------------->messagesqwqwe', messages);
  return (
    <div className="chat-page">
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg.text}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('message')} />
        <button type="submit">send message</button>
      </form>
    </div>
  );
};
