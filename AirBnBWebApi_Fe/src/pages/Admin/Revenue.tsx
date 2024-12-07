// src/pages/Revenue.tsx
import React from 'react';
import { AiOutlineDollarCircle } from 'react-icons/ai';

const Revenue: React.FC = () => {
  const revenueData = [
    { id: 1, date: '2024-10-01', amount: 1200, description: 'Booking from John Doe', status: 'Completed' },
    { id: 2, date: '2024-10-02', amount: 800, description: 'Booking from Jane Smith', status: 'Completed' },
    { id: 3, date: '2024-10-03', amount: 150, description: 'Refund to Michael Johnson', status: 'Refunded' },
    { id: 4, date: '2024-10-04', amount: 500, description: 'Booking from Alice Brown', status: 'Completed' },
    { id: 5, date: '2024-10-05', amount: 300, description: 'Booking from Robert Green', status: 'Pending' },
  ];

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Filter by:', event.target.value);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-4">Revenue Overview</h1>

      {/* Filters and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <select
            onChange={handleFilterChange}
            className="p-2 border rounded-lg shadow-sm bg-white"
          >
            <option value="all">All Time</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastWeek">Last Week</option>
          </select>
          <select
            onChange={handleFilterChange}
            className="p-2 border rounded-lg shadow-sm bg-white"
          >
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-3xl font-bold text-pink-500 mt-2">$5,400</p>
          <p className="text-gray-500 mt-1">Compared to last month: +10%</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-700">Completed Transactions</h2>
          <p className="text-3xl font-bold text-green-500 mt-2">35</p>
          <p className="text-gray-500 mt-1">Compared to last month: +5%</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-700">Refunded Amount</h2>
          <p className="text-3xl font-bold text-red-500 mt-2">$350</p>
          <p className="text-gray-500 mt-1">Compared to last month: -2%</p>
        </div>
      </div>

      {/* Revenue Details Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Revenue Details</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-left">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2 text-pink-500">${item.amount}</td>
                <td className={`px-4 py-2 ${item.status === 'Completed' ? 'text-green-500' : item.status === 'Refunded' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-600">Rows per page: 5</span>
        <div className="flex items-center space-x-1">
          <button className="px-2 py-1 text-gray-600 hover:text-gray-800">&lt;</button>
          <span className="text-gray-600">1–5 of 23</span>
          <button className="px-2 py-1 text-gray-600 hover:text-gray-800">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
