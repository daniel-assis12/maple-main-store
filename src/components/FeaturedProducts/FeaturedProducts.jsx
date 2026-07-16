import { Link } from "react-router";
import ProductCard from "../ProductCard/ProductCard";
import { useCart } from "../../context/CartContext.jsx";
import { useCatalog } from "../../context/CatalogContext.jsx";
import "./FeaturedProducts.css";

function FeaturedProducts() {
  const { addItem } = useCart();
  const { products, isLoading, source } = useCatalog();

  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 4);

  function handleQuickAdd(product) {
    addItem(
      product,
      1,
      product.colors?.[0] ?? "Standard",
    );
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

      {isLoading ? (
        <div className="featuredProductsLoading">
          Loading our collection...
        </div>
      ) : (
        <div className="productsGrid">
          {featuredProducts.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      )}

      {source === "local" && !isLoading && (
        <p className="catalogSourceNotice">
          Demonstration products are temporarily being displayed.
        </p>
      )}
    </section>
  );
}

export default FeaturedProducts;