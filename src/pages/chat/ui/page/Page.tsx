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
import { Messages } from '@/widgets/messages';
import { SendMessage } from '@/widgets/send-message/ui/send-message/SendMessage';

// const MicRecorder = require('mic-recorder-to-mp3');

// import { MicRecorder  from 'mic-recorder-to-mp3';
// import {
//   ReactMediaRecorder,
//   ReactMediaRecorderRenderProps,
//   useReactMediaRecorder,
// } from 'react-media-recorder';

// interface IFormInput {
//   message: string;
// }

type Props = {};
export const Chat: React.FC<any> = ({}: Props) => {
  if (!navigator.mediaDevices.getUserMedia) {
    return <div>Ваш браузер не поддерживает запись аудио</div>;
  }
  return (
    <div className="chat-page">
      <Messages className={'chat-page'} />
      <SendMessage className={'chat-page'} />
    </div>
  );
};
