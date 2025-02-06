import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Define authentication context types
interface AuthContextType {
  userId: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem("userId"));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));
  const navigate = useNavigate();

  // Function to handle login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const { token, userId } = await response.json();
      setUserId(userId);
      setToken(token);

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Function to handle signup
  const signup = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Signup failed");

      const { token, userId } = await response.json();
      setUserId(userId);
      setToken(token);

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      navigate("/dashboard"); // Redirect after signup
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      setUserId(null);
      setToken(null);

      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}