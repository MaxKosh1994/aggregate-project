import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/shared/enums/routes';
import Layout from '../Layout/Layout';
import { HomePage } from '@/pages';
import RouterErrorFallback from './RouterErrorFallback';
// import AuthGuard from './AuthGuard';
// import PublicGuard from './PublicGuard';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
        errorElement: <RouterErrorFallback />,
      },
      // {
      //   path: '/test',
      //   lazy: () =>
      //     import('@/pages').then((module) => ({
      //       Component: (props) => <module.TestPage {...props} />,
      //     })),
      // },
      {
        path: '*',
        element: <h1>404</h1>,
      },
    ],
  },
]);
