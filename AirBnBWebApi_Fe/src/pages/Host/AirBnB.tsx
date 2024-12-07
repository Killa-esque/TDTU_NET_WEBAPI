import React from 'react';
import { Table, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface RoomData {
  key: string;
  name: string;
  price: number;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
}

const AirBnB = () => {
  const navigate = useNavigate();

  const data: RoomData[] = [
    {
      key: '1',
      name: 'Cozy Studio in Downtown',
      price: 50,
      status: 'Active',
    },
    {
      key: '2',
      name: 'Luxury Apartment with Ocean View',
      price: 120,
      status: 'Inactive',
    },
    {
      key: '3',
      name: 'Family House near Park',
      price: 75,
      status: 'Under Maintenance',
    },
  ];

  const columns = [
    {
      title: 'Room Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a className="text-blue-600 hover:underline">{text}</a>,
    },
    {
      title: 'Price per Night',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Active' | 'Inactive' | 'Under Maintenance') => {
        let color = status === 'Active' ? 'green' : status === 'Inactive' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: RoomData) => (
        <div className="flex space-x-2">
          <Button type="link" onClick={() => navigate(`/host/airbnb-management/edit/${record.key}`)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => console.log('Delete room', record.key)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Airbnb Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/host/airbnb-management/new')}
        >
          Add New Room
        </Button>
      </div>

      {/* Table Section */}
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

      {/* Extra Info or Filter Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Filter by Status:</h3>
        <div className="flex space-x-2 mt-2">
          <Button>All</Button>
          <Button>Active</Button>
          <Button>Inactive</Button>
          <Button>Under Maintenance</Button>
        </div>
      </div>
    </div>
  );
};

export default AirBnB;
