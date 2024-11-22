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
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pokemonsNumber, setPokemonsNumber] = useState(0);

  const ITEMS_PER_PAGE = 20;

  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem("favorites");

    if (storedFavorites) {
      setFavoriteIds(JSON.parse(storedFavorites));
    }
  };

  const toggleFavorite = (pokemonId: number) => {
    let updatedFavorites: number[];

    if (favoriteIds.includes(pokemonId)) {
      updatedFavorites = favoriteIds.filter((id) => id !== pokemonId);
    } else {
      updatedFavorites = [...favoriteIds, pokemonId];
    }

    setFavoriteIds(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
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

  const filteredPokemons = hasToShowOnlyFavorites
    ? pokemonsToShow.filter((pokemon) => favoriteIds.includes(pokemon.id))
    : pokemonsToShow;

  const paginatedFavorites = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPokemons.slice(startIndex, endIndex);
  };

  useEffect(() => {
    loadFavorites();
    fetchPokemonsByPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (hasToShowOnlyFavorites) {
      setTotalPages(Math.ceil(favoriteIds.length / ITEMS_PER_PAGE));
    } else {
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
        {filteredPokemons.length > 0 ? (
          <div className={styles.pokemonList}>
            {hasToShowOnlyFavorites
              ? paginatedFavorites().map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    isFavorite={favoriteIds.includes(pokemon.id)}
                    toggleFavorite={toggleFavorite}
                  />
                ))
              : filteredPokemons.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    isFavorite={favoriteIds.includes(pokemon.id)}
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
