import { SubmitHandler, useForm } from 'react-hook-form';
import './page.scss';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/user';
import { axiosServerChat } from '@/shared/api/v1';

interface IFormInput {
  nickName: string;
}

type Props = {};
export const Home: React.FC<any> = ({}: Props) => {
  const navigate = useNavigate();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const res = await axiosServerChat.post('/', {
      nickName: data.nickName,
    });
    setUserInfo(res.data.nickname, res.data.user_id);
    navigate('/rooms');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nickName')} />
      <button type="submit">Submit</button>
    </form>
  );
};
