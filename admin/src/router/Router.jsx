import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/homePage/Home";
import Login from "../auth/login/Login";

import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
