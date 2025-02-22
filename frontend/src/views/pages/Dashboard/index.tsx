import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import SideBar from '../Sidebar';
import Header from '../Header';
import DashboardSummary from './dashboard-summary';
import DashboardStat from './dashboard-stat';
import OfferListTable from './offer-list';
import svgIcons from '../../../services/svgService';

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
  website_visits: {
    [day: string]: { desktop: number; mobile: number };
  };
  offers_sent: {
    [day: string]: number;
  };
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: svgIcons.dashboard },
  { label: 'Transactions', path: '/transactions', icon:  svgIcons.transactions },
];

const DashboardView: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [dashboardStat, setDashboardStat] = useState<DashboardStatType | null>(null);
  const [errorStat, setErrorStat] = useState<string | null>(null);
  const [loadingStat, setLoadingStat] = useState(true);

  // Check for authentication and redirect if not authenticated
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!user && !storedToken) {
      window.location.replace('/sign-in');
    }
    setIsCheckingAuth(false);
  }, [user]);

  // Fetch dashboard summary data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingSummary(true);
      try {
        const response = await fetch(
          'https://dummy-1.hiublue.com/api/dashboard/summary?filter=this-week',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

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
        const response = await fetch(
          'https://dummy-1.hiublue.com/api/dashboard/stat?filter=this-week',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
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

  const cards = dashboardSummary
    ? [
        {
          title: 'Total active users',
          count: dashboardSummary.current.active_users / 1000, // convert to "k" format
          percentage: Math.round(
            ((dashboardSummary.current.active_users - dashboardSummary.previous.active_users) /
              dashboardSummary.previous.active_users) *
              100
          ),
        },
        {
          title: 'Total clicks',
          count: dashboardSummary.current.clicks / 1000,
          percentage: Math.round(
            ((dashboardSummary.current.clicks - dashboardSummary.previous.clicks) /
              dashboardSummary.previous.clicks) *
              100
          ),
        },
        {
          title: 'Total appearances',
          count: dashboardSummary.current.appearance / 1000,
          percentage: Math.round(
            ((dashboardSummary.current.appearance - dashboardSummary.previous.appearance) /
              dashboardSummary.previous.appearance) *
              100
          ),
        },
      ]
    : [];

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBar navItems={navItems} />
      <div className="flex flex-col flex-1">
        <Header dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} logout={logout} />
        <div className="w-full h-full flex-1 overflow-x-hidden overflow-y-auto p-2 flex flex-col gap-2">
          <h1 className="text-2xl text-gray-900">Dashboard</h1>
          <DashboardSummary loadingSummary={loadingSummary} errorSummary={errorSummary} cards={cards} />
          <DashboardStat loadingStat={loadingStat} errorStat={errorStat} dashboardStat={dashboardStat} />
          <OfferListTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
