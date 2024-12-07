// src/constants/routeTitles.ts
import ROUTES from "./routes";

const routeTitles: { [key: string]: string } = {
  // User routes
  [ROUTES.HOME]: "Home",
  [ROUTES.LOGIN]: "Login",
  [ROUTES.REGISTER]: "Register",
  [ROUTES.USER_PROFILE]: "User Profile",
  [ROUTES.ROOM_DETAIL]: "Room Details",
  [ROUTES.SEARCH]: "Search",
  [ROUTES.BOOKING]: "Booking",
  [ROUTES.BOOKING_HISTORY]: "Booking History",
  [ROUTES.FAVORITES]: "Favorites",

  // Admin routes
  [ROUTES.ADMIN_DASHBOARD]: "Admin Dashboard",
  [ROUTES.ADMIN_LOCATION_MANAGEMENT]: "Location Management",
  [ROUTES.ADMIN_ROOM_MANAGEMENT]: "Room Management",
  [ROUTES.ADMIN_USER_MANAGEMENT]: "User Management",
  [ROUTES.ADMIN_REVENUE]: "Admin Revenue",
  [ROUTES.ADMIN_PROFILE]: "Admin Profile",
  [ROUTES.ADMIN_SUPPORT_MANAGEMENT]: "Support Management",
  [ROUTES.ADMIN_LOGIN]: "Admin Login",

  // Host routes
  [ROUTES.HOME]: "Host Dashboard",
  [ROUTES.HOST_AIRBNB_MANAGEMENT]: "Airbnb Management",
  [ROUTES.HOST_BOOKING_REQUESTS]: "Booking Requests",
  [ROUTES.HOST_REVENUE]: "Host Revenue",
  [ROUTES.HOST_PROFILE]: "Host Profile",

  // Not Found route
  [ROUTES.NOT_FOUND]: "Page Not Found",
};

export default routeTitles;
