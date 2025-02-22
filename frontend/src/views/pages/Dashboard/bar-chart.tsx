import { FC } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface BarChartProps {
  websiteVisits: {
    [day: string]: { desktop: number; mobile: number };
  };
}

const BarChart: FC<BarChartProps> = ({ websiteVisits }) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const desktopData = days.map((day) => websiteVisits[day]?.desktop || 0);
  const mobileData = days.map((day) => websiteVisits[day]?.mobile || 0);

  const series = [
    { name: 'Desktop', data: desktopData },
    { name: 'Mobile', data: mobileData },
  ];

  const options: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '20px' } },
    colors: ['#007867', '#FFAB00'],
    dataLabels: { enabled: false },
    xaxis: { categories: labels, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 0, max: Math.max(...desktopData, ...mobileData) + 10 },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: { shape: 'circle' },
      labels: { colors: 'text.primary' },
    },
    grid: { borderColor: '#E0E0E0', strokeDashArray: 4 },
  };

  return (
    <div className="flex-1">
      <div className="bg-white shadow rounded">
        <div className="p-2 md:p-6">
          <h3 className="text-lg text-gray-900 mb-4">Website visits</h3>
          <ReactApexChart type="bar" series={series} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
