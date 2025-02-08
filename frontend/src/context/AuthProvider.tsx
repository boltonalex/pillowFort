import { useState, useEffect, ReactNode } from "react";
import { AuthContext, AuthContextProps } from "./AuthContext"; // Import from new file

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

  // Fetch user data from API
  const fetchUserData = async (token: string, userId: string) => {
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
      // console.log(response.json())
      const userDataResponse = await response.json();
      setUserData(userDataResponse);
      localStorage.setItem("userData", JSON.stringify(userDataResponse));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchUserData(token, user);
    }
  }, [token, user]);

  // Authentication functions
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
    } catch (error: any) {
      console.error("Login Error:", error.message);
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
    } catch (error: any) {
      console.error("Signup Error:", error.message);
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
    } catch (error: any) {
      console.error("Google Sign-In Error:", error.message);
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
    } catch (error: any) {
      console.error("Logout Error:", error.message);
    }
  };

  console.log({ userData })

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}