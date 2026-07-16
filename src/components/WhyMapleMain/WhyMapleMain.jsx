import { Link } from "react-router";
import "./WhyMapleMain.css";

const values = [
  {
    number: "01",
    title: "Thoughtfully Curated",
    text: "We select practical products that bring real value to everyday life.",
  },
  {
    number: "02",
    title: "Simple Shopping",
    text: "Clear information, secure checkout and a straightforward experience.",
  },
  {
    number: "03",
    title: "Everyday Usefulness",
    text: "Products chosen to solve common problems without adding complexity.",
  },
  {
    number: "04",
    title: "Customer Confidence",
    text: "Every purchase is supported by secure payments and clear policies.",
  },
];

function WhyMapleMain() {
  return (
    <section className="whySection" id="about">
      <div className="whyIntro">
        <span>OUR APPROACH</span>

        <h2>
          Better products.
          <br />
          Less clutter.
        </h2>

        <p>
          Maple & Main is built around one simple idea: everyday products
          should be useful, easy to understand and worth bringing into your
          routine.
        </p>

        <Link to="/about" className="whyLink">
          Discover our story
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="whyGrid">
        {values.map((value) => (
          <article className="whyCard" key={value.number}>
            <span className="whyNumber">{value.number}</span>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WhyMapleMain;