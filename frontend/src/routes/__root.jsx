import { RootRoute, Route, createRouter, Outlet } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import ErrorPage from "../pages/ErrorPage";
import Favorites from "../pages/Favorites";
import MyList from "../pages/MyList";

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

export const favoritesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "favoris",
  component: Favorites,
});

export const myListRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "ma-liste",
  component: MyList,
});

export const errorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: ErrorPage,
});

// Créer routeTree
const routeTree = rootRoute.addChildren([homeRoute, filmRoute, favoritesRoute, myListRoute, errorRoute]);

// Créer router
export const router = createRouter({ routeTree });





