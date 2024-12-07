import { JwtPayload } from "@/types";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
