import { useParams } from "react-router-dom";
import { useRoom } from "@/hooks"; // Import hook useRoom
import { AiFillStar } from "react-icons/ai";
import { FaAward } from "react-icons/fa";
import { FiShare2, FiHeart } from "react-icons/fi";
import { MdOutlinePersonPin, MdOutlineKingBed, MdOutlineAcUnit, MdOutlineDirectionsCar, MdOutlineShower, MdOutlineCountertops, MdOutlineTv, MdOutlineWifi, MdOutlineWaves } from "react-icons/md";
import "@/assets/css/room-detail.css";

const Detail = () => {
  const { roomId } = useParams<{ roomId: string }>(); // Lấy roomId từ URL
  const { getRoomById } = useRoom();
  const { data: roomDetail, error } = getRoomById(roomId || ""); // Lấy dữ liệu từ API

  // Error state
  if (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold text-red-600">Error fetching room details</h2>
        <p className="text-gray-700 mt-2">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()} // Hoặc sử dụng refetch
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Nếu không có dữ liệu phòng
  if (!roomDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800">Room not found</h2>
        <p className="text-gray-600 mt-2">
          The room you're looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => window.history.back()} // Quay lại trang trước
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-20 room-details">
      <div>
        <p className="mb-2">
          <span className="font-semibold text-xl sm:text-3xl tracking-widest leading-relaxed text-gray-900">
            {roomDetail.propertyName}
          </span>
        </p>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <span className="flex items-center text-sm font-normal tracking-widest">
              <AiFillStar className="text-rose-500 mr-1" /> 4
            </span>
            <span className="underline text-sm font-normal tracking-widest mx-2">
              {5} đánh giá {/* Dữ liệu đánh giá nếu cần */}
            </span>
            <span className="text-sm font-normal tracking-widest mx-2 flex items-center">
              <FaAward className="text-rose-500 mr-1" /> Chủ nhà siêu cấp.
            </span>
          </div>
          <div className="flex items-center">
            <button className="px-2 py-1 flex items-center font-semibold text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <FiShare2 />
              <span className="ml-2">Chia sẻ</span>
            </button>
            <button className="px-2 py-1 flex items-center font-semibold text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <FiHeart />
              <span className="ml-2">Yêu thích</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 mt-5">
        <div className="rounded-xl overflow-hidden">
          <img
            className="w-full object-contain rounded-l-xl"
            src={roomDetail.propertyThumbnailUrl}
            alt="room"
          />
        </div>
      </div>

      <div className="w-full flex sm:flex-row flex-col mt-10 border-b pb-5">
        <div className="w-full sm:w-1/2 lg:w-3/5">
          <div className="pb-5 border-b">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{roomDetail.propertyDescription}</h2>
            <div className="flex items-center">
              <span className="font-semibold text-gray-600 mr-2">Sức chứa:</span>
              {[...Array(roomDetail.guests)].map((_, index) => (
                <MdOutlinePersonPin key={index} className="text-gray-500" />
              ))}
              <span className="font-semibold text-gray-600 ml-4">Giường:</span>
              {[...Array(roomDetail.beds)].map((_, index) => (
                <MdOutlineKingBed key={index} className="text-gray-500" />
              ))}
              <span className="font-semibold text-gray-600 ml-4">Phòng tắm:</span>
              {[...Array(roomDetail.bathrooms)].map((_, index) => (
                <MdOutlineShower key={index} className="text-gray-500" />
              ))}
            </div>
          </div>

          <div className="mt-5 pb-5 border-b">
            <h2 className="font-semibold text-gray-800 text-xl pb-4">Nơi này có những gì cho bạn</h2>
            <div className="grid grid-cols-2">
              {roomDetail.airConditioning && (
                <div className="flex items-center pb-4">
                  <MdOutlineAcUnit className="text-gray-500" />
                  <span className="ml-4 text-gray-800">Điều hòa</span>
                </div>
              )}
              {roomDetail.kitchen && (
                <div className="flex items-center pb-4">
                  <MdOutlineCountertops className="text-gray-500" />
                  <span className="ml-4 text-gray-800">Bếp</span>
                </div>
              )}
              {roomDetail.parking && (
                <div className="flex items-center pb-4">
                  <MdOutlineDirectionsCar className="text-gray-500" />
                  <span className="ml-4 text-gray-800">Đỗ xe</span>
                </div>
              )}
              {roomDetail.swimmingPool && (
                <div className="flex items-center pb-4">
                  <MdOutlineWaves className="text-gray-500" />
                  <span className="ml-4 text-gray-800">Hồ bơi</span>
                </div>
              )}
              {roomDetail.wifi && (
                <div className="flex items-center pb-4">
                  <MdOutlineWifi className="text-gray-500" />
                  <span className="ml-4 text-gray-800">Wifi</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
