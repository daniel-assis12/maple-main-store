import { useEffect } from "react";
import { Link } from "react-router";

import { useCart } from "../../context/CartContext.jsx";

import "./CartDrawer.css";

function formatCurrency(value) {
  const numericValue = Number(value) || 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericValue);
}

function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,

    isCartOpen,
    isLoading,
    isUpdating,
    error,

    closeCart,
    incrementItem,
    decrementItem,
    removeItem,
    emptyCart,
    checkout,
  } = useCart();

  useEffect(() => {
    if (!isCartOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeCart();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isCartOpen, closeCart]);

  async function handleIncrement(item) {
    try {
      await incrementItem(
        item.lineItemId ?? item.id,
      );
    } catch {
      // O erro já é exibido pelo CartContext.
    }
  }

  async function handleDecrement(item) {
    try {
      await decrementItem(
        item.lineItemId ?? item.id,
      );
    } catch {
      // O erro já é exibido pelo CartContext.
    }
  }

  async function handleRemove(item) {
    try {
      await removeItem(
        item.lineItemId ?? item.id,
      );
    } catch {
      // O erro já é exibido pelo CartContext.
    }
  }

  async function handleClearCart() {
    try {
      await emptyCart();
    } catch {
      // O erro já é exibido pelo CartContext.
    }
  }

  async function handleCheckout() {
    try {
      await checkout();
    } catch {
      // O erro já é exibido pelo CartContext.
    }
  }

  return (
    <>
      <div
        className={`mmCartOverlay ${
          isCartOpen ? "isVisible" : ""
        }`}
        aria-hidden="true"
        onClick={closeCart}
      />

      <aside
        className={`mmCartDrawer ${
          isCartOpen ? "isOpen" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isCartOpen}
        aria-labelledby="mm-cart-title"
      >
        <header className="mmCartHeader">
          <div>
            <span>YOUR SELECTION</span>

            <h2 id="mm-cart-title">
              Shopping Cart
            </h2>
          </div>

          <button
            className="mmCartClose"
            type="button"
            aria-label="Close shopping cart"
            onClick={closeCart}
          >
            ×
          </button>
        </header>

        <div className="mmCartStatus">
          <span>
            {itemCount}{" "}
            {itemCount === 1 ? "item" : "items"}
          </span>

          {items.length > 0 && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleClearCart}
            >
              Clear cart
            </button>
          )}
        </div>

        {error && (
          <div
            className="mmCartError"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mmCartBody">
          {isLoading ? (
            <div className="mmCartLoading">
              <span className="mmCartSpinner" />

              <p>Loading your cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="mmCartEmpty">
              <span
                className="mmCartEmptyIcon"
                aria-hidden="true"
              >
                ♧
              </span>

              <h3>Your cart is empty</h3>

              <p>
                Explore our thoughtfully selected
                collection and find something useful
                for your everyday routine.
              </p>

              <Link
                to="/shop"
                onClick={closeCart}
              >
                Explore the collection
              </Link>
            </div>
          ) : (
            <div className="mmCartItems">
              {items.map((item) => {
                const product = item.product ?? {};
                const itemId =
                  item.lineItemId ?? item.id;

                return (
                  <article
                    className="mmCartItem"
                    key={itemId}
                  >
                    <Link
                      className={`mmCartItemImage ${
                        product.imageClass ?? ""
                      }`}
                      to={
                        product.slug
                          ? `/product/${product.slug}`
                          : "/shop"
                      }
                      onClick={closeCart}
                      aria-label={`View ${
                        product.name ??
                        "product"
                      }`}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={
                            product.name ??
                            "Product"
                          }
                        />
                      ) : (
                        <span>
                          Maple
                          <br />
                          &amp; Main
                        </span>
                      )}
                    </Link>

                    <div className="mmCartItemContent">
                      <div className="mmCartItemTop">
                        <div>
                          <Link
                            className="mmCartItemName"
                            to={
                              product.slug
                                ? `/product/${product.slug}`
                                : "/shop"
                            }
                            onClick={closeCart}
                          >
                            {product.name ??
                              "Maple & Main Product"}
                          </Link>

                          {item.selectedColor &&
                            item.selectedColor !==
                              "Standard" && (
                              <p className="mmCartItemOption">
                                {
                                  item.selectedColor
                                }
                              </p>
                            )}
                        </div>

                        <button
                          className="mmCartRemove"
                          type="button"
                          disabled={isUpdating}
                          aria-label={`Remove ${
                            product.name ??
                            "product"
                          }`}
                          onClick={() =>
                            handleRemove(item)
                          }
                        >
                          ×
                        </button>
                      </div>

                      <div className="mmCartItemBottom">
                        <div
                          className="mmCartQuantity"
                          aria-label="Product quantity"
                        >
                          <button
                            type="button"
                            disabled={isUpdating}
                            aria-label="Decrease quantity"
                            onClick={() =>
                              handleDecrement(item)
                            }
                          >
                            −
                          </button>

                          <span aria-live="polite">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            disabled={isUpdating}
                            aria-label="Increase quantity"
                            onClick={() =>
                              handleIncrement(item)
                            }
                          >
                            +
                          </button>
                        </div>

                        <strong>
                          {formatCurrency(
                            item.lineTotal ??
                              item.unitPrice *
                                item.quantity,
                          )}
                        </strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <footer className="mmCartFooter">
            <div className="mmCartSubtotal">
              <div>
                <span>Subtotal</span>

                <small>
                  Shipping and taxes are calculated
                  at checkout.
                </small>
              </div>

              <strong>
                {formatCurrency(subtotal)}
              </strong>
            </div>

            <button
              className="mmCartCheckout"
              type="button"
              disabled={
                isUpdating ||
                isLoading ||
                items.length === 0
              }
              onClick={handleCheckout}
            >
              {isUpdating
                ? "Processing..."
                : "Secure Checkout"}
            </button>

            <button
              className="mmCartContinue"
              type="button"
              onClick={closeCart}
            >
              Continue shopping
            </button>

            <div className="mmCartAssurances">
              <span>Secure checkout</span>
              <span>Wix protected</span>
              <span>Customer support</span>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;