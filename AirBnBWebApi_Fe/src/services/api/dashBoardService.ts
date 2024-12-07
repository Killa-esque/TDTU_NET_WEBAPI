import API_ENDPOINTS from "@/constants/apiEndpoints";
import axiosClient from "../axiosClient";
import { Dashboard, Reservation } from "@/types";

const dashBoardService = {
  getDashboard: async () => {
    return await axiosClient.get<HttpResponse<Dashboard>>(API_ENDPOINTS.DASHBOARD);
  },
  getRecentBookings: async () => {
    return await axiosClient.get<HttpResponse<Reservation[]>>(`${API_ENDPOINTS.DASHBOARD}/recent-booking`);
  }
};

export default dashBoardService;
