import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";

import {
  CatalogProvider,
} from "./context/CatalogContext.jsx";

import {
  CartProvider,
} from "./context/CartContext.jsx";

import "./index.css";

createRoot(
  document.getElementById("root"),
).render(
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