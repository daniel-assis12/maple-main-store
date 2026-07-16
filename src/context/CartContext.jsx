import {
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react";

const CartContext = createContext(null);

const initialState = {
  items: [],
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const incomingItem = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.id === incomingItem.id &&
          item.selectedColor === incomingItem.selectedColor,
      );

      if (existingItem) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((item) =>
            item.id === incomingItem.id &&
            item.selectedColor === incomingItem.selectedColor
              ? {
                  ...item,
                  quantity: item.quantity + incomingItem.quantity,
                }
              : item,
          ),
        };
      }

      return {
        ...state,
        isOpen: true,
        items: [...state.items, incomingItem],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.cartItemId !== action.payload,
        ),
      };

    case "INCREASE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.cartItemId === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.cartItemId === action.payload
              ? {
                  ...item,
                  quantity: Math.max(0, item.quantity - 1),
                }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };

    case "OPEN_CART":
      return {
        ...state,
        isOpen: true,
      };

    case "CLOSE_CART":
      return {
        ...state,
        isOpen: false,
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  function addItem(product, quantity = 1, selectedColor = "") {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        ...product,
        quantity,
        selectedColor,
        cartItemId: `${product.id}-${selectedColor || "default"}`,
      },
    });
  }

  function removeItem(cartItemId) {
    dispatch({
      type: "REMOVE_ITEM",
      payload: cartItemId,
    });
  }

  function increaseQuantity(cartItemId) {
    dispatch({
      type: "INCREASE_QUANTITY",
      payload: cartItemId,
    });
  }

  function decreaseQuantity(cartItemId) {
    dispatch({
      type: "DECREASE_QUANTITY",
      payload: cartItemId,
    });
  }

  function openCart() {
    dispatch({ type: "OPEN_CART" });
  }

  function closeCart() {
    dispatch({ type: "CLOSE_CART" });
  }

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const value = useMemo(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      openCart,
      closeCart,
      clearCart,
    }),
    [state.items, state.isOpen, itemCount, subtotal],
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
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}