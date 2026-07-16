import { Link } from "react-router";
import { useCart } from "../../context/CartContext.jsx";
import "./CartDrawer.css";

function CartDrawer() {
  const {
    items,
    isOpen,
    subtotal,
    closeCart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  return (
    <>
      <div
        className={`cartOverlay ${isOpen ? "isVisible" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={`cartDrawer ${isOpen ? "isOpen" : ""}`}
        aria-hidden={!isOpen}
        aria-label="Shopping cart"
      >
        <div className="cartDrawerHeader">
          <div>
            <span>Your cart</span>
            <small>
              {items.length === 0
                ? "No items yet"
                : `${items.length} product${items.length > 1 ? "s" : ""}`}
            </small>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="emptyCart">
            <span aria-hidden="true">🛍️</span>
            <h2>Your cart is empty</h2>
            <p>
              Explore our curated collection and add something useful to your
              routine.
            </p>

            <Link to="/shop" onClick={closeCart}>
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="cartItems">
              {items.map((item) => (
                <article className="cartItem" key={item.cartItemId}>
                  <div
                    className={`cartItemImage ${item.imageClass}`}
                    aria-hidden="true"
                  />

                  <div className="cartItemInfo">
                    <div className="cartItemTop">
                      <div>
                        <p>{item.category}</p>
                        <h3>{item.name}</h3>

                        {item.selectedColor && (
                          <span>Color: {item.selectedColor}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.cartItemId)}
                        aria-label={`Remove ${item.name}`}
                      >
                        ×
                      </button>
                    </div>

                    <div className="cartItemBottom">
                      <div className="cartItemQuantity">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item.cartItemId)
                          }
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item.cartItemId)
                          }
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>

                      <strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="cartDrawerFooter">
              <div className="cartSubtotal">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>

              <p>
                Shipping and taxes will be calculated at checkout.
              </p>

              <button
                className="checkoutButton"
                type="button"
                onClick={() => {
                  window.alert(
                    "Wix checkout will be connected before launch.",
                  );
                }}
              >
                Proceed to Checkout
              </button>

              <button
                className="clearCartButton"
                type="button"
                onClick={clearCart}
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;