import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Checkbox } from "@mui/material";

interface TermsModalProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

export default function TermsModal({ userId, open, onClose }: TermsModalProps) {
  const [checked, setChecked] = useState(false);

  // const handleAccept = async () => {
  //   if (!userId) return;
  //   try {
  //     await setDoc(doc(db, "users", userId), { acceptedTerms: true }, { merge: true });
  //     onClose(); // Close modal after accepting
  //   } catch (error) {
  //     console.error("Error saving terms agreement:", error);
  //   }
  // };

  return (
    <Dialog open={open} onClose={() => { }}>
      <DialogTitle>Terms & Conditions</DialogTitle>
      <DialogContent>
        <Typography>
          By continuing, you agree to our Terms & Conditions and Privacy Policy.
        </Typography>
        <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
        <Typography>I agree to the Terms & Conditions.</Typography>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleAccept} disabled={!checked} variant="contained" color="primary"> */}
        Accept & Continue
        {/* </Button> */}
      </DialogActions>
    </Dialog>
  );
}