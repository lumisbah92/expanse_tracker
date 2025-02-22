import { lazy } from 'react';

// Layout
import AuthLayout from '../views/layouts/AuthLayout';
import Loadable from '../Components/loader/Loadable';

const Dashboard = Loadable(lazy(() => import('../views/pages/Dashboard')));
const Transactions = Loadable(lazy(() => import('../views/pages/Transactions')));
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
          element: <Dashboard />
        },
        {
          path: '/transactions',
          element: <Transactions />
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
