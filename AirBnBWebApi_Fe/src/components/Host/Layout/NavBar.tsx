import { Link, useLocation } from 'react-router-dom';
import { Dropdown, MenuProps } from 'antd';
import { DownOutlined, BarChartOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ROUTES from '@/constants/routes';

const NavBar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Lấy phần đường dẫn cuối cùng để xác định chính xác phần nào đang active
  const currentPath = location.pathname.split('/').pop();

  const isActive = (path: string) => {
    // Kiểm tra nếu path tương đương với đoạn cuối của location.pathname hoặc với path chính
    return currentPath === path || location.pathname === path;
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link to={ROUTES.HOST_REVENUE} className="flex items-center gap-2 hover:text-pink-500">
          <BarChartOutlined className="text-lg text-gray-500" />
          <span>Revenue Statistics</span>
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link to={ROUTES.HOST_ANALYSIS} className="flex items-center gap-2 hover:text-pink-500">
          <UserOutlined className="text-lg text-gray-500" />
          <span>User Analysis</span>
        </Link>
      ),
    },
  ];

  return (
    <nav className="hidden md:flex items-center gap-10">
      <Link
        to={ROUTES.HOST_HOME}
        className={`hover:underline ${isActive(ROUTES.HOST_HOME) ? 'text-white font-semibold' : 'text-gray-400'}`}
      >
        Today
      </Link>
      <Link
        to={ROUTES.HOST_LISTINGS}
        className={`hover:underline ${isActive(ROUTES.HOST_LISTINGS) ? 'text-white font-semibold' : 'text-gray-400'}`}
      >
        Listings
      </Link>
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
        open={open}
        onOpenChange={setOpen}
        overlayClassName="bg-white rounded-lg shadow-lg"
      >
        <div className={`flex items-center cursor-pointer hover:underline ${open ? 'text-pink-500' : 'text-gray-400'}`}>
          Menu <DownOutlined className="ml-1" />
        </div>
      </Dropdown>
    </nav>
  );
};

export default NavBar;
