import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { Toggle } from "../../components/Toggle";
import { fetchWrapper } from "../../services/api";
import { Pokemon } from "../../types/pokemon";
import { PokemonPagination } from "../../types/pokemonPagination";
import { PokemonCard } from "../../components/PokemonCard";
import { Pagination } from "../../components/Pagination";

export function Pokedex() {
  const [hasToShowOnlyFavorites, setHasToShowOnlyFavorites] = useState(false);
  const [pokemonInputValue, setPokemonInputValue] = useState("");
  const [pokemonsToShow, setPokemonsToShow] = useState<Pokemon[]>([]);
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pokemonsNumber, setPokemonsNumber] = useState(0);

  const ITEMS_PER_PAGE = 20;

  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem("favorites");

    if (storedFavorites) {
      try {
        const parsedFavorites: Pokemon[] = JSON.parse(storedFavorites);

        const validFavorites = parsedFavorites.filter(
          (pokemon) => pokemon.id && pokemon.name && pokemon.types
        );

        setPokemonsToShow(validFavorites);
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

    let updatedFavorites: Pokemon[];

    if (isAlreadyFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id !== pokemon.id);
    } else {
      updatedFavorites = [...favorites, pokemon];
    }

    saveFavorites(updatedFavorites);
  };

  const fetchPokemonsByPage = async (page: number) => {
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const { data: paginationData } = await fetchWrapper<PokemonPagination>(
      `pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`
    );

    setPokemonsNumber(paginationData.count);
    setTotalPages(Math.ceil(paginationData.count / ITEMS_PER_PAGE));

    const detailedPokemons = await Promise.all(
      paginationData.results.map(async (pokemon) => {
        const { data } = await fetchWrapper<Pokemon>(`pokemon/${pokemon.name}`);
        return data;
      })
    );

    setPokemonsToShow(detailedPokemons);
  };

  const displayedPokemons = hasToShowOnlyFavorites ? favorites : pokemonsToShow;

  useEffect(() => {
    loadFavorites();
    fetchPokemonsByPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!hasToShowOnlyFavorites) {
      fetchPokemonsByPage(1);
    }
  }, [hasToShowOnlyFavorites]);

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
          onChange={(e) => setPokemonInputValue(e.target.value)}
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

        {!hasToShowOnlyFavorites && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
