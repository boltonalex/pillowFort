import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
import {
  // getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  // getAdditionalUserInfo
} from "firebase/auth";

import { auth } from '../lib/firebaseAdmin';

// import axios from 'axios';

interface AuthContextProps {
  user: any;
  token: string;
  isLoginOpen: boolean;
  isKYCOpen: boolean;
  userData: any;
  setToken: () => void;
  loginWithGoogle: () => void;
  login: () => void;
  signup: () => void;
  logout: () => void;
  setIsLoginOpen: () => void;
  setIsKYCOpen: () => void;
  updateKYC: (formData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
// const InvestmentContext = createContext<InvestmentContextProps | undefined>(undefined);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(localStorage.getItem("userId") || null);
  const [userData, setUserData] = useState<any>(localStorage.getItem("userData") || null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isKYCOpen, setIsKYCOpen] = useState(false);

  const fetchUserData = async (token, user) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/${user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch userData");
      }
      const userDataResponse = await response.json();
      setUserData(userDataResponse);
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
  }

  // Fetch user data from backend if token exists
  useEffect(() => {
    if (token && user) {

      fetchUserData(token, user);
    }
  }, [token, user]);

  const login = async (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // const fullUser = getAdditionalUserInfo(user.uid);

        localStorage.setItem("userId", user.uid);
        localStorage.setItem("token", user.accessToken);
        setUser(user.uid);
        setToken(user.accessToken);
      })
      .catch((error) => {
        console.error(error.code, error.message);
      });

  };

  const signup = async (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        localStorage.setItem("userId", user.uid);
        localStorage.setItem("token", user.accessToken);
        setUser(user.uid);
        setToken(user.accessToken);
      })
      .catch((error) => {
        console.error(error.code, error.message);
      });
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (!result.user) throw new Error("Google Sign-In failed.");
      const token = await result.user.getIdToken();
      const userId = result.user.uid;


      // const { displayName, email } = result.user.providerData[0];
      // // POST to BE to upload name and email to DB for user to assist in KYC form
      // const updateUserData = async () => {
      //   try {
      //     const response = await axios(`http://localhost:3000/api/auth/${userId}`, {
      //       method: "PATCH",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${token}`,
      //       },
      //       data: JSON.stringify({ displayName, email }),
      //     });
      //     if (!response.ok) {
      //       throw new Error("Failed to fetch userData");
      //     }
      //     const userDataResponse = await response.json();
      //     setUserData(userDataResponse);
      //   } catch (error) {
      //     console.error("Error updating user:", error);
      //   }
      // }
      // updateUserData();

      setToken(token);
      setUser(userId);
      // setUserData(providerData);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      // localStorage.setItem("userData", JSON.stringify(providerData));

    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };


  // const investInFund = async (fundId: string, amount: number) => {

  const updateKYC = async (formData: any) => {
    const response = await fetch("http://localhost:3000/api/kyc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData), // Sends data to backend
    });

    if (!response.ok) {
      throw new Error("Failed to submit KYC. Please try again.");
    }
    setIsKYCOpen(false);
    fetchUserData(token, user)
  }

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userData");
      setToken(null);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
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
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}