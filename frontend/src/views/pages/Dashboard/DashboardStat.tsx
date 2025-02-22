import React from 'react';
import { DashboardStatType } from './index';
import BarChart from './BarChart';
import LineChart from './LineChart';

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
          <BarChart transaction_amounts={dashboardStat.transaction_amounts} />
          <LineChart transaction_counts={dashboardStat.transaction_counts} />
        </>
      )}
    </div>
  );
};

export default DashboardStat;
