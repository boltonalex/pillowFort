import LoginModal from "./LoginModal";
import KYCForm from "./KYCForm";
import { InvestmentProvider } from "./context/InvestmentProvider";
import { AuthProvider } from "./context/AuthProvider";
import Header from "./components/Header";
import Home from './views/Home';
import Funds from './views/Funds';
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
              <Route path="funds" element={<Funds />} />
            </Routes>

            <LoginModal />
            <KYCForm />
          </div>
        </InvestmentProvider>
      </AuthProvider>
    </div>
  );
}