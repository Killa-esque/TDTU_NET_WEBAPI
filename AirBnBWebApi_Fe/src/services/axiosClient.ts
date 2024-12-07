// axiosClient.ts
import { JwtPayload, RefreshTokenPayload, RefreshTokenResponse } from "@/types";
import axios from "axios";
import { isTokenExpired } from "@/utils/jwt";
import { CONFIG } from "@/config/appConfig";
import { notify } from "@/services/notifications/notificationService";
import { navigate } from "@/services/navigation/navigationService";
import { storage } from "@/utils";
import storageKeys from "@/constants/storageKeys";
import { authService } from "./api";
import ROUTES from "@/constants/routes";

const axiosClient = axios.create({
  baseURL: CONFIG.API.BASE_URL,
  headers: CONFIG.API.HEADERS,
  timeout: CONFIG.API.TIMEOUT,
});

// Request interceptor
axiosClient.interceptors.request.use(
  async (config: any) => {
    // Check request is call
    const user = storage.get(storageKeys.USER_INFO);
    const accessToken = storage.get(storageKeys.ACCESS_TOKEN);

    if (user && accessToken) {

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    notify('Request error. Please try again later.', 'error'); // Sử dụng notify
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;
    const status = response?.status;

    // Nếu token hết hạn (401) hoặc token bị lỗi, thực hiện refresh token
    if (status === 401) {
      const refreshToken = storage.get(storageKeys.REFRESH_TOKEN); // Lấy refresh token từ storage
      const accessToken = storage.get(storageKeys.ACCESS_TOKEN);
      const role = storage.get(storageKeys.USER_ROLE);

      if (refreshToken) {
        // Gọi API refresh token
        try {
          const refreshResponse = await authService.refreshToken({ refreshToken, role }); // API refresh token
          if (refreshResponse && refreshResponse.data && refreshResponse.data.payload) {
            const { accessToken } = refreshResponse.data.payload; // Giả sử API trả về accessToken mới
            // Lưu access token mới vào localStorage
            storage.set(storageKeys.ACCESS_TOKEN, accessToken);

            // Sửa lại headers của request gốc với token mới
            config.headers.Authorization = `Bearer ${accessToken}`;

            // Retry request với token mới
            return axiosClient(config);
          } else {
            throw new Error('Invalid refresh response');
          }
        } catch (refreshError) {
          // Nếu không thể refresh token, yêu cầu user đăng nhập lại
          notify('Session expired, please log in again.', 'error');
          const role = storage.get(storageKeys.USER_ROLE);

          if (role === 'Host') {
            navigate(ROUTES.HOST_LOGIN);
          } else if (role === 'Admin') {
            navigate(ROUTES.ADMIN_LOGIN);
          } else {
            navigate(ROUTES.HOME);
          }
          storage.clear(); // Xóa hết dữ liệu trong localStorage
          return Promise.reject(refreshError);
        }
      } else {
        // Nếu không có refresh token, redirect đến login page
        notify('Session expired, please log in again.', 'error');
        // Check role để điều hướng đến trang tương ứng

        const role = storage.get(storageKeys.USER_ROLE);

        if (role === 'Host') {
          navigate(ROUTES.HOST_LOGIN);
        } else if (role === 'Admin') {
          navigate(ROUTES.ADMIN_LOGIN);
        } else {
          navigate(ROUTES.HOME);
        }

        storage.clear(); // Xóa hết dữ liệu trong localStorage
      }
    }

    return Promise.reject(error);
  }
);
export default axiosClient;
