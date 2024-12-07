import React from 'react';
import { Button } from 'antd';
import { SettingOutlined, ExpandOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { useReservation } from '@/hooks';
import { ChartData } from '@/types';

type Props = {};

const Revenue: React.FC<Props> = () => {
  const { getRevenueData } = useReservation();
  const { data: revenue, isLoading, error } = getRevenueData();

  console.log(revenue);

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) => `$${tickValue}`,
        },
      },
    },
  };

  // Cấu hình dữ liệu cho biểu đồ
  const chartDataConfig = {
    labels: Array.from({ length: 12 }, (_, index) => {
      // Chuyển đổi số tháng thành tên tháng
      const month = new Date(2024, index).toLocaleString('default', { month: 'long' });
      return month;
    }),
    datasets: [
      {
        label: 'Income',
        data: Array.from({ length: 12 }, (_, index) => {
          // Tìm thu nhập cho mỗi tháng từ dữ liệu trả về
          const monthData = revenue?.chartDatas.find((data: ChartData) => new Date(data.date).getMonth() === index);
          return monthData ? monthData.income : 0; // Nếu không có dữ liệu thu nhập cho tháng đó thì gán giá trị 0
        }),
        borderColor: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        fill: true,
      },
    ],
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading revenue data</p>;
  }

  return (
    <div className="p-6 md:p-10 lg:p-12">
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Thu nhập</h1>
        <p className="text-2xl md:text-3xl font-bold text-gray-800">
          Bạn có thu nhập <span className="text-black">${revenue?.currentMonthIncome.toFixed(2)}</span> trong tháng này
        </p>
      </section>

      <div className="flex flex-wrap md:flex-nowrap gap-8">
        <div className="flex-1 bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <Button icon={<SettingOutlined />} />
            <Button icon={<ExpandOutlined />} />
          </div>

          {/* Biểu đồ thu nhập */}
          <Line data={chartDataConfig} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Revenue;
