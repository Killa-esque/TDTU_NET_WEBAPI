// src/components/UserMenu.tsx
import { useCallback, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { useModal } from "@/contexts/ModalAuthContext";
import MenuItem from "./MenuItem";
import Avatar from "@/components/User/Common/Avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { CONFIG } from "@/config/appConfig";
import ROUTES from "@/constants/routes";

function UserMenu() {
  const navigate = useNavigate();
  const { openAuthModal } = useModal();
  const { user, signOut } = useAuth(); // Get the current user from AuthContext
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!user) {
      navigate(ROUTES.HOST_LOGIN);
    }
  }, [user, navigate]);

  const handleLogout = useCallback(() => {
    signOut();
    setIsOpen(false);
  }, [signOut]);

  console.log(user);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {user ? (
          <div
            className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
          >
            Let's find your favourite place
          </div>
        ) : (
          <div
            className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
            onClick={onRent}
          >
            Airbnb your Home
          </div>
        )}
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <MenuOutlined />
          <div className="hidden md:block">
            {user ? (
              <Avatar src={`${CONFIG.SERVER_URL}${user?.avatar!}`} userName={user?.fullName} />
            ) : (
              <img
                className="rounded-full"
                height="30"
                width="30"
                alt="Avatar"
                src={`https://i.pravatar.cc/150?u=${1}`}
              />
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {user ? (
              <>
                <MenuItem onClick={() => navigate(ROUTES.ACCOUNT_SETTING)} label="Account Settings" />
                <hr />
                <MenuItem onClick={handleLogout} label="Logout" />
              </>
            ) : (
              <>
                <MenuItem onClick={() => openAuthModal(true)} label="Login" />
                <MenuItem onClick={() => openAuthModal(false)} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
