import Investments from "../Investments";
import Funds from "../Funds";
import KYCForm from "../KYCForm";

export default function FundsView() {
  return (
    <div className='max-w-7xl flex mx-auto flex-col'>

      <KYCForm />
      <Funds />
      <Investments />
    </div>
  );
}