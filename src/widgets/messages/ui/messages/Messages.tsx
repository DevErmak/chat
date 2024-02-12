import { useMessageStore } from '@/entities/message';
import { Message, Signature, Typography } from '@/shared/ui';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import cn from 'classnames';
import './messages.scss';
import { socket } from '@/shared/api/socket';
import { useCookies } from 'react-cookie';
import uuid from 'react-uuid';

interface IMessagesProps {
  className?: string | string[];
  onClick?: () => void;
}
export const Messages: React.FC<IMessagesProps> = ({ className, onClick }) => {
  const messages = useMessageStore((state) => state.message);
  const setMessages = useMessageStore((state) => state.setMessages);
  const addMessages = useMessageStore((state) => state.addMessages);
  const [cookie] = useCookies(['token']);

  const { roomId } = useParams();
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // socket.connect();
    // socket.emit('join room', { token: cookie.token, roomId: roomId });

    // socket.emit('get prev message', { roomId });

    // socket.on('get prev message', (msg) => {
    //   setMessages(msg);
    // });

    // socket.on('send message', (msg) => {
    //   console.log('--------------qwemsg', msg);
    //   addMessages(msg);
    // });

    console.log('--------------mesgeuseeefect');

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <div className={cn('messages', className)} onClick={onClick}>
      {messages.map((msg) => {
        if (typeof msg.text !== 'string') {
          const blob = new Blob([msg.text], { type: 'audio/wav' });
          return (
            <Signature type={'default'} date={msg.date} nameSender={msg.nickName} key={uuid()}>
              <Message type="voice" blob={blob} visualizerRef={visualizerRef} key={uuid()} />
            </Signature>
          );
        } else
          return (
            <Signature type={'default'} date={msg.date} nameSender={msg.nickName} key={uuid()}>
              <Message type="text" key={uuid()}>
                <Typography type="text-md" key={uuid()}>
                  {msg.text}
                </Typography>
              </Message>
            </Signature>
          );
      })}
    </div>
  );
};
