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
  const [nowDate, setNowDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('---------------->zxcqwe');
      setNowDate(new Date());
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [setNowDate]);

  const createFormatDate = (date: Date): React.ReactNode => {
    let result;
    console.log('---------------->date', date);
    const currentDate = new Date(date);
    const diffInMilliseconds = nowDate.getTime() - currentDate.getTime();
    console.log('---------------->diffInMilliseconds', diffInMilliseconds);
    if (diffInMilliseconds > 3 * 24 * 60 * 60 * 1000) {
      result = format(date, 'ee.MM.Y', { locale: ru });
    } else {
      result = formatDistanceStrict(date, nowDate, { locale: ru });
      // console.log('---------------->result', result);
      // result = intervalToDuration({
      //   start: date,
      //   end: nowDate,
      // });
      // console.log('---------------->result', result);
      // result = formatDuration(result);
      // console.log('---------------->result2', result);
      // result = format(subDays(diffInMilliseconds, 0), 'hh', { locale: ru });
    }
    return <Typography type={'text-sm'}>{result}</Typography>;
  };

  return (
    <div className={cn('signature', type, className)} onClick={onClick}>
      {children}
      <div className={cn('nameSender', classNameSender)}>
        <Typography type={'text-sm'}>{nameSender}</Typography>
      </div>
      <div className={cn('date', classNameDate)}>{createFormatDate(date)}</div>
    </div>
  );
};
