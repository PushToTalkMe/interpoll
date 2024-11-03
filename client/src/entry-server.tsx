import { Home } from "./pages/home/home";
import { PollI } from "./interfaces/api.interface";
import { renderToString } from "react-dom/server";
import { StrictMode } from "react";
import "./global.css";

export function render(initialPolls: PollI[]) {
  const html = renderToString(
    <StrictMode>
      <Home initialPolls={initialPolls || []} />
    </StrictMode>
  );
  return { html };
}
