const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const updatedCarts = [...state.carts, action.payload];
      const totalQuantity = updatedCarts.length;
      const totalPrice = updatedCarts.reduce(
        (sum, book) => sum + book.price,
        0,
      );

      return { carts: updatedCarts, totalQuantity, totalPrice };
    }

    case "REMOVE_FROM_CART": {
      const updatedCarts = state.carts.filter(
        (book) => book?._id !== action.payload,
      );

      const totalQuantity = updatedCarts.length;
      const totalPrice = updatedCarts.reduce(
        (sum, book) => sum + book.price,
        0,
      );

      return { carts: updatedCarts, totalQuantity, totalPrice };
    }

    case "SET_CART": {
      return action.payload;
    }

    case "CLEAR_CART": {
      return action.payload;
    }

    default:
      return state;
  }
};

export default cartReducer;
