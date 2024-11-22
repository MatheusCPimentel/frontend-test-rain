import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { usePokemons } from "../../hooks/usePokemons";
import { useFavorites } from "../../hooks/useFavorites";
import { usePagination } from "../../hooks/usePagination";
import { Toggle } from "../../components/Toggle";
import { PokemonCard } from "../../components/PokemonCard";
import { Pagination } from "../../components/Pagination";
import { SkeletonCard } from "../../components/SkeletonCard";

export function Pokedex() {
  const ITEMS_PER_PAGE = 20;

  const {
    pokemonsToShow,
    totalPages,
    pokemonsNumber,
    fetchPokemonsByPage,
    searchWithDebounce,
    isLoading,
  } = usePokemons(ITEMS_PER_PAGE);

  const { favorites, toggleFavorite } = useFavorites();
  const { currentPage, goToPage } = usePagination(1);

  const [hasToShowOnlyFavorites, setHasToShowOnlyFavorites] = useState(false);
  const [pokemonInputValue, setPokemonInputValue] = useState("");

  useEffect(() => {
    if (!hasToShowOnlyFavorites && !pokemonInputValue.trim()) {
      fetchPokemonsByPage(currentPage);
    }
  }, [currentPage, hasToShowOnlyFavorites]);

  const displayedPokemons = hasToShowOnlyFavorites ? favorites : pokemonsToShow;

  const handleSearch = (value: string) => {
    setPokemonInputValue(value);
    searchWithDebounce(value, currentPage);
  };

  const renderListContent = () => {
    if (isLoading) {
      return (
        <div className={styles.pokemonList}>
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      );
    }

    if (displayedPokemons.length > 0) {
      return (
        <div className={styles.pokemonList}>
          {displayedPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={favorites.some((fav) => fav.id === pokemon.id)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      );
    }

    return (
      <div className={styles.noResultsContainer}>
        <p>No results found based on your search.</p>

        <p>
          Please ensure that you have written the Pokémon name correctly, and
          not just part of the Pokémon's name.
        </p>
      </div>
    );
  };

  return (
    <div className={styles.pokedex}>
      <header>
        <span>
          {pokemonsNumber || "--"} <strong>Pokémons</strong> for you to choose
          your favorite
        </span>

        <input
          type="text"
          value={pokemonInputValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Find your Pokémon..."
        />

        <Toggle
          className={styles.favoritesToggle}
          isChecked={hasToShowOnlyFavorites}
          setIsChecked={setHasToShowOnlyFavorites}
          label="Show only my favorites"
        />
      </header>

      <main>
        {renderListContent()}

        {!hasToShowOnlyFavorites && !pokemonInputValue.trim() && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}
      </main>
    </div>
  );
}
