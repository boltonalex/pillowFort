import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, CircularProgress, Typography } from "@mui/material";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

interface KYCFormProps {
  userId: string;
  open: boolean;
  onClose: () => void;
  onKYCComplete: () => void;
}

export default function KYCForm({ userId, open, onClose, onKYCComplete }: KYCFormProps) {
  const [name, setName] = useState("");
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

  // 🔹 Handle KYC Submission
  const handleSubmit = async () => {
    if (!name
      || !dob
      || !address
      //  || !idFile
    ) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 🔍 Save KYC details in Firestore (without file upload for now)
      await setDoc(doc(db, "users", userId), {
        kycVerified: true,
        name,
        dob,
        address,
        idUploaded: true, // We mark that an ID was uploaded, file handling to be implemented separately
      }, { merge: true });

      onKYCComplete(); // ✅ Notify the app that KYC is complete
      onClose();
    } catch (error) {
      console.error("KYC Submission Failed:", error);
      setError("Failed to submit KYC. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Submit KYC"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}