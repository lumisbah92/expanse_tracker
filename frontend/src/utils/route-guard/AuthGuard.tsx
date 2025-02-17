import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default AuthGuard;
