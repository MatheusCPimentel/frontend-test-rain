import styles from "./styles.module.css";
import { Heart } from "lucide-react";
import { Pokemon } from "../../types/pokemon";
import { capitalizeWord } from "../../utils/capitalizeWord";

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  toggleFavorite: (pokemon: Pokemon) => void;
}

export function PokemonCard({
  pokemon,
  isFavorite,
  toggleFavorite,
}: PokemonCardProps) {
  const mainType = pokemon.types?.[0]?.type?.name || "unknown";

  return (
    <div className={`${styles.pokemonCard} ${styles[mainType]}`}>
      <div
        className={styles.favoriteIcon}
        onClick={() => toggleFavorite(pokemon)}
      >
        <Heart size={24} fill={isFavorite ? "red" : "none"} color="red" />
      </div>

      <img
        src={pokemon.sprites.front_default || ""}
        alt={pokemon.name || "Unknown"}
        className={styles.pokemonImage}
      />

      <h3 className={styles.pokemonName}>
        {capitalizeWord(pokemon.name || "Unknown")}
      </h3>

      <div className={styles.pokemonDetails}>
        {pokemon.types && (
          <p>
            <strong>Type: </strong>
            {pokemon.types.map((t) => capitalizeWord(t.type.name)).join(", ")}
          </p>
        )}

        {pokemon.height && (
          <p>
            <strong>Height:</strong> {pokemon.height / 10}m
          </p>
        )}

        {pokemon.weight && (
          <p>
            <strong>Weight:</strong> {pokemon.weight / 10}kg
          </p>
        )}

        {pokemon.abilities && (
          <p>
            <strong>Abilities: </strong>
            {pokemon.abilities
              .map((a) => capitalizeWord(a.ability.name))
              .join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
