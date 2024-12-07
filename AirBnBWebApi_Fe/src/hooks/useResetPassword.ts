import { useMutation } from "@tanstack/react-query";
import { useLoading } from "./useLoading";
import { authService } from "@/services/api";
import { ForgotPasswordPayload, ResetPasswordPayload } from "@/types";

const useResetPassword = () => {
  const { showLoading, hideLoading } = useLoading();

  /**
   * POST: Gửi yêu cầu reset mật khẩu
  */
  const forgotPassword = () => useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      try {
        showLoading();
        const response = await authService.forgotPassword(payload);
        return response.data;
      } finally {
        hideLoading();
      }
    },
  });

  /**
   * POST: Đặt lại mật khẩu
  */
  const resetPassword = () => useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      try {
        showLoading();
        const response = await authService.resetPassword(payload);
        return response.data;
      } finally {
        hideLoading();
      }
    },
  });

  return {
    forgotPassword,
    resetPassword,
  }
}


export default useResetPassword;
