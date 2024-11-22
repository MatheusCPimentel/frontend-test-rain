import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import styles from "./styles.module.css";
import logo from "../../assets/pokeapi_logo.png";

export const Navbar = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItemsArr = [
    {
      name: "Home",
      isActive: pathname === "/",
      link: "/",
      action: () => undefined,
    },
    {
      name: "Pokédex",
      isActive: pathname === "/pokedex",
      link: "/pokedex",
      action: () => undefined,
    },
    {
      name: "Logout",
      isActive: false,
      link: "/login",
      action: () => localStorage.removeItem("token"),
    },
  ];

  if (pathname === "/login") {
    return null;
  }

  return (
    <header className={styles.navbarContainer}>
      <div className={styles.navbarContent}>
        <img src={logo} alt="Logo" className={styles.logo} />

        <button
          className={styles.menuButton}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <Menu size={24} />
        </button>

        <div
          className={`${styles.navItems} ${
            isMenuOpen ? styles.navItems__open : ""
          }`}
        >
          {navItemsArr.map((item) => (
            <Link
              key={item.name}
              className={`${styles.navItem} ${
                item.isActive ? styles.navItem__active : ""
              }`}
              to={item.link}
              onClick={() => {
                item.action();
                setIsMenuOpen(false);
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};
