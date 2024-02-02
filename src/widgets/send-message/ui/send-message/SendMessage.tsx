import { socket } from '@/shared/api/socket';
import { useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import cn from 'classnames';
import './send-message.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { Button } from '@/shared/ui';
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
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStartRecording = () => {
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

  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log('---------------->data.message.trim()', data.message.trim());
    if (data.message.trim() || audioBlob !== null) {
      console.log('---------------->sendmass');
      socket.emit('send message', {
        token: cookie.token,
        roomId: roomId,
        message: audioBlob !== null ? audioBlob : data.message,
      });
      setAudioBlob(null);
      reset();
    }
  };

  if (!navigator.mediaDevices.getUserMedia) {
    return <div>Ваш браузер не поддерживает запись аудио</div>;
  }
  return (
    <div className={cn('send-message', className)} onClick={onClick}>
      {!recording ? (
        <Button type={'outline'} onClick={handleStartRecording}>
          <PiMicrophoneThin size={sizeIcon} />
        </Button>
      ) : (
        <Button type={'outline'} onClick={handleStopRecording}>
          <PiStopThin size={sizeIcon} />
        </Button>
      )}
      <form className={'form-message'} onSubmit={handleSubmit(onSubmit)}>
        {!recording ? (
          <textarea className="input-message" {...register('message')} />
        ) : (
          <LiveAudioVisualizer
            mediaRecorder={mediaRecorderRef.current as MediaRecorder}
            width={300}
            height={40}
          />
        )}
        <Button type={'outline'} ButtonType={'submit'}>
          <VscSend size={sizeIcon} />
        </Button>
      </form>
    </div>
  );
};
