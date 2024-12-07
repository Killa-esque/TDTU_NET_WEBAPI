import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Review, ReviewCreatePayload, Room, RoomAvailabilityPayload, SearchPayload } from "@/types/room";
import { reservationService, roomService } from "@/services/api";
import { useLoading } from "./useLoading";

const useRoom = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  /**
   * GET: Lấy danh sách tất cả các phòng
   */
  const getRooms = () =>
    useQuery({
      queryKey: ["rooms"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await roomService.getAllRooms();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * GET: Lấy chi tiết một phòng
   */
  const getRoomById = (roomId: string) =>
    useQuery({
      queryKey: ["rooms", roomId],
      queryFn: async () => {
        showLoading();
        try {
          const response = await roomService.getRoomById(roomId);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!roomId,
    });


  /**
   * POST: Tìm kiếm phòng
  */
  const searchRooms = () =>
    useMutation({
      mutationFn: async (searchParams: SearchPayload) => {
        const response = await roomService.searchRooms(searchParams);
        return response.data.payload;
      }
    });


  /**
   * POST: Thêm một phòng mới
   */
  const createRoom = useMutation({
    mutationFn: async (newRoom: Room) => {
      const response = await roomService.addNewRoom(newRoom);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"]
      });
    },
  });


  /**
   * PUT: Cập nhật thông tin phòng
   */
  const updateRoom = () => useMutation({
    mutationFn: async (data: { slug: string; updateData: Partial<Room> }) => {
      const response = await roomService.updatePatchRoom(data.slug, data.updateData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", "slug", variables.slug]
      });
    },
  });


  /**
   * DELETE: Xóa một phòng
   */
  const deleteRoom = useMutation({
    mutationFn: (roomId: string) => roomService.deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"]
      });
    },
  });


  /**
   * GET: Lấy các tiện ích của phòng
   */
  const getRoomAmenities = (roomId: string) =>
    useQuery({
      queryKey: ["rooms", roomId, "amenities"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await roomService.getRoomAmenities(roomId);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      enabled: !!roomId,
    });

  /**
   * GET: Lấy các tiện ích của phòng
   */
  const getRoomAmenitiesBySlug = (slug: string) =>
    useQuery({
      queryKey: ["rooms", slug, "amenities"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await roomService.getRoomAmenitiesBySlug(slug);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      enabled: !!slug,
    });

  const updateRoomAmenities = useMutation({
    mutationFn: async (data: { slug: string; amenityIds: string[] }) => {
      const response = await roomService.updateRoomAmenities(data.slug, data.amenityIds);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", variables.slug, "amenities"],
      });
    },
  });

  /**
   * POST: Thêm review vào phòng
   */
  const addRoomReview = () =>
    useMutation({
      mutationFn: (review: ReviewCreatePayload) =>
        roomService.addRoomReview(review),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["room", variables.propertyId, "reviews"]
        });
      },
    });

  /**
   * GET: Lấy danh sách review của một phòng
   */
  const getRoomReviews = (roomId: string) =>
    useQuery({
      queryKey: ["rooms", roomId, "reviews"],
      queryFn: async () => {
        const response = await roomService.getRoomReviews(roomId);
        return response.data.payload;
      },
      enabled: !!roomId,
    });

  /**
   * GET: Lấy thông tin chủ nhà
   */
  const getHostInfo = (hostId: string) =>
    useQuery({
      queryKey: ["hostInfo", hostId],
      queryFn: async () => {
        const response = await roomService.getHostInfo(hostId);
        return response.data.payload;
      },
      enabled: !!hostId,
    });



  /**
   * POST: Kiểm tra trạng thái phòng
   */
  const checkRoomAvailability = useMutation({
    mutationFn: async (data: RoomAvailabilityPayload) => {
      return await reservationService.checkRoomAvailability(data);
    },
    onSuccess: (data) => {
      // Optional: Handle success logic
      console.log("Availability check success:", data);
    },
    onError: (error) => {
      // Optional: Handle error logic
      console.error("Error checking availability:", error);
    },
  });

  /**
   * GET: Lấy danh sách phòng theo host
  */
  const getRoomsByHostId = (hostId: string) =>
    useQuery({
      queryKey: ["rooms", "host", hostId],
      queryFn: async () => {
        showLoading();
        try {
          const response = await roomService.getHostRooms(hostId);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      }
    });

  /**
   * GET: Room Type
  */
  const getRoomTypes = () =>
    useQuery({
      queryKey: ["rooms", "types"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await roomService.getRoomTypes();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      }
    });

  /**
   * POST: Thêm hình ảnh cho phòng
  */
  const addRoomImages = useMutation({
    mutationFn: async (data: { id: string; images: FormData }) => {

      // kiểm tra dữ liệu có đúng không:
      console.log(data.id);
      // console.log(data.images.get('file'));
      const response = await roomService.addRoomImages(data.id, data.images);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", variables.id],
      });
    },
  });

  /**
   * POST: Thêm tiện ích cho phòng
  */
  const addAmenitiesToProperty = useMutation({
    mutationFn: async (data: { id: string, payload: string[] }) => {
      const response = await roomService.addRoomAmenities(data.id, data.payload);
      return response.data;
    }
  });

  /**
   * GET: Lấy thông tin phòng theo Slug
  */
  const getRoomBySlug = (slug: string) =>
    useQuery({
      queryKey: ["rooms", "slug", slug],
      queryFn: async () => {
        showLoading();
        try {
          const response = await roomService.getRoomBySlug(slug);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      }
    });

  /**
   * POST: Xóa hình ảnh của phòng
   * */
  const deleteRoomImage = useMutation({
    mutationFn: async (data: { roomId: string; imageUrl: string }) => {
      console.log(data);
      const response = await roomService.deleteRoomImage(data.roomId, data.imageUrl);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", variables.roomId],
      });
    },
  });

  /**
   * POST: Publish phòng
  */
  const publishRoom = useMutation({
    mutationFn: async (slug: string) => {
      const response = await roomService.publishRoom(slug);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", "slug", variables]
      });
    },
  });

  /**
   * GET: Lấy dánh sách review của phòng theo host Id
  */
  const getAllReviewsByHostId = () =>
    useQuery({
      queryKey: ["rooms", "reviews", "host"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await roomService.getRoomReviewsByHostId();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      }
    });

  /**
   * GET: Lấy dữ liệu Analytics reviews
  */
  const getAnalyticsReviews = () =>
    useQuery({
      queryKey: ["rooms", "analytics", "reviews"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await roomService.getAnalyticsReviews();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      }
    });

  return {
    getRooms,
    getRoomById,
    searchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomAmenities,
    getHostInfo,
    addRoomReview,
    getRoomReviews,
    checkRoomAvailability,
    getRoomsByHostId,
    getRoomTypes,
    addRoomImages,
    addAmenitiesToProperty,
    getRoomBySlug,
    deleteRoomImage,
    getRoomAmenitiesBySlug,
    updateRoomAmenities,
    publishRoom,
    getAnalyticsReviews,
    getAllReviewsByHostId
  };
};

export default useRoom;
