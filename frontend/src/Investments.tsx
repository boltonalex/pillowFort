import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, CircularProgress, Typography } from "@mui/material";
import { fetchInvestments } from "./api";

interface Investment {
  id: string;
  fundId: string;
  amount: number;
  createdAt: { _seconds: number };
}

export default function Investments({ token, userId }: { token: string | null; userId: string | null }) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !userId) return; // Do not fetch if not logged in
    const loadInvestments = async () => {
      setLoading(true);
      try {
        const data = await fetchInvestments(token, userId);
        setInvestments(data);
      } catch (err) {
        setError("Failed to load investments.");
      }
      setLoading(false);
    };

    loadInvestments();
  }, [token, userId]);

  return (
    <div>
      <Typography variant="h6">Your Investments</Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!token ? (
        <Typography color="textSecondary">Login to view your investments.</Typography>
      ) : investments.length === 0 ? (
        <Typography>No investments found.</Typography>
      ) : (
        <List>
          {investments.map((inv) => (
            <ListItem key={inv.id}>
              <ListItemText
                primary={inv.fundId}
                secondary={`£${inv.amount} - ${new Date(inv.createdAt._seconds * 1000).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}