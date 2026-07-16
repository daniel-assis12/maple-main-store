import { Link } from "react-router";
import "./Footer.css";

const footerGroups = [
  {
    title: "Shop",
    links: [
      { label: "Shop All", to: "/shop" },
      { label: "Best Sellers", to: "/shop" },
      { label: "New Arrivals", to: "/shop" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Frequently Asked Questions", to: "/faq" },
      { label: "Shipping & Returns", to: "/shipping" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
    ],
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footerMain">
        <div className="footerBrand">
          <Link
            className="footerLogo"
            to="/"
            aria-label="Maple and Main home"
          >
            Maple<span>&amp;Main</span>
          </Link>

          <p>
            Thoughtfully curated products for a practical, comfortable and
            beautiful everyday life.
          </p>

          <div className="footerContact">
            <span>Customer support</span>

            <a href="mailto:hello@maplemainshop.com">
              hello@maplemainshop.com
            </a>
          </div>

          <div className="footerSocial" aria-label="Social media">
            <a href="#" aria-label="Instagram">
              IG
            </a>
            <a href="#" aria-label="Facebook">
              FB
            </a>
            <a href="#" aria-label="TikTok">
              TT
            </a>
            <a href="#" aria-label="Pinterest">
              PT
            </a>
          </div>
        </div>

        <div className="footerLinks">
          {footerGroups.map((group) => (
            <div className="footerGroup" key={group.title}>
              <h2>{group.title}</h2>

              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footerTrust">
        <div>
          <strong>Secure checkout</strong>
          <span>Protected payment experience</span>
        </div>

        <div>
          <strong>Free shipping</strong>
          <span>On qualifying U.S. orders</span>
        </div>

        <div>
          <strong>30-day guarantee</strong>
          <span>Shop with greater confidence</span>
        </div>

        <div>
          <strong>Customer support</strong>
          <span>We are here to help</span>
        </div>
      </div>

      <div className="footerBottom">
        <p>© {currentYear} Maple &amp; Main. All rights reserved.</p>

        <div className="footerPayments" aria-label="Accepted payment methods">
          <span>VISA</span>
          <span>MC</span>
          <span>AMEX</span>
          <span>PAYPAL</span>
          <span>APPLE PAY</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;