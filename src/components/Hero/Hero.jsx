import { Link } from "react-router";
import heroImage from "../../assets/hero.png";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="heroContent">
        <span className="heroBadge">
          CURATED FOR EVERYDAY LIVING
        </span>

        <h1>
          Everyday
          <br />
          Essentials.
          <br />
          Elevated Living.
        </h1>

        <p>
          Carefully selected products that combine style, functionality and
          comfort for your home, routine and everyday life.
        </p>

        <div className="heroButtons">
          <Link className="primary" to="/shop">
            Shop Collection
          </Link>

          <Link className="secondary" to="/shop">
            Best Sellers
          </Link>
        </div>
      </div>

      <div className="heroImage">
        <img
          src={heroImage}
          alt="Curated Maple and Main home and lifestyle products"
        />
      </div>
    </section>
  );
}

export default Hero;