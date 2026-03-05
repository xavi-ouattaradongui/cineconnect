import { RootRoute, Route, createRouter, Outlet, useLocation, redirect } from "@tanstack/react-router";
import Navbar from "../components/shared/Navbar";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import ErrorPage from "../pages/ErrorPage";
import Favorites from "../pages/Favorites";
import MyList from "../pages/MyList";
import Profile from "../pages/Profile";
import ProfileEdit from "../pages/ProfileEdit";
import ProfileSecurity from "../pages/ProfileSecurity";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CategoryPage from "../pages/CategoryPage";
import ExplorePage from "../pages/ExplorePage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

// Fonction pour vérifier l'authentification
const requireAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw redirect({
      to: "/login",
      replace: true,
    });
  }
};

// Fonction pour rediriger les utilisateurs authentifiés
const redirectIfAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (token) {
    throw redirect({
      to: "/home",
      replace: true,
    });
  }
};

// Root route
export const rootRoute = new RootRoute({
  component: () => {
    const location = useLocation();
    const hideNavbar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password" || location.pathname === "/reset-password";

    return (
      <div>
        {!hideNavbar && <Navbar />}
        <Outlet />
      </div>
    );
  },
});

// Routes PUBLIQUES (sans authentification)
export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Login,
  beforeLoad: redirectIfAuthenticated,
});

export const loginAltRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "login",
  component: Login,
  beforeLoad: redirectIfAuthenticated,
});

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "register",
  component: Register,
  beforeLoad: redirectIfAuthenticated,
});

export const forgotPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "forgot-password",
  component: ForgotPassword,
  beforeLoad: redirectIfAuthenticated,
});

export const resetPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "reset-password",
  component: ResetPassword,
  beforeLoad: redirectIfAuthenticated,
});

// Routes PRIVÉES (nécessitent authentification)
export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: Home,
  beforeLoad: requireAuth,
});

export const categoryRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "categorie/$category",
  component: CategoryPage,
  beforeLoad: requireAuth,
});

export const sectionRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "explorez/$section",
  component: ExplorePage,
  beforeLoad: requireAuth,
});

export const filmRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "film/$id",
  component: MovieDetails,
  beforeLoad: requireAuth,
});

export const favoritesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "favoris",
  component: Favorites,
  beforeLoad: requireAuth,
});

export const myListRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "ma-liste",
  component: MyList,
  beforeLoad: requireAuth,
});

export const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "profil",
  component: Profile,
  beforeLoad: requireAuth,
});

export const profileEditRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "profil/edition",
  component: ProfileEdit,
  beforeLoad: requireAuth,
});

export const profileSecurityRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "profil/securite",
  component: ProfileSecurity,
  beforeLoad: requireAuth,
});

export const errorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: ErrorPage,
});

// Créer routeTree
const routeTree = rootRoute.addChildren([
  loginRoute,
  loginAltRoute,
  registerRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  homeRoute,
  categoryRoute,
  sectionRoute,
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





