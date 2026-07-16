import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Benefits from "../../components/Benefits/Benefits";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  getProductBySlug,
  products,
} from "../../data/products.js";
import "./ProductPage.css";
import { useCart } from "../../context/CartContext.jsx";

function ProductPage() {
  const { addItem } = useCart();
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] ?? "",
  );
  const [message, setMessage] = useState("");

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter(
        (candidate) =>
          candidate.id !== product.id &&
          candidate.category === product.category,
      )
      .slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <section className="missingProduct">
        <span>PRODUCT NOT FOUND</span>
        <h1>This product is no longer available.</h1>
        <p>
          The address may be incorrect or the product may have been removed.
        </p>
        <Link to="/shop">Return to the collection</Link>
      </section>
    );
  }

 function handleAddToCart() {
  addItem(product, quantity, selectedColor);

  setMessage(
    `${quantity} × ${product.name} was added to your cart.`,
  );
}

  return (
    <>
      <div className="productBreadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <section className="productDetail">
        <div className="productGallery">
          <div
            className={`productMainImage ${product.imageClass}`}
            role="img"
            aria-label={`${product.name} product image placeholder`}
          >
            <span>{product.badge}</span>
            <p>Product photography will be added here</p>
          </div>

          <div className="productThumbnails" aria-label="Product gallery">
            {[1, 2, 3].map((thumbnail) => (
              <button
                type="button"
                key={thumbnail}
                aria-label={`View product image ${thumbnail}`}
              >
                {thumbnail}
              </button>
            ))}
          </div>
        </div>

        <div className="productDetailsContent">
          <p className="productDetailCategory">{product.category}</p>

          <h1>{product.name}</h1>

          <div className="productDetailRating">
            <span aria-hidden="true">★★★★★</span>

            <p>
              {product.rating.toFixed(1)} ·{" "}
              {product.reviewCount > 0
                ? `${product.reviewCount} verified reviews`
                : "New product — reviews coming soon"}
            </p>
          </div>

          <div className="productDetailPrice">
            <strong>${product.price.toFixed(2)}</strong>
            <span>${product.compareAtPrice.toFixed(2)}</span>
          </div>

          <p className="productDetailDescription">
            {product.description}
          </p>

          <div className="productColorSelection">
            <div>
              <strong>Color</strong>
              <span>{selectedColor}</span>
            </div>

            <div className="productColorOptions">
              {product.colors.map((color) => (
                <button
                  className={selectedColor === color ? "isSelected" : ""}
                  type="button"
                  key={color}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="productPurchaseRow">
            <div className="quantitySelector">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
              >
                −
              </button>

              <span aria-live="polite">{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((current) => current + 1)}
              >
                +
              </button>
            </div>

            <button
              className="productAddButton"
              type="button"
              onClick={handleAddToCart}
            >
              Add to Cart · ${(product.price * quantity).toFixed(2)}
            </button>
          </div>

          {message && (
            <p className="productCartMessage" role="status">
              {message}
            </p>
          )}

          <ul className="productBenefitsList">
            {product.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>

          <div className="productAssurances">
            <p>
              <strong>Free shipping</strong>
              <span>On qualifying U.S. orders</span>
            </p>

            <p>
              <strong>Secure checkout</strong>
              <span>Protected Wix checkout before launch</span>
            </p>

            <p>
              <strong>30-day guarantee</strong>
              <span>Final conditions will be shown before purchase</span>
            </p>
          </div>
        </div>
      </section>

      <Benefits />

      {relatedProducts.length > 0 && (
        <section className="relatedProducts">
          <div className="relatedProductsHeader">
            <span>YOU MAY ALSO LIKE</span>
            <h2>Complete your routine</h2>
          </div>

          <div className="relatedProductsGrid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                product={relatedProduct}
                key={relatedProduct.id}
              onQuickAdd={() => {
  addItem(
    relatedProduct,
    1,
    relatedProduct.colors?.[0] ?? "",
  );

  setMessage(
    `${relatedProduct.name} was added to your cart.`,
  );
}}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default ProductPage;