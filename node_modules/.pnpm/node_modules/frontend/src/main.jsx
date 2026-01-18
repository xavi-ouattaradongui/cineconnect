import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/__root";
import "./index.css";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { MyListProvider } from "./contexts/MyListContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <MyListProvider>
          <RouterProvider router={router} />
        </MyListProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  </React.StrictMode>
);




