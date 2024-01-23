import { useParams } from 'react-router-dom';
import './page.scss';

import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/entities/user';
import { useMessageStore } from '@/entities/message';
import { useCookies } from 'react-cookie';
import { SubmitHandler, useForm } from 'react-hook-form';

const MicRecorder = require('mic-recorder-to-mp3');

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

  // const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
  //   video: true,
  // });

  // const recorder = new MicRecorder({
  //   bitRate: 128,
  // });

  // const startRecord = () => {
  //   recorder
  //     .start()
  //     .then(() => {
  //       // something else
  //     })
  //     .catch((e: any) => {
  //       console.error(e);
  //     });
  // };

  // const stopRecord = () => {
  //   recorder
  //     .stop()
  //     .getMp3()
  //     .then(([buffer, blob]: any) => {
  //       // do what ever you want with buffer and blob
  //       // Example: Create a mp3 file and play
  //       console.log('---------------->savevocie');
  //       const file = new File(buffer, 'me-at-thevoice.mp3', {
  //         type: blob.type,
  //         lastModified: Date.now(),
  //       });

  //       const player = new Audio(URL.createObjectURL(file));
  //       player.play();
  //     })
  //     .catch((e: any) => {
  //       console.log('---------------->savevocie');

  //       alert('We could not retrieve your message');
  //       console.log(e);
  //     });
  // };

  // const [messages, setMessages] = useState([{ nickName: 'sd', message: 'freeBSD' }]);
  const [socket, setSocket] = useState(io('http://localhost:4000'));
  const [cookie, setCookie] = useCookies(['token']);

  const { roomId } = useParams();
  console.log('---------------->roomId', roomId);
  const userInfo = useUserStore((state) => {
    return { nickName: state.nickName, userId: state.id };
  });

  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.message.trim()) {
      console.log('---------------->aassss cookie.token', cookie.token);
      socket.emit('send message', { token: cookie.token, roomId: roomId, message: data.message });
      reset();
    }
  };

  useEffect(() => {
    // navigator.mediaDevices
    //   .getUserMedia({ audio: true, video: false })
    //   .then((res) => console.log('---------------->res', res))
    //   .catch((e) => {
    //     console.error(e);
    //   });
    const newSocket = io('http://localhost:4000');

    setSocket(newSocket);
    console.log('---------------->qqqwww');
    newSocket.emit('get prev message', { roomId });

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

  // const handleSendMessage = (e: any) => {
  //   e.preventDefault();
  //   console.log('---------------->ssss');
  //   if (message.trim()) {
  //     console.log('---------------->aassss cookie.token', cookie.token);
  //     socket.emit('send message', { token: cookie.token, roomId: roomId, message });
  //     setMessage('');
  //   }
  // };
  console.log('---------------->messagesqwqwe', messages);

  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);

  const mimeType = 'audio/webm';

  const startRecording = async () => {
    setRecordingStatus('recording');
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { type: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus('inactive');
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);

  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert('The MediaRecorder API is not supported in your browser.');
    }
  };
  return (
    <div className="chat-page">
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg.text}</li>
        ))}
      </ul>
      {/* <p>{status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button> */}
      {/* <ReactMediaRecorder
        video
        render={({
          status,
          startRecording,
          stopRecording,
          mediaBlobUrl,
        }: ReactMediaRecorderRenderProps) => (
          <div>
            <p>{status}\</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
          </div>
        )}
      /> */}

      {/* <button onClick={startRecord}>Start Recording</button> */}
      {/* <button onClick={stopRecord}>Stop Recording</button> */}

      <div className="audio-controls">
        {!permission ? (
          <button onClick={getMicrophonePermission} type="button">
            Get Microphone
          </button>
        ) : null}
        {permission && recordingStatus === 'inactive' ? (
          <button onClick={startRecording} type="button">
            Start Recording
          </button>
        ) : null}
        {recordingStatus === 'recording' ? (
          <button onClick={stopRecording} type="button">
            Stop Recording
          </button>
        ) : null}
      </div>
      {audio ? (
        <div className="audio-container">
          <audio src={audio} controls></audio>
          <a download href={audio}>
            Download Recording
          </a>
        </div>
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('message')} />
        <button type="submit">send message</button>
      </form>
    </div>
  );
};
