import { ReactNode } from 'react';

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  return <>{children}</>;
};

export default GuestGuard;
