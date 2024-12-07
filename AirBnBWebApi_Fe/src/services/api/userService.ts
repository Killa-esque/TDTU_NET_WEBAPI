import API_ENDPOINTS from "@/constants/apiEndpoints";
import axiosClient from "../axiosClient";
import { BookingHistoryPayload, EmailVerificationPayload, PaginatedUser, Role, User, UserCreatePayload } from "@/types";

const userService = {
  getProfile: async () => {
    return await axiosClient.get<HttpResponse<User>>(`${API_ENDPOINTS.USER}/me`);
  },

  updateUserProfile: async (userId: string, data: Partial<User>) => {
    return await axiosClient.patch<HttpResponse<string>>(`${API_ENDPOINTS.USER}/${userId}`, data);
  },

  uploadAvatar: async (avatar: FormData) => {
    return await axiosClient.post<HttpResponse<User>>(`${API_ENDPOINTS.USER}/upload-avatar`, avatar, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  updatePassword: async (data: { currentPassword: string; newPassword: string, confirmNewPassword: string }) => {
    return await axiosClient.post<HttpResponse<null>>(
      `${API_ENDPOINTS.USER}/update-password`,
      data
    );
  },

  getChangePasswordTime: async () => {
    return await axiosClient.get<HttpResponse<string>>(
      `${API_ENDPOINTS.USER}/time-changed-password`
    );
  },

  getBookingHistory: async () => {
    return await axiosClient.get<HttpResponse<BookingHistoryPayload[]>>(`${API_ENDPOINTS.USER}/booking-history`);
  },

  getAllUsers: async (currentPage?: number, pageSize?: number) => {
    if (currentPage && pageSize) {
      return await axiosClient.get<HttpResponse<PaginatedUser>>(`${API_ENDPOINTS.USER}?pageNumber=${currentPage}&pageSize=${pageSize}`);
    }
    return await axiosClient.get<HttpResponse<PaginatedUser>>(`${API_ENDPOINTS.USER}`);
  },

  createUser: async (data: UserCreatePayload) => {
    return await axiosClient.post<HttpResponse<string>>(API_ENDPOINTS.USER, data);
  },

  deleteUser: async (id: string) => {
    return await axiosClient.delete<HttpResponse<string>>(`${API_ENDPOINTS.USER}/delete-user/${id}`);
  },

  getUserById: async (id: string) => {
    return await axiosClient.get<HttpResponse<User>>(`${API_ENDPOINTS.USER}/${id}`);
  },

  updateUser: async (id: string, data: Partial<User>) => {
    return await axiosClient.patch<HttpResponse<string>>(`${API_ENDPOINTS.USER}/${id}`, data);
  },

  getRoles: async () => {
    return await axiosClient.get<HttpResponse<Role[]>>(`${API_ENDPOINTS.USER}/roles`);
  },

  sendEmailConfirmation: async (email: string) => {
    return await axiosClient.post<HttpResponse<string>>(`${API_ENDPOINTS.USER}/send-verification-email`, { email });
  },

  confirmEmail: async (payload: EmailVerificationPayload) => {
    return await axiosClient.post<HttpResponse<string>>(`${API_ENDPOINTS.USER}/verify-email`, payload);
  }



};

export default userService;
