import CushonButton from "./CushonButton";
import AuthButtons from "./AuthButtons";
import { useAuth } from "../context/useAuth";
import { useLocation } from "react-router";


const HeaderCTA = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className='flex p-4 pr-0 gap-2'>
      {!location.pathname.includes('funds') &&
        <CushonButton clickTarget={'funds'}>{user ? 'View Funds' : 'Get Started'}</CushonButton>
      }
      <AuthButtons />
    </div>
  )
}

export default HeaderCTA