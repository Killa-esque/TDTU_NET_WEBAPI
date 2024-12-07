import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { amenityService, roomService } from "@/services/api";
import { useLoading } from "./useLoading";

const useAmenities = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  const getAmenities = () =>
    useQuery({
      queryKey: ["amenities"],
      queryFn: async () => {
        try {
          showLoading();
          const response = await amenityService.getAllAmenities();
          return response.data.payload;
        }
        catch (error) {
          console.error("Error while fetching amenities: ", error);
        }
        finally {
          hideLoading();
        }
      },
      staleTime: 1000 * 60 * 5, // 5 phút
      refetchOnWindowFocus: false,
    });



  return {
    getAmenities,
  };
};

export default useAmenities;
