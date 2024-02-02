import { socket } from '@/shared/api/socket';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import cn from 'classnames';
import './send-message.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { Button, Message } from '@/shared/ui';
import { PiMicrophoneThin } from 'react-icons/pi';
import { VscSend } from 'react-icons/vsc';
import { PiStopThin } from 'react-icons/pi';

interface IFormInput {
  message: string;
}

interface ISendMessageProps {
  sizeIcon?: number;
  className?: string | string[];
  onClick?: () => void;
}
export const SendMessage: React.FC<ISendMessageProps> = ({ className, onClick, sizeIcon = 25 }) => {
  const [cookie, setCookie] = useCookies(['token']);

  const { roomId } = useParams();

  const [recording, setRecording] = useState(false);
  const [myAudioActive, setMyAudioActive] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [textValue, setTextValue] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  const handleStartRecording = () => {
    setMyAudioActive(false);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
          setMyAudioActive(true);
        };

        mediaRecorder.start();
        setRecording(true);
      })
      .catch((error) => {
        console.error('Error accessing audio stream:', error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSendMsg = () => {
    console.log(textValue);
    if (textValue.trim() || audioBlob !== null) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }
      console.log('---------------->sendmass');
      socket.emit('send message', {
        token: cookie.token,
        roomId: roomId,
        message: audioBlob !== null ? audioBlob : textValue,
      });
      setAudioBlob(null);
      setTextValue('');
      setMyAudioActive(false);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!navigator.mediaDevices.getUserMedia) {
    return <div>Ваш браузер не поддерживает запись аудио</div>;
  }
  return (
    <div className={cn('send-message', className)} onClick={onClick}>
      <Button
        type={'outline'}
        className={cn({ isRecord: !recording })}
        onClick={handleStopRecording}
      >
        <PiStopThin size={sizeIcon} />
      </Button>
      <div className={'form-message'}>
        {myAudioActive ? (
          <Message
            type="voice"
            blob={audioBlob as Blob}
            visualizerRef={visualizerRef}
            audioWidth={280}
            barColor={'#2f9b43'}
            barPlayedColor={'#bef574'}
          />
        ) : !recording ? (
          <textarea
            ref={textareaRef}
            className="input-message"
            value={textValue}
            onChange={(e) => {
              const textarea = textareaRef.current;
              if (textarea) {
                textarea.style.height = `${40}px`;
                const scrollY = textarea.scrollHeight || 0;
                textarea.style.height = `${scrollY}px`;
              }
              setTextValue(e.target.value);
            }}
          />
        ) : (
          <LiveAudioVisualizer
            mediaRecorder={mediaRecorderRef.current as MediaRecorder}
            width={300}
            height={40}
          />
        )}
        {textValue.length > 0 || myAudioActive || recording ? (
          <Button type={'outline'} ButtonType={'submit'} onClick={() => handleSendMsg()}>
            <VscSend size={sizeIcon} />
          </Button>
        ) : (
          <Button type={'outline'} onClick={handleStartRecording}>
            <PiMicrophoneThin size={sizeIcon} />
          </Button>
        )}
      </div>
    </div>
  );
};
