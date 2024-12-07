import { useEffect, useState } from "react";
import { useModal } from "@/contexts/ModalAuthContext";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth, useReservation, useRoom } from "@/hooks";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { CONFIG } from "@/config/appConfig";
import { Reservation } from "@/types/reservation";
import { Button, Modal } from "antd";
import ROUTES from "@/constants/routes";
import { useNotification } from "@/contexts";
import { storage } from "@/utils";
import storageKeys from "@/constants/storageKeys";
import ROLE from "@/constants/role";

type Props = {};

// Validation Schema cho Formik
const BookingSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Họ và tên không được bỏ trống")
    .min(2, "Họ và tên quá ngắn"),
  email: Yup.string()
    .email("Định dạng email không hợp lệ")
    .required("Email không được bỏ trống"),
  startDate: Yup.date().required("Vui lòng chọn ngày nhận phòng").nullable(),
  endDate: Yup.date().required("Vui lòng chọn ngày trả phòng").nullable(),
  guests: Yup.number()
    .min(1, "Số khách ít nhất là 1")
    .max(10, "Số khách tối đa là 10")
    .required("Vui lòng nhập số lượng khách"),
});

interface FormValues {
  startDate: string;
  endDate: string;
  guests: number;
  fullName: string;
  email: string;
}

interface BookingState {
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
}

