import Hero from "../components/Hero";
import ProductBenefitsList from "../components/ProductBenefitsList";
import CautionText from "../components/CautionText";
import CTA from "../components/CTA";
import FundsCard from "../components/FundsCard";


export default function Home() {
  return (
    <div>
      <Hero />
      <ProductBenefitsList />
      <CautionText />
      <CTA />
      <FundsCard />
      <CTA />
    </div>
  );
}