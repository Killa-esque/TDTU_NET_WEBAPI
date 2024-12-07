import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { storage } from '@/utils';
import storageKeys from '@/constants/storageKeys';
import { AuthContextProps, User } from '@/types';
import { setUser as setReduxUser } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import ROLE from '@/constants/role';
import { useNavigate } from 'react-router-dom';
import ROUTES from '@/constants/routes';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  role: null,
  setUser: () => { },
  signOut: () => { },
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load user and role from storage when component mounts
  useEffect(() => {
    console.log("Loading user and role from storage");
    setUser(storage.get(storageKeys.USER_INFO));
    setRole(storage.get(storageKeys.USER_ROLE));
  }, []);

  // Define a stable handleStorageChange function
  const handleStorageChange = useCallback(() => {
    console.log("Storage change detected");
    setUser(storage.get(storageKeys.USER_INFO));
    setRole(storage.get(storageKeys.USER_ROLE));
  }, []);

  // Register and clean up storage event listener
  useEffect(() => {
    console.log("Registering storage listener");
    window.addEventListener('storage', handleStorageChange);

    return () => {
      console.log("Removing storage listener");
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleStorageChange]);

  const signOut = useCallback(() => {
    storage.clear();

    if (role === ROLE.ADMIN) {
      navigate(ROUTES.ADMIN_LOGIN);
    }
    else if (role === ROLE.HOST) {
      navigate(ROUTES.HOST_LOGIN);
    }
    else {
      navigate(ROUTES.HOME);
    }

    setUser(null);
    setRole(null);
    dispatch(setReduxUser(null));
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user, role, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
