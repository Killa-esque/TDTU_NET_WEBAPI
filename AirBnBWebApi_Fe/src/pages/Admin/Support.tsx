// src/pages/Support.tsx
import React from 'react';
import { AiOutlineMail, AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineUser } from 'react-icons/ai';

const Support: React.FC = () => {
  const supportRequests = [
    {
      id: 1,
      user: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Issue with booking',
      status: 'Open',
      date: '2024-10-05',
      description: 'I am unable to complete the payment for my booking.'
    },
    {
      id: 2,
      user: 'Jane Smith',
      email: 'jane.smith@example.com',
      subject: 'Refund request',
      status: 'In Progress',
      date: '2024-10-04',
      description: 'I would like to request a refund for my last booking.'
    },
    {
      id: 3,
      user: 'Michael Johnson',
      email: 'michael.j@example.com',
      subject: 'Account recovery',
      status: 'Resolved',
      date: '2024-10-03',
      description: 'I forgot my password and need to recover my account.'
    },
    {
      id: 4,
      user: 'Alice Brown',
      email: 'alice.brown@example.com',
      subject: 'Issue with room availability',
      status: 'Open',
      date: '2024-10-02',
      description: 'The room I want to book shows unavailable even though it should be available.'
    },
  ];

  const handleStatusChange = (id: number, status: string) => {
    console.log('Change status of request ID:', id, 'to', status);
    // Logic to update status of the request
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-4">Support Management</h1>

      {/* Support Requests Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Support Requests</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-left">
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {supportRequests.map((request) => (
              <tr key={request.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 flex items-center space-x-2">
                  <AiOutlineUser className="text-blue-500" />
                  <span>{request.user}</span>
                </td>
                <td className="px-4 py-2">{request.email}</td>
                <td className="px-4 py-2 truncate">{request.subject}</td>
                <td className="px-4 py-2">{request.date}</td>
                <td className={`px-4 py-2 ${request.status === 'Open' ? 'text-yellow-500' : request.status === 'In Progress' ? 'text-blue-500' : 'text-green-500'}`}>
                  {request.status}
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(request.id, 'In Progress')}
                      className="text-blue-500 hover:text-blue-700 transition duration-200"
                    >
                      <AiOutlineClockCircle size={20} />
                    </button>
                    <button
                      onClick={() => handleStatusChange(request.id, 'Resolved')}
                      className="text-green-500 hover:text-green-700 transition duration-200"
                    >
                      <AiOutlineCheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => console.log('View details for request ID:', request.id)}
                      className="text-gray-500 hover:text-gray-700 transition duration-200"
                    >
                      <AiOutlineMail size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-600">Rows per page: 5</span>
        <div className="flex items-center space-x-1">
          <button className="px-2 py-1 text-gray-600 hover:text-gray-800">&lt;</button>
          <span className="text-gray-600">1–5 of 23</span>
          <button className="px-2 py-1 text-gray-600 hover:text-gray-800">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Support;
