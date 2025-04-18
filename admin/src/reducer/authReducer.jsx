const authReducer = (state, action) => {
  switch (action.type) {
    case "REMOVE_TOKEN": {
      const removeToken = localStorage.removeItem("token");
      localStorage.removeItem("name");

      return {
        ...state,
        token: "",
        name: "",
        removeToken,
      };
    }

    case "SET_TOKEN_IN_STATE": {
      return {
        ...state,
        token: action.payload,
      };
    }

    default:
      return state;
  }
};

export default authReducer;
