import { createContext } from "react";

// Define UserData type (optional, to match your current implementation)
interface UserData {
  id: string;
  email: string;
  kycVerified?: boolean;
  [key: string]: any;
}

// Define AuthContextProps with proper types
export interface AuthContextProps {
  user: string | null;
  token: string | null;
  isLoginOpen: boolean;
  isKYCOpen: boolean;
  userData: UserData | null;
  setToken: (token: string | null) => void;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setIsLoginOpen: (isOpen: boolean) => void;
  setIsKYCOpen: (isOpen: boolean) => void;
  updateKYC: (formData: any) => Promise<void>;
}

// Create and export AuthContext
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);