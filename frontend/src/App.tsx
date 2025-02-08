// import { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme, Container, Typography, Button } from "@mui/material";
import LoginModal from "./LoginModal";
import Investments from "./Investments";
import Funds from "./Funds";
import KYCForm from "./KYCForm";
import { InvestmentProvider } from "./context/InvestmentProvider";
import { AuthProvider } from "./context/AuthProvider";
import AuthButtons from './components/AuthButtons'

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ff9800" },
  },
});

export default function App() {

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>

        <InvestmentProvider>

          <CssBaseline />
          <Container maxWidth="md">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
              PillowFort Investments
            </Typography>
            <AuthButtons />

            <KYCForm />

            <Funds />

            <Investments />

            <LoginModal />
          </Container>
        </InvestmentProvider>
      </AuthProvider>

    </ThemeProvider>
  );
}