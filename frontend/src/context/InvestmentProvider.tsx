import { useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./useAuth";
import { InvestmentContext } from "./InvestmentContext"; // Import the separate InvestmentContext
import { Fund, Investment } from "../types";
const BE_URL = import.meta.env.VITE_BE_URL;

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const refreshFunds = async () => {
    try {
      const response = await fetch(`${BE_URL}/funds`, {
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

  const refreshInvestments = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${BE_URL}/investments/${user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  const investInFund = async (fundId: string, amount: number) => {
    if (!user || !token) {
      console.error("Investment attempt without authentication.");
      return;
    }

    try {
      const response = await fetch(`${BE_URL}/investments`, {
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