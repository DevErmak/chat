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
}

export const Message: React.FC<IMessageProps> = ({
  className,
  type,
  children,
  onClick,
  visualizerRef,
  blob,
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
      const audioUrl = URL.createObjectURL(blob as Blob);
      const audioElement = new Audio(audioUrl);

      return (
        <div className={cn('message', type, className)} onClick={onClick}>
          {toggleSound ? (
            <Button
              className={'button_play'}
              type="outline"
              onClick={() => {
                setToggleSound(!toggleSound);
                audioElement.play();
              }}
            >
              <IoPlayOutline size={25} />
            </Button>
          ) : (
            <Button
              className={'button_play'}
              type="outline"
              onClick={() => {
                setToggleSound(!toggleSound);
                audioElement.pause();
              }}
            >
              <HiOutlinePause size={25} />
            </Button>
          )}
          <div className={'voice_visual'}>
            <AudioVisualizer
              ref={visualizerRef}
              blob={blob as Blob}
              width={250}
              height={30}
              barWidth={2}
              gap={1}
              barColor={'#abcdef'}
              barPlayedColor={'#8DA0B3'}
            />
          </div>
        </div>
      );
  }
};
