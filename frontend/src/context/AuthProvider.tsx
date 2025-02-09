import { useState, useEffect, ReactNode, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { UserData, AuthContextProps } from '../types';

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";

import { auth } from "../lib/firebaseAdmin";

interface AuthProviderProps {
  children: ReactNode;
}


export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<string | null>(localStorage.getItem("userId"));
  const [userData, setUserData] = useState<AuthContextProps["userData"]>(
    localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData") as string) : null
  );
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isKYCOpen, setIsKYCOpen] = useState<boolean>(false);

  const fetchUserData = useCallback(async (token: string, userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch userData");
      }
      if (response.status === 403) {
        logout()
      }
      const userDataResponse = await response.json();
      setUserData(userDataResponse);
      localStorage.setItem("userData", JSON.stringify(userDataResponse));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    if (token && user) {
      fetchUserData(token, user);
    }
  }, [fetchUserData, token, user]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedUser = userCredential.user;
      const userToken = await loggedUser.getIdToken();

      localStorage.setItem("userId", loggedUser.uid);
      localStorage.setItem("token", userToken);
      setUser(loggedUser.uid);
      setToken(userToken);

      fetchUserData(userToken, loggedUser.uid);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login Error:", error.message);
      } else {
        console.error("Login Error: An unknown error occurred", error);
      }
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      const userToken = await newUser.getIdToken();

      localStorage.setItem("userId", newUser.uid);
      localStorage.setItem("token", userToken);
      setUser(newUser.uid);
      setToken(userToken);

      fetchUserData(userToken, newUser.uid);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Signup Error:", error.message);
      } else {
        console.error("Signup Error: An unknown error occurred", error);
      }
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoginOpen(false);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!result.user) throw new Error("Google Sign-In failed.");

      const token = await result.user.getIdToken();
      const userId = result.user.uid;

      setToken(token);
      setUser(userId);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      fetchUserData(token, userId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Google Sign-In Error:", error.message);
      } else {
        console.error("Google Sign-In Error: An unknown error occurred", error);
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userData");
      setToken(null);
      setUser(null);
      setUserData(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Logout Error:", error.message);
      } else {
        console.error("Logout Error: An unknown error occurred", error);
      }
    }
  };

  const updateKYC = async (kycData: Partial<UserData>): Promise<void> => {
    if (!user || !token) return;

    try {
      const response = await fetch(`http://localhost:3000/api/kyc/${user}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(kycData),
      });

      if (!response.ok) {
        throw new Error("Failed to update KYC");
      }

      const updatedUserData = await response.json();
      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("KYC Update Error:", error.message);
      } else {
        console.error("KYC Update Error: An unknown error occurred", error);
      }
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoginOpen,
        isKYCOpen,
        userData,
        setToken,
        loginWithGoogle,
        login,
        signup,
        logout,
        setIsLoginOpen,
        setIsKYCOpen,
        updateKYC
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}