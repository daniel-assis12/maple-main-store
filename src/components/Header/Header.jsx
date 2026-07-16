import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { useCart } from "../../context/CartContext.jsx";
import "./Header.css";

const navigationLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Best Sellers", href: "/shop" },
  { label: "New", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

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
      <a className="skipLink" href="#main-content">
        Skip to main content
      </a>

      <div className="topbar">
        <span>Free Shipping on Qualifying U.S. Orders</span>
        <span>Secure Checkout</span>
        <span>30-Day Guarantee</span>
      </div>

      <header className="siteHeader">
        <Link
          className="headerLogo"
          to="/"
          aria-label="Maple and Main home"
        >
          Maple<span>&amp;Main</span>
        </Link>

        <nav
          className="desktopNavigation"
          aria-label="Main navigation"
        >
          {navigationLinks.map((link) => (
            <NavLink
              to={link.href}
              key={link.label}
              className={({ isActive }) =>
                isActive ? "isActive" : ""
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="headerActions">
          <Link
            className="headerIconButton searchButton"
            to="/shop"
            aria-label="Search products"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </Link>

          <button
            className="headerIconButton cartButton"
            type="button"
            aria-label={`Open shopping cart with ${itemCount} items`}
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
            className={`mobileMenuButton ${
              isMenuOpen ? "isOpen" : ""
            }`}
            type="button"
            aria-label={
              isMenuOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() =>
              setIsMenuOpen((currentValue) => !currentValue)
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`mobileMenuOverlay ${
          isMenuOpen ? "isVisible" : ""
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside
        id="mobile-navigation"
        className={`mobileMenu ${
          isMenuOpen ? "isOpen" : ""
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="mobileMenuHeader">
          <span>Menu</span>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav aria-label="Mobile navigation">
          {navigationLinks.map((link) => (
            <NavLink
              to={link.href}
              key={link.label}
              onClick={closeMenu}
            >
              <span>{link.label}</span>
              <span aria-hidden="true">→</span>
            </NavLink>
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