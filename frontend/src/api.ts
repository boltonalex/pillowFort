export const fetchInvestments = async (token: string, userId: string) => {
  const response = await fetch(`http://localhost:3000/api/investments/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch investments");
  return response.json();
};

export const fetchFunds = async () => {
  const response = await fetch(`http://localhost:3000/api/funds`);
  if (!response.ok) throw new Error("Failed to fetch funds");
  return response.json();
};

export const investInFund = async (token: string, userId: string, fundId: string, amount: number, name: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/investments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, fundId, amount, name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to invest in fund.");
    }

    return await response.json();
  } catch (error) {
    console.error("Investment failed:", error);
    throw error;
  }
};