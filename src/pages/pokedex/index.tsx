import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { Toggle } from "../../components/Toggle";
import { fetchWrapper } from "../../services/api";

export function Pokedex() {
  const [hasToShowOnlyFavorites, setHasToShowOnlyFavorites] = useState(false);
  const [pokemonInputValue, setPokemonInputValue] = useState("");

  const [pokemonsToShow, setPokemonsToShow] = useState([]);

  const onFindYourPokemonInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPokemonInputValue(e.target.value);
  };

  const getPokemons = async () => {
    const response = await fetchWrapper("pokemon");
  };

  useEffect(() => {
    getPokemons();
  }, []);

  return (
    <div className={styles.pokedex}>
      <header>
        <span>
          800 <strong>Pokémons</strong> for you to choose your favorite
        </span>

        <input
          type="text"
          value={pokemonInputValue}
          onChange={onFindYourPokemonInputChange}
          placeholder="Find your Pokémon..."
        />

        <Toggle
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
