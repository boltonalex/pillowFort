import { useAuth } from "../context/AuthProvider";
import { Typography, Button } from "@mui/material";

const AuthButtons = () => {
  const { user, setIsLoginOpen, logout } = useAuth();

  return (
    <>
      {!user ? (
        <Button variant="contained" color="primary" onClick={() => setIsLoginOpen(true)}>
          Login
        </Button>
      ) : (
        <>
          {/* <Typography color="success.main">✅ Logged in</Typography> */}
          <Button variant="outlined" color="secondary" onClick={logout} sx={{ ml: 2 }}>
            Logout
          </Button>
        </>
      )}

    </>
  )
}

export default AuthButtons