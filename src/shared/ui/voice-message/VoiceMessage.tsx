import React, { Ref, useEffect, useRef, useState } from 'react';

import './voice-message.scss';

import cn from 'classnames';
import { AudioVisualizer } from 'react-audio-visualize';
import { handlePlayAudio } from '@/shared/lib';
import { Button } from '../button/Button';
import { IoPlayOutline } from 'react-icons/io5';
import { HiOutlinePause } from 'react-icons/hi2';
import { handlePauseAudio } from '@/shared/lib/audio/audio';
import { useMessageStore } from '@/entities/message';

type type = 'text' | 'voice';

interface IMessageProps {
  type: type;
  blob: Blob;
  isActive?: boolean;
  className?: string | string[];
  onClick?: () => void;
  messageRef?: Ref<HTMLElement>;
  audioWidth?: number;
  audioHeight?: number;
  barColor?: string;
  barPlayedColor?: string;
  sizeIcon?: number;
  isWithButton?: boolean;
}

export const VoiceMessage: React.FC<IMessageProps> = ({
  className,
  type,
  onClick,
  blob,
  isActive = false,
  audioWidth = 240,
  audioHeight = 30,
  barColor = '#abcdef',
  barPlayedColor = '#8DA0B3',
  sizeIcon = 25,
  isWithButton = false,
}) => {
  const [timeAudio, setTimeAudio] = useState(0);
  // const [audioElement] = new Audio();
  // const [audioUrl] = useState(URL.createObjectURL(blob as Blob));
  const audioElement = useMessageStore((state) => state.audioElement);
  // const UrlCurrentVoice = useMessageStore((state) => state.UrlCurrentVoice);
  // const setUrlCurrentVoice = useMessageStore((state) => state.setUrlCurrentVoice);
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const UrlCurrentVoice = URL.createObjectURL(blob);
  const currentAudioElement = new Audio(UrlCurrentVoice);
  // console.log('---------------->!!activeVoice!', activeVoice);
  const [toggleSound, setToggleSound] = useState(isActive);
  console.log('---------------->!!!toggleSound', toggleSound);

  const startVoice = new Event('start');

  // useEffect(() => {
  //   console.log('---------------->use eccfactiveVoice!', activeVoice);
  //   setToggleSound(activeVoice);
  // }, [activeVoice]);

  const playAudio = () => {
    console.log('---------------->play audioElement', audioElement);
    // audioElement.src = UrlCurrentVoice;
    // setToggleSound(isActive);
    // audioElement.play();
    audioElement.dispatchEvent(startVoice);
    currentAudioElement.play();
  };
  const pauseAudio = () => {
    audioElement.src = UrlCurrentVoice;
    console.log('---------------->pause audioElement', audioElement);

    setToggleSound(false);
    // audioElement.currentTime = 0;
    // currentAudioElement.pause();
    console.log('---------------->pause audioElement.currentTime', audioElement.currentTime);
  };
  // const stopAudio = () => {
  //   setToggleSound(true);
  //   audioElement.currentTime = 0;
  //   audioElement.pause();
  //   console.log('---------------->stop audioElement.currentTime', audioElement.currentTime);
  // };

  // const audioElement = new Audio(audioUrl);
  currentAudioElement.addEventListener('play', (event) => {
    console.log('---------------->play audielem event', audioElement);
    // console.log('---------------->stop audio ended currentAudioElement', currentAudioElement);
    setToggleSound(true);
  });
  audioElement.addEventListener('ended', (event) => {
    console.log('---------------->stop audio ended', audioElement);
    // console.log('---------------->stop audio ended currentAudioElement', currentAudioElement);
    setToggleSound(false);
  });
  audioElement.addEventListener('pause', (event) => {
    console.log('---------------->pause current audio pause');
    setToggleSound(false);
  });
  currentAudioElement.addEventListener('loadedmetadata', function () {
    setTimeAudio(currentAudioElement.duration);
  });
  audioElement.addEventListener('start', function () {
    console.log('---------------->qq');
    console.log('---------------->currentAudioElement', currentAudioElement);
    console.log('---------------->play curent audioElement.src', audioElement.src);
    currentAudioElement.pause();
    setToggleSound(false);
    // if (currentAudioElement.src !== audioElement.src) {
    //   audioElement.src = currentAudioElement.src;
    //   console.log('---------------->2play curent audioElement.src', audioElement.src);
    // }
    // audioElement.src = currentAudioElement.src;
    // currentAudioElement.play();
  });
  return (
    <div className={cn('message', type, className)} onClick={onClick}>
      {isWithButton ? null : toggleSound ? (
        <Button className={'button_play'} type="outline" onClick={() => pauseAudio()}>
          <HiOutlinePause size={sizeIcon} />
        </Button>
      ) : (
        <Button className={'button_play'} type="outline" onClick={() => playAudio()}>
          <IoPlayOutline size={sizeIcon} />
        </Button>
      )}
      <div className={'voice_visual'}>
        <AudioVisualizer
          ref={visualizerRef}
          blob={blob as Blob}
          width={audioWidth}
          height={audioHeight}
          barWidth={2}
          gap={1}
          barColor={barColor}
          barPlayedColor={barPlayedColor}
        />
      </div>
      <div>{timeAudio}</div>
    </div>
  );
};
