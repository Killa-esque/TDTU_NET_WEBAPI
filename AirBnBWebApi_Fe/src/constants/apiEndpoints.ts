const API_ENDPOINTS = {
  // User Endpoints
  USER: "/User",

  // Host Endpoints
  HOST: {
    DASHBOARD: `/host/dashboard`,
    AIRBNB_MANAGEMENT: `/host/airbnb`,
    BOOKING_REQUESTS: `/host/booking-requests`,
    REVENUE: `/host/revenue`,
    PROFILE: `/host/profile`,
  },

  // Admin Endpoints
  ADMIN: {
    DASHBOARD: `/admin/dashboard`,
    LOCATION_MANAGEMENT: `/admin/location`,
    ROOM_MANAGEMENT: `/admin/room`,
    USER_MANAGEMENT: `/admin/users`,
    REVENUE: `/admin/revenue`,
    SUPPORT_MANAGEMENT: `/admin/support`,
  },

  // Auth Endpoints
  AUTH: {
    LOGIN: `/auth/login`,
    LOGOUT: `/auth/logout`,
    REFRESH_TOKEN: `/auth/refresh-token`,
    REGISTER: `/auth/register`,
    FORGOT_PASSWORD: `/auth/forgot-password`,
    RESET_PASSWORD: `/auth/reset-password`,
  },

  // Room Endpoints
  ROOMS: "/Property",
  RESERVATION: "/Reservation",
  LOCATION: "/Location",
  AMENITY: "/Amenity",
  REVIEW: "/Review",
  DASHBOARD: "/DashBoard",
  // ROOMS: {
  //   GET_ALL: "/Property",              // Lấy tất cả các phòng
  //   GET_BY_ID: "/Property",            // Lấy thông tin chi tiết phòng theo ID (thêm {id} ở cuối)
  //   SEARCH: "/Property/search",        // Tìm kiếm phòng
  //   GET_REVIEWS: "/Property",          // Lấy danh sách review (thêm {id}/reviews ở cuối)
  //   ADD_REVIEW: "/Property",           // Thêm review mới (thêm {id}/reviews ở cuối)
  //   GET_STATUS: "/Property",           // Lấy trạng thái phòng (thêm {id}/status ở cuối)
  //   GET_AMENITIES: "/Property",        // Lấy danh sách tiện ích (thêm {id}/amenities ở cuối)
  //   ADD_IMAGES: "/Property",           // Thêm hình ảnh (thêm {id}/images ở cuối)
  //   UPDATE: "/Property",               // Cập nhật thông tin phòng (thêm {id} ở cuối)
  //   DELETE: "/Property",               // Xóa phòng (thêm {id} ở cuối)
  //   HOST_INFO: "Property/:propertyId/host",             // Lấy thông tin host (thêm {hostId} ở cuối)
  // },
};

export default API_ENDPOINTS;
