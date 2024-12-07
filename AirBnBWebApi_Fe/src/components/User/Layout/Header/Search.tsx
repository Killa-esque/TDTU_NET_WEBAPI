import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs"; // Chỉ cần import dayjs để sử dụng diff
import { SearchOutlined } from "@ant-design/icons";
import { useCountries, useSearchModal } from "@/hooks";

type Props = {};

const useSearchParams = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const Search: React.FC<Props> = () => {
  const searchModel = useSearchModal();
  const params = useSearchParams();
  const { getByValue } = useCountries();

  const locationValue = params.get("locationValue");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  const guestCount = params.get("guestCount");

  const locationLabel = useMemo(() => {
    if (locationValue) {
      return getByValue(locationValue)?.label || "Anywhere";
    }
    return "Anywhere";
  }, [getByValue, locationValue]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = dayjs(startDate); // Sử dụng dayjs để parse ngày bắt đầu
      const end = dayjs(endDate); // Sử dụng dayjs để parse ngày kết thúc
      let diff = end.diff(start, "day"); // Tính sự chênh lệch giữa hai ngày

      if (diff === 0) {
        diff = 1; // Nếu ngày bắt đầu và kết thúc là cùng một ngày, đặt diff là 1
      }

      return `${diff} Days`;
    }
    return "Any Week";
  }, [startDate, endDate]);

  const guessLabel = useMemo(() => {
    if (guestCount) {
      return `${guestCount} Guests`;
    }
    return "Add Guests";
  }, [guestCount]);

  return (
    <div
      onClick={() => {
        console.log("Open search modal");
        searchModel.onOpen();
      }}
      className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold px-6">{locationLabel}</div>
        <div className="hidden sm:block text-losm font-semibold px-6 border-x-[1px] flex-1 text-center">
          {durationLabel}
        </div>
        <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
          <div className="hidden sm:block text-center">{guessLabel}</div>
          <div className="p-2 bg-rose-500 rounded-full text-white">
            <SearchOutlined size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
