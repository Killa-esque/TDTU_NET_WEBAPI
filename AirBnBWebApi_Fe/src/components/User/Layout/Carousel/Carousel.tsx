import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "@/assets/css/carousel.css";
import { Navigation } from 'swiper/modules';

// Import các hình ảnh
import bacCuc from "@/assets/images/Bắc cực.jpg";
import baiBien from "@/assets/images/bãi biển.jpg";
import cabin from "@/assets/images/cabin.jpg";
import choiGolf from "@/assets/images/Chơi golf.jpg";
import congVienQuocGia from "@/assets/images/công viên quốc gia.jpg";
import dao from "@/assets/images/Đảo.jpg";
import hangDong from "@/assets/images/hang động.jpg";
import hoBoiTuyetVoi from "@/assets/images/hồ bơi tuyệt vời.jpg";
import khungCanhTuyetVoi from "@/assets/images/khung cảnh tuyệt vời.jpg";
import luotSong from "@/assets/images/lướt sóng.jpg";
import nhaDuoiLongDat from "@/assets/images/nhà dưới lòng đất.jpg";
import nhaNho from "@/assets/images/nhà nhỏ.jpg";
import phucVuBuaSang from "@/assets/images/Phục vụ bữa sáng.jpg";
import nhietDoi from "@/assets/images/nhiệt đới.jpg";
import thatAnTuong from "@/assets/images/thật ấn tượng.jpg";
import thietKe from "@/assets/images/thiết kế.jpg";
import venHo from "@/assets/images/ven hồ.jpg";
import khuCamTrai from "@/assets/images/khucamtrai.jpg";
import lauDai from "@/assets/images/laudai.jpg";
import nhaKhungChuA from "@/assets/images/nhakhungchua.jpg";

// Định nghĩa interface cho item
interface ImageItem {
  image: string;
  name: string;
}

// Dữ liệu hình ảnh
const image1: ImageItem[] = [
  { image: bacCuc, name: "Bắc cực" },
  { image: baiBien, name: "Bãi biển" },
  { image: cabin, name: "Cabin" },
  { image: choiGolf, name: "Chơi golf" },
  { image: congVienQuocGia, name: "Công viên quốc gia" },
  { image: dao, name: "Đảo" },
  { image: hangDong, name: "Hang động" },
  { image: hoBoiTuyetVoi, name: "Hồ bơi tuyệt vời" },
  { image: khungCanhTuyetVoi, name: "Khung cảnh tuyệt vời" },
  { image: luotSong, name: "Lướt sóng" },
  { image: nhaDuoiLongDat, name: "Nhà dưới lòng đất" },
  { image: nhaNho, name: "Nhà nhỏ" },
  { image: nhietDoi, name: "Nhiệt đới" },
  { image: phucVuBuaSang, name: "Phục vụ bữa sáng" },
  { image: thatAnTuong, name: "Thật ấn tượng" },
  { image: thietKe, name: "Thiết kế" },
  { image: venHo, name: "Ven hồ" },
  { image: khuCamTrai, name: "Khu cắm trại" },
  { image: nhaKhungChuA, name: "Nhà khung chữ A" },
  { image: lauDai, name: "Lâu đài" },
];

// Component CarouselSearch
const Carousel: React.FC = () => {
  return (
    <div className="flex item-swiper">
      <Swiper
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 0 },
          640: { slidesPerView: 3, spaceBetween: 10 },
          768: { slidesPerView: 4, spaceBetween: 10 },
          1024: { slidesPerView: 6, spaceBetween: 10 },
          1280: { slidesPerView: 8, spaceBetween: 10 },
        }}
        slidesPerView={8}
        spaceBetween={10}
        className="mySwiper"
        modules={[Navigation]}
        navigation
      >
        {image1.map((item, index) => (
          <SwiperSlide key={index}>
            <NavLink to="/" className="font-medium">
              <span className="flex flex-col items-center slick-item slick-item-img">
                <img src={item.image} alt={item.name} className="w-6" />
                <span className="text-xs hover:text-black">{item.name}</span>
              </span>
            </NavLink>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* <div className="flex items-center ml-2">
        <Button className="flex items-center button-filter border rounded-md text-base">
          <FilterOutlined className="mr-2" />
          <span className="filter">Bộ lọc</span>
        </Button>
      </div> */}
    </div>
  );
};

export default Carousel;
