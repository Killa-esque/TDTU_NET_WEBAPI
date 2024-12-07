
import axiosClient from "../axiosClient";
import API_ENDPOINTS from "@/constants/apiEndpoints";
import { RoomAvailabilityPayload, RoomAvailabilityResponse } from "@/types";
import { Reservation, Revenue } from "@/types/reservation";

const reservationService = {
  // Kiểm tra tình trạng còn phòng trống hay không
  checkRoomAvailability: async (payload: RoomAvailabilityPayload) => {
    console.log(payload);
    return await axiosClient.post<HttpResponse<RoomAvailabilityResponse>>(`${API_ENDPOINTS.RESERVATION}/check-availability`, payload);
  },

  // Get all reservations
  getAllReservations: async () => {
    return await axiosClient.get<HttpResponse<Reservation[]>>(API_ENDPOINTS.RESERVATION);
  },

  // Create new reservation
  createReservation: async (payload: Reservation) => {
    return await axiosClient.post<HttpResponse<string>>(API_ENDPOINTS.RESERVATION, payload);
  },

  // Update reservation record
  updateReservation: async (id: string, payload: Reservation) => {
    return await axiosClient.put<HttpResponse<string>>(`${API_ENDPOINTS.RESERVATION}/${id}`, payload);
  },

  // Delete reservation record
  deleteReservation: async (id: string) => {
    return await axiosClient.delete<HttpResponse<string>>(`${API_ENDPOINTS.RESERVATION}/${id}`);
  },

  // Get reservation by ID
  getReservationById: async (id: string) => {
    return await axiosClient.get<HttpResponse<Reservation>>(`${API_ENDPOINTS.RESERVATION}/${id}`);
  },

  // Cancel reservation
  cancelReservation: async (reservationId: string) => {
    return await axiosClient.post<HttpResponse<null>>(`${API_ENDPOINTS.RESERVATION}/cancel-reservation`, { reservationId });
  },

  // Lấy danh sách các phòng đặt sắp check-out
  getCheckOutRooms: async () => {
    return await axiosClient.get<HttpResponse<Reservation[]>>(`${API_ENDPOINTS.RESERVATION}/check-out`);
  },
  // Lấy danh sách phòng đặt đang diễn ra trong khoảng thời gian check-in và check-out
  getCurrentReservations: async () => {
    return await axiosClient.get<HttpResponse<Reservation[]>>(`${API_ENDPOINTS.RESERVATION}/current`);
  },
  // Lấy danh sách Các đặt phòng tương lai, chưa đến thời gian check-in.
  getUpcomingReservations: async () => {
    return await axiosClient.get<HttpResponse<Reservation[]>>(`${API_ENDPOINTS.RESERVATION}/upcoming`);
  },
  // Lấy danh sách phòng đặt đang đợi host xác nhận
  getPendingReservations: async () => {
    return await axiosClient.get<HttpResponse<Reservation[]>>(`${API_ENDPOINTS.RESERVATION}/pending`);
  },
  // Host xác nhận đặt phòng
  confirmReservation: async (reservationId: string) => {
    return await axiosClient.post<HttpResponse<null>>(`${API_ENDPOINTS.RESERVATION}/confirm-reservation`, { reservationId });
  },
  getRevenueData: async () => {
    return await axiosClient.get<HttpResponse<Revenue>>(`${API_ENDPOINTS.RESERVATION}/revenue`);
  }
};

export default reservationService;
