import { FC } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface LineChartProps {
  transaction_counts: {
    [day: string]: number;
  };
}

const LineChart: FC<LineChartProps> = ({ transaction_counts }) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const transactionCountsData = days.map((day) => transaction_counts[day] || 0);

  const series = [
    { name: 'Transaction counts', data: transactionCountsData },
  ];

  const options: ApexOptions = {
    chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 3, colors: ['#1C252E'] },
    xaxis: { categories: labels, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: undefined } } },
    yaxis: { min: 0, max: Math.max(...transactionCountsData) + 5, tickAmount: 5 },
    grid: { borderColor: '#E0E0E0', strokeDashArray: 4 },
    markers: { size: 0 },
    tooltip: { enabled: false },
    legend: { show: false },
  };

  return (
    <div className="flex-1 w-full">
      <div className="bg-white shadow rounded w-full">
        <div className="p-2 md:p-6">
          <h3 className="text-lg text-gray-900 mb-4">Transaction counts</h3>
          <ReactApexChart options={options} series={series} type="line" />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
