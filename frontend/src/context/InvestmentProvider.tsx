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
  minimum: number;
}

interface InvestmentContextProps {
  funds: Fund[];
  investments: Investment[];
  refreshInvestments: () => void;
  refreshFunds: () => void;
  investInFund: (fundId: string, amount: number) => Promise<void>;
}

const InvestmentContext = createContext<InvestmentContextProps | undefined>(undefined);

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  // Fetch Funds
  const refreshFunds = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/funds", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch funds");
      }

      const fundsData = await response.json();
      setFunds(fundsData.funds);
    } catch (error) {
      console.error("Error fetching funds:", error);
    }
  };

  // Fetch Investments for the logged-in user
  const refreshInvestments = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await fetch(`http://localhost:3000/api/investments/${user}`, {
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
      setInvestments(investmentsData);
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
  }, [token, user]);

  // Function to handle investing in a fund
  const investInFund = async (fundId: string, amount: number) => {
    if (!user || !token) {
      console.error("Investment attempt without authentication.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user, fundId, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to invest in fund.");
      }
      refreshInvestments();
    } catch (error) {
      console.error("Investment failed:", error);
    }
  };

  useEffect(() => {
    refreshFunds();
  }, []);

  useEffect(() => {
    if (user) {
      refreshInvestments();
    }
  }, [refreshInvestments, user]);

  return (
    <InvestmentContext.Provider
      value={{
        funds,
        investments,
        refreshInvestments,
        refreshFunds,
        investInFund,
      }}
    >
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