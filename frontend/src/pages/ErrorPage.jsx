import { Link } from "@tanstack/react-router";

export default function ErrorPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl mb-6">Cette page n’existe pas.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
