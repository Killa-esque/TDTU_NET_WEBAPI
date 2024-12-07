import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoomAvailabilityPayload } from "@/types/room";
import { reservationService, roomService } from "@/services/api";
import { useLoading } from "./useLoading";
import { Reservation } from "@/types/reservation";

const useReservation = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  /**
   * GET: Lấy danh sách đặt phòng
   */
  const getReservations = () =>
    useQuery({
      queryKey: ["reservations"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await reservationService.getAllReservations();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * GET: Lấy phòng đã đặt bằng id
   */
  const getReservationById = (reservationId: string) =>
    useQuery({
      queryKey: ["reservation", reservationId],
      queryFn: async () => {
        showLoading();
        try {
          const response = await roomService.getRoomById(reservationId);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * POST: Tạo mới đặt phòng
  */
  const createReservation = useMutation({
    mutationFn: async (payload: Reservation) => {
      const response = await reservationService.createReservation(payload);
      return response.data; // Trả về dữ liệu API trả về
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservations"]
      });
    }
  });

  /**
   * POST: Kiểm tra tình trạng phòng
  */
  const checkRoomAvailability = () =>
    useMutation({
      mutationFn: async (payload: RoomAvailabilityPayload) => {
        showLoading();
        try {
          const response = await reservationService.checkRoomAvailability(payload);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      }
    });

  /**
   * PUT: Cập nhật đặt phòng
  */
  const updateReservation = () =>
    useMutation({
      mutationFn: async ({ id, payload }: { id: string; payload: Reservation }) => {
        showLoading();
        try {
          const response = await reservationService.updateReservation(id, payload);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["reservations"]
        });
      }
    });

  /**
   * DELETE: Xóa đặt phòng
  */
  const deleteReservation = () =>
    useMutation({
      mutationFn: async (id: string) => {
        showLoading();
        try {
          const response = await reservationService.deleteReservation(id);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["reservations"]
        });
      }
    });

  /**
   * POST: Cancel đặt phòng
  */
  const cancelReservation = useMutation({
    mutationFn: async (id: string) => {
      showLoading();
      try {
        const response = await reservationService.cancelReservation(id);
        return response.data;
      } finally {
        hideLoading();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking-history"]
      });
    }
  });

  /**
   * GET: Lấy danh sách các phòng sắp check-out
  */
  const getCheckOutRooms = () =>
    useQuery({
      queryKey: ["current-check-out-rooms"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await reservationService.getCheckOutRooms();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * GET: Lấy danh sách các phòng đang diễn ra
  */
  const getCurrentReservations = () =>
    useQuery({
      queryKey: ["current-reservations"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await reservationService.getCurrentReservations();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * GET: Lấy danh sách các phòng sắp tới
  */
  const getUpcomingReservations = () =>
    useQuery({
      queryKey: ["upcoming-reservations"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await reservationService.getUpcomingReservations();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * GET: Lấy danh sách các phòng đợi xác nhận
  */
  const getPendingReservations = () =>
    useQuery({
      queryKey: ["pending-reservations"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await reservationService.getPendingReservations();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * POST: Xác nhận đặt phòng
  */
  const confirmReservation = useMutation({
    mutationFn: async (reservationId: string) => {
      showLoading();
      try {
        const response = await reservationService.confirmReservation(reservationId);
        return response.data;
      } finally {
        hideLoading();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending-reservations"]
      });
      queryClient.invalidateQueries({
        queryKey: ["upcoming-reservations"]
      });
      queryClient.invalidateQueries({
        queryKey: ["current-reservations"]
      });
      queryClient.invalidateQueries({
        queryKey: ["current-check-out-rooms"]
      });
    }
  });

  /**
   * GET: Lấy danh sách revenue
  */
  const getRevenueData = () =>
    useQuery({
      queryKey: ["revenue"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await reservationService.getRevenueData();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });



  return {
    getReservations,
    getReservationById,
    createReservation,
    checkRoomAvailability,
    updateReservation,
    deleteReservation,
    cancelReservation,
    getCheckOutRooms,
    getCurrentReservations,
    getUpcomingReservations,
    getPendingReservations,
    confirmReservation,
    getRevenueData
  };
};

export default useReservation;
