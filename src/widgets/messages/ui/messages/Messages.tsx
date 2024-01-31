import { useMessageStore } from '@/entities/message';
import { Message, Signature, Typography } from '@/shared/ui';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

type Props = {};
export const Messages: React.FC<any> = ({}: Props) => {
  const messages = useMessageStore((state) => state.message);
  const setMessages = useMessageStore((state) => state.setMessages);
  const addMessages = useMessageStore((state) => state.addMessages);

  const [socket, setSocket] = useState(io('http://localhost:4000'));
  // const [cookie, setCookie] = useCookies(['token']);
  const { roomId } = useParams();
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');

    setSocket(newSocket);
    console.log('---------------->34qqqwww');
    newSocket.emit('get prev message', { roomId });
    console.log('---------------->qqqwww2');

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
  console.log('---------------->messagesww', messages);

  return (
    <div>
      {messages.map((msg, i) => {
        console.log('---------------->fofofof');
        if (typeof msg.text !== 'string') {
          const blob = new Blob([msg.text], { type: 'audio/wav' });
          console.log('---------------->blob', blob);
          return (
            <Signature type={'default'} date={msg.date} nameSender={msg.nickName}>
              <Message type="voice" blob={blob} visualizerRef={visualizerRef} />
            </Signature>
          );
        } else
          return (
            <Signature type={'default'} date={msg.date} nameSender={msg.nickName}>
              <Message type="text">
                <Typography type="text-md">{msg.text}</Typography>
              </Message>
            </Signature>
          );
      })}
    </div>
  );
};
