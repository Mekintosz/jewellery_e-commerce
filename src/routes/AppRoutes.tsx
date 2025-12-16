import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const ProductListingPage = lazy(
  () => import("../pages/ProductListingPage/ProductListingPage"),
);
const ProductDetailPage = lazy(
  () => import("../pages/ProductDetailPage/ProductDetailPage"),
);
const ShoppingCartPage = lazy(
  () => import("../pages/ShoppingCartPage/ShoppingCartPage"),
);
const CheckoutPage = lazy(() => import("../pages/CheckoutPage/CheckoutPage"));
const ContactUsPage = lazy(
  () => import("../pages/ContactUsPage/ContactUsPage"),
);
const RegistrationPage = lazy(
  () => import("../pages/RegistrationPage/RegistrationPage"),
);
const UserProfilePage = lazy(
  () => import("../pages/UserProfilePage/UserProfilePage"),
);
const WishlistPage = lazy(() => import("../pages/WishlistPage/WishlistPage"));
const LoginPage = lazy(() => import("../pages/LoginPage/LoginPage"));

export const AppRoutes = () => {
  const routing = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "products", element: <ProductListingPage /> },
        { path: "products/:productId", element: <ProductDetailPage /> },
        { path: "cart", element: <ShoppingCartPage /> },
        {
          path: "checkout",
          element: (
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          ),
        },
        { path: "contact", element: <ContactUsPage /> },
        { path: "register", element: <RegistrationPage /> },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          ),
        },
        { path: "wishlist", element: <WishlistPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ]);

  return routing;
};
