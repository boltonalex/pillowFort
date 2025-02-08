import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "./context/AuthProvider";

export default function KYCForm() {
  const { user,
    isKYCOpen,
    setIsKYCOpen,
    isKycVerified,
    updateKYC
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIdFile(event.target.files[0]);
    }
  };

  // 🔹 Handle KYC Submission via API
  const handleSubmit = async () => {
    if (!name || !dob || !address) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("user", user);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("dob", dob);
      formData.append("address", address);
      if (idFile) {
        formData.append("idFile", idFile);
      }

      await updateKYC(Object.fromEntries(formData.entries()));

    } catch (error) {
      console.error("KYC Submission Failed:", error);
      setError("Failed to submit KYC. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={isKYCOpen} onClose={() => setIsKYCOpen(false)}>
      <DialogTitle>KYC Verification</DialogTitle>
      <DialogContent>
        <Typography>Please fill out your details to verify your identity.</Typography>
        {error && <Typography color="error">{error}</Typography>}

        <TextField
          label="Full Name"
          fullWidth
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <TextField
          label="Residential Address"
          fullWidth
          margin="dense"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input type="file" accept=".jpg,.png,.pdf" onChange={handleFileChange} />
        {idFile && <Typography>File selected: {idFile.name}</Typography>}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setIsKYCOpen(false)} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Submit KYC"}
        </Button>
      </DialogActions>
    </Dialog >
  );
}