import styles from "./styles.module.css";
import { Heart } from "lucide-react";
import { Pokemon } from "../../types/pokemon";
import { capitalizeWord } from "../../utils/capitalizeWord";

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  toggleFavorite: (pokemonId: number) => void;
}

export function PokemonCard({
  pokemon,
  isFavorite,
  toggleFavorite,
}: PokemonCardProps) {
  return (
    <div
      className={`${styles.pokemonCard} ${styles[pokemon.types[0].type.name]}`}
    >
      <div
        className={styles.favoriteIcon}
        onClick={() => toggleFavorite(pokemon.id)}
      >
        <Heart size={24} fill={isFavorite ? "red" : "none"} color="red" />
      </div>

      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className={styles.pokemonImage}
      />

      <h3 className={styles.pokemonName}>{capitalizeWord(pokemon.name)}</h3>

      <div className={styles.pokemonDetails}>
        <p>
          <strong>Type: </strong>
          {pokemon.types.map((t) => capitalizeWord(t.type.name)).join(", ")}
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
  );
}
