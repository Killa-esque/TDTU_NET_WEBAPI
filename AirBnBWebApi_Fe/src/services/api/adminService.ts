import axiosClient from "../axiosClient";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const adminService = {
  getDashboardData: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.ADMIN.USER_MANAGEMENT);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await axiosClient.delete(`${API_ENDPOINTS.ADMIN.USER_MANAGEMENT}/${userId}`);
    return response.data;
  },

  manageLocation: async (locationData: any) => {
    const response = await axiosClient.post(API_ENDPOINTS.ADMIN.LOCATION_MANAGEMENT, locationData);
    return response.data;
  },

  manageRoom: async (roomData: any) => {
    const response = await axiosClient.post(API_ENDPOINTS.ADMIN.ROOM_MANAGEMENT, roomData);
    return response.data;
  },

  getRevenueReport: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.ADMIN.REVENUE);
    return response.data;
  },

  manageSupport: async (supportData: any) => {
    const response = await axiosClient.post(API_ENDPOINTS.ADMIN.SUPPORT_MANAGEMENT, supportData);
    return response.data;
  },
};

export default adminService;
