import { SubmitHandler, useForm } from 'react-hook-form';
import './page.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
interface IUserState {
  nickName: string;
  isLoading: boolean;
  setNickName: (nickName: string) => void;
  removeNickName: (id: number) => void;
}

export const useUserStore = create<IUserState>()(
  devtools(
    immer((set) => ({
      nickName: '',
      isLoading: false,
      setNickName: (nickName) =>
        set((state) => {
          state.nickName = nickName;
        }),
      removeNickName: () =>
        set((state) => {
          state.nickName = '';
        }),
    })),
  ),
);

interface IFormInput {
  nickName: string;
}

type Props = {};
export const Home: React.FC<any> = ({}: Props) => {
  const navigate = useNavigate();
  const setNickName = useUserStore((state) => state.setNickName);
  const nickName = useUserStore((state) => state.nickName);
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    setNickName(data.nickName);
    axios.post(
      'http://localhost:4000/',
      {
        nickName: nickName,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    navigate('/message');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nickName')} />
      <button type="submit">Submit</button>
    </form>
  );
};
