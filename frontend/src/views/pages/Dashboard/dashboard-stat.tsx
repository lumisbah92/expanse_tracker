import React from 'react';
import { DashboardStatType } from './index';
import BarChart from './bar-chart';
import LineChart from './line-chart';

interface DashboardStatProps {
  loadingStat: boolean;
  errorStat: string | null;
  dashboardStat: DashboardStatType | null;
}

const DashboardStat: React.FC<DashboardStatProps> = ({ loadingStat, errorStat, dashboardStat }) => {
  if (loadingStat) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        Loading...
      </div>
    );
  }

  if (errorStat) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p className="text-red-600">{errorStat}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-2">
      {dashboardStat && (
        <>
          <BarChart websiteVisits={dashboardStat.website_visits} />
          <LineChart offersSent={dashboardStat.offers_sent} />
        </>
      )}
    </div>
  );
};

export default DashboardStat;
