import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    rating: 5,
    text:
      "The store feels simple, polished and easy to navigate. I found exactly what I needed without feeling overwhelmed.",
    name: "Sample Customer",
    location: "United States",
  },
  {
    id: 2,
    rating: 5,
    text:
      "I appreciate the clean presentation and the focus on practical products for everyday life.",
    name: "Sample Customer",
    location: "United States",
  },
  {
    id: 3,
    rating: 5,
    text:
      "Checkout was straightforward and the overall experience felt secure and professional.",
    name: "Sample Customer",
    location: "United States",
  },
];

function Testimonials() {
  return (
    <section className="testimonialsSection">
      <div className="testimonialsHeader">
        <span>CUSTOMER EXPERIENCE</span>

        <h2>What shoppers are saying</h2>

        <p>
          These are temporary layout examples. Real verified reviews will be
          connected before launch.
        </p>
      </div>

      <div className="testimonialsGrid">
        {testimonials.map((testimonial) => (
          <article className="testimonialCard" key={testimonial.id}>
            <div
              className="testimonialStars"
              aria-label={`${testimonial.rating} out of 5 stars`}
            >
              {"★".repeat(testimonial.rating)}
            </div>

            <blockquote>“{testimonial.text}”</blockquote>

            <div className="testimonialAuthor">
              <div className="testimonialAvatar" aria-hidden="true">
                {testimonial.name.charAt(0)}
              </div>

              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.location}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="testimonialsNotice">
        <span aria-hidden="true">✓</span>
        Verified customer reviews will be added before the store goes live.
      </div>
    </section>
  );
}

export default Testimonials;