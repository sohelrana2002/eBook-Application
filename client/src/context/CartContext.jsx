"use client";

import cartReducer from "@/reducer/cartReducer";
import { createContext, useContext, useEffect, useReducer } from "react";

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
      alert("This book is alreday added in the cart.");
      return state;
    }
    dispatch({ type: "ADD_TO_CART", payload: books });

    alert("This book is added in cart successfully.");
  };

  // removeFromCart function
  const removeFromCart = (bookId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: bookId });

    alert("This book is remove from cart successfully!");
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

    alert("Your cart is clear successfully.");
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
