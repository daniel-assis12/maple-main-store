import { Link } from "react-router";
import "./ProductCard.css";

function ProductCard({ product, onQuickAdd }) {
  return (
    <article className="catalogProductCard">
      <Link
        className={`catalogProductImage ${product.imageClass}`}
        to={`/product/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        {product.badge && (
          <span className="catalogProductBadge">{product.badge}</span>
        )}

        <span className="catalogImageLabel">Product image coming soon</span>
      </Link>

      <div className="catalogProductInfo">
        <p className="catalogProductCategory">{product.category}</p>

        <Link
          className="catalogProductName"
          to={`/product/${product.slug}`}
        >
          {product.name}
        </Link>

        <div className="catalogProductRating">
          <span aria-hidden="true">★★★★★</span>

          <small>
            {product.rating.toFixed(1)}
            {product.reviewCount > 0
              ? ` (${product.reviewCount})`
              : " • New product"}
          </small>
        </div>

        <p className="catalogProductDescription">
          {product.shortDescription}
        </p>

        <div className="catalogProductBottom">
          <div className="catalogProductPrice">
            <strong>${product.price.toFixed(2)}</strong>

            <span>${product.compareAtPrice.toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            Quick Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;