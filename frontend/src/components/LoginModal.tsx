import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

export default function LoginModal() {
  const { login, signup, loginWithGoogle, setIsLoginOpen, isLoginOpen, loginErrorMessage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (isSignup) {
        await signup(email, password);
        setIsSignup(false)
      } else {
        await login(email, password);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login Error:", error.message);
      } else {
        console.error("Login Error: An unknown error occurred", error);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: { key: string; }) => {
      if (event.key === "Escape") {
        setIsLoginOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsLoginOpen]);



  return (
    isLoginOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50" onClick={() => setIsLoginOpen(false)}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-semibold text-center">
            {isSignup ? "Sign Up" : "Login"} to PillowFort
          </h2>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

          <form action={handleAuth} className="mt-4 space-y-4" role='form'>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <p
              className="text-sm text-center text-blue-500 cursor-pointer"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Already have an account? Login" : "New user? Sign Up"}
            </p>

            <button
              type="submit"
              className="cursor-pointer w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          <button
            className="cursor-pointer w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            onClick={loginWithGoogle}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign in with Google"}
          </button>

          <button
            className="cursor-pointer w-full mt-2 text-gray-600 hover:text-gray-900 transition"
            onClick={() => setIsLoginOpen(false)}
          >
            Cancel
          </button>
          {loginErrorMessage && (
            <div className='text-orange-500'>
              <p>{loginErrorMessage}</p>
            </div>
          )}
        </div>
      </div >
    )
  );
}