import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { usePokemons } from "../../hooks/usePokemons";
import { useFavorites } from "../../hooks/useFavorites";
import { usePagination } from "../../hooks/usePagination";
import { Toggle } from "../../components/Toggle";
import { PokemonCard } from "../../components/PokemonCard";
import { Pagination } from "../../components/Pagination";

export function Pokedex() {
  const ITEMS_PER_PAGE = 20;

  const {
    pokemonsToShow,
    totalPages,
    pokemonsNumber,
    fetchPokemonsByPage,
    searchWithDebounce,
  } = usePokemons(ITEMS_PER_PAGE);

  const { favorites, toggleFavorite } = useFavorites();
  const { currentPage, goToPage } = usePagination(1);

  const [hasToShowOnlyFavorites, setHasToShowOnlyFavorites] = useState(false);
  const [pokemonInputValue, setPokemonInputValue] = useState("");

  const displayedPokemons = hasToShowOnlyFavorites ? favorites : pokemonsToShow;

  const handleSearch = (value: string) => {
    setPokemonInputValue(value);
    searchWithDebounce(value, currentPage);
  };

  useEffect(() => {
    if (!hasToShowOnlyFavorites && !pokemonInputValue.trim()) {
      fetchPokemonsByPage(currentPage);
    }
  }, [currentPage, hasToShowOnlyFavorites]);

  return (
    <div className={styles.pokedex}>
      <header>
        <span>
          {pokemonsNumber} <strong>Pokémons</strong> for you to choose your
          favorite
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
        {displayedPokemons.length > 0 ? (
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
        ) : (
          <div className={styles.noResultsContainer}>
            <p>No results found based on your search.</p>

            <p>
              Please ensure that you have written the Pokémon name correctly,
              and not just part of the Pokémon's name.
            </p>
          </div>
        )}

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
