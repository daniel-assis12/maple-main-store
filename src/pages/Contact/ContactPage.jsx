import { useState } from "react";
import PageHero from "../../components/PageHero/PageHero";
import "./ContactPage.css";

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <PageHero
        eyebrow="Customer Support"
        title="How can we help?"
        description="Send us a message and our support team will respond as soon as possible."
      />

      <section className="contactSection">
        <div className="contactInformation">
          <span>GET IN TOUCH</span>

          <h2>We are here to help.</h2>

          <p>
            Questions about a product, order or delivery? Contact our support
            team using the form or email us directly.
          </p>

          <a href="mailto:hello@maplemainshop.com">
            hello@maplemainshop.com
          </a>
        </div>

        <form className="contactForm" onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" name="name" required />
          </label>

          <label>
            Email
            <input type="email" name="email" required />
          </label>

          <label>
            Order number <small>Optional</small>
            <input type="text" name="orderNumber" />
          </label>

          <label>
            Message
            <textarea name="message" rows="6" required />
          </label>

          <button type="submit">Send message</button>

          {submitted && (
            <p className="contactSuccess" role="status">
              Form layout confirmed. Wix submission will be connected before
              launch.
            </p>
          )}
        </form>
      </section>
    </>
  );
}

export default ContactPage;