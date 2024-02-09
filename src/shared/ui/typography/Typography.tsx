import React from 'react';
import './typography.scss';
import cn from 'classnames';
type TypographyTypes =
  | 'display-2xl'
  | 'display-xl'
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'display-xs'
  | 'display-2xs'
  | 'text-2xl'
  | 'text-xl'
  | 'text-lg'
  | 'text-md'
  | 'text-sm'
  | 'text-xs'
  | 'text-2xs';

type TypographyTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'div';

interface ITypographyProps {
  children: React.ReactNode;
  type: TypographyTypes;
  isUnSelectable?: boolean;
  className?: string | string[];
  onClick?: () => void;
  variant?: TypographyTags;
}

const typographyMap: Record<TypographyTypes, TypographyTags> = {
  'display-2xl': 'h1',
  'display-xl': 'h2',
  'display-lg': 'h3',
  'display-md': 'h4',
  'display-sm': 'h5',
  'display-xs': 'h6',
  'display-2xs': 'span',
  'text-2xl': 'span',
  'text-xl': 'span',
  'text-lg': 'span',
  'text-md': 'span',
  'text-sm': 'span',
  'text-xs': 'span',
  'text-2xs': 'span',
};

export const Typography: React.FC<ITypographyProps> = ({
  className,
  variant,
  type,
  children,
  onClick,
  isUnSelectable = false,
}) => {
  const TagName = variant || typographyMap[type];

  return (
    <TagName className={cn(type, { unselectable: isUnSelectable }, className)} onClick={onClick}>
      {children}
    </TagName>
  );
};
