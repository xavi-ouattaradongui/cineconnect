import { Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { useMyList } from "../contexts/MyListContext";
import { useAuth } from "../contexts/AuthContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileSection from "../components/profile/ProfileSection";
import { Heart, List } from "lucide-react";

export default function Profile() {
  const { favorites, refresh: refreshFavorites } = useFavorites();
  const { myList } = useMyList();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Rafraîchir les favoris au montage
  useEffect(() => {
    if (user) {
      refreshFavorites();
    }
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Veuillez vous connecter</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-600 dark:text-gray-400">
      <div className="h-16" />
      <main className="max-w-6xl mx-auto pt-12 px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <ProfileSidebar />

          <div className="md:col-span-9 space-y-10">
            <ProfileHeader user={user} onLogout={handleLogout} />

            <ProfileSection
              title="Favoris Récents"
              icon={<Heart size={14} className="text-red-500" />}
              items={favorites}
              emptyMessage="Aucun favori pour le moment."
              linkTo="/favoris"
              linkText="Voir tout"
            />

            <ProfileSection
              title="Listes Récentes"
              icon={<List size={14} className="text-blue-400" />}
              items={myList}
              emptyMessage="Votre liste est vide."
              linkTo="/ma-liste"
              linkText="Voir tout"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
