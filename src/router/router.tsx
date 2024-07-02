import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "./../components/app-shell";
import Dashboard from "./../pages/dashboard";
import Login from "@/pages/auth/Login";
import { useAuth } from "@/context/AuthContext";
import { Products } from "@/pages/products/Products";
import Vouchers from "@/pages/vouchers/Vouchers";
import { AddProduct } from "@/pages/products/product-detail/add-product-form";
import AddVoucher from "@/pages/vouchers/components/voucher-detail/add-voucher-form";

const PrivateRoute = ({ element, ...rest }: any) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <AppShell {...rest}>{element}</AppShell>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/admin/milk",
        element: <Products />,
      },
      {
        path: "/admin/new",
        element: <AddProduct />,
      },
      {
        path: "/admin/vouchers",
        element: <Vouchers />,
      },
      {
        path: "/admin/vouchers/new",
        element: <AddVoucher />,
      },
      
    ],
  },
]);

export default router;
