import { Link } from "react-router";
import featuredImage from "../../assets/featured.png";
import "./FeaturedStory.css";

function FeaturedStory() {
  return (
    <section className="featuredStory">
      <div className="featuredStoryImage">
        <img
          src={featuredImage}
          alt="Featured Maple and Main product"
        />
      </div>

      <div className="featuredStoryContent">
        <span className="featuredEyebrow">
          THIS WEEK&apos;S FEATURED PICK
        </span>

        <h2>
          One smart product.
          <br />
          A better everyday routine.
        </h2>

        <p>
          Our featured products are selected because they solve practical
          everyday problems without adding unnecessary complexity.
        </p>

        <ul>
          <li>Designed for everyday use</li>
          <li>Simple, practical and easy to understand</li>
          <li>Carefully selected for usefulness</li>
          <li>Supported by secure checkout</li>
        </ul>

        <div className="featuredStoryActions">
          <Link
            className="featuredPrimary"
            to="/product/everyday-home-organizer"
          >
            Discover the Product
          </Link>

          <Link className="featuredSecondary" to="/shop">
            See All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedStory;