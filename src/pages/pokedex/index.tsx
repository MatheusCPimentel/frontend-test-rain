import { ChevronDown, Target } from "lucide-react";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { Toggle } from "../../components/Toggle";
import { fetchWrapper } from "../../services/api";
import { Pagination } from "../../types/pagination";
import { PokemonType } from "../../types/pokemonType";
import { capitalizeWord } from "../../utils/capitalizeWord";

export function Pokedex() {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [hasToShowOnlyFavorites, setHasToShowOnlyFavorites] = useState(false);
  const [pokemonInputValue, setPokemonInputValue] = useState("");

  const [selectedPokemonType, setSelectedPokemonType] = useState<string | null>(
    null
  );

  const [pokemonTypeOptions, setPokemonTypeOptions] = useState<string[]>([]);

  const [pokemonsToShow, setPokemonsToShow] = useState([]);

  const onFindYourPokemonInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPokemonInputValue(e.target.value);
  };

  const getPokemons = async () => {
    const response = await fetchWrapper("pokemon");
  };

  const getAllPokemonTypes = async () => {
    const { data } = await fetchWrapper<Pagination<PokemonType>>("type");

    const allAvailableTypes = data.results.map((type) => type.name);

    setPokemonTypeOptions(allAvailableTypes);
  };

  useEffect(() => {
    getPokemons();
    getAllPokemonTypes();
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
                {pokemonTypeOptions.map((type) => (
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

                    <span>{capitalizeWord(type)}</span>
                  </label>
                ))}

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
