// src/pages/RoomManagementPage.tsx
import React from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';

const Room: React.FC = () => {
  const rooms = [
    {
      id: 1,
      name: 'Deluxe Room',
      location: 'New York, USA',
      price: '$120/night',
      status: 'Available',
    },
    {
      id: 2,
      name: 'Standard Room',
      location: 'Los Angeles, USA',
      price: '$90/night',
      status: 'Booked',
    },
    {
      id: 3,
      name: 'Suite Room',
      location: 'Chicago, USA',
      price: '$250/night',
      status: 'Available',
    },
  ];

  const handleEdit = (id: number) => {
    console.log('Edit room with ID:', id);
    // Logic chỉnh sửa phòng
  };

  const handleDelete = (id: number) => {
    console.log('Delete room with ID:', id);
    // Logic xóa phòng
  };

  const handleAddRoom = () => {
    console.log('Add new room');
    // Logic thêm phòng mới
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Room Management</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddRoom}
          className="flex items-center bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
        >
          <AiOutlinePlus className="mr-2" /> Add New Room
        </button>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-left">
              <th className="px-4 py-2">Room ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{room.id}</td>
                <td className="px-4 py-2">{room.name}</td>
                <td className="px-4 py-2">{room.location}</td>
                <td className="px-4 py-2">{room.price}</td>
                <td className={`px-4 py-2 ${room.status === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                  {room.status}
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(room.id)}
                      className="text-blue-500 hover:text-blue-700 transition duration-200"
                    >
                      <AiOutlineEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="text-red-500 hover:text-red-700 transition duration-200"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Room;
