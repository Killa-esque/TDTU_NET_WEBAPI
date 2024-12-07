import React from 'react';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, GlobalOutlined, DollarOutlined } from '@ant-design/icons';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter className="bg-gray-50 border-t py-3 hidden md:block">
      <div className="container mx-auto px-8 flex justify-between items-center text-gray-500 max-lg:text-xs">
        <div>
          <span>© 2024 Airbnb, Inc.</span>
          <span className="px-3 hover:underline cursor-pointer">Quyền riêng tư</span>
          <span className="px-3 hover:underline cursor-pointer">Điều khoản</span>
          <span className="px-3 hover:underline cursor-pointer">Sơ đồ trang web</span>
        </div>
        <div className="text-gray-700">
          <span><GlobalOutlined /></span>
          <span className="hover:underline cursor-pointer px-2 font-medium">Tiếng Việt (VN)</span>
          <span className="hover:underline cursor-pointer px-2 font-medium"><DollarOutlined /></span>
          <span className="px-1 cursor-pointer"><FacebookOutlined /></span>
          <span className="px-1 cursor-pointer"><InstagramOutlined /></span>
          <span className="px-1 cursor-pointer"><TwitterOutlined /></span>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
