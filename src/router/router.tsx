import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "./../components/app-shell";
import Dashboard from "./../pages/dashboard";
import Login from "@/pages/auth/Login";
import { useAuth } from "@/context/AuthContext";
import { Products } from "@/pages/products/Products";
import { Category } from "@/pages/category/Category";
import { AddCategory } from "@/pages/category/category-detail/add-category-form";
import { Brand } from "@/pages/brand/Brand";
import { AddBrand } from "@/pages/brand/brand-detail/add-brand-form";
import { Blog } from "@/pages/blog/Blog";
import { AddBlog } from "@/pages/blog/blog-detail/add-blog-form";
import Vouchers from "@/pages/vouchers/Vouchers";
import AddVoucher from "@/pages/vouchers/voucher-detail/add-voucher-form";
import Orders from "@/pages/order/Orders";
import OrderDetail from "@/pages/order/OrderDetail";
import { ProductForm } from "@/pages/products/product-detail/add-product-form";

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
    element: <PrivateRoute />,
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
        path: "/admin/newMilk",
        element: <ProductForm />,
      },
      {
        path: "/admin/category",
        element: <Category />,
      },
      {
        path: "/admin/newCategory",
        element: <AddCategory />,
      },
      {
        path: "/admin/vouchers",
        element: <Vouchers />,
      },
      {
        path: "/admin/orders",
        element: <Orders />,
      },
      {
        path: "/admin/orders/:orderId",
        element: <OrderDetail />,
      },
      {
        path: "/admin/vouchers/new",
        element: <AddVoucher />,
      },
      {
        path: "/admin/brand",
        element: <Brand />,
      },
      {
        path: "/admin/newBrand",
        element: <AddBrand />,
      },
      {
        path: "/admin/blog",
        element: <Blog />,
      },
      {
        path: "/admin/newBlog",
        element: <AddBlog />,
      },
    ],
  },
]);

export default router;
