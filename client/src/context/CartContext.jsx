"use client";

import cartReducer from "@/reducer/cartReducer";
import { createContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

const initialState = {
  carts: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const CartProvide = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // addToCart function
  const addToCart = (books) => {
    const exists = state.carts.some((cart) => cart?._id === books?._id);

    if (exists) {
      toast.warning("This book is alreday added in the cart.");
      return state;
    }
    dispatch({ type: "ADD_TO_CART", payload: books });

    toast.success("This book is added in cart successfully.");
  };

  // removeFromCart function
  const removeFromCart = (bookId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: bookId });

    toast.success("This book is remove from cart successfully!");
  };

  // Load data from localstorage
  useEffect(() => {
    const stored = localStorage.getItem("eBookCarts");

    if (stored) {
      try {
        dispatch({ type: "SET_CART", payload: JSON.parse(stored) });
      } catch (error) {
        console.log("Cart load error: ", error);
      }
    }
  }, []);

  // store in local storage
  useEffect(() => {
    localStorage.setItem("eBookCarts", JSON.stringify(state));
  }, [state]);

  // clearCarts function
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART", payload: initialState });

    toast.success("Your cart is clear successfully.");
  };

  const value = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartProvide, CartContext };
