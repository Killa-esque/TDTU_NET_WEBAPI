import CardSetting from '@/components/User/Common/CardSetting';
import ROUTES from '@/constants/routes';
import { useModal } from '@/contexts/ModalAuthContext';
import { useAuth } from '@/hooks';
import { useEffect } from 'react';
import { FaUser, FaLock, FaBookmark, FaHeart, FaClipboardList } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {}

const AccountSetting = ({ }: Props) => {

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { openAuthModal } = useModal();


  useEffect(() => {
    if (!user) {
      openAuthModal();
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
    }
  }, [user, location.pathname, openAuthModal]);

  const settings = [
    {
      icon: <FaUser />,
      title: "Personal Information",
      description: "Provide personal information and how we can contact you",
      route: ROUTES.USER_PROFILE,
    },
    {
      icon: <FaLock />,
      title: "Login & Security",
      description: "Update your password and secure your account",
      route: ROUTES.LOGIN_SECURITY,
    },
    {
      icon: <FaClipboardList />,
      title: "Bookings",
      description: "Review your bookings, payments, and vouchers",
      route: ROUTES.BOOKING_HISTORY,
    },
    {
      icon: <FaHeart />,
      title: "Favourites",
      description: "View and manage your favourite listings",
      route: ROUTES.FAVORITES,
    },
    {
      icon: <FaBookmark />,
      title: "Saved",
      description: "Check out your saved items and plans",
      route: ROUTES.SAVED,
    },
  ];

  const handleNavigate = (route: string) => {
    if (user) {
      navigate(route);
    }
    else {
      navigate(ROUTES.HOME);
    }
  }

  return (
    <div className='h-vh-70'>
      <div className='heading mb-6 flex flex-wrap flex-col items-center justify-center'>
        <h2 className="text-4xl font-semibold text-gray-800">Account Settings</h2>
        {
          user ? (
            <>
              <h4 className='text-xl text-gray-800'>
                <span>Hi, {user ? user.fullName : ""}, </span>
                <span> {user ? user.email : ""}</span>
              </h4>
            </>
          ) : (
            <h4 className='text-xl text-gray-800'>
              <span>Hi, Guest</span>
            </h4>
          )
        }
      </div>

      <div className='content flex flex-wrap justify-center gap-6'>
        {settings.map((setting, index) => (
          <CardSetting
            key={index}
            icon={setting.icon}
            title={setting.title}
            description={setting.description}
            className="min-h-[200px] h-full w-[45%] lg:w-[30%]"
            onClick={() => handleNavigate(`${location.pathname}/${setting.route}`)} // Điều hướng tới route tương ứng khi click
          />
        ))}
      </div>
    </div>
  );
}

export default AccountSetting;
