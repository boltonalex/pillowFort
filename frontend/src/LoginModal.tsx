import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";
import { useAuth } from "./context/AuthProvider";

// interface LoginModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
// }

export default function LoginModal() {
  const { login, signup, loginWithGoogle, setIsLoginOpen, isLoginOpen } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      setIsLoginOpen(false);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check your credentials.");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      await loginWithGoogle();
      setIsLoginOpen(false);
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    }

    setLoading(false);
  };

  return (
    <Dialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
      <DialogTitle>{isSignup ? "Sign Up" : "Login"} to PillowFort</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography
          variant="body2"
          sx={{ mt: 2, cursor: "pointer", color: "blue", textAlign: "center" }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "New user? Sign Up"}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleAuth} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : isSignup ? "Sign Up" : "Login"}
        </Button>
        <Button onClick={handleGoogleLogin} variant="contained" color="secondary" startIcon={<Google />} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Sign in with Google"}
        </Button>
        <Button onClick={() => setIsLoginOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog >
  );
}