import { DatePicker } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs"; // Import dayjs

type Props = {
  value: [Dayjs, Dayjs];
  onChange: (dates: [Dayjs | null, Dayjs | null]) => void;
  disabledDates?: Dayjs[]; // Sử dụng Dayjs cho danh sách ngày bị disable
};

const { RangePicker } = DatePicker;

function Calendar({ value, onChange, disabledDates }: Props) {
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    if (!current) {
      return false;
    }

    const isPastDate = current < dayjs(); // Kiểm tra nếu ngày nhỏ hơn hôm nay
    const isDisabled = disabledDates
      ? disabledDates.some((date) => current.isSame(date, "day")) // Sử dụng isSame để so sánh ngày
      : false;

    return isPastDate || isDisabled;
  };

  return (
    <RangePicker
      value={value}
      onChange={(dates) => onChange([dates?.[0] || null, dates?.[1] || null])}
      format="YYYY-MM-DD"
      disabledDate={disabledDate}
      showTime={false}
      style={{ width: "100%" }}
    />
  );
}

export default Calendar;
