import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoading } from "./useLoading";
import dashBoardService from "@/services/api/dashBoardService";

const useDashboard = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  /**
   * GET: Lấy các thông số thống kê
   */
  const getDashboard = () =>
    useQuery({
      queryKey: ["dashboard"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await dashBoardService.getDashboard();
          return response.data;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  const getRecentBookings = () =>
    useQuery({
      queryKey: ["recentBookings"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await dashBoardService.getRecentBookings();
          return response.data;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });


  return {
    getDashboard,
    getRecentBookings
  };
};

export default useDashboard;
