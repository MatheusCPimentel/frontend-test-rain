import { useState, useEffect } from "react";
import { Pokemon } from "../types/pokemon";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);

  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem("favorites");

    if (storedFavorites) {
      try {
        const parsedFavorites: Pokemon[] = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
      }
    }
  };

  const saveFavorites = (updatedFavorites: Pokemon[]) => {
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const toggleFavorite = (pokemon: Pokemon) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.id === pokemon.id);

    const updatedFavorites = isAlreadyFavorite
      ? favorites.filter((fav) => fav.id !== pokemon.id)
      : [...favorites, pokemon];

    saveFavorites(updatedFavorites);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return { favorites, toggleFavorite };
};
