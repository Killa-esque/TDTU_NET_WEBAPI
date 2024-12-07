import axiosClient from "../axiosClient";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const hostService = {
  getListings: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.HOST.AIRBNB_MANAGEMENT);
    return response.data;
  },

  createListing: async (listingData: any) => {
    const response = await axiosClient.post(API_ENDPOINTS.HOST.AIRBNB_MANAGEMENT, listingData);
    return response.data;
  },

  getBookingRequests: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.HOST.BOOKING_REQUESTS);
    return response.data;
  },

  getRevenue: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.HOST.REVENUE);
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await axiosClient.put(API_ENDPOINTS.HOST.PROFILE, profileData);
    return response.data;
  },
};

export default hostService;
