import { Navigate, createBrowserRouter } from "react-router-dom";
import {
  Discover,
  Browse,
  Shop,
  Category,
  Artist,
  FavouritePlaylists,
  Playlist,
  Search,
  MyOrders,
  Cart,
  Checkout,
  OrderTracking,
  ProductDetails,
  Addresses,
  PaymentMethods,
  Support,
  Profile,
  Notifications,
  Error,
  About,
  Contact,
  Legal,
  Policy,
} from "@/pages/_root";

import { Register, Login, ForgetPass, VerifyForgetPass } from "@/pages/_auth";
import { RootLayout, AuthLayout } from "@/pages/_layout";
import {
  Dashboard,
  Inventory,
  Customers,
  Payouts,
  Shipping,
  Coupons,
  Settings,
  Products,
  Product,
  Orders,
} from "@/pages/_merchant";
import { Categories } from "@/pages/_admin";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        element: <RootLayout />,
        errorElement: <Error />,
        children: [
          { index: true, element: <Navigate to="/discover" replace /> },
          {
            path: "/discover",
            element: <Discover />,
          },
          {
            path: "/browse",
            element: <Browse />,
          },
          {
            path: "/shop",
            element: <Shop />,
          },
          {
            path: "/search",
            element: <Search />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/notifications",
            element: <Notifications />,
          },
          {
            path: "/favourite-playlists",
            element: <FavouritePlaylists />,
          },

          {
            path: "/my-orders",
            element: <MyOrders />,
          },
          {
            path: "/cart",
            element: <Cart />,
          },
          {
            path: "/checkout",
            element: <Checkout />,
          },
          {
            path: "/order-tracking",
            element: <OrderTracking />,
          },
          {
            path: "/product/:id",
            element: <ProductDetails />,
          },
          {
            path: "/addresses",
            element: <Addresses />,
          },
          {
            path: "/payment-methods",
            element: <PaymentMethods />,
          },
          {
            path: "/support",
            element: <Support />,
          },
          {
            path: "/merchant/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/merchant/products",
            element: <Products />,
          },
          {
            path: "/merchant/products/:id",
            element: <Product />,
          },
          {
            path: "/merchant/orders",
            element: <Orders />,
          },
          {
            path: "/merchant/inventory",
            element: <Inventory />,
          },
          {
            path: "/merchant/customers",
            element: <Customers />,
          },
          {
            path: "/merchant/payouts",
            element: <Payouts />,
          },
          {
            path: "/merchant/shipping",
            element: <Shipping />,
          },
          {
            path: "/merchant/coupons",
            element: <Coupons />,
          },
          {
            path: "/merchant/settings",
            element: <Settings />,
          },
          {
            path: "/admin/categories",
            element: <Categories />,
          },
          {
            path: "/about",
            element: <About />,
          },
          {
            path: "/contact",
            element: <Contact />,
          },
          {
            path: "/legal",
            element: <Legal />,
          },
          {
            path: "/policy",
            element: <Policy />,
          },
          {
            path: "/category/:id",
            element: <Category />,
          },
          {
            path: "/artist/:id",
            element: <Artist />,
          },
          {
            path: "/:section/:id",
            element: <Playlist />,
          },
        ],
      },
      {
        element: <AuthLayout />,
        errorElement: <Error />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
          {
            path: "/reset-password",
            element: <ForgetPass />,
          },
          {
            path: "/verify-reset-password",
            element: <VerifyForgetPass />,
          },
        ],
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);
