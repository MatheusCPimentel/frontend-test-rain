import { ChevronDown, Target } from "lucide-react";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { Toggle } from "../../components/Toggle";
import { fetchWrapper } from "../../services/api";

export function Pokedex() {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [hasToShowOnlyFavorites, setHasToShowOnlyFavorites] = useState(false);
  const [pokemonInputValue, setPokemonInputValue] = useState("");

  const [selectedPokemonType, setSelectedPokemonType] = useState<string | null>(
    null
  );

  const [pokemonsToShow, setPokemonsToShow] = useState([]);

  const onFindYourPokemonInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPokemonInputValue(e.target.value);
  };

  const getPokemons = async () => {
    const response = await fetchWrapper("pokemon");
    console.log(response);
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

        <div className={styles.filterOptions}>
          <div className={styles.typeContainer}>
            <div
              className={styles.typeInput}
              onClick={() => setIsTypeModalOpen(!isTypeModalOpen)}
            >
              <Target size={16} />
              <span>Type</span>
              <ChevronDown size={16} />
            </div>

            {isTypeModalOpen && (
              <div className={styles.typeModal}>
                {["Fire", "Water", "Grass", "Electric", "Poison", "Flying"].map(
                  (type) => (
                    <label
                      key={type}
                      className={styles.typeOption}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="radio"
                        name="pokemonType"
                        value={type}
                        checked={selectedPokemonType === type}
                        onChange={() => setSelectedPokemonType(type)}
                      />

                      <span>{type}</span>
                    </label>
                  )
                )}

                <button
                  className={styles.applyButton}
                  onClick={() => setIsTypeModalOpen(false)}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <Toggle
            isChecked={hasToShowOnlyFavorites}
            setIsChecked={setHasToShowOnlyFavorites}
            label="Show only my favorites"
          />
        </div>
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
