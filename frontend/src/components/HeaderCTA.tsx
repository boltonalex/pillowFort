import CushonButton from "./CushonButton";
import AuthButtons from "./AuthButtons";
import { useAuth } from "../context/AuthProvider";
import { useLocation } from "react-router";


const HeaderCTA = () => {
  const { user } = useAuth();

  const location = useLocation()

  console.log(location.pathname.includes('funds'))


  return (
    <div className='flex p-4 gap-2'>
      {!location.pathname.includes('funds') &&
        <CushonButton clickTarget={'funds'}>{user ? 'View Funds' : 'Get Started'}</CushonButton>
      }
      <AuthButtons />
    </div>
  )
}

export default HeaderCTA