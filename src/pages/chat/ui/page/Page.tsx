import { useParams } from 'react-router-dom';
import './page.scss';

import io from 'socket.io-client';
import { useEffect, useState } from 'react';

type Props = {};
export const Chat: React.FC<any> = ({}: Props) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{ nickName: 'sd', message: 'freeBSD' }]);
  const [socket, setSocket] = useState(io('http://localhost:4000'));
  const [username, setUsername] = useState('');
  useEffect(() => {
    const newSocket = io('http://localhost:4000');

    setSocket(newSocket);

    newSocket.on('chat message', (msg) => {
      console.log('---------------->msg', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
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
    if (message.trim() && username.trim()) {
      socket.emit('chat message', { userId: 1, roomId: 1, message });
      setMessage('');
    }
  };
  return (
    <div className="chat-page">
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.nickName}: </strong>
            {msg.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="enter/create a username"
        />
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
