import { useAuth } from "../context/AuthProvider";
// import { Typography, Button } from "@mui/material";

const AuthButtons = () => {
  const { user, setIsLoginOpen, logout } = useAuth();

  return (
    <>
      {!user ? (
        <button onClick={() => setIsLoginOpen(true)}>
          Login
        </button>
      ) : (
        <>
          <button onClick={logout}>
            Logout
          </button>
        </>
      )}

    </>
  )
}

export default AuthButtons