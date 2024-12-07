import React from 'react';
import { User } from '@/types';

type UserTableProps = {
  users: User[];
};

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border-collapse">
        <thead className="bg-gray-200 text-gray-600">
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Avatar</th>
            <th className="py-2 px-4 border">Full Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Birthday</th>
            <th className="py-2 px-4 border">Phone</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">{user.id}</td>
              <td className="py-2 px-4 border">
                <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full" />
              </td>
              <td className="py-2 px-4 border">{user.fullName}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{user.birthday}</td>
              <td className="py-2 px-4 border">{user.phoneNumber}</td>
              <td className="py-2 px-4 border">{user.role}</td>
              <td className="py-2 px-4 border">
                <button className="text-blue-500 hover:text-blue-700">Edit</button>
                <button className="text-red-500 hover:text-red-700 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
