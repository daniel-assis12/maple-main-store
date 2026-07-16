import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import { CartProvider } from "./context/CartContext.jsx";
import { CatalogProvider } from "./context/CatalogContext.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CatalogProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </CatalogProvider>
    </BrowserRouter>
  </StrictMode>,
);