import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

function applyInitialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {}
}
applyInitialTheme();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
