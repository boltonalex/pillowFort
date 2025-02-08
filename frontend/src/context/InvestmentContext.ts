import { createContext } from "react";

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
  currency?: string;
  minimum: number;
}

interface InvestmentContextProps {
  funds: Fund[];
  investments: Investment[];
  refreshInvestments: () => void;
  refreshFunds: () => void;
  investInFund: (fundId: string, amount: number) => Promise<void>;
}

// Create and export InvestmentContext
export const InvestmentContext = createContext<InvestmentContextProps | undefined>(undefined);