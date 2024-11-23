import { useState } from "react";
import { fetchWrapper } from "../../services/api";
import { Pokemon } from "../../types/pokemon";
import { PokemonPagination } from "../../types/pokemonPagination";

export const usePokemons = (itemsPerPage: number) => {
  const [pokemonsToShow, setPokemonsToShow] = useState<Pokemon[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pokemonsNumber, setPokemonsNumber] = useState(0);
  const [isLoadingPokemons, setIsLoadingPokemons] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState<number | null>(null);

  const fetchPokemonsByPage = async (page: number) => {
    setIsLoadingPokemons(true);

    const offset = (page - 1) * itemsPerPage;

    try {
      const { data: paginationData } = await fetchWrapper<PokemonPagination>(
        `pokemon?limit=${itemsPerPage}&offset=${offset}`
      );

      setPokemonsNumber(paginationData.count);
      setTotalPages(Math.ceil(paginationData.count / itemsPerPage));

      const detailedPokemons = await Promise.all(
        paginationData.results.map(async (pokemon) => {
          const { data } = await fetchWrapper<Pokemon>(
            `pokemon/${pokemon.name}`
          );

          return data;
        })
      );

      setPokemonsToShow(detailedPokemons);
    } catch (error) {
      console.error("Failed to fetch Pokémons:", error);
    } finally {
      setIsLoadingPokemons(false);
    }
  };

  const fetchPokemonByName = async (name: string) => {
    setIsLoadingPokemons(true);
    try {
      const { data } = await fetchWrapper<Pokemon>(
        `pokemon/${name.toLowerCase()}`
      );

      setPokemonsToShow([data]);
    } catch (error) {
      console.error("Pokemon not found:", error);
      setPokemonsToShow([]);
    } finally {
      setIsLoadingPokemons(false);
    }
  };

  const searchWithDebounce = (searchValue: string, currentPage: number) => {
    if (debouncedSearch) clearTimeout(debouncedSearch);

    setDebouncedSearch(
      window.setTimeout(() => {
        if (searchValue.trim()) {
          fetchPokemonByName(searchValue);
        } else {
          fetchPokemonsByPage(currentPage);
        }

        setDebouncedSearch(null);
      }, 500)
    );
  };

  const isDebouncingPokemons = debouncedSearch !== null;

  return {
    pokemonsToShow,
    totalPages,
    pokemonsNumber,
    fetchPokemonsByPage,
    searchWithDebounce,
    isLoadingPokemons,
    isDebouncingPokemons,
  };
};
