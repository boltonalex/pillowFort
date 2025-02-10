import { useAuth } from "../context/useAuth";

const AuthButtons = () => {
  const { user, setIsLoginOpen, logout } = useAuth();

  return (
    <>
      {!user ? (
        <button
          className="cursor-pointer text-pink-500 border-pink-500 border-2 font-semibold rounded-full sm:px-6 px-2 sm:py-2 mt-2 sm:mt-0 flex items-center sm:gap-2 h-[40px] shadow-md hover:bg-pink-200 transition duration-300"
          onClick={() => setIsLoginOpen(true)}
          name='login'
          role='button'
        >
          Login
        </button>
      ) : (
        <>
          <button
            onClick={logout}
            className="cursor-pointer text-white bg-pink-500 font-semibold rounded-full sm:px-6 px-2 sm:py-2 mt-2 sm:mt-0 flex items-center sm:gap-2 h-[40px] shadow-md hover:bg-pink-600 transition duration-300"
            name='logout'
            role='button'
          >
            Logout
          </button>
        </>
      )}

    </>
  )
}

export default AuthButtons