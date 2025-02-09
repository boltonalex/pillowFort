import { useAuth } from "../context/useAuth";

const AuthButtons = () => {
  const { user, setIsLoginOpen, logout } = useAuth();

  return (
    <>
      {!user ? (
        <button
          className="cursor-pointer text-pink-500 border-pink-500 border-2 font-semibold rounded-full px-6 py-2 flex items-center gap-2 shadow-md hover:bg-pink-200 transition duration-300"
          onClick={() => setIsLoginOpen(true)}>
          Login
        </button>
      ) : (
        <>
          <button
            onClick={logout}
            className="cursor-pointer text-white bg-pink-500 font-semibold rounded-full px-6 py-2 flex items-center gap-2 shadow-md hover:bg-pink-600 transition duration-300"
          >
            Logout
          </button>
        </>
      )}

    </>
  )
}

export default AuthButtons