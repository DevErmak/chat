import React, { Ref } from 'react';

import './message.scss';

import cn from 'classnames';
type type = 'text' | 'voice';

interface IMessageProps {
  children: React.ReactNode;
  type: type;
  className?: string | string[];
  onClick?: () => void;
  MessageRef?: Ref<HTMLElement>;
}

export const Message: React.FC<IMessageProps> = ({ className, type, children, onClick }) => {
  switch (type) {
    case 'text':
      return (
        <div className={cn('message', type, className)} onClick={onClick}>
          {children}
        </div>
      );
    case 'voice':
      return (
        <div className={cn('message', type, className)} onClick={onClick}>
          {children}
        </div>
      );
  }
};
