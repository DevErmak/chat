// import { Footer } from '@/widgets/footer';
import { NavBar } from '@/widgets/navbar';
import { Outlet } from 'react-router-dom';

type Props = {};
export const DefaultLayout: React.FC<any> = ({}: Props) => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
