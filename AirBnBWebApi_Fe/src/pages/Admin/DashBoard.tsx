// src/pages/AdminDashboard.tsx
import { useDashboard } from '@/hooks';
import { Reservation } from '@/types';
import React from 'react';

const DashBoard: React.FC = () => {
  const { getDashboard, getRecentBookings } = useDashboard();

  const { data: dashboard, isLoading, isError } = getDashboard();
  const { data: recentBookings, isLoading: isBookingsLoading, isError: isBookingsError } = getRecentBookings();


  if (isLoading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Admin Dashboard</h1>
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Admin Dashboard</h1>
        <div className="text-red-500">Error fetching data. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Card Tổng số người dùng */}
        <div className="bg-white shadow-lg rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-pink-500 mt-2">{dashboard.payload.totalUsers}</p>
          <p className="text-gray-500 mt-1">Compared to last month: +{dashboard.payload.usersComparedToLastMonth}%</p>
        </div>

        {/* Card Tổng số đơn đặt phòng */}
        <div className="bg-white shadow-lg rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-700">Bookings</h2>
          <p className="text-3xl font-bold text-pink-500 mt-2">{dashboard.payload.totalBookings}</p>
          <p className="text-gray-500 mt-1">Compared to last month: +{dashboard.payload.bookingsComparedToLastMonth}%</p>
        </div>

        {/* Card Tổng doanh thu */}
        <div className="bg-white shadow-lg rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-3xl font-bold text-pink-500 mt-2">${dashboard.payload.totalRevenue}</p>
        </div>
      </div>


      <div className="bg-white shadow-lg rounded-lg p-5 col-span-1 md:col-span-2 lg:col-span-4">
        <h2 className="text-xl font-semibold text-gray-700">Recent Bookings</h2>
        <div className="mt-4">
          {recentBookings?.payload?.map((booking: Reservation) => (
            <div key={booking.reservationId} className="border-b py-3">
              <h3 className="text-lg font-semibold">{booking.propertyName}</h3>
              <p className="text-gray-600">Guest: {booking.guestName}</p>
              <p className="text-gray-500">Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p className="text-gray-500">Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              <p className="text-gray-500">Total Price: ${booking.totalPrice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
