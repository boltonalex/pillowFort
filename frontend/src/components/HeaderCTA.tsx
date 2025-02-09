import CushonButton from "./CushonButton";
import AuthButtons from "./AuthButtons";
import { useAuth } from "../context/useAuth";
import { useLocation } from "react-router";


const HeaderCTA = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className='flex sm:p-4 pr-0 sm:gap-2 text-xs sm:text-base'>
      {!location.pathname.includes('fundList') &&
        <CushonButton clickTarget={'fundList'}>{user ? 'View Funds' : 'Get Started'}</CushonButton>
      }
      <AuthButtons />
    </div>
  )
}

export default HeaderCTA