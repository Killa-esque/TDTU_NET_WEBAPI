import { useState } from 'react';
import { Button, Spin, message } from 'antd';
import { useReservation } from '@/hooks';
import { Reservation } from '@/types/reservation';
import dayjs from 'dayjs';

const Home = () => {
  const { getCheckOutRooms, getPendingReservations, getUpcomingReservations, getCurrentReservations, confirmReservation } = useReservation();

  // Data for different tabs
  const { data: checkOutRooms, isLoading: isLoadingCheckOut, isError: isErrorCheckOut } = getCheckOutRooms();
  const { data: pendingReservations, isLoading: isLoadingPending, isError: isErrorPending } = getPendingReservations();
  const { data: upcomingReservations, isLoading: isLoadingUpcoming, isError: isErrorUpcoming } = getUpcomingReservations();
  const { data: currentReservations, isLoading: isLoadingCurrent, isError: isErrorCurrent } = getCurrentReservations();

  const [activeTab, setActiveTab] = useState('current'); // Tab mặc định

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleConfirmReservation = async (reservationId: string) => {
    try {
      if (reservationId) {
        // Thực hiện xác nhận đặt phòng
        await confirmReservation.mutateAsync(reservationId);

        // Hiển thị thông báo xác nhận thành công
        message.success('Xác nhận thành công!');
      }
    } catch (error) {
      message.error('Xác nhận thất bại. Vui lòng thử lại.');
    }
  };

  const tabs = [
    { label: `Sắp trả phòng (${checkOutRooms?.length || 0})`, key: 'checkout' },
    { label: `Hiện đang đón tiếp (${currentReservations?.length || 0})`, key: 'current' },
    { label: `Sắp tới (${upcomingReservations?.length || 0})`, key: 'upcoming' },
    { label: `Yêu cầu đặt phòng đang chờ xử lý (${pendingReservations?.length || 0})`, key: 'pendingReviews' },
    // thêm tab xác nhận trả phòng
    // { label: `Xác nhận trả phòng (${checkOutRooms?.length || 0})`, key: 'checkout' }
  ];

  const renderTabContent = () => {
    let data;
    let isLoading;
    let isError;

    // Xử lý dữ liệu cho từng tab
    if (activeTab === 'checkout') {
      data = checkOutRooms;
      isLoading = isLoadingCheckOut;
      isError = isErrorCheckOut;
    } else if (activeTab === 'pendingReviews') {
      data = pendingReservations;
      isLoading = isLoadingPending;
      isError = isErrorPending;
    } else if (activeTab === 'upcoming') {
      data = upcomingReservations;
      isLoading = isLoadingUpcoming;
      isError = isErrorUpcoming;
    } else {
      data = currentReservations;
      isLoading = isLoadingCurrent;
      isError = isErrorCurrent;
    }

    if (isLoading) {
      return <div className="flex justify-center mt-4"><Spin size="large" /></div>;
    }

    if (isError) {
      return <div className="text-red-500 mt-4">Đã có lỗi xảy ra! Vui lòng thử lại.</div>;
    }

    if (!data || data.length === 0) {
      return <div className="text-gray-500 mt-4">Không có dữ liệu.</div>;
    }

    return (
      <div className="space-y-6 mt-6">
        {data.map((booking: Reservation) => (
          <div
            key={booking.reservationId}
            className="border p-6 rounded-xl shadow-lg bg-white flex justify-between items-center hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-800">{booking.guestName}</h4>
              <p className="text-gray-600 mt-1">Phòng: {booking.propertyName}</p>
              <p className="text-gray-600 mt-2">
                <span className="font-medium">Ngày check-in:</span> {dayjs(booking.checkInDate).format('DD/MM/YYYY')}
                - <span className="font-medium">Ngày check-out:</span> {dayjs(booking.checkOutDate).format('DD/MM/YYYY')}
              </p>
            </div>

            {/* Xác nhận cho các đánh giá đang chờ xử lý */}
            {activeTab === 'pendingReviews' && (
              <Button
                type="primary"
                onClick={() => booking.reservationId && handleConfirmReservation(booking.reservationId)}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-md px-4 py-2"
              >
                Xác nhận
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 lg:p-12">
      <section className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Hân hạnh chào đón Phú!
        </h1>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Đặt phòng/đặt chỗ của bạn
        </h2>
        <div className="flex flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 text-sm border ${activeTab === tab.key ? 'border-black text-black' : 'border-gray-300 text-gray-500'
                } rounded-full transition hover:border-black`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 p-4 rounded-lg">
        {renderTabContent()}
      </section>
    </div>
  );
};

export default Home;
