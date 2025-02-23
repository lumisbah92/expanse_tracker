import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import SideBar from '../Sidebar';
import Header from '../Header';
import DashboardSummary from './DashboardSummary';
import DashboardStat from './DashboardStat';
import svgIcons from '../../../services/svgService';
import TransactionListTable from './TransactionList';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export type DashboardSummaryType = {
  title: string;
  count: number;
  percentage: number;
};

export interface DashboardStatType {
  transaction_amounts: {
    [day: string]: { income: number; expense: number };
  };
  transaction_counts: {
    [day: string]: number;
  };
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: svgIcons.dashboard },
  { label: 'Add Transaction', path: '/add-transaction', icon:  svgIcons.transactions },
];

const DashboardView: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummaryType[] | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [dashboardStat, setDashboardStat] = useState<DashboardStatType | null>(null);
  const [errorStat, setErrorStat] = useState<string | null>(null);
  const [loadingStat, setLoadingStat] = useState(true);

  // Check for authentication and redirect if not authenticated
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!user && !storedToken) {
      window.location.replace('/login');
    }
    setIsCheckingAuth(false);
  }, [user]);

  // Fetch dashboard summary data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingSummary(true);
      try {
        const url = `${import.meta.env.VITE_API_URL}/transactions/summary`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (!response.ok) {
          setErrorSummary('Failed to fetch dashboard summary');
          return;
        }

        const data = await response.json();
        setDashboardSummary(data);
      } catch (err: any) {
        setErrorSummary(err.message);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch dashboard stats data
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStat(true);
      try {
        const url = `${import.meta.env.VITE_API_URL}/transactions/stats`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
          setErrorStat('Failed to fetch dashboard stats');
          return;
        }
        const data = await response.json();
        setDashboardStat(data);
      } catch (err: any) {
        setErrorStat(err?.message);
      } finally {
        setLoadingStat(false);
      }
    };

    fetchStats();
  }, []);

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
      <div className="h-full flex flex-col gap-2 flex-1">
        <Header dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} logout={logout} />
        <div className="w-full h-full flex-1 overflow-x-hidden overflow-y-auto p-2 lg:p-4 flex flex-col gap-5">
          <h1 className="md:text-2xl font-bold text-gray-900">Dashboard</h1>
          <DashboardSummary loadingSummary={loadingSummary} errorSummary={errorSummary} cards={dashboardSummary} />
          <DashboardStat loadingStat={loadingStat} errorStat={errorStat} dashboardStat={dashboardStat} />
          {/* <TransactionListTable/> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
