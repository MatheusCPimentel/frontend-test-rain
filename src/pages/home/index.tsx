import styles from "./styles.module.css";
import homeImage from "../../assets/home_image.png";

export function Home() {
  return (
    <div className={styles.home}>
      <div>
        <h1>Find all your favorite Pokemon</h1>

        <h6>
          You can know the type of Pokemon, its strengths, disadvantages and
          abilities
        </h6>

        <button>See pokemons</button>
      </div>

      <img src={homeImage} alt="Banner image" />
    </div>
  );
}
