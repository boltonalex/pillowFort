import { useAuth } from "../context/useAuth";
import { AvailableFundsProps } from "../types";
import { Link } from "react-router";

export default function AvailableFunds({ funds, setSelectedFund, setIsInvesting }: AvailableFundsProps) {
  const { user, userData, setIsLoginOpen } = useAuth();
  const sortedFunds = [...funds].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="sm:w-1/2 w-full px-2">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Funds</h2>

      {sortedFunds.length === 0 ? (
        <div className="text-center py-10 mt-4">Loading...</div>
      ) : (
        <div>
          {sortedFunds.map((fund) => (
            <div key={fund.id} className="bg-white mt-4 p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{fund.name}</h3>
                <div className='flex flex-col items-center'>
                  £{fund.minimum} <sup className="pt-1 text-xs/2 text-center text-gray-400">minimum <br />investment</sup>
                </div>
              </div>
              <p className="text-gray-500 text-sm">{fund.description}</p>

              <div className="mt-4 flex justify-between text-sm text-gray-700">
                <p>
                  <span className="text-green-600 font-bold">▲ £1,377</span> (12%)
                </p>
                <p>
                  Target: <span className="font-semibold">£{fund.minimum * 5}</span>
                </p>
              </div>

              <div className="mt-4">
                {!user ? (
                  <button
                    className="cursor-pointer w-full bg-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-600 transition"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    Login or Signup to Invest
                  </button>
                ) : userData?.kycVerified ? (
                  <button
                    className="cursor-pointer w-full bg-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-600 transition"
                    role='button'
                    title='investCTA'
                    onClick={() => {
                      setSelectedFund(fund);
                      setIsInvesting(true);
                    }}
                  >
                    Invest
                  </button>
                ) : (

                  <Link to="/kyc">

                    <button
                      role='button'
                      title='completeCTA'
                      className="cursor-pointer w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Complete KYC to Invest
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )
      }
    </div >
  );
}