import { lazy } from 'react';

// Layout
import AuthLayout from '../views/layouts/AuthLayout';
import Loadable from '../Components/loader/Loadable';

const Dashboard = Loadable(lazy(() => import('../views/pages/Dashboard')));
const Login = Loadable(lazy(() => import('../views/pages/Auth/SignIn/SignInPage')));
const Register = Loadable(lazy(() => import('../views/pages/Auth/SignUp/SignUpPage')));


// ==============================|| AUTH ROUTES ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: '/',
          element: <Login />
        },
        {
          path: '/dashboard',
          element: <Dashboard />
        },
        {
          path: '/sign-in',
          element: <Login />
        },
        {
          path: '/sign-up',
          element: <Register />
        },
      ],
    },
  ],
};

export default LoginRoutes;
