import axiosClient from "../axiosClient";
import API_ENDPOINTS from "@/constants/apiEndpoints";
import { Amenity, HostInfo, Review, ReviewAnalytics, ReviewCreatePayload, Room, RoomType, SearchPayload } from "@/types";

const roomService = {
  // Lấy danh sách tất cả phòng
  getAllRooms: async () => {
    return await axiosClient.get<HttpResponse<Room[]>>(API_ENDPOINTS.ROOMS);
  },

  // Lấy chi tiết một phòng theo id
  getRoomById: async (id: string) => {
    return await axiosClient.get<HttpResponse<Room>>(`${API_ENDPOINTS.ROOMS}/${id}`);
  },

  // Tìm kiếm phòng
  searchRooms: async (searchParams: SearchPayload) => {
    return await axiosClient.post<HttpResponse<Room[]>>(`${API_ENDPOINTS.ROOMS}/search`, searchParams);
  },

  // Lấy danh sách review của một phòng
  getRoomReviews: async (id: string) => {
    return await axiosClient.get<HttpResponse<Review[]>>(`${API_ENDPOINTS.ROOMS}/${id}/reviews`);
  },

  // Thêm một review mới vào phòng
  addRoomReview: async (reviewPayload: ReviewCreatePayload) => {
    return await axiosClient.post<HttpResponse<string>>(`${API_ENDPOINTS.ROOMS}/reviews`, reviewPayload);
  },

  // Lấy danh sách tiện ích của phòng
  getRoomAmenities: async (id: string) => {
    return await axiosClient.get<HttpResponse<Amenity[]>>(`${API_ENDPOINTS.ROOMS}/${id}/amenities`);
  },

  // Thêm một phòng mới
  addNewRoom: async (newRoomPayload: Room) => {
    return await axiosClient.post<HttpResponse<string>>(API_ENDPOINTS.ROOMS, newRoomPayload);
  },

  // Thêm hình ảnh cho phòng
  addRoomImages: async (id: string, imagesPayload: FormData) => {
    return await axiosClient.post<HttpResponse<string[]>>(`${API_ENDPOINTS.ROOMS}/${id}/images`, imagesPayload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updatePatchRoom: async (slug: string, data: Partial<Room>) => {
    return await axiosClient.patch<HttpResponse<string>>(`${API_ENDPOINTS.ROOMS}/${slug}`, data);
  },

  // Xóa một phòng
  deleteRoom: async (id: string) => {
    return await axiosClient.delete(`${API_ENDPOINTS.ROOMS}/${id}`);
  },

  // Lấy thông tin host
  getHostInfo: async (propertyId: string) => {
    return await axiosClient.get<HttpResponse<HostInfo>>(`${API_ENDPOINTS.ROOMS}/${propertyId}/host`);
  },

  // Lấy danh sách phòng của host
  getHostRooms: async (hostId: string) => {
    return await axiosClient.get<HttpResponse<Room[]>>(`${API_ENDPOINTS.ROOMS}/host/${hostId}`);
  },

  // Lấy danh sách các loại phòng
  getRoomTypes: async () => {
    return await axiosClient.get<HttpResponse<RoomType[]>>(`${API_ENDPOINTS.ROOMS}/types`);
  },

  // Thêm tiện ích cho phòng
  addRoomAmenities: async (id: string, amenities: string[]) => {
    return await axiosClient.post(`${API_ENDPOINTS.ROOMS}/${id}/amenities`, amenities);
  },

  // Lấy phòng bới slug
  getRoomBySlug: async (slug: string) => {
    return await axiosClient.get<HttpResponse<Room>>(`${API_ENDPOINTS.ROOMS}/${slug}/slug`);
  },

  // Xóa hình ảnh của phòng
  deleteRoomImage: async (id: string, imageUrl: string) => {
    return await axiosClient.post(`${API_ENDPOINTS.ROOMS}/${id}/images/delete`, { imageUrl });
  },

  getRoomAmenitiesBySlug: async (slug: string) => {
    return await axiosClient.get<HttpResponse<Amenity[]>>(`${API_ENDPOINTS.ROOMS}/${slug}/amenities`);
  },

  // Cập nhật tiện ích cho phòng
  updateRoomAmenities: async (slug: string, amenities: string[]) => {
    return await axiosClient.put<HttpResponse<string>>(`${API_ENDPOINTS.ROOMS}/${slug}/amenities`, amenities);
  },

  publishRoom: async (slug: string) => {
    return await axiosClient.patch<HttpResponse<string>>(`${API_ENDPOINTS.ROOMS}/publish/${slug}`);
  },

  getRoomReviewsByHostId: async () => {
    return await axiosClient.get<HttpResponse<Review[]>>(`${API_ENDPOINTS.REVIEW}/host`);
  },

  getAnalyticsReviews: async () => {
    return await axiosClient.get<HttpResponse<ReviewAnalytics[]>>(`${API_ENDPOINTS.REVIEW}/host/analytics`);
  }




};

export default roomService;
