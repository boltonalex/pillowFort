import { useState, useRef } from "react";
import { Fund } from "../types";

interface InvestmentFormProps {
  selectedFund: Fund;
  onClose: () => void;
  onInvest: (amount: number) => void;
}

export default function InvestmentForm({ selectedFund, onClose, onInvest }: InvestmentFormProps) {
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const formatCurrency = (value: string) => {
    let numericValue = value.replace(/[^0-9.]/g, "");
    const decimalParts = numericValue.split(".");
    if (decimalParts.length > 2) {
      numericValue = decimalParts[0] + "." + decimalParts.slice(1).join("");
    }
    const parsedValue = parseFloat(numericValue);
    if (isNaN(parsedValue)) return numericValue; // Allow unfinished input
    return numericValue.includes(".") ? numericValue : parsedValue.toLocaleString("en-GB");
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestmentAmount(formatCurrency(e.target.value));
  };
  const handleBlur = () => {
    if (investmentAmount) {
      const numericValue = parseFloat(investmentAmount.replace(/[^0-9.]/g, ""));
      if (!isNaN(numericValue)) {
        setInvestmentAmount(numericValue.toLocaleString("en-GB", { minimumFractionDigits: 2 }));
      }
    }
  };
  const handleFocus = () => {
    setInvestmentAmount(investmentAmount.replace(/,/g, ""));
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

        {/* ✅ React Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">£</span>
            <input
              ref={inputRef}
              type="number"
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