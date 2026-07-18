import { useState } from "react";
import { useCatalog } from "../../context/CatalogContext.jsx";

import {
  addProductToWixCart,
  clearWixCart,
  getCurrentWixCart,
} from "../../services/wixCartService.js";

function extractCart(response) {
  return (
    response?.cart ??
    response?.currentCart ??
    response ??
    null
  );
}

function WixCartTestPage() {
  const {
    products,
    isLoading: isCatalogLoading,
  } = useCatalog();

  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState(
    "The Wix cart has not been tested yet.",
  );
  const [isWorking, setIsWorking] = useState(false);

  async function readCart() {
    try {
      setIsWorking(true);
      setMessage("Reading Wix cart...");

      const response = await getCurrentWixCart();
      const currentCart = extractCart(response);

      console.log("Current Wix cart:", currentCart);

      setCart(currentCart);

      const itemTotal =
        currentCart?.lineItems?.length ?? 0;

      setMessage(
        itemTotal > 0
          ? "Existing Wix cart loaded."
          : "There is no active Wix cart yet.",
      );
    } catch (error) {
      console.error("Read Wix cart error:", error);

      setCart(null);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to read the Wix cart.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function addFirstProduct() {
   const firstProduct =
  products.find(
    (product) =>
      (product.wixProduct?.productOptions?.length ?? 0) === 0,
  ) ?? products[0];

    if (!firstProduct) {
      setMessage(
        "No Wix product is available for the test.",
      );
      return;
    }

    try {
      setIsWorking(true);

      setMessage(
        `Adding ${firstProduct.name} to the Wix cart...`,
      );

      console.log(
        "Product sent to Wix cart:",
        firstProduct,
      );

      const response = await addProductToWixCart(
        firstProduct,
        1,
        firstProduct.colors?.[0] ?? "",
      );

      console.log(
        "Complete add-to-cart response:",
        response,
      );

      const updatedCart = extractCart(response);

      setCart(updatedCart);

      const itemTotal =
        updatedCart?.lineItems?.length ?? 0;

      setMessage(
        itemTotal > 0
          ? `${firstProduct.name} was added to the real Wix cart.`
          : "Wix answered the request, but no cart item was returned. Check the browser Console.",
      );
    } catch (error) {
      console.error(
        "Complete Wix add-to-cart error:",
        error,
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add the product.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function deleteCart() {
    try {
      setIsWorking(true);
      setMessage("Clearing the Wix cart...");

      await clearWixCart();

      setCart(null);
      setMessage("The Wix cart was cleared.");
    } catch (error) {
      console.error("Clear Wix cart error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to clear the Wix cart.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  const lineItems = cart?.lineItems ?? [];

  return (
    <section
      style={{
        width: "min(900px, calc(100% - 40px))",
        minHeight: "65vh",
        margin: "0 auto",
        padding: "80px 0",
      }}
    >
      <p
        style={{
          marginBottom: "12px",
          color: "#4c6760",
          fontSize: "11px",
          fontWeight: "800",
          letterSpacing: "2px",
        }}
      >
        WIX ECOMMERCE TEST
      </p>

      <h1
        style={{
          marginBottom: "18px",
          fontFamily: "Georgia, serif",
          fontSize: "50px",
          fontWeight: "500",
        }}
      >
        Real Wix cart
      </h1>

      <p
        style={{
          marginBottom: "30px",
          lineHeight: "1.7",
        }}
      >
        {message}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "40px",
        }}
      >
        <button
          type="button"
          disabled={isWorking}
          onClick={readCart}
        >
          Read Wix Cart
        </button>

        <button
          type="button"
          disabled={
            isWorking ||
            isCatalogLoading ||
            products.length === 0
          }
          onClick={addFirstProduct}
        >
          Add First Product
        </button>

        <button
          type="button"
          disabled={isWorking}
          onClick={deleteCart}
        >
          Clear Wix Cart
        </button>
      </div>

      <div>
        <h2
          style={{
            marginBottom: "18px",
            fontFamily: "Georgia, serif",
            fontSize: "30px",
          }}
        >
          Cart items: {lineItems.length}
        </h2>

        {lineItems.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {lineItems.map((item, index) => (
              <article
                key={item._id ?? `cart-item-${index}`}
                style={{
                  padding: "18px",
                  border: "1px solid #ded8d0",
                }}
              >
                <strong>
                  {item.productName?.original ??
                    item.productName?.translated ??
                    item.descriptionLines?.[0]?.name?.original ??
                    "Wix product"}
                </strong>

                <p>Quantity: {item.quantity ?? 0}</p>

                <p>
                  Line item ID: {item._id ?? "Unavailable"}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p>The cart has no products.</p>
        )}
      </div>
    </section>
  );
}

export default WixCartTestPage;