import React, { useEffect, useState } from 'react';
import { Button, Tag, Spin, Alert, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth, useRoom } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import ROUTES from '@/constants/routes';
import { PropertyStatusEnum, Room } from '@/types/room';
import { CONFIG } from '@/config/appConfig';

const Listings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.HOST_LOGIN);
    }
  }, [user, navigate]);

  const { getRoomsByHostId, deleteRoom } = useRoom();
  const { data: rooms, isLoading, error } = getRoomsByHostId(user?.id || '');

  // Loading state for delete action
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal state for delete confirmation
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const getStatusTag = (status: PropertyStatusEnum) => {
    switch (status) {
      case PropertyStatusEnum.Available:
        return <Tag color="green">Available</Tag>;
      case PropertyStatusEnum.Booked:
        return <Tag color="orange">Booked</Tag>;
      case PropertyStatusEnum.Unavailable:
        return <Tag color="red">Unavailable</Tag>;
      default:
        return <Tag color="gray">Unknown</Tag>;
    }
  };

  const handleEditClick = (room: Room) => {
    if (room.slug) {
      navigate(`${ROUTES.HOST_EDIT_ROOM.replace(":slug", room.slug)}`, { state: { room } });
    } else {
      console.error('Room slug is undefined');
    }
  };


  const handleDeleteClick = (room: Room) => {
    // Khi nhấn vào Delete, mở modal xác nhận
    setRoomToDelete(room);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (roomToDelete) {
      setIsDeleting(true);  // Đặt trạng thái loading khi bắt đầu xóa
      try {
        // Thực hiện xóa phòng
        if (roomToDelete.id) {
          await deleteRoom.mutateAsync(roomToDelete.id);
        } else {
          console.error('Room ID is undefined');
        }
        setDeleteModalVisible(false);
      } catch (error) {
        console.error('Failed to delete room:', error);
      } finally {
        setIsDeleting(false);  // Đặt lại trạng thái loading
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const renderListings = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center mt-8">
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="mt-8">
          <Alert message="Lỗi khi tải danh sách phòng" type="error" showIcon />
        </div>
      );
    }

    if (!rooms || rooms.length === 0) {
      return (
        <div className="text-center text-gray-500 mt-8">
          <img
            src="https://via.placeholder.com/300?text=No+Data"
            alt="No Data"
            className="mx-auto mb-4"
          />
          <p className="text-lg">Bạn chưa có danh sách phòng nào. Hãy thêm một phòng mới!</p>
        </div>
      );
    }

    return (
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rooms.map((room: Room) => {
          return (
            <div key={room.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={`${CONFIG.SERVER_URL}${room.propertyImageUrls && room.propertyImageUrls[0]}`}
                alt={room.propertyName}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{room.propertyName}</h2>
                <div
                  className="text-sm text-gray-500"
                  dangerouslySetInnerHTML={{ __html: room.propertyDescription }}
                />
                <div className="text-sm text-gray-500">
                  {room.guests} guests • {room.bedrooms} bedrooms • {room.bathrooms} bathrooms
                </div>
                <div className="text-lg font-bold mt-2">${room.propertyPricePerNight} / night</div>
                <div className="mt-2">{getStatusTag(room.propertyStatus ?? PropertyStatusEnum.Unknown)}</div>
                <div className="mt-2">
                  {room && room.isPublished === true ? (
                    <Tag color="green">Published</Tag>
                  ) : (
                    <Tag color="red">Unpublished</Tag>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4">
                  <Button
                    icon={<EditOutlined />}
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditClick(room)} // Xử lý khi nhấn Edit
                  >
                    Edit
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteClick(room)} // Xử lý khi nhấn Delete
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </section>
    );
  };

  return (
    <div className="p-6 md:p-10 lg:p-12">
      {/* Header */}
      <section className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Listings</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-black text-white"
          onClick={() => navigate(ROUTES.HOST_ADD_ROOM, { replace: true })}
        >
          Add New Listing
        </Button>
      </section>

      {/* Listings */}
      {renderListings()}

      {/* Modal Confirm Delete */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Yes"
        cancelText="No"
        footer={
          isDeleting ? (
            <Spin size="small" />
          ) : (
            <>
              <Button onClick={handleCancelDelete}>No</Button>
              <Button type="primary" onClick={handleConfirmDelete}>Yes</Button>
            </>
          )
        }
      >
        <p>Are you sure you want to delete this room?</p>
      </Modal>

      {/* Pagination */}
      {rooms && rooms.length > 0 && (
        <section className="mt-8 flex justify-center">
          <Button className="mx-1" type="default">1</Button>
          <Button className="mx-1" type="default">2</Button>
          <Button className="mx-1" type="default">3</Button>
        </section>
      )}
    </div>
  );
};

export default Listings;
