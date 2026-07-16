import { Link } from "react-router";
import "./ProductCard.css";

function ProductCard({ product, onQuickAdd }) {
  const displayedPrice =
    product.formattedPrice || `$${product.price.toFixed(2)}`;

  return (
    <article className="catalogProductCard">
      <Link
        className={`catalogProductImage ${product.imageClass}`}
        to={`/product/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <span className="catalogImageLabel">
            Product image coming soon
          </span>
        )}

        {product.badge && (
          <span className="catalogProductBadge">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="catalogProductInfo">
        <p className="catalogProductCategory">
          {product.category}
        </p>

        <Link
          className="catalogProductName"
          to={`/product/${product.slug}`}
        >
          {product.name}
        </Link>

        {product.reviewCount > 0 ? (
          <div className="catalogProductRating">
            <span aria-hidden="true">★★★★★</span>

            <small>
              {product.rating.toFixed(1)} ({product.reviewCount})
            </small>
          </div>
        ) : (
          <div className="catalogProductRating">
            <small>New product</small>
          </div>
        )}

        <p className="catalogProductDescription">
          {product.shortDescription}
        </p>

        <div className="catalogProductBottom">
          <div className="catalogProductPrice">
            <strong>{displayedPrice}</strong>

            {product.compareAtPrice && (
              <span>
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => onQuickAdd(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.inStock ? "Quick Add" : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;