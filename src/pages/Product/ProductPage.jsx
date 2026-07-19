import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import Benefits from "../../components/Benefits/Benefits";
import PageMeta from "../../components/PageMeta/PageMeta";
import ProductCard from "../../components/ProductCard/ProductCard";

import {
  useCart,
} from "../../context/CartContext.jsx";

import {
  useCatalog,
} from "../../context/CatalogContext.jsx";

import "./ProductPage.css";

function ProductPage() {
  const { slug } = useParams();

  const {
    addItem,
    isUpdating,
  } = useCart();

  const {
    products,
    getProductBySlug,
    isLoading,
  } = useCatalog();

  const product =
    getProductBySlug(slug);

  const [quantity, setQuantity] =
    useState(1);

  const [
    selectedOption,
    setSelectedOption,
  ] = useState("");

  const [
    selectedImageIndex,
    setSelectedImageIndex,
  ] = useState(0);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    setQuantity(1);
    setSelectedImageIndex(0);
    setMessage("");

    setSelectedOption(
      product?.colors?.[0] ??
        "Standard",
    );
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    const sameCategory =
      products.filter(
        (candidate) =>
          candidate.id !== product.id &&
          candidate.category ===
            product.category,
      );

    const otherProducts =
      products.filter(
        (candidate) =>
          candidate.id !== product.id &&
          candidate.category !==
            product.category,
      );

    return [
      ...sameCategory,
      ...otherProducts,
    ].slice(0, 3);
  }, [product, products]);

  if (isLoading) {
    return (
      <section className="missingProduct">
        <span>MAPLE &amp; MAIN</span>

        <h1>Loading product...</h1>

        <p>
          We are retrieving the latest
          product information.
        </p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="missingProduct">
        <PageMeta
          title="Product Not Found"
        />

        <span>PRODUCT NOT FOUND</span>

        <h1>
          This product is no longer
          available.
        </h1>

        <p>
          The address may be incorrect or
          the product may have been removed.
        </p>

        <Link to="/shop">
          Return to the collection
        </Link>
      </section>
    );
  }

  const galleryImages =
    product.images?.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const selectedImage =
    galleryImages[selectedImageIndex] ??
    product.image ??
    "";

  const displayedPrice =
    product.formattedPrice ??
    `$${product.price.toFixed(2)}`;

  async function handleAddToCart() {
    if (!product.inStock) {
      setMessage(
        "This product is currently unavailable.",
      );

      return;
    }

    try {
      setMessage("");

      await addItem(
        product,
        quantity,
        selectedOption,
      );

      setMessage(
        `${quantity} × ${product.name} was added to your cart.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add this product to the cart.",
      );
    }
  }

  async function handleRelatedQuickAdd(
    relatedProduct,
  ) {
    try {
      setMessage("");

      await addItem(
        relatedProduct,
        1,
        relatedProduct.colors?.[0] ??
          "Standard",
      );

      setMessage(
        `${relatedProduct.name} was added to your cart.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add this product to the cart.",
      );
    }
  }

  return (
    <>
      <PageMeta
        title={product.name}
        description={
          product.shortDescription
        }
      />

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
            className={`productMainImage ${
              product.imageClass ?? ""
            }`}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
              />
            ) : (
              <p>
                Product photography will
                be added here
              </p>
            )}

            {product.badge && (
              <span>{product.badge}</span>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div
              className="productThumbnails"
              aria-label="Product gallery"
            >
              {galleryImages.map(
                (image, index) => (
                  <button
                    className={
                      selectedImageIndex ===
                      index
                        ? "isSelected"
                        : ""
                    }
                    type="button"
                    key={`${image}-${index}`}
                    aria-label={`View product image ${
                      index + 1
                    }`}
                    onClick={() =>
                      setSelectedImageIndex(
                        index,
                      )
                    }
                  >
                    <img
                      src={image}
                      alt=""
                    />
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        <div className="productDetailsContent">
          <p className="productDetailCategory">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="productDetailPrice">
            <strong>
              {displayedPrice}
            </strong>

            {product.compareAtPrice && (
              <span>
                $
                {product.compareAtPrice.toFixed(
                  2,
                )}
              </span>
            )}
          </div>

          <div
            className="productDetailDescription"
            dangerouslySetInnerHTML={{
              __html:
                product.description,
            }}
          />

          {product.colors?.length > 0 && (
            <div className="productColorSelection">
              <div>
                <strong>
                  Product option
                </strong>

                <span>
                  {selectedOption}
                </span>
              </div>

              <div className="productColorOptions">
                {product.colors.map(
                  (option) => (
                    <button
                      className={
                        selectedOption ===
                        option
                          ? "isSelected"
                          : ""
                      }
                      type="button"
                      key={option}
                      onClick={() =>
                        setSelectedOption(
                          option,
                        )
                      }
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="productPurchaseRow">
            <div className="quantitySelector">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={isUpdating}
                onClick={() =>
                  setQuantity(
                    (current) =>
                      Math.max(
                        1,
                        current - 1,
                      ),
                  )
                }
              >
                −
              </button>

              <span aria-live="polite">
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                disabled={isUpdating}
                onClick={() =>
                  setQuantity(
                    (current) =>
                      current + 1,
                  )
                }
              >
                +
              </button>
            </div>

            <button
              className="productAddButton"
              type="button"
              disabled={
                !product.inStock ||
                isUpdating
              }
              onClick={handleAddToCart}
            >
              {!product.inStock
                ? "Out of Stock"
                : isUpdating
                  ? "Adding..."
                  : `Add to Cart · $${(
                      product.price *
                      quantity
                    ).toFixed(2)}`}
            </button>
          </div>

          {message && (
            <p
              className="productCartMessage"
              role="status"
            >
              {message}
            </p>
          )}

          <ul className="productBenefitsList">
            {product.benefits.map(
              (benefit) => (
                <li key={benefit}>
                  {benefit}
                </li>
              ),
            )}
          </ul>

          <div className="productAssurances">
            <p>
              <strong>
                Secure checkout
              </strong>

              <span>
                Protected by the Wix
                eCommerce platform
              </span>
            </p>

            <p>
              <strong>
                Live availability
              </strong>

              <span>
                Synchronized with our Wix
                product catalog
              </span>
            </p>

            <p>
              <strong>
                Customer support
              </strong>

              <span>
                hello@maplemainshop.com
              </span>
            </p>
          </div>
        </div>
      </section>

      <Benefits />

      {relatedProducts.length > 0 && (
        <section className="relatedProducts">
          <div className="relatedProductsHeader">
            <span>
              YOU MAY ALSO LIKE
            </span>

            <h2>
              Complete your routine
            </h2>
          </div>

          <div className="relatedProductsGrid">
            {relatedProducts.map(
              (relatedProduct) => (
                <ProductCard
                  product={
                    relatedProduct
                  }
                  key={
                    relatedProduct.id
                  }
                  onQuickAdd={
                    handleRelatedQuickAdd
                  }
                />
              ),
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default ProductPage;