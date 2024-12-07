import { useState, useCallback } from 'react';
import { Badge, Dropdown, Space } from 'antd';
import { DownOutlined, BellOutlined } from '@ant-design/icons';
import Avatar from '@/components/User/Common/Avatar';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import ROUTES from '@/constants/routes';
import { useAuth } from '@/hooks';

type SafeUser = {
  name?: string;
  image?: string;
  email?: string;
};

type Props = {
  currentUser?: SafeUser | null;
};

const UserMenu: React.FC<Props> = ({ currentUser }) => {
  const navigate = useNavigate();

  const { signOut } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((value) => !value);
  }, []);

  const onProfile = () => {
    navigate(ROUTES.HOST_PROFILE);
    setIsDropdownOpen(false); // Đóng dropdown sau khi chuyển hướng
  };

  const onPassword = () => {
    navigate(ROUTES.HOST_PASSWORD);
    setIsDropdownOpen(false); // Đóng dropdown sau khi chuyển hướng
  };

  const onLogout = () => {
    // Xử lý logout ở đây
    setIsDropdownOpen(false);

    // Đăng xuất khỏi hệ thống
    signOut();
  };

  // Cấu hình các item của menu
  const items: MenuProps['items'] = [
    {
      label: 'Profile',
      key: 'profile',
      onClick: onProfile,
    },
    {
      label: 'Change password',
      key: 'password',
      onClick: onPassword,
    },
    {
      label: 'Logout',
      key: 'logout',
      onClick: onLogout,
    },
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Notification Icon with Badge */}
      <Badge count={5} offset={[-2, 5]}>
        <BellOutlined className="text-white text-lg cursor-pointer" />
      </Badge>

      {/* User Avatar and Dropdown */}
      <Dropdown
        menu={{ items }}  // Cách mới sử dụng item cho Dropdown
        trigger={['click']}
        placement="bottomRight"
        arrow
        open={isDropdownOpen}
        onOpenChange={toggleDropdown}
      >
        <div onClick={(e) => e.preventDefault()}>
          <Space>
            {currentUser ? (
              <Avatar src={currentUser.image} userName={currentUser.name} />
            ) : (
              <img
                className="rounded-full"
                height="30"
                width="30"
                alt="Avatar"
                src="https://i.pravatar.cc/150?img=3"
              />
            )}
            <DownOutlined className="text-white" />
          </Space>
        </div>
      </Dropdown>
    </div>
  );
};

export default UserMenu;
