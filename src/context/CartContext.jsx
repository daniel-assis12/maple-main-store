import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useCatalog } from "./CatalogContext.jsx";

import {
  addProductToWixCart,
  clearWixCart,
  getCurrentWixCart,
  removeWixCartItem,
  startWixCheckout,
  updateWixCartQuantity,
} from "../services/wixCartService.js";

const CartContext = createContext(null);

function extractText(value, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  return (
    value?.original ??
    value?.translated ??
    value?.value ??
    fallback
  );
}

function extractNumber(value) {
  const rawValue =
    value?.amount ??
    value?.value ??
    value ??
    0;

  const numericValue = Number(rawValue);

  return Number.isFinite(numericValue)
    ? numericValue
    : 0;
}

function extractImageUrl(lineItem, fallback = "") {
  return (
    lineItem?.image?.url ??
    lineItem?.media?.url ??
    lineItem?.media?.mainMedia?.image?.url ??
    fallback
  );
}

function extractSelectedOption(lineItem) {
  const descriptionLines =
    lineItem?.descriptionLines ?? [];

  const selectedValues = descriptionLines
    .map((descriptionLine) =>
      extractText(
        descriptionLine?.colorInfo?.original ??
          descriptionLine?.plainText?.original ??
          descriptionLine?.name,
      ),
    )
    .filter(Boolean);

  return selectedValues.join(", ");
}

function normalizeWixCart(
  wixCart,
  catalogProducts,
) {
  const lineItems = wixCart?.lineItems ?? [];

  return lineItems.map((lineItem, index) => {
    const catalogItemId =
      lineItem?.catalogReference?.catalogItemId ??
      lineItem?.catalogItemId ??
      "";

    const catalogProduct =
      catalogProducts.find(
        (product) =>
          product.wixId === catalogItemId ||
          product.id === catalogItemId,
      ) ?? null;

    const productName =
      extractText(
        lineItem?.productName,
        catalogProduct?.name ?? "Maple & Main Product",
      );

    const unitPrice =
      extractNumber(
        lineItem?.price ??
          lineItem?.priceAfterDiscounts ??
          lineItem?.fullPrice,
      ) || catalogProduct?.price || 0;

    const quantity =
      Math.max(
        1,
        Number(lineItem?.quantity) || 1,
      );

    const product = catalogProduct ?? {
      id: catalogItemId || lineItem?._id,
      wixId: catalogItemId,
      slug: "",
      name: productName,
      price: unitPrice,
      formattedPrice:
        lineItem?.price?.formattedAmount ??
        `$${unitPrice.toFixed(2)}`,
      image: extractImageUrl(lineItem),
      colors: ["Standard"],
      imageClass: "productImageHome",
      inStock: true,
    };

    return {
      id:
        lineItem?._id ??
        `wix-cart-item-${index}`,

      lineItemId:
        lineItem?._id ??
        `wix-cart-item-${index}`,

      catalogItemId,

      product: {
        ...product,
        name: productName,
        price: unitPrice,
        image: extractImageUrl(
          lineItem,
          product.image,
        ),
      },

      quantity,

      selectedColor:
        extractSelectedOption(lineItem) ||
        product.colors?.[0] ||
        "Standard",

      unitPrice,

      lineTotal:
        unitPrice * quantity,

      wixLineItem: lineItem,
    };
  });
}

