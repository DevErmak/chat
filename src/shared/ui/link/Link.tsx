import './link.scss';
import cn from 'classnames';
type type = '';

interface ILinkProps {
  children: React.ReactNode;
  type?: type;
  href: string;
  className?: string | string[];
  onClick?: () => void;
}

export const Link: React.FC<ILinkProps> = ({ className, type, children, onClick, href }) => {
  return (
    <a href={href} className={cn('link', `link_${type}`, className)} onClick={onClick}>
      {children}
    </a>
  );
};
