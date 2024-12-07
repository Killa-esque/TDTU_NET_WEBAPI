import { Card } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { FaBookmark } from 'react-icons/fa';
import AccountLayout from '@/components/User/Layout/AccountLayout/AccountLayout';
import CustomSidebar from '@/components/User/Layout/AccountLayout/CustomSidebar';
import { savedData } from '@/data/savedData';

const Saved = () => {
  // Sidebar items specific for this route
  const sidebarItems = [
    {
      icon: <FaBookmark className="text-pinkCustom w-6 h-6" />,
      title: "Saved Items",
      description: "Check out your saved items and manage your plans.",
    },
    // Thêm các item khác nếu cần
  ];

  // Nội dung Saved
  const content = (
    <div className="mt-4">
      <Swiper spaceBetween={20} slidesPerView={1} breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}>
        {savedData.map((item) => (
          <SwiperSlide key={item.id}>
            <Card
              hoverable
              className="shadow-md rounded-lg flex flex-col justify-between h-full"
              cover={
                <img
                  alt={item.tenPhong}
                  src={item.hinhAnh[0]}
                  className="rounded-t-lg object-cover w-full h-48"
                />
              }
            >
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.tenPhong.length > 40
                    ? `${item.tenPhong.substring(0, 40)}...`
                    : item.tenPhong}
                </h3>
                <p className="text-sm text-gray-600">Guests: {item.khach}</p>
                <p className="text-sm text-gray-600">Price: ${item.giaTien} per night</p>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <a href="#" className="text-blue-600 hover:underline">View Details</a>
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  return (
    <AccountLayout
      title="Your Saved Items"
      content={content}
      sidebar={<CustomSidebar items={sidebarItems} />}
    />
  );
};

export default Saved;