const Booking = ({ }: Props) => {

  if (!storage.get(storageKeys.USER_INFO) && storage.get(storageKeys.USER_ROLE) !== ROLE.USER) {
    return <Navigate to={ROUTES.HOME} />
  }

  const { roomId } = useParams<{ roomId: string }>();
  const { getRoomById } = useRoom();
  const { data: roomInfo } = getRoomById(roomId || "");
  const { createReservation } = useReservation();

  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { openAuthModal, isBookingModalOpen, closeBookingModal, openBookingModal } = useModal();
  const { handleNotification } = useNotification();

  const [bookingState, setBookingState] = useState<BookingState | null>(null);
  const [isLoadingCreateReservation, setIsLoadingCreateReservation] = useState(false);

  useEffect(() => {
    if (!user) {
      openAuthModal(); // Mở modal nếu chưa đăng nhập
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
    }
  }, [user, location.pathname, openAuthModal]);

  useEffect(() => {
    // Lấy dữ liệu truyền qua state từ route trước
    const state = location.state as BookingState;
    if (state) {
      setBookingState(state);
    } else {
      console.error("No state found. Redirecting...");
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  if (!user || !bookingState) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Đang tải thông tin đặt phòng...</p>
      </div>
    );
  }

  const { startDate, endDate, guests, totalPrice } = bookingState;
  const totalDays = dayjs(endDate).diff(dayjs(startDate), "day");
  const { fullName, email } = user;

  const maxFreeGuests = roomInfo?.guests ?? 0;
  const extraGuestFeePerNight = 20;
  const extraGuests = guests > maxFreeGuests ? guests - maxFreeGuests : 0;
  const extraGuestFee = extraGuests * extraGuestFeePerNight;

  const initialValues: FormValues = {
    startDate: startDate,
    endDate: endDate,
    guests: guests,
    fullName: fullName || "",
    email: email || "",
  };

  const handleSubmit = async (values: FormValues) => {
    if (!roomId) {
      console.error("Room ID is undefined");
      return;
    }

    const payload: Reservation = {
      propertyId: roomId,
      userId: user.id,
      checkInDate: values.startDate,
      checkOutDate: values.endDate,
      guests: values.guests,
      guestName: user.fullName,
      propertyName: roomInfo?.propertyName || "",
    };



    try {
      setIsLoadingCreateReservation(true);

      const response = await createReservation.mutateAsync(payload);

      if (response.payload) {
        openBookingModal();
      } else {
        handleNotification(response.message, "info");
        navigate(ROUTES.HOME, { replace: true });
      }

    } catch (error) {
      handleNotification("Đã xảy ra lỗi. Vui lòng thử lại sau.", "error");
    } finally {
      setIsLoadingCreateReservation(false);
    }
  };


  const handleModalOk = () => {
    closeBookingModal();
    navigate(`${ROUTES.ACCOUNT_SETTING}/${ROUTES.BOOKING_HISTORY}`, { replace: true }); // Điều hướng đến trang theo dõi đặt phòng
  };

  const handleModalCancel = () => {
    closeBookingModal();
    navigate(ROUTES.HOME, { replace: true }); // Điều hướng về Home
  };


  return (
    <div className="bg-gray-50 min-h-screen py-10 px-5 lg:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Thông Tin */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            Yêu cầu đặt phòng/đặt chỗ
          </h1>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={BookingSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="bg-white shadow rounded-lg p-6 space-y-6">
                {/* Thông tin chuyến đi */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Chuyến đi của bạn
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Ngày:</span>
                      <span className="font-medium">
                        {dayjs(values.startDate).format("DD/MM/YYYY")} -{" "}
                        {dayjs(values.endDate).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <ErrorMessage name="startDate" component="div" className="text-red-500" />
                    <ErrorMessage name="endDate" component="div" className="text-red-500" />
                    <div className="flex justify-between">
                      <span className="text-gray-700">Khách:</span>
                      <span className="font-medium">{values.guests} khách</span>
                    </div>
                    <ErrorMessage name="guests" component="div" className="text-red-500" />
                  </div>
                </div>

                {/* Thông tin người dùng */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin của bạn
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-gray-700 font-medium"
                      >
                        Họ và tên
                      </label>
                      <Field
                        id="fullName"
                        name="fullName"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <ErrorMessage name="fullName" component="div" className="text-red-500" />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-700 font-medium"
                      >
                        Email
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500" />
                    </div>
                  </div>
                </div>

                {/* Nút Submit */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-rose-600 focus:ring-4 focus:ring-rose-300 transition duration-200"
                    disabled={isLoadingCreateReservation}
                  >
                    {isLoadingCreateReservation ? "Đang xử lý..." : "Xác nhận đặt phòng"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Chi tiết giá */}
        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <img
              src={`${CONFIG.SERVER_URL}${roomInfo?.propertyImageUrls?.[0] ?? ''}`}
              alt={roomInfo?.propertyName}
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <h2 className="text-lg font-semibold text-gray-900">
              {roomInfo?.propertyName}
            </h2>
            <p className="text-sm text-gray-500 mb-6">Toàn bộ căn hộ cho thuê</p>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-700">{`$${roomInfo?.propertyPricePerNight.toLocaleString()} x ${totalDays} đêm`}</span>
                <span className="font-medium">{`$${(
                  (roomInfo?.propertyPricePerNight ?? 0) * totalDays
                ).toLocaleString()}`}</span>
              </div>
              {extraGuests > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Phí phụ thêm ({extraGuests} khách)
                  </span>
                  <span className="font-medium">{`₫${extraGuestFee.toLocaleString()}`}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-4">
                <span className="text-gray-900 font-bold">Tổng (Dollar)</span>
                <span className="font-bold text-gray-900">{`$${(totalPrice ?? 0).toLocaleString()}`}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Modal thông báo */}
        <Modal
          title="Đặt phòng thành công"
          open={isBookingModalOpen}
          onCancel={handleModalCancel}
          centered
          footer={[
            <div className="flex justify-center">
              <Button key="back" onClick={handleModalCancel}>
                Quay lại trang chủ
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handleModalOk}
              >
                Theo dõi quá trình đặt phòng
              </Button>
            </div>
          ]}
        >
          <p>Chúng tôi đã nhận được yêu cầu đặt phòng của bạn.</p>
          <p>Bạn có thể theo dõi trạng thái đặt phòng trong mục "Lịch sử đặt phòng".</p>
        </Modal>
      </div>
    </div>
  );
};

export default Booking;
