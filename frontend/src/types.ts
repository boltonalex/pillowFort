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

export interface UserData {
  id: string | null;
  email: string | null;
  name: string | null;
  kycVerified?: boolean;
  [key: string]: unknown;
}

export interface AuthContextProps {
  user: string | null;
  token: string | null;
  isLoginOpen: boolean;
  isKYCOpen: boolean;
  userData: UserData | null;
  loginErrorMessage: string;
  setToken: (token: string | null) => void;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setIsLoginOpen: (isOpen: boolean) => void;
  setIsKYCOpen: (isOpen: boolean) => void;
  updateKYC: (kycData: Partial<UserData>) => Promise<void>;
}