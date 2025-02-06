import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "./firebase";

interface LoginModalProps {
  isOpen: boolean;
  closeModal: () => void;
  setToken: (token: string | null) => void;
}

export default function LoginModal({ isOpen, closeModal, setToken }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👀 Password Visibility Toggle

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      const token = await result.user.getIdToken();
      setToken(token);
      closeModal();
    } catch (err) {
      setError("Google login failed. Try another method.");
    }
    setLoading(false);
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = isSignup ? await signUpWithEmail(email, password) : await signInWithEmail(email, password);
      const token = await result.user.getIdToken();
      setToken(token);
      closeModal();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Check your credentials.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
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
          type={showPassword ? "text" : "password"} // 👀 Toggle visibility
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
        <Button onClick={handleEmailAuth} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : isSignup ? "Sign Up" : "Login"}
        </Button>
        <Button onClick={handleGoogleLogin} variant="contained" color="secondary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Sign in with Google"}
        </Button>
        <Button onClick={closeModal}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}