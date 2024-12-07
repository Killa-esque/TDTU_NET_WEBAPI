import React, { useEffect } from 'react';
import { matchPath, Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import ROUTES from '@/constants/routes';
import { useModal } from '@/contexts/ModalAuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, role } = useAuth();
  const { openAuthModal } = useModal();
  const location = useLocation();

  const publicRoutesForGuests = [ROUTES.HOME, ROUTES.SEARCH, ROUTES.ROOM_DETAIL];

  const isPublicRoute = publicRoutesForGuests.some((route) =>
    matchPath(route, location.pathname)
  );

  useEffect(() => {
    if (!user && !role && !isPublicRoute) {
      console.log("Opening login modal for protected route:", location.pathname);
      openAuthModal();
    }
  }, [user, role, location.pathname, openAuthModal, isPublicRoute]);

  if (!user && !role) {
    if (isPublicRoute) {
      console.log("Public route");
      return <>{children}</>;
    }
    console.log("Not authenticated");

    return <Navigate to={ROUTES.HOME} />;
  }

  if (user && role && !allowedRoles.includes(role)) {
    console.log("Unauthorized");
    return <Navigate to={ROUTES.UNAUTHORIZED} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};



export default ProtectedRoute;
