import { socket } from '@/shared/api/socket';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import cn from 'classnames';
import './send-message.scss';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { Button, VoiceMessage } from '@/shared/ui';
import { PiMicrophoneThin } from 'react-icons/pi';
import { VscSend } from 'react-icons/vsc';
import { PiStopThin } from 'react-icons/pi';
import { IoPlayOutline } from 'react-icons/io5';
import { HiOutlinePause } from 'react-icons/hi2';
import { RxCross2 } from 'react-icons/rx';
import fixWebmDuration from 'webm-duration-fix';

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
  const [UrlAudio, setUrlAudio] = useState<string | null>(null);
  const [textValue, setTextValue] = useState('');
  const [toggleSound, setToggleSound] = useState(true);
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

        mediaRecorder.onstop = async () => {
          const audioBlob = await fixWebmDuration(new Blob([...chunks], { type: 'audio/wav' }));
          setAudioBlob(audioBlob);
          setUrlAudio(URL.createObjectURL(audioBlob));
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

  const handleDeleteVoice = () => {
    setAudioBlob(null);
    setTextValue('');
    setMyAudioActive(false);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  console.log('---------------->widthMsgVisual', widthMsgVisual);
  if (!navigator.mediaDevices.getUserMedia) {
    return <div>Ваш браузер не поддерживает запись аудио</div>;
  }
  return (
    <div className={cn('send-message', className)} onClick={onClick} ref={messageVisualRef}>
      <Button
        type={'outline'}
        className={cn({ isRecord: !recording })}
        onClick={handleStopRecording}
      >
        <PiStopThin size={sizeIcon} />
      </Button>
      {myAudioActive ? (
        <Button className={'button_play'} type="outline" onClick={() => handleDeleteVoice()}>
          <RxCross2 size={sizeIcon} />
        </Button>
      ) : null}
      {myAudioActive ? (
        toggleSound ? (
          <Button
            className={'button_play'}
            type="outline"
            onClick={() => {
              setToggleSound(!toggleSound);
            }}
          >
            <IoPlayOutline size={sizeIcon} />
          </Button>
        ) : (
          <Button
            className={'button_play'}
            type="outline"
            onClick={() => {
              setToggleSound(!toggleSound);
            }}
          >
            <HiOutlinePause size={sizeIcon} />
          </Button>
        )
      ) : null}
      <div className={'form-message'}>
        {myAudioActive ? (
          <VoiceMessage
            type="voice"
            blob={audioBlob as Blob}
            UrlAudio={UrlAudio as string}
            audioWidth={230}
            barColor={'#2f9b43'}
            barPlayedColor={'#bef574'}
            sizeIcon={28}
            isWithButton={true}
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
  );
};
