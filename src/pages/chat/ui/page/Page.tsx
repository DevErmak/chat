import { useParams } from 'react-router-dom';
import './page.scss';

import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/entities/user';
import { useMessageStore } from '@/entities/message';
import { useCookies } from 'react-cookie';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosServerChat } from '@/shared/api/v1';
import isBlob from 'is-blob';
import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize';
import isBuffer from 'is-buffer';
import { Message, Signature, Typography } from '@/shared/ui';

// const MicRecorder = require('mic-recorder-to-mp3');

// import { MicRecorder  from 'mic-recorder-to-mp3';
// import {
//   ReactMediaRecorder,
//   ReactMediaRecorderRenderProps,
//   useReactMediaRecorder,
// } from 'react-media-recorder';

interface IFormInput {
  message: string;
}

type Props = {};
export const Chat: React.FC<any> = ({}: Props) => {
  const messages = useMessageStore((state) => state.message);
  const setMessages = useMessageStore((state) => state.setMessages);
  const addMessages = useMessageStore((state) => state.addMessages);

  const [socket, setSocket] = useState(io('http://localhost:4000'));
  const [cookie, setCookie] = useCookies(['token']);

  const { roomId } = useParams();
  console.log('---------------->roomId', roomId);
  const userInfo = useUserStore((state) => {
    return { nickName: state.nickName, userId: state.id };
  });

  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.message.trim() || audioBlob !== null) {
      console.log('---------------->aassss cookie.token', cookie.token);
      console.log('---------------->123audioBlob', audioBlob);
      console.log(
        '----------------> audioBlob !== null ? audioBlob : data.message',
        audioBlob !== null ? audioBlob : data.message,
      );
      socket.emit('send message', {
        token: cookie.token,
        roomId: roomId,
        message: audioBlob !== null ? audioBlob : data.message,
      });
      setAudioBlob(null);
      reset();
    }
  };

  useEffect(() => {
    const newSocket = io('http://localhost:4000');

    setSocket(newSocket);
    console.log('---------------->qqqwww');
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

  console.log('---------------->messagesqwqwe', messages);

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

  const handlePlayAudio = (audioBlob: Blob) => {
    console.log('---------------->assudioBlob', audioBlob);
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log('---------------->audioUrl', audioUrl);
    const audioElement = new Audio(audioUrl);
    console.log('---------------->audioElement', audioElement);
    audioElement.play();
  };

  const visualizerRef = useRef<HTMLCanvasElement>(null);

  if (!navigator.mediaDevices.getUserMedia) {
    return <div>Ваш браузер не поддерживает запись аудио</div>;
  }
  return (
    <div className="chat-page">
      <div>
        {!recording ? (
          <button onClick={handleStartRecording}>Start Recording</button>
        ) : (
          <div>
            <button onClick={handleStopRecording}>Stop Recording</button>
            <LiveAudioVisualizer
              mediaRecorder={mediaRecorderRef.current as MediaRecorder}
              width={200}
              height={75}
            />
          </div>
        )}
      </div>

      <ul>
        {messages.map((msg, i) => {
          console.log('123---------------->msg.text', msg.text);
          console.log('123---------------->isBuffer([msg.text])', isBuffer([msg.text]));
          console.log('123---------------->isBuffer([msg.text])', typeof msg.text);
          console.log('123---------------->isBuffer([msg.text])', typeof msg.text !== 'string');
          if (typeof msg.text !== 'string') {
            const blob = new Blob([msg.text], { type: 'audio/wav' });
            console.log('---------------->blob', blob);
            return (
              <li key={i}>
                <button onClick={() => handlePlayAudio(blob)}>Play Audio</button>
                <AudioVisualizer
                  ref={visualizerRef}
                  blob={blob}
                  width={150}
                  height={60}
                  barWidth={2}
                  gap={1}
                  barColor={'#abcdef'}
                  barPlayedColor={'#8DA0B3'}
                />
              </li>
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
      </ul>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('message')} />
        <button type="submit">send message</button>
      </form>
    </div>
  );
};
