'use client'

import { usePreferencesStore } from "@/store/favouriteStore";
//Components
import { Button } from "../ui/button";

export default function AddToFavoritesButton({ id }: { id: string }) {
  const { favorites, toggleFavorite } = usePreferencesStore();

  const isFav = favorites.includes(id);

  const handleClick = () => {
    toggleFavorite(id);
  };

  return (
    <Button
      variant={isFav ? 'favorites' : 'default'}
      onClick={handleClick}
    >
      {isFav ? 'Nei preferiti ⭐' : 'Aggiungi ai preferiti'}
    </Button>
  );
}
