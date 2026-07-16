import { useEffect, useState } from "react";
import "./Header.css";
import { useCart } from "../../context/CartContext.jsx";

const navigationLinks = [
  { label: "Shop", href: "#featured-products" },
  { label: "Best Sellers", href: "#featured-products" },
  { label: "New", href: "#categories" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#footer" },
];

function Header() {
  const { itemCount, openCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <div className="topbar">
        <span>Free Shipping on Qualifying U.S. Orders</span>
        <span>Secure Checkout</span>
        <span>30-Day Guarantee</span>
      </div>

      <header className="siteHeader">
        <a className="headerLogo" href="/" aria-label="Maple and Main home">
          Maple<span>&amp;Main</span>
        </a>

        <nav className="desktopNavigation" aria-label="Main navigation">
          {navigationLinks.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="headerActions">
          <button
            className="headerIconButton searchButton"
            type="button"
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </button>

          <button
              className="headerIconButton cartButton"
               type="button"
               aria-label="Open shopping cart"
               onClick={openCart}
          >
        
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 8H7" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            <span className="cartCount">{itemCount}</span>
          </button>

          <button
            className={`mobileMenuButton ${isMenuOpen ? "isOpen" : ""}`}
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`mobileMenuOverlay ${isMenuOpen ? "isVisible" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside
        className={`mobileMenu ${isMenuOpen ? "isOpen" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="mobileMenuHeader">
          <span>Menu</span>

          <button type="button" onClick={closeMenu} aria-label="Close menu">
            ×
          </button>
        </div>

        <nav aria-label="Mobile navigation">
          {navigationLinks.map((link) => (
            <a href={link.href} key={link.label} onClick={closeMenu}>
              <span>{link.label}</span>
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </nav>

        <div className="mobileMenuSupport">
          <strong>Need help?</strong>

          <a href="mailto:hello@maplemainshop.com">
            hello@maplemainshop.com
          </a>
        </div>

        <div className="mobileMenuBenefits">
          <span>Secure Checkout</span>
          <span>Free Shipping</span>
          <span>30-Day Guarantee</span>
        </div>
      </aside>
    </>
  );
}

export default Header;