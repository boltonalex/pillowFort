const BE_URL = import.meta.env.VITE_BE_URL;

export const fetchInvestments = async (token: string, userId: string) => {
  const response = await fetch(`${BE_URL}/investments/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch investments");
  return response.json();
};

export const fetchFunds = async () => {
  const response = await fetch(`${BE_URL}/funds`);
  if (!response.ok) throw new Error("Failed to fetch funds");
  return response.json();
};
