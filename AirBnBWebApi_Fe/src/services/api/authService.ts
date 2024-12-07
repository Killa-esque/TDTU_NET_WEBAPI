import API_ENDPOINTS from "@/constants/apiEndpoints";
import axiosClient from "../axiosClient";
import { storage } from "@/utils";
import { ForgotPasswordPayload, LoginPayload, RefreshTokenPayload, RefreshTokenResponse, RegisterPayload, ResetPasswordPayload, User } from "@/types";
import storageKeys from "@/constants/storageKeys";

const authService = {
  register: async (payload: RegisterPayload) => {
    return await axiosClient.post<HttpResponse<User>>(API_ENDPOINTS.AUTH.REGISTER, payload);
  },

  login: async (payload: LoginPayload) => {
    return await axiosClient.post<HttpResponse<User>>(API_ENDPOINTS.AUTH.LOGIN, payload);

  },

  logout: async () => {
    storage.remove(storageKeys.USER_INFO);
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    return await axiosClient.post<HttpResponse<null>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    return await axiosClient.post<HttpResponse<null>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  },

  refreshToken: async (payload: RefreshTokenPayload) => {
    const user = storage.get(storageKeys.USER_INFO);
    if (!user) {
      return null;
    }

    return await axiosClient.post<HttpResponse<RefreshTokenResponse>>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, payload);
  },
};

export default authService;
