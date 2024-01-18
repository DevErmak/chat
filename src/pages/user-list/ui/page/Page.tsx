import { Button, Typography } from '@/shared/ui';
import './page.scss';
import { useLayoutEffect, useState } from 'react';
import { IUserDataServer } from '@/entities/user/model/types';
import { useNavigate } from 'react-router-dom';
import { axiosServerChat } from '@/shared/api/v1';
import classNames from 'classnames';
import { useUserStore } from '@/entities/user';
import { useCookies } from 'react-cookie';

type Props = {};
export const UserList: React.FC<any> = ({}: Props) => {
  const userInfo = useUserStore((state) => {
    return { nickName: state.nickName, userId: state.id };
  });
  const [users, setUsers] = useState([]);
  const [dirtyUsers, setDirtyUsers] = useState<number[]>([userInfo.userId]);
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(['token']);

  useLayoutEffect(() => {
    async function getUsers() {
      try {
        const res = await axiosServerChat.post('/users', {
          token: cookie.token,
        });
        console.log('---------------->asdqweqwe', res.data);
        setUsers(res.data);
      } catch {
        setUsers([]);
      }
    }
    getUsers();
  }, [userInfo]);

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
            className={classNames({ user: true, select: dirtyUsers.includes(data.user_id) })}
          >
            {data.nickname}
          </Typography>
        ))}
      </div>
      <Button
        type="primary"
        onClick={handleCreateRoomClick}
        className={classNames({ 'button-create-room': true, active: dirtyUsers.length > 1 })}
      >
        <Typography type="text-md" className={'write'}>
          написать
        </Typography>
      </Button>
    </div>
  );
};
