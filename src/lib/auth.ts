export const getWallet = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("wallet");
};

export const logout = () => {
  localStorage.removeItem("wallet");
  window.location.href = "/login";
};
