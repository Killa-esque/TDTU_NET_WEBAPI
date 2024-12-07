import { useState } from "react";
import { DatePicker, Select } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAuth, useRoom } from "@/hooks";
import { RoomAvailabilityPayload } from "@/types";
import { useNotification } from "@/contexts";
import "@/assets/css/datepicker-custom.css"; // Import file CSS tùy chỉnh
import { useModal } from "@/contexts/ModalAuthContext";

const { RangePicker } = DatePicker;

interface Props {
  roomId: string;
}

const BookingDetail = ({ roomId }: Props) => {
  const [dates, setDates] = useState<[string | null, string | null]>([null, null]);
  const [guests, setGuests] = useState(1);
  const [availabilityResult, setAvailabilityResult] = useState<{
    isAvailable: boolean;
    totalPrice?: number;
  } | null>(null);

  const { user } = useAuth();
  const { openAuthModal } = useModal();

  const navigate = useNavigate();
  const { handleNotification } = useNotification();
  const { checkRoomAvailability } = useRoom();

  const handleCheckAvailability = () => {
    if (!dates[0] || !dates[1]) {
      handleNotification("Vui lòng chọn ngày để kiểm tra phòng!", "warning");
      return;
    }

    const payload: RoomAvailabilityPayload = {
      propertyId: roomId,
      startDate: dates[0]!,
      endDate: dates[1]!,
      guests: guests,
    };

    checkRoomAvailability.mutate(payload, {
      onSuccess: (data) => {
        const { isAvailable, totalPrice } = data.data.payload;

        if (!isAvailable) {
          handleNotification("Phòng không còn trống trong khoảng thời gian này!", "warning");
          setAvailabilityResult({ isAvailable, totalPrice });
        }

        if (isAvailable && totalPrice) {
          handleNotification("Phòng còn trống, bạn có thể đặt phòng!", "success");
          setAvailabilityResult({ isAvailable, totalPrice });
        }
      },
      onError: () => {
        handleNotification("Đã xảy ra lỗi, vui lòng thử lại sau!", "error");
      },
    });
  };

  const handleNavigateToBooking = () => {
    if (user) {
      navigate(`/booking/${roomId}`, {
        state: {
          startDate: dates[0]!,
          endDate: dates[1]!,
          guests: guests!,
          totalPrice: availabilityResult?.totalPrice,
        },
      });

      return;
    }

    openAuthModal();
  };

  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf("day");
  };

  const handleClearData = () => {
    setDates([null, null]); // Reset ngày
    setGuests(1); // Reset số khách về mặc định
    setAvailabilityResult(null); // Reset trạng thái phòng
  };

  const isChecking = checkRoomAvailability.status === "pending";
  const isAvailable = availabilityResult?.isAvailable;

  return (
    <div className="sticky top-28 bg-white shadow-xl rounded-xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">
        {availabilityResult
          ? availabilityResult.isAvailable
            ? "Phòng có sẵn"
            : "Phòng không còn trống"
          : "Thêm ngày để kiểm tra phòng"}
      </h3>
      {availabilityResult?.isAvailable && (
        <div className="mt-4">
          <p className="text-gray-700">
            Tổng giá:{" "}
            <span className="font-semibold">
              {availabilityResult.totalPrice?.toLocaleString()}$
            </span>
          </p>
        </div>
      )}
      <RangePicker
        className="w-full custom-range-picker"
        popupClassName="custom-range-picker-popup"
        format="YYYY-MM-DD"
        disabledDate={disabledDate}
        onChange={(dates, dateStrings) => {
          setDates(dateStrings); // Cập nhật ngày
          setAvailabilityResult(null); // Reset trạng thái phòng
          if (!dateStrings[0] || !dateStrings[1]) {
            handleClearData(); // Nếu xóa thì reset
            setAvailabilityResult(null); // Reset trạng thái phòng
          }
        }}
        allowClear={true} // Kích hoạt nút Clear
        placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
      />

      <Select
        value={guests}
        onChange={(value) => {
          setGuests(value); // Cập nhật số khách
        }}
        className="w-full"
        placeholder="Số khách"
        allowClear={true} // Kích hoạt nút Clear
        onClear={handleClearData} // Reset khi Clear
      >
        {[...Array(10)].map((_, index) => (
          <Select.Option key={index + 1} value={index + 1}>
            {index + 1} khách
          </Select.Option>
        ))}
      </Select>

      <button
        className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-200 ${isAvailable ? "bg-green-500 hover:bg-green-600" : "bg-rose-500 hover:bg-rose-600"}`}
        onClick={isAvailable ? handleNavigateToBooking : handleCheckAvailability}
        disabled={isChecking === true ? true : isAvailable === false}
      >
        {isChecking ? "Đang kiểm tra..." : isAvailable !== null && isAvailable === true ? "Đặt phòng ngay" : isAvailable !== null && isAvailable === false
          ? "Phòng không còn trống"
          : "Kiểm tra phòng"}
      </button>
    </div>
  );
};

export default BookingDetail;
