import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthProvider"; // Assuming you have an Auth context

// Define types
interface Investment {
  id: string;
  userId: string;
  fundId: string;
  amount: number;
  createdAt: string;
}

interface Fund {
  id: string;
  name: string;
  description: string;
  currency: string;
}

interface InvestmentContextProps {
  funds: Fund[];
  investments: Investment[];
  refreshInvestments: () => void;
  refreshFunds: () => void;
}

const InvestmentContext = createContext<InvestmentContextProps | undefined>(undefined);

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const { userId, token } = useAuth();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  // Fetch Funds
  const refreshFunds = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/funds", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch funds");
      }

      const fundsData = await response.json();
      setFunds(fundsData.funds);
    } catch (error) {
      console.error("Error fetching funds from API:", error);
    }
  };

  // Fetch Investments for the logged-in user
  const refreshInvestments = useCallback(async () => {
    if (!userId || !token) return;

    try {
      const response = await fetch(`http://localhost:3000/api/investments/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure authenticated request
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch investments");
      }

      const investmentsData = await response.json();
      setInvestments(investmentsData.investments);
    } catch (error) {
      console.error("Error fetching investments from API:", error);
    }
  }, [userId]);

  useEffect(() => {
    refreshFunds();
  }, []);

  useEffect(() => {
    if (userId) {
      refreshInvestments();
    }
  }, [refreshInvestments, userId]);

  return (
    <InvestmentContext.Provider value={{ funds, investments, refreshInvestments, refreshFunds }}>
      {children}
    </InvestmentContext.Provider>
  );
}

// Custom hook to use the context
export function useInvestments() {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error("useInvestments must be used within an InvestmentProvider");
  }
  return context;
}