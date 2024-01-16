import { Button, Typography } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';

type Props = {};
export const NavBar: React.FC<any> = ({}: Props) => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate('/users');
  };
  return (
    <nav>
      <ul>
        <li>
          <Button type={'outline'} onClick={onClick}>
            <Typography type="text-md">люди</Typography>
          </Button>
        </li>
      </ul>
    </nav>
  );
};
