import { createBrowserRouter } from "react-router-dom";
import AppShell from "./../components/app-shell";
import Dashboard from "./../pages/dashboard";
import Login from "@/pages/auth/Login";

const router = createBrowserRouter([
  {
    //auth
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
