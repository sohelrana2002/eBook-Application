const authReducer = (state, action) => {
  switch (action.type) {
    // Initial loading cases
    case "LOAD_TOKEN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOAD_TOKEN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        name: action.payload.name,
        isLoading: false,
        error: null,
      };

    case "LOAD_TOKEN_FAILURE":
      return {
        ...state,
        token: "",
        name: "",
        isLoading: false,
        error: action.payload || "Failed to load token",
      };

    // Store token cases
    case "STORE_TOKEN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "STORE_TOKEN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        name: action.payload.name,
        isLoading: false,
        error: null,
      };

    case "STORE_TOKEN_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // Logout cases
    case "LOGOUT_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOGOUT_SUCCESS":
      return {
        ...state,
        token: "",
        name: "",
        isLoading: false,
        error: null,
      };

    case "LOGOUT_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
