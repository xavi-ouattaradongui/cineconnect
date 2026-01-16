import { RootRoute, Route, createRouter, Outlet } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import ErrorPage from "../pages/ErrorPage";

// Root route
export const rootRoute = new RootRoute({
  component: () => (
    <div>
      <Navbar />
      <Outlet />
    </div>
  ),
});

// Routes enfants
export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

export const filmRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "film/$id",
  component: MovieDetails,
});

export const errorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: ErrorPage,
});

// Créer routeTree
const routeTree = rootRoute.addChildren([homeRoute, filmRoute, errorRoute]);

// Créer router
export const router = createRouter({ routeTree });





