import "./Benefits.css";

const benefits = [
  {
    icon: "🚚",
    title: "Free Shipping",
    text: "On qualifying U.S. orders.",
  },
  {
    icon: "🔒",
    title: "Secure Checkout",
    text: "Protected payments every time.",
  },
  {
    icon: "↩",
    title: "30-Day Guarantee",
    text: "Shop with confidence.",
  },
  {
    icon: "✓",
    title: "Carefully Curated",
    text: "Practical products selected with care.",
  },
];

function Benefits() {
  return (
    <section className="benefits" aria-label="Store benefits">
      <div className="benefitsInner">
        {benefits.map((benefit) => (
          <article className="benefitCard" key={benefit.title}>
            <div className="benefitIcon" aria-hidden="true">
              {benefit.icon}
            </div>

            <div>
              <h2>{benefit.title}</h2>
              <p>{benefit.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Benefits;