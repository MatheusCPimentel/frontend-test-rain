import { ChevronDown, Target } from "lucide-react";
import styles from "./styles.module.css";
import { useState } from "react";
import { Toggle } from "../../components/Toggle";

export function Pokedex() {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [hasToShowOnlyFavorites, setHasToShowOnlyFavorites] = useState(false);

  const [pokemonTypes, setPokemonTypes] = useState<Record<string, boolean>>({
    Fire: false,
    Water: false,
    Grass: false,
    Electric: false,
    Poison: false,
    Flying: false,
  });

  const toggleType = (type: string) => {
    setPokemonTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className={styles.pokedex}>
      <header>
        <span>
          800 <strong>Pokemons</strong> for you to choose your favorite
        </span>

        <input type="text" placeholder="Find your Pokemon..." />

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
                {Object.keys(pokemonTypes).map((type) => (
                  <label
                    key={type}
                    className={styles.typeOption}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={pokemonTypes[type]}
                      onChange={() => toggleType(type)}
                    />

                    <span>{type}</span>
                  </label>
                ))}
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

      <main></main>
    </div>
  );
}
