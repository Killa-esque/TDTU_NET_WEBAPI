import { getRoleFromToken } from "@/utils/auth";

const useAuthorization = (requiredRole: string) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return false;

  const role = getRoleFromToken(accessToken);
  return role === requiredRole;
};

export default useAuthorization;
