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
  const [debouncedSearch, setDebouncedSearch] = useState<number | null>(null);
  const [lastPageBeforeFavorites, setLastPageBeforeFavorites] = useState(1);

  const ITEMS_PER_PAGE = 20;

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

  const fetchPokemonByName = async (name: string) => {
    try {
      const { data } = await fetchWrapper<Pokemon>(
        `pokemon/${name.toLowerCase()}`
      );
      setPokemonsToShow([data]);
    } catch (error) {
      console.error("Pokemon not found:", error);
      setPokemonsToShow([]);
    }
  };

  const onSearchInputChange = (value: string) => {
    setPokemonInputValue(value);

    if (debouncedSearch) clearTimeout(debouncedSearch);

    setDebouncedSearch(
      setTimeout(() => {
        if (value.trim() === "") {
          fetchPokemonsByPage(currentPage);
        } else {
          fetchPokemonByName(value);
        }
      }, 500)
    );
  };

  const handleToggleFavorites = (isActive: boolean) => {
    setHasToShowOnlyFavorites(isActive);
    if (isActive) {
      setLastPageBeforeFavorites(currentPage);
    } else {
      setCurrentPage(lastPageBeforeFavorites);
    }
  };

  const getDisplayedPokemons = () => {
    if (pokemonInputValue.trim()) {
      return pokemonsToShow.filter((pokemon) =>
        pokemon.name
          .toLowerCase()
          .includes(pokemonInputValue.trim().toLowerCase())
      );
    }

    if (hasToShowOnlyFavorites) {
      return favorites;
    }

    return pokemonsToShow;
  };

  useEffect(() => {
    loadFavorites();
    fetchPokemonsByPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!hasToShowOnlyFavorites && !pokemonInputValue.trim()) {
      fetchPokemonsByPage(currentPage);
    }
  }, [hasToShowOnlyFavorites]);

  const displayedPokemons = getDisplayedPokemons();

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
          onChange={(e) => onSearchInputChange(e.target.value)}
          placeholder="Find your Pokémon..."
        />

        <Toggle
          className={styles.favoritesToggle}
          isChecked={hasToShowOnlyFavorites}
          setIsChecked={handleToggleFavorites}
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
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
