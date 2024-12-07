import { useState } from 'react'
import { CONFIG } from '@/config/appConfig'
import type { HostInfo } from '@/types'
import { HomeOutlined, MailOutlined, PhoneOutlined, StarOutlined } from '@ant-design/icons'
import { Button, Modal, Rate } from 'antd'

type Props = {
  hostInfo: HostInfo | undefined
}

const HostInfo = ({ hostInfo }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  return (
    <div className="mt-6 pb-6 border-b">
      {/* Tiêu đề */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin chủ nhà</h2>
      <div className="flex flex-wrap items-center space-x-4">
        {/* Avatar */}
        <img
          className="w-16 h-16 rounded-full object-cover"
          src={`${CONFIG.SERVER_URL}${hostInfo?.avatar}` || "https://via.placeholder.com/150"}
          alt="Host Avatar"
        />
        {/* Thông tin cơ bản */}
        <div>
          <p className="text-lg font-semibold text-gray-800">{hostInfo?.fullName}</p>
          <p className="text-sm text-gray-600">Kinh nghiệm: {hostInfo?.experience} năm</p>
          <p className="text-sm text-gray-600">
            Tỷ lệ phản hồi: {hostInfo?.responseRate}%
          </p>
        </div>
      </div>

      {/* Nút mở modal */}
      <button
        className="mt-4 font-semibold underline text-sm text-rose-500"
        onClick={showModal}
      >
        Tìm hiểu thêm về chủ nhà
      </button>

      {/* Modal hiển thị chi tiết */}
      <Modal
        title={`Thông tin chi tiết về ${hostInfo?.fullName}`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        {/* Avatar và Thông tin cơ bản */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <img
            className="w-20 h-20 rounded-full object-cover mb-4 md:mb-0"
            src={`${CONFIG.SERVER_URL}${hostInfo?.avatar}` || "https://via.placeholder.com/150"}
            alt="Host Avatar"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">{hostInfo?.fullName}</p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {hostInfo?.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Số điện thoại:</strong> {hostInfo?.phoneNumber}
            </p>
          </div>
        </div>

        {/* Đánh giá */}
        <div className="mt-6">
          <p className="text-lg font-semibold text-gray-800 mb-2">Đánh giá</p>
          <div className="flex items-center space-x-2">
            <Rate disabled defaultValue={hostInfo?.averageRating} />
            <span className="text-sm text-gray-600">
              ({hostInfo?.averageRating}/5 từ {hostInfo?.totalReviews} đánh giá)
            </span>
          </div>
        </div>

        {/* Các thông tin bổ sung */}
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-800 flex items-center">
            <HomeOutlined className="mr-2" />
            <strong className='mr-1'>Tổng số airbnb: </strong> {hostInfo?.totalProperties}
          </p>
          <p className="text-sm text-gray-800 flex items-center">
            <StarOutlined className="mr-2" />
            <strong className='mr-1'>Phản hồi: </strong> {hostInfo?.responseRate}%
          </p>
        </div>

        {/* Nút liên hệ */}
        <div className="mt-6 flex justify-between">
          <Button
            className='bg-rose-500'
            type="primary"
            icon={<MailOutlined />}
            onClick={() => alert("Liên hệ qua email")}
          >
            Gửi email
          </Button>
          <Button
            type="default"
            icon={<PhoneOutlined />}
            onClick={() => alert("Gọi điện thoại")}
          >
            Gọi điện
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default HostInfo
