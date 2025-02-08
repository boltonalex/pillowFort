import { useContext } from "react";
import { InvestmentContext } from "./InvestmentContext";

export function useInvestments() {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error("useInvestments must be used within an InvestmentProvider");
  }
  return context;
}