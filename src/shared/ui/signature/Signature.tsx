import React, { Ref, useEffect, useState } from 'react';
import cn from 'classnames';
import { Typography } from '../typography/Typography';
import {
  format,
  formatDistance,
  formatDistanceStrict,
  formatDuration,
  intervalToDuration,
  sub,
  subDays,
  subMinutes,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import './signature.scss';

type type = 'default';

interface ISignatureProps {
  children: React.ReactNode;
  nameSender: string;
  date: Date;
  type: type;
  className?: string | string[];
  classNameSender?: string | string[];
  classNameDate?: string | string[];
  onClick?: () => void;
  MessageRef?: Ref<HTMLElement>;
}

export const Signature: React.FC<ISignatureProps> = ({
  className,
  nameSender,
  date,
  onClick,
  type,
  children,
  classNameSender,
  classNameDate,
}) => {
  const createFormatDate = (date: Date): React.ReactNode => {
    return format(date, 'HH:mm', { locale: ru });
  };
  const diffDay = (date: Date): React.ReactNode => {
    let result = '';

    const today = new Date();
    const targetDate = new Date(date);

    const roundedToday = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
    );
    const roundedTargetDate = new Date(
      Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate()),
    );

    const daysDiff = Math.floor(
      (roundedToday.getTime() - roundedTargetDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff === 0) {
      result = '';
    } else if (daysDiff === 1) {
      result = 'Вчера';
    } else if (daysDiff === 2) {
      result = 'Позавчера';
    } else {
      result = format(date, 'dd.MM.yyyy', { locale: ru });
    }

    return result;
  };

  return (
    <div className={cn('signature', type, className)} onClick={onClick}>
      {children}
      <div className={cn('nameSender', classNameSender)}>
        <Typography type={'text-sm'}>{nameSender}</Typography>
      </div>
      <div className={cn('date', classNameDate)}>
        <Typography type={'text-sm'}>{createFormatDate(date)}</Typography>
        <Typography type={'text-sm'}>{diffDay(date)}</Typography>
      </div>
    </div>
  );
};
