import { Image } from 'antd'
import airbnb_logo from "@/assets/images/airbnb_logo.png";
import { useNavigate } from 'react-router-dom';
import ROUTES from '@/constants/routes';


type Props = {}

const Logo = (props: Props) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => { navigate(ROUTES.ADMIN_DASHBOARD) }}>
      <Image
        alt='logo'
        className='block max-w-[75px] sm:max-w-[100px] md:max-w-[125px] lg:max-w-[150px] xl:max-w-[175px] h-auto object-contain cursor-pointer'
        src={airbnb_logo}
        preview={false}
      />
    </div>


  )
}

export default Logo
