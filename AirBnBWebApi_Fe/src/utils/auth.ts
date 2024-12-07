// src/utils/auth.ts
import { TokenPayload } from "@/types";
import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = (accessToken: string): string | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(accessToken);
    return decoded.role || null;
  } catch (error) {
    console.error("Invalid access token:", error);
    return null;
  }
};
