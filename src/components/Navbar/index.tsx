import { Link, useLocation } from "react-router-dom";
import styles from "./styles.module.css";
import logo from "../../assets/pokeapi_logo.png";

export const Navbar = () => {
  const { pathname } = useLocation();

  const navItemsArr = [
    {
      name: "Home",
      isActive: pathname === "/",
      link: "/",
    },
    {
      name: "Pokédex",
      isActive: pathname === "/pokedex",
      link: "/pokedex",
    },
  ];

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbarContent}>
        <img src={logo} alt="Logo" />
        <div>
          {navItemsArr.map((item) => (
            <Link
              className={`${styles.navItem} ${
                item.isActive ? styles.navItem__active : ""
              }`}
              to={item.link}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
