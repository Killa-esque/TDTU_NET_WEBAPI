import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from 'react-icons/rx';
import { SiBuildkite } from 'react-icons/si';
import { AiOutlineUser, AiOutlineUsergroupDelete, AiOutlineDollarCircle, AiOutlineQuestionCircle } from "react-icons/ai";
import { GoLocation } from "react-icons/go";
import logo from "@/assets/images/logo.png";
import { useEffect, useState } from "react";

type Props = {};

function SideNav({ }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    const currentPath = pathname.split("/")[2] || "dashboard"; // Lấy phần sau "/admin/"
    setActiveKey(currentPath);
  }, [pathname]);

  const menuItems = [
    {
      category: "General", items: [
        { key: "dashboard", icon: <RxDashboard />, label: "Dashboard", path: "/admin" },
        { key: "location-management", icon: <GoLocation />, label: "Locations", path: "/admin/location-management" },
      ],
    },
    {
      category: "User Management", items: [
        { key: "user-management", icon: <AiOutlineUsergroupDelete />, label: "Users", path: "/admin/user-management" },
        { key: "profile", icon: <AiOutlineUser />, label: "Profile", path: "/admin/profile" },
      ],
    },
  ];


  const handleNavigation = (path: string, key: string) => {
    setActiveKey(key);
    navigate(path);
  };

  const handleGoBack = () => {
    navigate(-1); // Quay về trang trước đó trong lịch sử
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg">
      {/* Header của Sidebar */}
      <div className="flex items-center space-x-2 bg-rose-500 text-white px-4 py-5">
        <img src={logo} alt="Logo" className="w-12 h-12 rounded-full shadow-md" />
        <div className="flex flex-col">
          <span className="text-xl font-bold">Admin Dashboard</span>
          <span className="text-sm opacity-80">Manage everything easily</span>
        </div>
      </div>

      {/* Nút "Go Back" */}
      <div className="px-4 py-3">
        <button
          className="w-full px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-all"
          onClick={handleGoBack}
        >
          Go Back
        </button>
      </div>

      {/* Nội dung của Sidebar */}
      <div className="mt-4">
        {menuItems.map((group) => (
          <div key={group.category} className="mb-4">
            <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {group.category}
            </div>
            {group.items.map((item) => (
              <div
                key={item.key}
                className={`my-1 flex items-center space-x-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${activeKey === item.key
                  ? "bg-rose-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-rose-500 hover:bg-opacity-20 hover:text-pinkCustom"
                  }`}
                onClick={() => handleNavigation(item.path, item.key)}
              >
                <button
                  className={`p-2 rounded-full transition-all duration-300 ${activeKey === item.key
                    ? "bg-white text-pinkCustom"
                    : "bg-rose-500 text-white hover:bg-white hover:text-pinkCustom"
                    }`}
                >
                  <span className="text-xl">{item.icon}</span>
                </button>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { SideNav };
