import React, { Ref } from 'react';
import './button.scss';
import cn from 'classnames';
type ButtonSizes = 'lg' | 'md' | 'sm';
type type = 'text' | 'voice';

interface IButtonProps {
  children: React.ReactNode;
  type: type;
  size?: ButtonSizes;
  isSet?: boolean;
  className?: string | string[];
  form?: string;
  onClick?: () => void;
  buttonRef?: Ref<HTMLButtonElement & HTMLElement>;
}

export const Message: React.FC<IButtonProps> = ({
  className,
  type,
  children,
  onClick,
  isSet,
  form,
  size,
  buttonRef,
}) => {
  return (
    <button
      type={ButtonType}
      className={cn('button', `button_${type}`, `button_${size}`, className)}
      onClick={onClick}
      disabled={disabled}
      form={form}
      ref={buttonRef}
    >
      {children}
    </button>
  );
};
