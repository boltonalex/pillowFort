import LoginModal from "./components/LoginModal";
import { InvestmentProvider } from "./context/InvestmentProvider";
import { AuthProvider } from "./context/AuthProvider";
import Header from "./components/Header";
import Home from './views/Home';
import Funds from './views/Funds';
import KYC from './views/KYC';
import { Routes, Route } from "react-router";

export default function App() {

  return (
    <div className='font-work font-bold'>

      <AuthProvider>
        <InvestmentProvider>
          <div className='w-full'>
            <Header />
            <Routes>
              <Route index element={<Home />} />
              <Route path="/fundList" element={<Funds />} />
              <Route path="/kyc" element={<KYC />} />
            </Routes>

            <LoginModal />
          </div>
        </InvestmentProvider>
      </AuthProvider>
    </div>
  );
}