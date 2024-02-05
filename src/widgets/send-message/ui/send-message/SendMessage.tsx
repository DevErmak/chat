import { socket } from '@/shared/api/socket';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  const [widthMsgVisual, setWidthMsgVisual] = useState<number>();
  const messageVisualRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    if (messageVisualRef.current) {
      console.log('---------------->handlemessageVisualRef', messageVisualRef.current.clientWidth);
      setWidthMsgVisual(messageVisualRef.current.clientWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
  console.log('---------------->widthMsgVisual', widthMsgVisual);
  if (!navigator.mediaDevices.getUserMedia) {
    return <div>Ваш браузер не поддерживает запись аудио</div>;
  }
  return (
    <div className={cn('send-message', className)} onClick={onClick} ref={messageVisualRef}>
      <div className={'form-message'}>
        <div className={'visual-message'}>
          <Button
            type={'outline'}
            className={cn({ isRecord: !recording })}
            onClick={handleStopRecording}
          >
            <PiStopThin size={sizeIcon} />
          </Button>
          {myAudioActive ? (
            <Message
              type="voice"
              blob={audioBlob as Blob}
              visualizerRef={visualizerRef}
              audioWidth={200}
              barColor={'#2f9b43'}
              barPlayedColor={'#bef574'}
              sizeIcon={28}
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
              width={widthMsgVisual! - 77}
              height={40}
            />
          )}
        </div>
        <div className={'send-button'}>
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
    </div>
  );
};
