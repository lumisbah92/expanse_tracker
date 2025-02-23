import { lazy } from 'react';

// Layout
import AuthLayout from '../views/layouts/AuthLayout';
import Loadable from '../Components/loader/Loadable';

const Dashboard = Loadable(lazy(() => import('../views/pages/Dashboard')));
const AddTransaction = Loadable(lazy(() => import('../views/pages/Transactions')));
const Login = Loadable(lazy(() => import('../views/pages/Auth/Login/LoginPage')));
const Register = Loadable(lazy(() => import('../views/pages/Auth/Register/RegisterPage')));


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
          path: '/add-transaction',
          element: <AddTransaction />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        },
      ],
    },
  ],
};

export default LoginRoutes;
