// src/App.js
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import PrivateRoute from "./Components/PrivateRoute";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import MainLayout from "./Layouts/MainLayout";
import Products from "./Pages/Products";
import Categories from "./Pages/Categories";
import OrderItems from "./Pages/OrderItems";
import Orders from "./Pages/Orders";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/", element: <Products /> },
      { path: "products", element: <Products /> },
      { path: "categories", element: <Categories /> },
      { path: "order-items", element: <OrderItems /> },
      { path: "orders", element: <Orders /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
