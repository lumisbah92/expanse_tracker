import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import SideBar from '../Sidebar';
import Header from '../Header';
import svgIcons from '../../../services/svgService';
import AddTransaction from './AddTransaction';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: svgIcons.dashboard },
  { label: 'Add Transaction', path: '/add-transaction', icon:  svgIcons.transactions },
];

const Transactions: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!user && !storedToken) {
      window.location.replace('/login');
    }
    setIsCheckingAuth(false);
  }, [user]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <SideBar navItems={navItems} />
      <div className="h-full flex flex-col flex-1">
        <Header dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} logout={logout} />
        <div className="h-full flex flex-col items-center flex-1 px-2 py-8">
          <AddTransaction />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
