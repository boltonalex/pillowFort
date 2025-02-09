import { useAuth } from "../context/useAuth";
import { useInvestments } from "../context/useInvestments";
import { UserInvestmentsProps } from "../types";

export default function UserInvestments({ groupedInvestments }: UserInvestmentsProps) {
  const { token } = useAuth();
  const { investments } = useInvestments();

  const sortedInvestments = Object.entries(groupedInvestments).sort(([fundA], [fundB]) =>
    fundA.localeCompare(fundB)
  );

  return (
    <div className="sm:w-1/2 w-full px-2">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 sm:mt-0 mt-6">Your Investments</h2>

      {!token ? (
        <p className="text-gray-500 mt-4">Login to view your investments.</p>
      ) : investments?.length === 0 ? (
        <p className="text-gray-600 mt-4">No investments found.</p>
      ) : (
        <div>
          {sortedInvestments.map(([fundId, totalAmount]) => (
            <div key={fundId} className="bg-white p-6 mt-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold capitalize">Cushon {fundId.replace("-", " ")}</h3>
              <div className="flex justify-end items-end">
                <p className="text-gray-500 text-sm mt-2 mr-3">Total Investment</p>
                <p className="text-gray-600 font-bold text-xl">£{totalAmount.toLocaleString()}</p>
              </div>

              <div className="mt-4">
                <button
                  disabled
                  className="w-full bg-gray-300 text-white font-semibold py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}