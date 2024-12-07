import { useState } from 'react';
import { Table, Button, Space, Modal, Pagination, message, Tag, Input, Select } from 'antd';
import { User as UserType } from '@/types';
import { useUser } from '@/hooks';
import { ColumnsType } from 'antd/es/table';
import EditUserForm from '@/components/Admin/Form/EditUserForm';
import CreateUserForm from '@/components/Admin/Form/CreateUserForm';

const User = () => {
  // Component state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
  const [isCreateDrawerVisible, setIsCreateDrawerVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [searchFullName, setSearchFullName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  // User hooks
  const { getAllUsers, deleteUser } = useUser();

  const { data: paginatedUsers, isLoading } = getAllUsers(currentPage, pageSize);
  const { mutate: deleteUserById } = deleteUser();

  console.log(paginatedUsers);

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize); // Update the page size if needed
  };

  // Handle search fullName
  const handleSearchFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFullName(e.target.value);
  };

  // Handle search email
  const handleSearchEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value);
  };

  // Handle role filter
  const handleRoleChange = (value: string | null) => {
    setSelectedRole(value);
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: paginatedUsers?.totalCount,
    onChange: handlePageChange,
  };

  const filteredData = paginatedUsers?.items.filter((user) => {
    return (
      user.fullName.toLowerCase().includes(searchFullName.toLowerCase()) &&
      user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      (selectedRole ? user.roles.includes(selectedRole) : true) // Filter by role if selected
    );
  });


  // Render table columns
  const columns: ColumnsType<UserType> = [
    {
      title: 'Id',
      key: 'id',
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1, // Calculate row index based on page
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => {
        return roles.map((role: string) => (
          <Tag key={role} color="blue">
            {role}
          </Tag>
        ));
      },
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserType) => (
        <Space size="middle">
          <button
            type="submit"
            className="w-full py-3 bg-pinkCustom text-white font-semibold rounded-lg hover:bg-pink-700 transition p-3"
            onClick={() => handleEditUser(record.id)}
          >
            <i className='fa-regular fa-edit'></i>
          </button>
          <button
            type="submit"
            className="w-full py-3 bg-yellow-800 text-white font-semibold rounded-lg hover:bg-yellow-900 transition p-3"
            onClick={() => handleDeleteUser(record.id, record.fullName)}
          >
            <i className='fa-regular fa-trash'></i>
          </button>
        </Space>
      ),
    },
  ];

  // Handle edit user
  const handleEditUser = (userId: string) => {
    setIsEditDrawerVisible(true);
    setEditingUser(userId);
  };

  // Handle delete user
  const handleDeleteUser = (userId: string, username: string) => {
    Modal.confirm({
      title: 'Bạn có chắc là muốn xóa user này không?',
      onOk: () => {

        console.log(userId);
        deleteUserById(userId,
          {
            onSuccess: () => {
              message.success(`Delete ${username} successfully!`);
            },
            onError: () => {
              message.error("Failed to update. Please try again.");
            },
          })
      },
    });
  };

  return (
    <div>
      <button
        className="py-3 bg-pinkCustom text-white font-semibold rounded-lg hover:bg-pink-700 transition p-3 my-3"
        onClick={() => {
          setIsCreateDrawerVisible(true);
        }}
      >
        <i className='fa-regular fa-plus'></i>
        <span className='ml-2'>Tạo người dùng</span>
      </button>


      <div className='mb-5 flex justify-between'>
        <div>
          <Input
            placeholder="Search by Full Name"
            value={searchFullName}
            onChange={handleSearchFullName}
            style={{ width: 200, marginRight: 10 }}
          />
          <Input
            placeholder="Search by Email"
            value={searchEmail}
            onChange={handleSearchEmail}
            style={{ width: 200, marginRight: 10 }}
          />
        </div>
        <div>
          <Select
            placeholder="Filter by Role"
            style={{ width: 200 }}
            onChange={handleRoleChange}
            value={selectedRole}
            allowClear
          >
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Host">Host</Select.Option>
            <Select.Option value="User">User</Select.Option>
          </Select>
        </div>
      </div>

      <Table<UserType>
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={isLoading}
        pagination={paginationConfig}
      />

      {isEditDrawerVisible && (
        <EditUserForm
          visible={isEditDrawerVisible}
          onClose={() => setIsEditDrawerVisible(false)}
          userId={editingUser}
        />
      )}

      {isCreateDrawerVisible && (
        <CreateUserForm
          visible={isCreateDrawerVisible}
          onClose={() => setIsCreateDrawerVisible(false)}
        />
      )}
    </div>
  );
};

export default User;
