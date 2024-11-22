import { Link, useLocation } from "react-router-dom";
import styles from "./styles.module.css";
import logo from "../../assets/pokeapi_logo.png";

export const Navbar = () => {
  const { pathname } = useLocation();

  const navItemsArr = [
    {
      name: "Favorites",
      isActive: pathname === "/favorites",
      link: "/favorites",
    },
    {
      name: "Main",
      isActive: pathname === "/",
      link: "/",
    },
  ];

  return (
    <div className={styles.navbar}>
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
  );
};
