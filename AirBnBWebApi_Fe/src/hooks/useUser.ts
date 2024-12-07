import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/api";
import { useLoading } from "./useLoading";
import { EmailVerificationPayload, User, UserCreatePayload } from "@/types";

const useUser = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  /**
   * GET: Lấy danh sách đặt phòng
   */
  const getMe = () =>
    useQuery({
      queryKey: ["me"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await userService.getProfile();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * PATCH: Cập nhật thông tin người dùng
  */
  const updateUser = () =>
    useMutation({
      mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
        const response = await userService.updateUserProfile(userId, data);
        return response.data.payload;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["me"]
        });
        queryClient.invalidateQueries({
          queryKey: ["users", variables.userId]
        });
        queryClient.invalidateQueries({
          queryKey: ["users"]
        });
      }
    });

  /**
   * POST: Upload ảnh đại diện
  */
  const uploadAvatar = () =>
    useMutation({
      mutationFn: async (formData: FormData) => {
        const response = await userService.uploadAvatar(formData);
        return response.data.payload;
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["me"]
        });
      }
    });

  /**
   * POST: Cập nhật mật khẩu
  */
  const updatePassword = () =>
    useMutation({
      mutationFn: async (data: { currentPassword: string; newPassword: string, confirmNewPassword: string }) => {
        return await userService.updatePassword(data);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["change-password-time"]
        });
      }
    });

  /**
   * GET: Thời gian đã thay đổi mật khẩu
  */
  const getChangePasswordTime = () =>
    useQuery({
      queryKey: ["change-password-time"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await userService.getChangePasswordTime();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * GET: Lấy danh sách phòng đã đặt của user
  */
  const getBookingHistory = () =>
    useQuery({
      queryKey: ["booking-history"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await userService.getBookingHistory();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * GET: Lấy danh sách tất cả user có trong hệ thống
  */
  const getAllUsers = (currentPage: number, pageSize: number) =>
    useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await userService.getAllUsers(currentPage, pageSize);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * GET: Lấy thông tin user theo id
  */
  const getUserById = (userId: string) =>
    useQuery({
      queryKey: ["users", userId],
      queryFn: async () => {
        showLoading();
        try {
          const response = await userService.getUserById(userId);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!userId
    });

  /**
   * DELETE: Xóa user
  */
  const deleteUser = () =>
    useMutation({
      mutationFn: async (userId: string) => {
        showLoading();
        try {
          const response = await userService.deleteUser(userId);
          return response.data;
        } finally {
          hideLoading();
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"]
        });
      }
    });

  /**
   * POST: Tạo mới user
  */
  const createUser = () =>
    useMutation({
      mutationFn: async (data: UserCreatePayload) => {
        showLoading();
        try {
          const response = await userService.createUser(data);
          return response.data;
        } finally {
          hideLoading();
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"]
        });
      }
    });

  /**
   * GET: Lấy danh sách role
  */
  const getRoles = () =>
    useQuery({
      queryKey: ["roles"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await userService.getRoles();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * POST: Gửi yêu cầu xác nhận email
  */
  const sendEmailConfirmation = () =>
    useMutation({
      mutationFn: async (email: string) => {
        showLoading();
        try {
          const response = await userService.sendEmailConfirmation(email);
          return response.data;
        } finally {
          hideLoading();
        }
      }
    });

  /**
   * POST: Xác nhận email
  */
  const confirmEmail = () =>
    useMutation({
      mutationFn: async (payload: EmailVerificationPayload) => {
        showLoading();
        try {
          const response = await userService.confirmEmail(payload);
          return response.data;
        } finally {
          hideLoading();
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["me"]
        });
      }
    });


  return {
    getMe,
    updateUser,
    uploadAvatar,
    updatePassword,
    getChangePasswordTime,
    getBookingHistory,
    getAllUsers,
    getUserById,
    deleteUser,
    createUser,
    getRoles,
    sendEmailConfirmation,
    confirmEmail
  };
};

export default useUser;
