import { Link } from "react-router";
import ProductCard from "../ProductCard/ProductCard";
import { useCart } from "../../context/CartContext.jsx";
import { products } from "../../data/products.js";
import "./FeaturedProducts.css";

function FeaturedProducts() {
  const { addItem } = useCart();

  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 4);

  function handleQuickAdd(product) {
    const defaultColor = product.colors?.[0] ?? "";

    addItem(product, 1, defaultColor);
  }

  return (
    <section
      className="featuredProductsSection"
      id="featured-products"
    >
      <div className="featuredProductsHeader">
        <div>
          <span>CURATED FAVORITES</span>

          <h2>Featured Products</h2>

          <p>
            Practical, carefully selected products designed to make everyday
            life easier.
          </p>
        </div>

        <Link className="viewAllProducts" to="/shop">
          View all products
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="productsGrid">
        {featuredProducts.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            onQuickAdd={handleQuickAdd}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;