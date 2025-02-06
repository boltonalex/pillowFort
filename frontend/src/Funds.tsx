import { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { useInvestments } from "./context/InvestmentProvider";

export default function Funds() {
  const { funds, refreshInvestments } = useInvestments();
  const [isInvesting, setIsInvesting] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [userId] = useState<string | null>(() => localStorage.getItem("userId"));
  const [token] = useState<string | null>(() => localStorage.getItem("authToken"));

  // 💰 Handle investment submission
  const handleInvest = async () => {
    if (!selectedFund || !investmentAmount || !userId || !token) return;

    try {
      await investInFund(token, userId, selectedFund.id, investmentAmount, selectedFund.name);
      setIsInvesting(false);
      alert(`Successfully invested £${investmentAmount} in ${selectedFund.name}`);
      setInvestmentAmount(0);
      refreshInvestments(); // Refresh investments after investment
    } catch (error) {
      console.error("Investment failed:", error);
      alert("Failed to process investment. Please try again.");
    }
  };

  return (
    <div>
      <Typography variant="h6">Available Investment Funds</Typography>
      {funds.length === 0 ? <CircularProgress /> : null}

      <List>
        {funds?.map((fund) => (
          <ListItem key={fund.id}>
            <ListItemText
              primary={fund.name}
              secondary={`${fund.description} - Minimum: £${fund.minimum}`}
            />
            {!token ? (
              <Button variant="outlined" disabled>
                Login to Invest
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelectedFund(fund);
                  setIsInvesting(true);
                }}
              >
                Invest
              </Button>
            )}
          </ListItem>
        ))}
      </List>

      {/* 💰 Investment Form (Modal) */}
      <Dialog open={isInvesting && selectedFund !== null} onClose={() => setIsInvesting(false)}>
        <DialogTitle>Invest in {selectedFund?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Investment Amount (£)"
            type="number"
            fullWidth
            margin="dense"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsInvesting(false)}>Cancel</Button>
          <Button
            onClick={handleInvest}
            variant="contained"
            color="primary"
            disabled={investmentAmount < (selectedFund?.minimum || 0)}
          >
            {investmentAmount !== 0 && investmentAmount < (selectedFund?.minimum || 0)
              ? `Must be more than £${selectedFund!.minimum}`
              : "Confirm Investment"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}