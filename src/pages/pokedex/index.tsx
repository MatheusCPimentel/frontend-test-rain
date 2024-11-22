import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Toggle } from "../../components/Toggle";
import { fetchWrapper } from "../../services/api";
import { Pokemon } from "../../types/pokemon";
import { PokemonPagination } from "../../types/pokemonPagination";
import { capitalizeWord } from "../../utils/capitalizeWord";

export function Pokedex() {
  const [hasToShowOnlyFavorites, setHasToShowOnlyFavorites] = useState(false);
  const [pokemonInputValue, setPokemonInputValue] = useState("");
  const [pokemonsToShow, setPokemonsToShow] = useState<Pokemon[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<number | null>(null);
  const [pokemonsNumber, setPokemonsNumber] = useState(0);

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

  const fetchInitialPokemons = async () => {
    const { data: paginationData } = await fetchWrapper<PokemonPagination>(
      "pokemon?limit=20&offset=0"
    );

    setPokemonsNumber(paginationData.count);

    const detailedPokemons = await Promise.all(
      paginationData.results.map(async (pokemon) => {
        const { data } = await fetchWrapper<Pokemon>(`pokemon/${pokemon.name}`);
        return data;
      })
    );

    setPokemonsToShow(detailedPokemons);
  };

  const fetchPokemon = async (searchValue: string) => {
    if (!searchValue) {
      fetchInitialPokemons();
      return;
    }

    const { data } = await fetchWrapper<Pokemon>(
      `pokemon/${searchValue.toLowerCase()}`
    );

    setPokemonsToShow([data]);
  };

  const onInputChange = (value: string) => {
    setPokemonInputValue(value);

    if (debouncedSearch) clearTimeout(debouncedSearch);

    setDebouncedSearch(
      setTimeout(() => {
        fetchPokemon(value);
      }, 500)
    );
  };

  useEffect(() => {
    loadFavorites();
    fetchInitialPokemons();
  }, []);

  const filteredPokemons = hasToShowOnlyFavorites
    ? pokemonsToShow.filter((pokemon) => favoriteIds.includes(pokemon.id))
    : pokemonsToShow;

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
          onChange={(e) => onInputChange(e.target.value)}
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
            {filteredPokemons.map((pokemon) => (
              <div
                key={pokemon.id}
                className={`${styles.pokemonCard} ${
                  styles[pokemon.types[0].type.name]
                }`}
              >
                <div
                  className={styles.favoriteIcon}
                  onClick={() => toggleFavorite(pokemon.id)}
                >
                  <Heart
                    size={24}
                    fill={favoriteIds.includes(pokemon.id) ? "red" : "none"}
                    color="red"
                  />
                </div>

                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className={styles.pokemonImage}
                />

                <h3 className={styles.pokemonName}>
                  {capitalizeWord(pokemon.name)}
                </h3>

                <div className={styles.pokemonDetails}>
                  <p>
                    <strong>Type: </strong>
                    {pokemon.types
                      .map((t) => capitalizeWord(t.type.name))
                      .join(", ")}
                  </p>

                  <p>
                    <strong>Height:</strong> {pokemon.height / 10}m
                  </p>

                  <p>
                    <strong>Weight:</strong> {pokemon.weight / 10}kg
                  </p>

                  <p>
                    <strong>Abilities: </strong>
                    {pokemon.abilities
                      .map((a) => capitalizeWord(a.ability.name))
                      .join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className={styles.startTypingPhrase}>
            Start typing or select a filter to see <strong>Pokémons</strong>!
          </span>
        )}
      </main>
    </div>
  );
}
