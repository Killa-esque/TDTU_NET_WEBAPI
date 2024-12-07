import React from "react";
import { Rate, Avatar } from "antd";
import { Review } from "@/types";
import { CONFIG } from "@/config/appConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

interface FeedbackRoomProps {
  reviews: Review[];
}


const FeedbackRoom: React.FC<FeedbackRoomProps> = ({ reviews }) => {

  console.log(reviews)
  return (
    <div >
      {/* Tổng quan đánh giá */}
      <div className="border-b pb-6">
        <div className="flex items-center space-x-2 font-semibold text-2xl text-gray-800 mb-2">
          <i className="fa fa-star text-rose-500"></i>
          <span className="font-semibold">
            {reviews.length > 0 ? (
              (
                reviews.reduce((total, review) => total + review.rating, 0) /
                reviews.length
              ).toFixed(2)
            ) : 0}
          </span>
          <span className="text-gray-500">({reviews.length} đánh giá)</span>
        </div>

        {/* Xếp hạng tổng thể */}
        <div className="mt-6">
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            Xếp hạng tổng thể
          </h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const starCount = reviews.filter(
                (review) => Math.round(review.rating) === star
              ).length;
              const percentage = (starCount / reviews.length) * 100;

              return (
                <div key={star} className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-800 w-4">
                    {star}
                  </span>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <hr />

      {/* Danh sách bình luận */}
      <div className="mt-6">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={1} // Hiển thị 1 bình luận trên màn hình nhỏ
          breakpoints={{
            640: { slidesPerView: 2 }, // Hiển thị 2 bình luận trên màn hình >= 640px
            1024: { slidesPerView: 3 }, // Hiển thị 3 bình luận trên màn hình >= 1024px
          }}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.reviewId}>
              <div className="p-4 bg-white rounded-lg shadow-md border">
                {/* Thông tin người dùng */}
                <div className="flex items-center">
                  <Avatar
                    src={`${CONFIG.SERVER_URL}${review.avatar}` || "https://via.placeholder.com/150"}
                    size={50}
                  />
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">
                      {review.fullName || "Ẩn danh"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {review.createdAt
                        ?
                        `Ngày ${new Date(review.createdAt).getDate()}
                         tháng ${new Date(review.createdAt).getMonth() + 1
                        } năm ${new Date(review.createdAt).getFullYear()}`
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Nội dung bình luận */}
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Rate className="custom-rate text-rose-500!important text-sm" disabled value={review.rating} />
                  </div>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">
                    {review.comment}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>


    </div>
  );
};

export default FeedbackRoom;
