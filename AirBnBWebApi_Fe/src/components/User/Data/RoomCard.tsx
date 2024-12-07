import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import { AiFillStar } from "react-icons/ai";
import { FaBed, FaUser, FaShower } from "react-icons/fa";
import { Room } from "@/types";
import { CONFIG } from "@/config/appConfig";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/constants/routes";
import { useRoom } from "@/hooks";

type RoomCardProps = {
  room: Room;
};

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();
  const { getRoomAmenities } = useRoom();

  const { data: amenities = [] } = room.id ? getRoomAmenities(room.id) : { data: [] };

  const hasMultipleImages = (room.propertyImageUrls ?? []).length > 1;

  const handleBooking = (slug: string) => {
    const roomDetailPath = ROUTES.ROOM_DETAIL.replace(":slug", slug.toString());
    navigate(roomDetailPath, { state: { room } });
  };


  return (
    <div className="roomLink">
      <Swiper
        slidesPerView={1}
        cssMode={true}
        navigation={hasMultipleImages}
        pagination={hasMultipleImages}
        mousewheel={hasMultipleImages}
        keyboard={hasMultipleImages}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        className="roomSwiper"
      >
        {room.propertyImageUrls && room.propertyImageUrls.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${CONFIG.SERVER_URL}${image}`}
              alt={`Slide ${index + 1}`}
              className="w-full"
              loading="lazy"
            />
          </SwiperSlide>
        ))}

        <button className="absolute top-3 right-3 z-30">
          <AiFillStar className="icon-heart" />
        </button>
      </Swiper>

      <div className="cursor-pointer" onClick={() => room.slug && handleBooking(room.slug)}>
        <p className="flex justify-between mt-2">
          <span className="font-bold truncate">{room.propertyName}</span>
          <span className="flex items-center ml-1">
            <span className="ml-2 text-yellow-500 mx-1">
              <AiFillStar />
            </span>
            9.14
          </span>
        </p>
        <p className="text-sm mt-2">
          <span className="flex items-center">
            <span className="font-semibold text-gray-600 mr-1">Sức chứa:</span>
            <span className="flex">
              {[...Array(room.guests)].map((_, index) => (
                <FaUser key={index} className="inline text-gray-500 mx-1" />
              ))}
            </span>
          </span>
          <span className="flex items-center mt-2">
            <span className="font-semibold text-gray-600 mr-1">Giường:</span>
            <span className="flex">
              {[...Array(room.beds)].map((_, index) => (
                <FaBed key={index} className="inline text-gray-500 mx-1" />
              ))}
            </span>
          </span>
          <span className="flex items-center mt-2">
            <span className="font-semibold text-gray-600 mr-1">Phòng tắm:</span>
            <span className="flex">
              {[...Array(room.bathrooms)].map((_, index) => (
                <FaShower key={index} className="inline text-gray-500 mx-1" />
              ))}
            </span>
          </span>
          <span className="flex items-center font-semibold text-gray-600 mt-2">
            Các tiện ích:
            {
              amenities.map((amenity, index) => (
                <span key={index} className="inline text-gray-500 ml-2">
                  <i className={`fa-regular ${amenity.icon} `}></i>
                </span>

              ))
            }
          </span>
        </p>
        <p className="mt-1 text-xl text-gray-700">
          <span className="font-bold text-2xl text-gray-900">${room.propertyPricePerNight}</span>
          <span className="text-base text-gray-500">/đêm</span>
        </p>
      </div>
    </div>
  );
};

export default RoomCard;
