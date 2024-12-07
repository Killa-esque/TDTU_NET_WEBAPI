import AccountLayout from '@/components/User/Layout/AccountLayout/AccountLayout';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Card, Button, Modal, Tabs, Rate, Space, message } from 'antd';
import { FaHistory, FaCalendarAlt, FaStar, FaMoneyCheckAlt } from 'react-icons/fa';
import 'antd/dist/reset.css';
import CustomSidebar from '@/components/User/Layout/AccountLayout/CustomSidebar';
import { useRoom, useUser } from '@/hooks';
import { CONFIG } from '@/config/appConfig';
import { useState } from 'react';
import useReservation from '@/hooks/useReservation';
import { BookingHistoryPayload, ReviewCreatePayload } from '@/types';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { storage } from '@/utils';
import storageKeys from '@/constants/storageKeys';
import ROUTES from '@/constants/routes';
import { Navigate } from 'react-router-dom';

const BookingHistory = () => {
  if (!storage.get(storageKeys.USER_INFO) && storage.get(storageKeys.USER_ROLE) !== "Admin") {
    return <Navigate to={ROUTES.HOME} />
  }

  // Custom hooks
  const { getBookingHistory } = useUser();
  const { cancelReservation } = useReservation();
  const { addRoomReview } = useRoom();

  // state components
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalReviewVisible, setIsModalReviewVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingHistoryPayload | null>(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  // Get booking history data
  const { data: bookingData } = getBookingHistory();

  const { mutate: addReviewMutation } = addRoomReview();


  // Handle cancel reservation action
  const handleCancelBooking = async (booking: BookingHistoryPayload) => {
    console.log(booking);
    setIsModalVisible(true);
    setSelectedBooking(booking);
  };

  const confirmCancelBooking = async () => {
    console.log(selectedBooking);
    if (selectedBooking) {
      try {
        if (selectedBooking?.reservationId) {
          await cancelReservation.mutateAsync(selectedBooking.reservationId);
        }
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error canceling booking:', error);
      }
    }
  };

  // Filter booking data based on the active tab
  const filteredBookings = bookingData?.filter((booking: BookingHistoryPayload) => {
    if (activeTab === "pending") return booking.status.toLowerCase() === "pending";
    if (activeTab === "confirmed") return booking.status.toLowerCase() === "confirmed";
    if (activeTab === "completed") return booking.status.toLowerCase() === "completed";
    if (activeTab === "cancelled") return booking.status.toLowerCase() === "cancelled";
    return true;
  });

  const tabItems = [
    {
      label: "Pending",
      key: "pending",
      children: (
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="booking-history-swiper"
        >
          {filteredBookings && filteredBookings.length > 0 ? (
            filteredBookings?.map((booking: BookingHistoryPayload) => (
              <SwiperSlide key={booking.reservationId}>
                <Card
                  hoverable
                  className="shadow-md rounded-lg transition-transform duration-300 transform hover:scale-105"
                  cover={
                    <img
                      alt={booking.propertyName}
                      src={`${CONFIG.SERVER_URL}/${booking.propertyImageUrls[1]}`}
                      className="rounded-t-lg object-cover w-full h-48"
                    />
                  }
                >
                  <h3 className="text-lg font-semibold text-gray-800">{booking.propertyName}</h3>
                  <p className="text-sm text-gray-600">Guests: {booking.guests}</p>
                  <p className="text-sm text-gray-600">Price: ${booking.propertyPricePerNight} per night</p>
                  <div className="mt-4 flex justify-between">
                    <Button
                      className="text-red-600 hover:underline"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </Card>
              </SwiperSlide>
            ))
          ) : (
            <div className="text-gray-500 mt-4">No data.</div>
          )}
        </Swiper>
      ),
    },
    {
      label: "Confirmed",
      key: "confirmed",
      children: (
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="booking-history-swiper"
        >
          {filteredBookings && filteredBookings.length > 0 ? (
            filteredBookings?.map((booking: BookingHistoryPayload) => (
              <SwiperSlide key={booking.reservationId}>
                <Card
                  hoverable
                  className="shadow-md rounded-lg transition-transform duration-300 transform hover:scale-105"
                  cover={
                    <img
                      alt={booking.propertyName}
                      src={`${CONFIG.SERVER_URL}/${booking.propertyImageUrls[1]}`}
                      className="rounded-t-lg object-cover w-full h-48"
                    />
                  }
                >
                  <h3 className="text-lg font-semibold text-gray-800">{booking.propertyName}</h3>
                  <p className="text-sm text-gray-600">Guests: {booking.guests}</p>
                  <p className="text-sm text-gray-600">Price: ${booking.propertyPricePerNight} per night</p>
                </Card>
              </SwiperSlide>
            ))
          ) : (
            <div className="text-gray-500 mt-4">No data.</div>
          )}
        </Swiper>
      ),
    },
    {
      label: "Completed",
      key: "completed",
      children: (
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="booking-history-swiper"
        >
          {filteredBookings && filteredBookings.length > 0 ? (
            filteredBookings?.map((booking: BookingHistoryPayload) => (
              <SwiperSlide key={booking.reservationId}>
                <Card
                  hoverable
                  className="shadow-md rounded-lg transition-transform duration-300 transform hover:scale-105"
                  cover={
                    <img
                      alt={booking.propertyName}
                      src={`${CONFIG.SERVER_URL}/${booking.propertyImageUrls[1]}`}
                      className="rounded-t-lg object-cover w-full h-48"
                    />
                  }
                >
                  <h3 className="text-lg font-semibold text-gray-800">{booking.propertyName}</h3>
                  <p className="text-sm text-gray-600">Guests: {booking.guests}</p>
                  <p className="text-sm text-gray-600">Price: ${booking.propertyPricePerNight} per night</p>
                  <Space>
                    <Button
                      className="bg-pinkCustom text-white hover:bg-pink-700!important"
                      onClick={() => {
                        setIsModalReviewVisible(true)
                        setSelectedBooking(booking)
                      }}
                    >
                      Leave a Review
                    </Button>
                  </Space>
                </Card>
              </SwiperSlide>
            ))
          ) : (
            <div className="text-gray-500 mt-4">No data.</div>
          )}
        </Swiper>
      ),
    },
    {
      label: "Cancelled",
      key: "cancelled",
      children: (
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="booking-history-swiper"
        >
          {filteredBookings && filteredBookings.length > 0 ? (
            filteredBookings?.map((booking: any) => (
              <SwiperSlide key={booking.reservationId}>
                <Card
                  hoverable
                  className="shadow-md rounded-lg transition-transform duration-300 transform hover:scale-105"
                  cover={
                    <img
                      alt={booking.propertyName}
                      src={`${CONFIG.SERVER_URL}/${booking.propertyImageUrls[1]}`}
                      className="rounded-t-lg object-cover w-full h-48"
                    />
                  }
                >
                  <h3 className="text-lg font-semibold text-gray-800">{booking.propertyName}</h3>
                  <p className="text-sm text-gray-600">Guests: {booking.guests}</p>
                  <p className="text-sm text-gray-600">Price: ${booking.propertyPricePerNight} per night</p>
                </Card>
              </SwiperSlide>
            ))
          ) : (
            <div className="text-gray-500 mt-4">No data.</div>
          )}
        </Swiper>
      ),
    },
  ];

  const content = (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Booking History</h2>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems} // Using items instead of TabPane
      />
    </div>
  );

  const handleReviewSubmit = () => {
    if (!rating || !reviewText) {
      message.info('Hãy đánh giá và viết đánh giá của bạn trước khi gửi.');
      return;
    }


    if (selectedBooking) {
      const { propertyId, userId } = selectedBooking;

      let payload: ReviewCreatePayload = {
        propertyId,
        userId,
        comment: reviewText,
        rating: rating,
      }

      console.log(payload);
      addReviewMutation(payload, {
        onSuccess: () => {
          message.success('Cảm on bạn đã gửi đánh giá của mình.');
          setIsModalReviewVisible(false);
        },
        onError: () => {
          message.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
      });
    }
    else {
      message.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  const sidebarItems = [
    {
      icon: <FaHistory className="text-pinkCustom w-6 h-6" />,
      title: "Booking History",
      description: "View and manage your past bookings.",
    },
    {
      icon: <FaCalendarAlt className="text-pinkCustom w-6 h-6" />,
      title: "Upcoming Bookings",
      description: "Check out your future bookings and plan your trips.",
    },
    {
      icon: <FaStar className="text-pinkCustom w-6 h-6" />,
      title: "Reviewed Places",
      description: "See places you’ve reviewed and give ratings to your stays.",
    },
    {
      icon: <FaMoneyCheckAlt className="text-pinkCustom w-6 h-6" />,
      title: "Payment History",
      description: "Keep track of your payments and refunds.",
    },
  ];


  return (
    <>
      <AccountLayout
        title="Booking History"
        content={content}
        sidebar={<CustomSidebar items={sidebarItems} />}
      />
      {/* Modal for confirming cancellation */}
      <Modal
        title="Cancel Booking"
        open={isModalVisible}
        onOk={confirmCancelBooking}
        onCancel={() => setIsModalVisible(false)}
        okText="Confirm Cancel"
        cancelText="Cancel"
        centered
      >
        <p>Are you sure you want to cancel this booking?</p>
      </Modal>

      {/* Modal for Review */}
      <Modal
        title="Leave a Review"
        open={isModalReviewVisible}
        onCancel={() => setIsModalReviewVisible(false)}
        onOk={handleReviewSubmit}
        okText="Submit Review"
        width={800}
        centered
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <Rate
            value={rating}
            onChange={setRating}
            className="mb-4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Write a Review</label>
          <div className="mb-4">
            <CKEditor
              editor={ClassicEditor}
              data={reviewText}
              onChange={(event, editor) => setReviewText(editor.getData())}
              config={{
                toolbar: [
                  'bold',
                  'italic',
                  'link',
                  'bulletedList',
                  'numberedList',
                  'blockQuote',
                  'undo',
                  'redo',
                ],
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingHistory;
