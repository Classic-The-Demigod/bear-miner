export interface User {
  id: string;
  walletAddress: string;
  balance: number;
  tokenBalance: number;
  role: "USER" | "ADMIN";
  name?: string;
  email?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionData {
  userId: string;
  walletAddress: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
}

export interface NonceResponse {
  nonce: string;
}

export interface ErrorResponse {
  error: string;
}
