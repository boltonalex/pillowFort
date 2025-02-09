import { useState, useEffect, useMemo } from "react";
import { useInvestments } from "../context/useInvestments";
import { useAuth } from "../context/useAuth";
import InvestmentForm from "./InvestmentForm";
import UserInvestments from "./UserInvestments";
import AvailableFunds from "./AvailableFunds"; // ✅ Import new component
import { Fund } from "../types";

export default function Funds() {
  const { funds, refreshInvestments, investInFund, investments } = useInvestments();
  const { user, token, userData } = useAuth();
  const [isInvesting, setIsInvesting] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [investmentSum, setInvestmentSum] = useState<number>(0);

  useEffect(() => {
    if (investments && investments.length > 0) {
      const totalInvestment = investments.reduce((acc, curr) => acc + curr.amount, 0);
      setInvestmentSum(totalInvestment);
    } else {
      setInvestmentSum(0);
    }
  }, [user, investments]);

  const groupedInvestments = useMemo(() => {
    if (!investments || investments.length === 0) return {};

    return investments.reduce<{ [key: string]: number }>((acc, inv) => {
      acc[inv.fundId] = (acc[inv.fundId] || 0) + inv.amount;
      return acc;
    }, {});
  }, [investments]);

  const handleInvest = async (amount: number) => {
    if (!selectedFund || !user || !token) return;

    try {
      await investInFund(selectedFund.id, amount);
      setIsInvesting(false);
      refreshInvestments();
    } catch (error) {
      console.error("Investment failed:", error);
    }
  };

  return (
    <div className="">
      {user && investmentSum > 0 && (
        <div className="bg-pink-500 text-white p-8 text-center relative">
          <h2 className="text-2xl font-semibold">Total Investments</h2>
          <p className="text-5xl font-bold mt-2">
            {/* {`£${investmentSum}`} */}
            {new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: "GBP",
            }).format(investmentSum)}
          </p>
        </div>
      )}

      {userData && (userData.name || userData.email) && (
        <div className='p-8 bg-gray-100 shadow-lg'>
          <p>
            Your are logged in as: <span className="capitalize">{userData?.name || userData?.email || "Guest"}</span>
          </p>
        </div>
      )}


      <div className="bg-gray-100 p-6 rounded-b-3xl shadow-lg flex sm:flex-row flex-col">
        <AvailableFunds funds={funds} setSelectedFund={setSelectedFund} setIsInvesting={setIsInvesting} />
        <div className="w-[5px] bg-pink-500 mx-6 rounded-3xl"></div>
        <UserInvestments groupedInvestments={groupedInvestments} />
      </div>

      {isInvesting && selectedFund && (
        <InvestmentForm
          selectedFund={selectedFund}
          onClose={() => setIsInvesting(false)}
          onInvest={handleInvest}
        />
      )}
    </div>
  );
}