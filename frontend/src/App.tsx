import { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme, Container, Typography, Button } from "@mui/material";
import LoginModal from "./LoginModal";
import Investments from "./Investments";
import Funds from "./Funds";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import KYCForm from "./KYCForm";
import { InvestmentProvider } from "./context/InvestmentProvider";
import { AuthProvider } from "./context/AuthProvider";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ff9800" },
  },
});

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem("userId"));
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showKYC, setShowKYC] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const newToken = await firebaseUser.getIdToken();
        setToken(newToken);
        setUserId(firebaseUser.uid);
        localStorage.setItem("token", newToken);
        localStorage.setItem("userId", firebaseUser.uid);

        // 🔹 Check if KYC is completed
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();
        setShowKYC(!userData?.kycVerified);
      } else {
        handleLogout();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>

        <InvestmentProvider>

          <CssBaseline />
          <Container maxWidth="md">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
              PillowFort Investments
            </Typography>

            {!token ? (
              <Button variant="contained" color="primary" onClick={() => setIsLoginOpen(true)}>
                Login
              </Button>
            ) : (
              <>
                <Typography color="success.main">✅ Logged in</Typography>
                <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ ml: 2 }}>
                  Logout
                </Button>
              </>
            )}

            {showKYC && userId && (
              <KYCForm userId={userId} open={showKYC} onClose={() => setShowKYC(false)} onKYCComplete={() => setShowKYC(false)} />
            )}

            {/* Always Show Funds, Restrict Investment Actions */}
            <Funds />

            {/* Only Show Investments if Logged In */}
            {token && userId && <Investments token={token} userId={userId} />}

            {/* Login Modal */}
            <LoginModal isOpen={isLoginOpen} closeModal={() => setIsLoginOpen(false)} setToken={setToken} />
          </Container>
        </InvestmentProvider>
      </AuthProvider>

    </ThemeProvider>
  );
}