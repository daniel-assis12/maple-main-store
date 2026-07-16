import { useState } from "react";
import PageHero from "../../components/PageHero/PageHero";
import "./FAQPage.css";

const questions = [
  {
    question: "Do you offer free shipping?",
    answer:
      "Free shipping is available on qualifying U.S. orders. The final threshold and delivery conditions will be displayed before checkout.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times vary by product and destination. Estimated delivery information will be displayed on each product page.",
  },
  {
    question: "Can I return my order?",
    answer:
      "Eligible products may be returned within 30 days according to our final refund and return policy.",
  },
  {
    question: "How do I track my order?",
    answer:
      "After your order ships, tracking information will be sent to the email used during checkout.",
  },
  {
    question: "Is checkout secure?",
    answer:
      "Yes. The final checkout will be processed using Wix's secure e-commerce infrastructure.",
  },
];

function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState(0);

  return (
    <>
      <PageHero
        eyebrow="Help Center"
        title="Frequently asked questions"
        description="Find quick answers about ordering, delivery, returns and shopping with Maple & Main."
      />

      <section className="faqSection">
        {questions.map((item, index) => {
          const isOpen = openQuestion === index;

          return (
            <article className="faqItem" key={item.question}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenQuestion(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && <p>{item.answer}</p>}
            </article>
          );
        })}
      </section>
    </>
  );
}

export default FAQPage;