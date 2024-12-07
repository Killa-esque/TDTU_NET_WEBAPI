import React from 'react';

const UserCreate = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create New User</h2>
      <form className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <input type="date" placeholder="Birthday" className="w-full p-2 border rounded" />
        <select className="w-full p-2 border rounded">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="text" placeholder="Phone Number" className="w-full p-2 border rounded" />
        <input type="text" placeholder="Role" className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Create</button>
      </form>
    </div>
  );
};

export default UserCreate;
