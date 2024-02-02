import { useMessageStore } from '@/entities/message';
import { socket } from '@/shared/api/socket';
import { Message, Signature, Typography } from '@/shared/ui';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import cn from 'classnames';
import './messages.scss';

type Props = {};

interface IMessagesProps {
  className?: string | string[];
  onClick?: () => void;
}
export const Messages: React.FC<IMessagesProps> = ({ className, onClick }) => {
  const messages = useMessageStore((state) => state.message);
  const setMessages = useMessageStore((state) => state.setMessages);
  const addMessages = useMessageStore((state) => state.addMessages);

  const { roomId } = useParams();
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    socket.emit('get prev message', { roomId });

    socket.on('get prev message', (msg) => {
      setMessages(msg);
    });

    socket.on('send message', (msg) => {
      console.log('--------------qwemsg', msg);
      addMessages(msg);
    });

    console.log('--------------q');

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
