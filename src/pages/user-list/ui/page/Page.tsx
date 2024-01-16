import { Button, Typography } from '@/shared/ui';
import './page.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IUserDataServer } from '@/entities/user/model/types';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { axiosServerChat } from '@/shared/api/v1';

type Props = {};
export const UserList: React.FC<any> = ({}: Props) => {
  const [users, setUsers] = useState([]);
  const [dirtyUsers, setDirtyUsers] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/users').then((res) => setUsers(res.data));
  }, []);

  const handleUserClick = (userId: number) => {
    if (dirtyUsers.includes(userId)) {
      setDirtyUsers(dirtyUsers.filter((id) => id !== userId));
    } else {
      setDirtyUsers([...dirtyUsers, userId]);
    }
  };
  const handleCreateRoomClick = async () => {
    await axiosServerChat.post('/createRoom', {
      id: dirtyUsers,
    });
    navigate('/rooms');
  };
  console.log('---------------->users', users);
  console.log('---------------->dirtyUsers', dirtyUsers);
  return (
    <div className="user-page">
      <div className="container-users">
        {users.map((data: IUserDataServer, i) => (
          <Typography
            type="text-md"
            key={i}
            onClick={() => handleUserClick(data.user_id)}
            className={['user', dirtyUsers.includes(data.user_id) ? 'user-select' : '']}
          >
            {data.nickname}
          </Typography>
        ))}
      </div>
      <Button
        type="primary"
        onClick={handleCreateRoomClick}
        className={['button-create-room', dirtyUsers.length ? 'button-create-room-active' : '']}
      >
        <Typography type="text-md" className={'write'}>
          написать
        </Typography>
      </Button>
    </div>
  );
};
