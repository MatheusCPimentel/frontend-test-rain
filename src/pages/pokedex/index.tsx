import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { Toggle } from "../../components/Toggle";
import { fetchWrapper } from "../../services/api";
import { Pokemon } from "../../types/pokemon";

export function Pokedex() {
  const [hasToShowOnlyFavorites, setHasToShowOnlyFavorites] = useState(false);
  const [pokemonInputValue, setPokemonInputValue] = useState("");
  const [pokemonsToShow, setPokemonsToShow] = useState<Pokemon[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<number | null>(null);
  const [pokemonsNumber, setPokemonsNumber] = useState(0);

  const fetchPokemonsNumber = async () => {
    const { data } = await fetchWrapper<{ count: number }>("pokemon");

    setPokemonsNumber(data.count);
  };

  const fetchPokemon = async (searchValue: string) => {
    if (!searchValue) {
      setPokemonsToShow([]);
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
    fetchPokemonsNumber();
  }, []);

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
        {pokemonsToShow.length > 0 ? (
          <h1>Pokémon</h1>
        ) : (
          <span className={styles.startTypingPhrase}>
            Start typing or select a filter to see <strong>Pokémons</strong>!
          </span>
        )}
      </main>
    </div>
  );
}
