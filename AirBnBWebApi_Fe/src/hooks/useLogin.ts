import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNotification } from '@/contexts';
import { useModal } from '@/contexts/ModalAuthContext';
import { authService } from '@/services/api';
import { setUser as setReduxUser } from '@/redux/slices/authSlice';
import { storage } from '@/utils';
import { getRoleFromToken } from '@/utils/auth';
import storageKeys from '@/constants/storageKeys';
import ROUTES from '@/constants/routes';
import useAuth from './useAuth';
import { IUseLogin, LoginPayload, User } from '@/types';

type Role = 'User' | 'Host' | 'Admin';
type RoleRedirectMap = Record<Role, string>;

const useLogin = (): IUseLogin => {
  const dispatch = useDispatch();
  const { handleNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const { closeAuthModal } = useModal();

  const loginMutation = useMutation({
    mutationKey: ['userLogin'],
    mutationFn: async (payload: LoginPayload) => {
      const response = await authService.login(payload);
      return response.data;
    },
    onSuccess: (response: HttpResponse<User>) => {
      const data = response.payload;
      storage.set(storageKeys.USER_INFO, {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.roles,
        avatar: data.avatar,
        token: data.token ? {
          accessToken: data.token.accessToken,
          refreshToken: data.token.refreshToken,
        } : {
          accessToken: '',
          refreshToken: '',
        },
        expiresIn: Date.now() + 3600000, // set expiration time
      });

      if (data.token) {
        storage.set(storageKeys.ACCESS_TOKEN, data.token.accessToken);
        storage.set(storageKeys.REFRESH_TOKEN, data.token.refreshToken);
      }

      setUser(data);
      dispatch(setReduxUser(response.payload));
      closeAuthModal();

      const roleRedirectMap: RoleRedirectMap = {
        User: ROUTES.HOME,
        Host: ROUTES.HOST_HOME,
        Admin: ROUTES.ADMIN_DASHBOARD,
      };

      const role = data.token ? getRoleFromToken(data.token.accessToken) as Role : 'User';

      storage.set(storageKeys.USER_ROLE, role);

      console.log(roleRedirectMap[role])

      const redirectPath = roleRedirectMap[role];

      // Get from sessionStorage
      const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
      if (redirectAfterLogin) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectAfterLogin);
        handleNotification('Đăng nhập thành công!', 'success');
        return;
      }

      navigate(redirectPath);
      handleNotification('Đăng nhập thành công!', 'success');
    },
    onError: () => {
      handleNotification('Đăng nhập thất bại. Vui lòng thử lại.', 'error');
    },
  });

  // Mutation function
  const handleLogin = (payload: LoginPayload) => loginMutation.mutate(payload);

  return {
    handleLogin,
    isLoading: loginMutation.status === 'pending',
    error: loginMutation.error,
  };
};

export default useLogin;