export function CartProvider({ children }) {
  const { products } = useCatalog();

  const [wixCart, setWixCart] = useState(null);
  const [isCartOpen, setIsCartOpen] =
    useState(false);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isUpdating, setIsUpdating] =
    useState(false);
  const [error, setError] = useState("");

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const currentCart =
        await getCurrentWixCart();

      setWixCart(currentCart);
      return currentCart;
    } catch (cartError) {
      console.error(
        "Unable to load Wix cart:",
        cartError,
      );

      setWixCart(null);
      setError(
        cartError instanceof Error
          ? cartError.message
          : "Unable to load the shopping cart.",
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const items = useMemo(
    () => normalizeWixCart(wixCart, products),
    [wixCart, products],
  );

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.lineTotal,
        0,
      ),
    [items],
  );

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  function toggleCart() {
    setIsCartOpen((currentValue) => !currentValue);
  }

  async function addItem(
    product,
    quantity = 1,
    selectedOption = "",
  ) {
    try {
      setIsUpdating(true);
      setError("");

      const updatedCart =
        await addProductToWixCart(
          product,
          quantity,
          selectedOption,
        );

      setWixCart(updatedCart);
      setIsCartOpen(true);

      return updatedCart;
    } catch (cartError) {
      console.error(
        "Unable to add product to Wix cart:",
        cartError,
      );

      setError(
        cartError instanceof Error
          ? cartError.message
          : "Unable to add this product to the cart.",
      );

      throw cartError;
    } finally {
      setIsUpdating(false);
    }
  }

  async function updateQuantity(
    itemId,
    quantity,
  ) {
    const normalizedQuantity =
      Number(quantity);

    if (
      !Number.isFinite(normalizedQuantity) ||
      normalizedQuantity < 1
    ) {
      return removeItem(itemId);
    }

    try {
      setIsUpdating(true);
      setError("");

      const updatedCart =
        await updateWixCartQuantity(
          itemId,
          normalizedQuantity,
        );

      setWixCart(updatedCart);

      return updatedCart;
    } catch (cartError) {
      console.error(
        "Unable to update Wix cart quantity:",
        cartError,
      );

      setError(
        cartError instanceof Error
          ? cartError.message
          : "Unable to update the product quantity.",
      );

      throw cartError;
    } finally {
      setIsUpdating(false);
    }
  }

  async function incrementItem(itemId) {
    const item = items.find(
      (cartItem) =>
        cartItem.id === itemId ||
        cartItem.lineItemId === itemId,
    );

    if (!item) {
      return;
    }

    return updateQuantity(
      item.lineItemId,
      item.quantity + 1,
    );
  }

  async function decrementItem(itemId) {
    const item = items.find(
      (cartItem) =>
        cartItem.id === itemId ||
        cartItem.lineItemId === itemId,
    );

    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
      return removeItem(item.lineItemId);
    }

    return updateQuantity(
      item.lineItemId,
      item.quantity - 1,
    );
  }

  async function removeItem(itemId) {
    try {
      setIsUpdating(true);
      setError("");

      const updatedCart =
        await removeWixCartItem(itemId);

      setWixCart(updatedCart);

      return updatedCart;
    } catch (cartError) {
      console.error(
        "Unable to remove Wix cart item:",
        cartError,
      );

      setError(
        cartError instanceof Error
          ? cartError.message
          : "Unable to remove this product.",
      );

      throw cartError;
    } finally {
      setIsUpdating(false);
    }
  }

  async function emptyCart() {
    try {
      setIsUpdating(true);
      setError("");

      await clearWixCart();

      setWixCart(null);
    } catch (cartError) {
      console.error(
        "Unable to clear Wix cart:",
        cartError,
      );

      setError(
        cartError instanceof Error
          ? cartError.message
          : "Unable to clear the shopping cart.",
      );

      throw cartError;
    } finally {
      setIsUpdating(false);
    }
  }

  async function checkout() {
    if (items.length === 0) {
      setError(
        "Add at least one product before checkout.",
      );
      return;
    }

    try {
      setIsUpdating(true);
      setError("");

      await startWixCheckout();
    } catch (checkoutError) {
      console.error(
        "Unable to start Wix checkout:",
        checkoutError,
      );

      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start secure checkout.",
      );

      throw checkoutError;
    } finally {
      setIsUpdating(false);
    }
  }

  const value = useMemo(
    () => ({
      cart: wixCart,
      items,
      itemCount,
      subtotal,

      isCartOpen,
      isLoading,
      isUpdating,
      error,

      openCart,
      closeCart,
      toggleCart,

      addItem,
      removeItem,
      updateQuantity,
      incrementItem,
      decrementItem,

      clearCart: emptyCart,
      emptyCart,
      refreshCart,

      checkout,
      startCheckout: checkout,
    }),
    [
      wixCart,
      items,
      itemCount,
      subtotal,
      isCartOpen,
      isLoading,
      isUpdating,
      error,
      refreshCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}