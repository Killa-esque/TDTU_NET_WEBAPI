
export interface AuthContextProps {
  user: User | null,
  role: string | null,
  setUser: (user: User) => void,
  signOut: () => void
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  roles: string[];
  avatar: string | null;
  dateOfBirth: string;
  city: string | null;
  country: string | null;
  address: string | null;
  isEmailVerified?: boolean;
  gender: string;
  token?: Token;
}

export interface UserCreatePayload extends Omit<User, 'avatar' | 'token' | 'gender' | 'id'> {
  password: string;
  gender: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}
export interface PaginatedUser {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  items: User[];
}


export interface LoginPayload {
  email: string;
  password: string;
  role: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  role: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
  role: string;
}

export interface ForgotPasswordPayload {
  email: string;
}
export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface BookingHistoryPayload {
  propertyId: string;
  userId: string;
  reservationId: string;
  propertyImageUrls: string[];
  propertyName: string;
  guests: number;
  propertyPricePerNight: number;
  totalPrice: number;
  bookingDate: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
}

export interface TokenPayload {
  sub: string;           // User ID
  email: string;         // Email người dùng
  fullName: string;      // Tên đầy đủ
  role: string;          // Vai trò là một chuỗi, ví dụ: "User"
  jti: string;           // JWT ID
  exp: number;           // Thời gian hết hạn
  iss: string;           // Issuer
  aud: string;           // Audience
}


// Response

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  status: boolean;
  statusCode: number;
  message: string;
  payload: User;
  dateTime: string;
  error: string | null;
}

export interface RegisterResponse {
  status: boolean;
  statusCode: number;
  message: string;
  payload: User;
  dateTime: string;
  error: string | null;
}

export interface ForgotPasswordResponse {
  status: boolean;
  statusCode: number;
  message: string;
  payload: null;
  dateTime: string;
  error: string | null;
}

export interface ResetPasswordResponse {
  status: boolean;
  statusCode: number;
  message: string;
  payload: null;
  dateTime: string;
  error: string | null;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}


//
export interface IUseLogin {
  handleLogin: (payload: LoginPayload) => void;
  isLoading: boolean;
  error: Error | null;
}


export interface EmailVerificationPayload {
  verificationCode: string;
  email: string;
}
