import { Route, Routes } from "react-router";
import "./App.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CartDrawer from "./components/CartDrawer/CartDrawer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import HomePage from "./pages/Home/HomePage";
import ShopPage from "./pages/Shop/ShopPage";
import ProductPage from "./pages/Product/ProductPage";
import AboutPage from "./pages/About/AboutPage";
import ContactPage from "./pages/Contact/ContactPage";
import FAQPage from "./pages/FAQ/FAQPage";
import PolicyPage from "./pages/Policy/PolicyPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import WixTestPage from "./pages/WixTest/WixTestPage";

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />

      <main id="main-content" tabIndex="-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wix-test" element={<WixTestPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route
            path="/product/:slug"
            element={<ProductPage />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/contact"
            element={<ContactPage />}
          />
          <Route path="/faq" element={<FAQPage />} />

          <Route
            path="/shipping"
            element={<PolicyPage type="shipping" />}
          />

          <Route
            path="/privacy"
            element={<PolicyPage type="privacy" />}
          />

          <Route
            path="/terms"
            element={<PolicyPage type="terms" />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}

export default App;