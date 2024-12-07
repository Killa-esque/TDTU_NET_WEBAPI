// src/templates/AdminTemplate.tsx
import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Drawer } from "antd";
import { Footer, Header, SideNav } from "@/components/Admin/Layout";
import ROUTES from "@/constants/routes";
import { useAuth } from "@/hooks";
import { storage } from "@/utils";
import storageKeys from "@/constants/storageKeys";

function AdminTemplate() {
  const { user } = useAuth();

  console.log(user);
  if (!storage.get(storageKeys.USER_INFO) && storage.get(storageKeys.USER_ROLE) !== "Admin") {
    return <Navigate to={ROUTES.ADMIN_LOGIN} />
  }

  const [visible, setVisible] = useState(false);
  const openDrawer = () => setVisible(!visible);


  let { pathname } = useLocation();
  return (
    <div className="flex h-screen p-5">
      {/* Sidebar - Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        width={250}
        className="block lg:hidden"
      >
        <div className="shadow-lg rounded-lg overflow-hidden">
          <SideNav />
        </div>
      </Drawer>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex flex-shrink-0 shadow-lg rounded-lg">
        <SideNav />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full bg-white shadow-lg rounded-lg ml-5">
        {/* Header */}
        <div className={`w-full sticky top-0 z-50 shadow-md rounded-t-lg`}>
          <Header onPress={openDrawer} name={pathname} subName={pathname} />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export { AdminTemplate };
