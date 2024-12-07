
import { Location, LocationCreatePayload, LocationUpdatePayload } from "@/types";
import axiosClient from "../axiosClient";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const locationService = {
  getAllLocations: async () => {
    return await axiosClient.get<HttpResponse<Location[]>>(API_ENDPOINTS.LOCATION);
  },

  getLocationById: async (id: string) => {
    return await axiosClient.get<HttpResponse<Location>>(`${API_ENDPOINTS.LOCATION}/${id}`);
  },

  createLocation: async (payload: LocationCreatePayload) => {
    return await axiosClient.post<HttpResponse<string>>(API_ENDPOINTS.LOCATION, payload);
  },

  updateLocation: async (payload: LocationUpdatePayload) => {
    return await axiosClient.put<HttpResponse<string>>(`${API_ENDPOINTS.LOCATION}/${payload.id}`, payload);
  },

  deleteLocation: async (id: string) => {
    return await axiosClient.delete<HttpResponse<string>>(`${API_ENDPOINTS.LOCATION}/${id}`);
  },

  uploadLocationImage: async (payload: { locationId: string; image: FormData }) => {
    return await axiosClient.post<HttpResponse<string>>(`${API_ENDPOINTS.LOCATION}/${payload.locationId}/upload-image`, payload.image, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default locationService;
