import { RootRoute, Route, createRouter, Outlet } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import ErrorPage from "../pages/ErrorPage";
import Favorites from "../pages/Favorites";
import MyList from "../pages/MyList";
import Profile from "../pages/Profile";
import ProfileEdit from "../pages/ProfileEdit";
import ProfileSecurity from "../pages/ProfileSecurity";

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

export const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "profil",
  component: Profile,
});

export const profileEditRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "profil/edition",
  component: ProfileEdit,
});

export const profileSecurityRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "profil/securite",
  component: ProfileSecurity,
});

export const errorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: ErrorPage,
});

// Créer routeTree
const routeTree = rootRoute.addChildren([
  homeRoute,
  filmRoute,
  favoritesRoute,
  myListRoute,
  profileRoute,
  profileEditRoute,
  profileSecurityRoute,
  errorRoute,
]);

// Créer router
export const router = createRouter({ routeTree });





