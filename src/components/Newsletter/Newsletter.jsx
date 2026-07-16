import { useState } from "react";
import "./Newsletter.css";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  function handleSubmit(event) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  }

  return (
    <section className="newsletterSection">
      <div className="newsletterInner">
        <div className="newsletterContent">
          <span>JOIN MAPLE & MAIN</span>

          <h2>Thoughtful finds, delivered to your inbox.</h2>

          <p>
            Be the first to discover new arrivals, limited offers and practical
            products selected for everyday living.
          </p>

          <ul>
            <li>Early access to new arrivals</li>
            <li>Exclusive offers and seasonal promotions</li>
            <li>Helpful product inspiration</li>
          </ul>
        </div>

        <div className="newsletterFormPanel">
          <p className="newsletterOffer">Get 10% off your first order</p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="newsletter-email">Email address</label>

            <div className="newsletterInputRow">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setStatus("idle");
                }}
                aria-invalid={status === "error"}
              />

              <button type="submit">Join the list</button>
            </div>

            <p className="newsletterPrivacy">
              By subscribing, you agree to receive marketing emails. You may
              unsubscribe at any time.
            </p>

            {status === "error" && (
              <p className="newsletterMessage newsletterError" role="alert">
                Please enter a valid email address.
              </p>
            )}

            {status === "success" && (
              <p className="newsletterMessage newsletterSuccess" role="status">
                You are on the list. Welcome to Maple & Main.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;