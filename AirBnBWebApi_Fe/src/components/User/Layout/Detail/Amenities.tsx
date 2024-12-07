import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Amenity } from "@/types";

const Amenities = ({ amenities }: { amenities: Amenity[] | undefined }) => {
  const [showAll, setShowAll] = useState(false);


  // Danh sách tiện ích giới hạn
  const visibleAmenities: Amenity[] | [] = showAll ? amenities ?? [] : amenities?.slice(0, 6) ?? [];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiện ích nổi bật</h2>
      <div className="grid grid-cols-2 gap-4">
        {visibleAmenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-4">
            <span className="text-2xl text-gray-600">
              <i className={`fa-regular ${amenity.icon}`}></i>
            </span>
            <span className="text-gray-800">{amenity.description}</span>
          </div>
        ))}
      </div>
      {/* Nút hiển thị tất cả */}
      {amenities && amenities.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center space-x-2"
        >
          <span>
            {showAll ? "Thu gọn tiện nghi" : `Hiển thị tất cả ${amenities.length} tiện nghi`}
          </span>
          <IoMdArrowDropdown />
        </button>
      )}
    </div>
  );
};

export default Amenities;
