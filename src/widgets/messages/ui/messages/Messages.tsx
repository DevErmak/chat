import { useMessageStore } from '@/entities/message';
import { Signature, Typography, VoiceMessage } from '@/shared/ui';
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
  // const [activeComponentIndex, setActiveComponentIndex] = useState(-1);
  // const handleComponentClick = (i: number) => {
  //   setActiveComponentIndex(i);
  // };

  return (
    <div className={cn('messages', className)} onClick={onClick}>
      {messages.map((msg, i) => {
        if (typeof msg.text !== 'string') {
          const blob = new Blob([msg.text], { type: 'audio/wav' });
          const UrlAudio = URL.createObjectURL(blob);
          return (
            <Signature type={'default'} date={msg.date} nameSender={msg.nickName} key={uuid()}>
              <VoiceMessage
                // isActive={i === activeComponentIndex}
                type="voice"
                blob={blob}
                UrlAudio={UrlAudio}
                key={uuid()}
                index={uuid()}
                // onClick={() => handleComponentClick(i)}
              />
            </Signature>
          );
        } else
          return (
            <Signature type={'default'} date={msg.date} nameSender={msg.nickName} key={uuid()}>
              <Typography type="text-md" key={uuid()} className={'message text'}>
                {msg.text}
              </Typography>
            </Signature>
          );
      })}
    </div>
  );
};
