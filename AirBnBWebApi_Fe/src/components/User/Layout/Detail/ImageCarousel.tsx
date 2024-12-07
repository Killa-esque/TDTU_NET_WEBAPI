import { CONFIG } from '@/config/appConfig'
import { EyeOutlined } from '@ant-design/icons'
import { Button, Image } from 'antd'
import { useState } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { SwiperSlide } from 'swiper/react'
import { Swiper } from 'swiper/react'

type Props = {
  propertyImageUrls: string[]
}

const ImageCarousel = ({ propertyImageUrls }: Props) => {

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);


  return (
    <div className='carousel relative '>
      <div className="mt-5">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1} // Hiển thị 1 ảnh/lần
          breakpoints={{
            640: { slidesPerView: 2 }, // Hiển thị 2 ảnh trên màn hình >= 640px
            1024: { slidesPerView: 3 }, // Hiển thị 3 ảnh trên màn hình >= 1024px
          }}
          className="room-swiper"
        >
          {propertyImageUrls.map((imageUrl: string, index: number) => (
            <SwiperSlide key={index}>
              <Image
                src={`${CONFIG.SERVER_URL}${imageUrl}`}
                alt={`room-${index}`}
                className="swiper-image"
                preview={{
                  src: `${CONFIG.SERVER_URL}${imageUrl}`, // Hiển thị ảnh trong gallery
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Nút "Xem tất cả ảnh" */}
      {propertyImageUrls.length > 0 && (
        <div className="mt-4 inline absolute right-0">
          <Button
            type="default"
            title='View All Images'
            onClick={() => setIsGalleryOpen(true)} // Mở gallery khi nhấn nút
          >
            <EyeOutlined />
          </Button>
        </div>
      )}

      {/* Ant Design Gallery */}
      <Image.PreviewGroup
        preview={{
          visible: isGalleryOpen,
          onVisibleChange: (visible) => setIsGalleryOpen(visible), // Đóng gallery
        }}
      >
        {propertyImageUrls.map((imageUrl: string, index: number) => (
          <Image
            key={index}
            src={`${CONFIG.SERVER_URL}${imageUrl}`}
            style={{ display: "none" }} // Ẩn ảnh gốc, chỉ dùng trong gallery
          />
        ))}
      </Image.PreviewGroup>
    </div>
  )
}

export default ImageCarousel
