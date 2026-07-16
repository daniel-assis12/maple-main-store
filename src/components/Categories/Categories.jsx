import { Link } from "react-router";
import "./Categories.css";

const categories = [
  {
    name: "Home",
    description: "Smart essentials for organized and comfortable spaces.",
    className: "categoryHome",
    category: "Home",
  },
  {
    name: "Beauty & Wellness",
    description: "Simple tools designed for better daily routines.",
    className: "categoryBeauty",
    category: "Beauty & Wellness",
  },
  {
    name: "Tech & Everyday Carry",
    description: "Practical products made for life on the move.",
    className: "categoryTech",
    category: "Tech & Everyday Carry",
  },
];

function Categories() {
  return (
    <section className="categoriesSection" id="categories">
      <div className="categoriesHeader">
        <span>EXPLORE THE COLLECTION</span>

        <h2>Shop by Category</h2>

        <p>
          Thoughtfully selected products for your home, personal care and
          everyday life.
        </p>
      </div>

      <div className="categoriesGrid">
        {categories.map((category) => (
          <Link
            className={`categoryCard ${category.className}`}
            to={`/shop?category=${encodeURIComponent(category.category)}`}
            key={category.name}
          >
            <div className="categoryOverlay" />

            <div className="categoryContent">
              <p>{category.description}</p>

              <h3>{category.name}</h3>

              <span className="categoryLink">
                Explore category
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;