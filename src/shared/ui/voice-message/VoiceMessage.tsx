import React, { Ref, useEffect, useMemo, useRef, useState } from 'react';

import './voice-message.scss';

import cn from 'classnames';
import { AudioVisualizer } from 'react-audio-visualize';
import { Button } from '../button/Button';
import { IoPlayOutline } from 'react-icons/io5';
import { HiOutlinePause } from 'react-icons/hi2';
import { useMessageStore } from '@/entities/message';
import { Typography } from '../typography/Typography';

type type = 'text' | 'voice';

interface IMessageProps {
  type: type;
  blob: Blob;
  UrlAudio: string;
  index?: string;
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
  UrlAudio,
  index = 'none',
  isActive = false,
  audioWidth = 240,
  audioHeight = 30,
  barColor = '#abcdef',
  barPlayedColor = '#8DA0B3',
  sizeIcon = 25,
  isWithButton = false,
}) => {
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const [timeAudio, setTimeAudio] = useState(0);
  const currentAudioElement = useMemo(() => new Audio(UrlAudio), []);
  const activeComponentIndex = useMessageStore((state) => state.activeComponentIndex);
  const setActiveComponentIndex = useMessageStore((state) => state.setActiveComponentIndex);
  const [toggleSound, setToggleSound] = useState(index === activeComponentIndex);
  useEffect(() => {
    currentAudioElement.addEventListener('loadedmetadata', () => {
      setTimeAudio(currentAudioElement.duration);
    });
    currentAudioElement.addEventListener('pause', () => {
      console.log('---------------->pause event currentAudioElement', currentAudioElement);
      setToggleSound(false);
    });
    return () => {
      currentAudioElement.removeEventListener('loadedmetadata', () => {});
      currentAudioElement.removeEventListener('pause', () => {});
    };
  }, []);
  useEffect(() => {
    if (index !== activeComponentIndex) {
      setToggleSound(false);
      currentAudioElement.pause();
    } else {
      setToggleSound(true);
    }
  }, [activeComponentIndex]);

  const playAudio = () => {
    setActiveComponentIndex(index);
    setToggleSound(true);
    console.log('---------------->play currentAudioElement', currentAudioElement);
    currentAudioElement.play();
  };
  const pauseAudio = () => {
    console.log('---------------->pause currentAudioElement', currentAudioElement);
    currentAudioElement.pause();
    setToggleSound(false);
  };
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
        <Typography type="text-sm">{timeAudio.toFixed(0)}c</Typography>
      </div>
    </div>
  );
};
