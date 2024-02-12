import React, { Ref, useState } from 'react';

import './message.scss';

import cn from 'classnames';
import { AudioVisualizer } from 'react-audio-visualize';
import { handlePlayAudio } from '@/shared/lib';
import { Button } from '../button/Button';
import { IoPlayOutline } from 'react-icons/io5';
import { HiOutlinePause } from 'react-icons/hi2';
import { handlePauseAudio } from '@/shared/lib/audio/audio';

type type = 'text' | 'voice';

interface IMessageProps {
  type: type;
  children?: React.ReactNode;
  className?: string | string[];
  onClick?: () => void;
  messageRef?: Ref<HTMLElement>;
  visualizerRef?: Ref<HTMLCanvasElement>;
  blob?: Blob;
  audioWidth?: number;
  audioHeight?: number;
  barColor?: string;
  barPlayedColor?: string;
  sizeIcon?: number;
  isWithButton?: boolean;
}

export const Message: React.FC<IMessageProps> = ({
  className,
  type,
  children,
  onClick,
  visualizerRef,
  blob,
  audioWidth = 240,
  audioHeight = 30,
  barColor = '#abcdef',
  barPlayedColor = '#8DA0B3',
  sizeIcon = 25,
  isWithButton = false,
}) => {
  const [toggleSound, setToggleSound] = useState(true);
  switch (type) {
    case 'text':
      return (
        <div className={cn('message', type, className)} onClick={onClick}>
          {children}
        </div>
      );
    case 'voice':
      console.log('---------------->!!!!blob', blob);
      const audioUrl = URL.createObjectURL(blob as Blob);
      const audioElement = new Audio(audioUrl);

      return (
        <div className={cn('message', type, className)} onClick={onClick}>
          {isWithButton ? null : toggleSound ? (
            <Button
              className={'button_play'}
              type="outline"
              onClick={() => {
                setToggleSound(!toggleSound);
                audioElement.play();
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
                audioElement.pause(true);
              }}
            >
              <HiOutlinePause size={sizeIcon} />
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
        </div>
      );
  }
};
