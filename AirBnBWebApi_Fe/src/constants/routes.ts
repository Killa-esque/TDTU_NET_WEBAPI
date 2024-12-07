// src/constants/routes.ts
const ROUTES = {
  HOME: "/",
  ACCOUNT_SETTING: "/account-setting",
  USER_PROFILE: "personal-info",
  LOGIN_SECURITY: "login-security",
  RESERVATION: "reservation",

  ROOM_DETAIL: "/room-detail/:slug",
  SEARCH: "/search",
  BOOKING: "/booking/:roomId",
  BOOKING_HISTORY: "booking-history",
  FAVORITES: "favorites",
  SAVED: "saved",

  // Admin routes
  ADMIN_DASHBOARD: "/admin",
  ADMIN_LOCATION_MANAGEMENT: "/admin/location-management",
  ADMIN_USER_MANAGEMENT: "/admin/user-management",
  ADMIN_PROFILE: "/admin/profile",
  ADMIN_LOGIN: "/admin-login",


  // Host routes
  HOST_HOME: "/host",
  HOST_AIRBNB_MANAGEMENT: "/host/airbnb-management",
  HOST_BOOKING_REQUESTS: "/host/booking-requests",
  HOST_REVENUE: "/host/revenue",
  HOST_PROFILE: "/host/profile",
  HOST_PASSWORD: "/host/password",
  HOST_ANALYSIS: "/host/analysis",
  HOST_CREATE_NEW_LISTING: "/host/create-new-airbnb",
  HOST_MESSAGES: "/host/messages",
  HOST_LISTINGS: "/host/listings",
  HOST_LOGIN: "/host-login",
  HOST_ADD_ROOM: "/host/add-room",
  HOST_EDIT_ROOM: "/host/edit-room/:slug",

  FORGOT_PASSWORD: "/forgot-password",

  // Not Found
  NOT_FOUND: "*",
  UNAUTHORIZED: "/unauthorized",
};

export default ROUTES;


