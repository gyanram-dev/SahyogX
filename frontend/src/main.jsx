import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { apiUrl } from "@/hooks/lib/api";

fetch(apiUrl("/")).catch(() => {});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="dark">
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);