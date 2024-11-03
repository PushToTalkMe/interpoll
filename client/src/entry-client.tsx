import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "./global.css";
import { Home } from "./pages/home/home";

const initialPolls = window.__INITIAL_POLLS__ || [];

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <Home initialPolls={initialPolls} />
  </StrictMode>
);
