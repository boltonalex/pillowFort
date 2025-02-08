import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useAuth } from "./context/AuthProvider";
import { useInvestments } from "./context/InvestmentProvider";

export default function Investments() {
  const { investments } = useInvestments();
  const { token } = useAuth();

  return (
    <div>
      <Typography variant="h6">Your Investments</Typography>
      {!token ? (
        <Typography color="textSecondary">Login to view your investments.</Typography>
      ) : investments?.length === 0 ? (
        <Typography>No investments found.</Typography>
      ) : (
        <List>
          {investments?.map((inv) => (
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