import { AiFillStar } from "react-icons/ai";
import { FaAward } from "react-icons/fa";
import { FiShare2, FiHeart } from "react-icons/fi";
import "@/assets/css/room-detail.css";
import FeedbackRoom from '@/components/User/Layout/Detail/FeedBackRoom';
import { useLocation, useParams } from 'react-router-dom';
import { useRoom } from '@/hooks';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/assets/css/room.css';
import BookingDetail from '@/components/User/Layout/Detail/BookingDetail';
import Amenities from '@/components/User/Layout/Detail/Amenities';
import HostInfo from '@/components/User/Layout/Detail/HostInfo';
import ImageCarousel from '@/components/User/Layout/Detail/ImageCarousel';
import RoomDescription from '@/components/User/Layout/Detail/RoomDescription';

type Props = {}

const Detail = ({ }: Props) => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const roomId = location.state.room.id;
  console.log(roomId);

  const { getRoomBySlug, getRoomAmenities, getHostInfo, getRoomReviews } = useRoom();
  const { data: roomDetail, error } = getRoomBySlug(slug || "");
  const { data: roomAmenities } = getRoomAmenities(roomId || "");
  const { data: hostInfo } = getHostInfo(roomId || "");
  const { data: reviews } = getRoomReviews(roomId || "");

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

  // useEffect(() => { window.scrollTo(0, 0); setFeedBackRoom([{ id: 1, content: "Đánh giá 1" }, { id: 2, content: "Đánh giá 2" }]); }, []);

  return (
    <div>
      <div className="container mx-auto px-20 room-details">
        <div className='title'>
          <div className="mb-2">
            <p className="font-semibold text-xl sm:text-3xl tracking-widest leading-relaxed text-gray-900">{roomDetail.propertyName}</p>
          </div>
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center">
              <span className="flex items-center text-sm font-normal tracking-widest"><AiFillStar className="text-rose-500 mr-1" /> 4</span>
              <span className="underline text-sm font-normal tracking-widest mx-2">{reviews && reviews.length} đánh giá</span>
              <span className="text-sm font-normal tracking-widest mx-2 flex items-center"><FaAward className="text-rose-500 mr-1" /> Chủ nhà siêu cấp .</span>
            </div>
            <div className="flex items-center">
              <button className="px-2 py-1 flex items-center font-semibold text-sm text-gray-700 hover:bg-gray-100 rounded-md"><FiShare2 /><span className="ml-2">Chia sẻ</span></button>
              <button className="px-2 py-1 flex items-center font-semibold text-sm text-gray-700 hover:bg-gray-100 rounded-md"><FiHeart /><span className="ml-2">Yêu thích</span></button>
            </div>
          </div>
        </div>

        {/* Swiper Carousel */}
        <ImageCarousel propertyImageUrls={roomDetail.propertyImageUrls || []} />


        <div className="w-full flex sm:flex-row flex-col mt-10 border-b pb-5 space-y-6 sm:space-y-0 sm:space-x-6">
          {/* Thông tin chính về phòng */}
          <div className="w-full sm:w-1/2 lg:w-3/5">
            {/* Mô tả */}
            <RoomDescription guests={roomDetail.guests} beds={roomDetail.beds} bathrooms={roomDetail.beds} propertyDescription={roomDetail.propertyDescription} />

            {/* Show Host Information */}
            <HostInfo hostInfo={hostInfo} />


            {/* Tiện ích */}
            <Amenities amenities={roomAmenities} />
          </div>

          {/* Phần bên phải */}
          <div className="w-full sm:w-1/2 lg:w-2/5">
            <BookingDetail roomId={roomId || ""} />
          </div>
        </div>

        <div className="mt-10 pb-5 border-b">
          <FeedbackRoom reviews={reviews || []} />
        </div>
      </div>
    </div >)
}


export default Detail
