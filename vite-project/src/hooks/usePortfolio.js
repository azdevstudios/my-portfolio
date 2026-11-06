import { useContext } from "react";
import { PortfolioContext } from "../context/portfolio-context";
export default function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("PortfolioProvider is required.");
  return context;
}
