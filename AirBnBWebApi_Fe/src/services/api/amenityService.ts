
import { Amenity } from "@/types";
import axiosClient from "../axiosClient";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const amenityService = {
  getAllAmenities: async () => {
    return await axiosClient.get<HttpResponse<Amenity[]>>(API_ENDPOINTS.AMENITY);
  },
};

export default amenityService;
