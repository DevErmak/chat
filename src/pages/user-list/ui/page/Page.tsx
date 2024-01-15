import './page.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {};
export const UserList: React.FC<any> = ({}: Props) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:4000/users').then((res) => setUsers(res.data));
  }, []);

  console.log('---------------->users', users);
  return (
    <div className="chat-page">
      <div>
        {users.map((data: any, i) => (
          <div key={i}>{data.nickname}</div>
        ))}
      </div>
    </div>
  );
};
