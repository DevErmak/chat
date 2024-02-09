import { SubmitHandler, useForm } from 'react-hook-form';
import './page.scss';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/user';
import { axiosServerChat } from '@/shared/api/v1';
import { Button, Typography } from '@/shared/ui';
import { useCookies } from 'react-cookie';
import { ReactComponent as SvgEnterKey } from '@/shared/ui/svg/enter-key.svg';

interface IFormInput {
  nickName: string;
}

type Props = {};
export const Home: React.FC<any> = ({}: Props) => {
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(['token', 'session']);
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.nickName.trim())
      try {
        const res = await axiosServerChat.post('/', {
          nickName: data.nickName,
        });
        console.log('---------------->res.data', res.data);
        setUserInfo(res.data.nickName, res.data.userId);
        setCookie('token', res.data.token);
        setCookie('session', res.data.userId);
        navigate('/rooms');
      } catch {
        return <Typography type="text-md">сервер не доступен</Typography>;
      }
  };
  return (
    <div className="home-page">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('nickName')} placeholder={'name'} />
        <Button type="outline" className={'enter-button'}>
          <SvgEnterKey />
        </Button>
      </form>
    </div>
  );
};
