export interface Fund {
  id: string;
  name: string;
  description: string;
  minimum: number;
}

export interface Investment {
  id: string;
  userId: string;
  fundId: string;
  amount: number;
  createdAt: string;
}

export interface InvestmentContextProps {
  funds: Fund[];
  investments: Investment[];
  refreshInvestments: () => void;
  refreshFunds: () => void;
  investInFund: (fundId: string, amount: number) => Promise<void>;
}

export interface UserInvestmentsProps {
  groupedInvestments: { [key: string]: number };
}

export interface AvailableFundsProps {
  funds: Fund[];
  setSelectedFund: (fund: Fund | null) => void;
  setIsInvesting: (isInvesting: boolean) => void;
}