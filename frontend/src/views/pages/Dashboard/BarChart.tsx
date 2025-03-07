import { FC } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface BarChartProps {
  transaction_amounts: {
    [day: string]: { income: number; expense: number };
  };
}

const BarChart: FC<BarChartProps> = ({ transaction_amounts }) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const incomeData = days.map((day) => transaction_amounts[day]?.income || 0);
  const expenseData = days.map((day) => transaction_amounts[day]?.expense || 0);

  const series = [
    { name: 'Income', data: incomeData },
    { name: 'Expense', data: expenseData },
  ];

  const options: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '20px' } },
    colors: ['#007867', '#FFAB00'],
    dataLabels: { enabled: false },
    xaxis: { categories: labels, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: {
      min: 0,
      max: Math.ceil(Math.max(...incomeData, ...expenseData) / 100) * 100,
      tickAmount: undefined,
      labels: {
        formatter: (value: number) => {
          if (value % 100 === 0) return value.toString();
          return '';
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: { shape: 'circle' },
      labels: { colors: '#243642' },
      fontWeight: 600
    },
    grid: { borderColor: '#E0E0E0', strokeDashArray: 4 },
  };

  return (
    <div className="flex-1">
      <div className="bg-white shadow rounded-[10px]">
        <div className="p-2 md:p-6">
          <h3 className="md:text-lg font-semibold text-gray-900 mb-4">Transaction amounts</h3>
          <ReactApexChart type="bar" series={series} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
