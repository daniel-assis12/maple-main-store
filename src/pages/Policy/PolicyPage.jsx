import PageHero from "../../components/PageHero/PageHero";
import "./PolicyPage.css";

function PolicyPage({ type }) {
  const policies = {
    shipping: {
      eyebrow: "Customer Information",
      title: "Shipping & Returns",
      description:
        "Important information about delivery, tracking, returns and refunds.",
    },
    privacy: {
      eyebrow: "Legal",
      title: "Privacy Policy",
      description:
        "How Maple & Main collects, uses and protects customer information.",
    },
    terms: {
      eyebrow: "Legal",
      title: "Terms & Conditions",
      description:
        "The terms governing use of the Maple & Main website and services.",
    },
  };

  const policy = policies[type] ?? policies.shipping;

  return (
    <>
      <PageHero {...policy} />

      <article className="policyContent">
        <p className="policyWarning">
          Final legally reviewed content will replace this implementation
          notice before launch.
        </p>

        <h2>Policy information</h2>

        <p>
          This page has been created as part of the site structure. The final
          policy will be completed after shipping regions, delivery estimates,
          suppliers, return conditions and checkout operations are confirmed.
        </p>

        <h2>Contact</h2>

        <p>
          Questions may be sent to{" "}
          <a href="mailto:hello@maplemainshop.com">
            hello@maplemainshop.com
          </a>
          .
        </p>
      </article>
    </>
  );
}

export default PolicyPage;