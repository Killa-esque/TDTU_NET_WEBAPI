import ROLE from '@/constants/role';
import ROUTES from '@/constants/routes';
import storageKeys from '@/constants/storageKeys';
import { storage } from '@/utils';
import { Navigate, Outlet } from 'react-router-dom';

type Props = {}

const AccountSettingTemplate = (props: Props) => {

  if (!storage.get(storageKeys.USER_INFO) && storage.get(storageKeys.USER_ROLE) !== ROLE.USER) {
    return <Navigate to={ROUTES.HOME} />
  }

  return (
    <>
      <div className='container mx-auto'>
        <Outlet />
      </div>
    </>
  )
}

export { AccountSettingTemplate };
