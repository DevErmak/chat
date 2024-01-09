import { RouterProvider } from 'react-router-dom';
import { appRouter } from './model/appRouter';

const App: React.FC<any> = () => {
  return <RouterProvider router={appRouter()} />;
};

export default App;
