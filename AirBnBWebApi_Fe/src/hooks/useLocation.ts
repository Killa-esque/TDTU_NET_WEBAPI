import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { locationService } from "@/services/api";
import { useLoading } from "./useLoading";
import { Location, LocationCreatePayload, LocationUpdatePayload } from "@/types";

const useLocation = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  /**
   * GET: Lấy danh sách vị trí
   */
  const getLocations = () =>
    useQuery({
      queryKey: ["locations"],
      queryFn: async () => {
        showLoading();
        try {
          const response = await locationService.getAllLocations();
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    });

  /**
   * GET: Lấy vị tri bằng id
  */
  const getLocationById = (locationId: string) =>
    useQuery({
      queryKey: ["locations", locationId],
      queryFn: async () => {
        showLoading();
        try {
          const response = await locationService.getLocationById(locationId);
          return response.data.payload;
        } finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!locationId,
    });

  /**
   * POST: Tạo mới vị trí
  */
  const createLocation = () => useMutation({
    mutationFn: async (payload: LocationCreatePayload) => {
      const response = await locationService.createLocation(payload);
      return response.data; // Trả về dữ liệu API trả về
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"]
      });
    },
  });

  /**
   * PUT: Cập nhật vị trí
  */
  const updateLocation = () => useMutation({
    mutationFn: async (payload: LocationUpdatePayload) => {
      const response = await locationService.updateLocation(payload);
      return response.data; // Trả về dữ liệu API trả về
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      }),
        queryClient.invalidateQueries({
          queryKey: ["locations", variables.id]
        });
    },
  });

  /**
   * DELETE: Xóa vị trí
  */
  const deleteLocation = () => useMutation({
    mutationFn: async (locationId: string) => {
      const response = await locationService.deleteLocation(locationId);
      return response.data; // Trả về dữ liệu API trả về
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"]
      });
    },
  });

  /**
   * POST: Upload hình ảnh cho vị trí
  */
  const uploadLocationImage = () => useMutation({
    mutationFn: async (payload: { locationId: string, image: FormData }) => {
      const response = await locationService.uploadLocationImage(payload);
      return response.data; // Trả về dữ liệu API trả về
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"]
      });
    },
  });

  return {
    getLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
    uploadLocationImage,
  };
};

export default useLocation;
