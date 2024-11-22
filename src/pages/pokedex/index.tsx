import { ChevronDown, Target } from "lucide-react";
import styles from "./styles.module.css";
import { useState } from "react";
import { Toggle } from "../../components/Toggle";

export function Pokedex() {
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [hasToShowOnlyFavorites, setHasToShowOnlyFavorites] = useState(false);

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
                <div>Test</div>
                <div>Test</div>
                <div>Test</div>
                <div>Test</div>
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
