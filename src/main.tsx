import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ListPage from "./components/ListPage/ListPage";
import DetailsPage from "./components/DetailsPage/DetailsPage";
import NewRequest from "./components/NewRequest/NewRequest";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute authentication={true}>
        <ListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/requests",
    element: (
      <ProtectedRoute authentication={true}>
        <ListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/new",
    element: (
      <ProtectedRoute authentication={true}>
        <NewRequest />
      </ProtectedRoute>
    ),
  },
  {
    path: "/requests/:id",
    element: (
      <ProtectedRoute authentication={true}>
        <DetailsPage />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
