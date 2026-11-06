import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import PortfolioProvider from "./context/PortfolioProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <PortfolioProvider><App /></PortfolioProvider>
    </ThemeProvider>
  </React.StrictMode>
);
