import { useParams } from 'react-router-dom';
import './page.scss';

import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/entities/user';
import { useMessageStore } from '@/entities/message';
import { useCookies } from 'react-cookie';

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

  useEffect(() => {
    const newSocket = io('http://localhost:4000');

    setSocket(newSocket);

    newSocket.emit('get prev message', { roomId });

    newSocket.on('get prev message', (msg) => {
      console.log('---------------->!!!msg', msg);
      setMessages(msg);
    });

    newSocket.on('sent message', (msg) => {
      console.log('--------------qwemsg', msg);
      addMessages(msg);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    console.log('---------------->ssss');
    if (message.trim()) {
      console.log('---------------->aassss');
      socket.emit('sent message', { token: cookie.token, roomId: roomId, message });
      setMessage('');
    }
  };
  console.log('---------------->messagesqwqwe', messages);
  return (
    <div className="chat-page">
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg.text}</li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Start typing the message"
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};
