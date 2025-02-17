import { Outlet } from 'react-router-dom';
import GuestGuard from '../../Components/route-guard/GuestGuard';

const AuthLayout = () => {
  return (
    <GuestGuard>
      <Outlet />
    </GuestGuard>
  );
};

export default AuthLayout;
