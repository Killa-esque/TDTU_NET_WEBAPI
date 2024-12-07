export interface JwtPayload {
  sub: string;      // User ID (subject)
  email: string;    // Email của người dùng
  Role: 'User' | 'Host' | 'Admin';     // Vai trò của người dùng (User, Admin, etc.)
  jti: string;      // Token ID
  exp: number;      // Expiration time (UNIX timestamp)
  iss: string;      // Issuer (Server phát hành token)
  aud: string;      // Audience (Ứng dụng hoặc người nhận token)
}


