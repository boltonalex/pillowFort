import { useState } from "react";
import { auth, provider, signInWithPopup } from "./firebase";

export default function Auth({ setToken }) {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    setUser(result.user);
    setToken(token);
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button onClick={() => auth.signOut()}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
}