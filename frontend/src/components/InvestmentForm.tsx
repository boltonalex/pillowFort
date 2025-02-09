import { useState, useRef } from "react";
import { Fund } from "../types";

interface InvestmentFormProps {
  selectedFund: Fund;
  onClose: () => void;
  onInvest: (amount: number) => void;
}

const formatCurrency = (value: string, forceTwoDecimals = false): string => {
  const numericValue = value.replace(/[^0-9.]/g, "");
  const parsedValue = parseFloat(numericValue);

  if (isNaN(parsedValue)) return "";

  return parsedValue.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: forceTwoDecimals ? 2 : 0,
  });
};

export default function InvestmentForm({ selectedFund, onClose, onInvest }: InvestmentFormProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestmentAmount(formatCurrency(e.target.value));
  };

  const handleBlur = () => {
    if (investmentAmount) {
      setInvestmentAmount(formatCurrency(investmentAmount, true));
    }
  };

  const handleFocus = () => {
    setInvestmentAmount(investmentAmount.replace(/[^0-9.]/g, ""));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numericAmount = parseFloat(investmentAmount.replace(/[^0-9.]/g, ""));

    if (!isNaN(numericAmount) && numericAmount >= (selectedFund?.minimum || 0)) {
      onInvest(numericAmount);
      setInvestmentAmount("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold">Invest in {selectedFund?.name}</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              name="investmentAmount"
              className="w-full p-2 pl-7 border border-gray-300 rounded-lg"
              placeholder="Investment Amount"
              value={investmentAmount}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-4 py-2 rounded-lg ${parseFloat(investmentAmount.replace(/[^0-9.]/g, "")) < (selectedFund?.minimum || 0)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              disabled={parseFloat(investmentAmount.replace(/[^0-9.]/g, "")) < (selectedFund?.minimum || 0)}
            >
              {investmentAmount && parseFloat(investmentAmount.replace(/[^0-9.]/g, "")) < (selectedFund?.minimum || 0)
                ? `Must be more than £${selectedFund!.minimum}`
                : "Confirm Investment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}