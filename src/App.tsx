import { useEffect } from "react";
import { fetchWrapper } from "./services/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./pages/login";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/home";
import { Pokedex } from "./pages/pokedex";
import styles from "./App.module.css";

function App() {
  const getPokemons = async () => {
    /* Endpoints needed: 
    MAIN:
    pokemon?offset=20&limit=20

    FILTER:
    type/{type}
    pokemon/{pokemon}
    */

    const response = await fetchWrapper("pokemon/charmander");
    console.log(response);
  };

  useEffect(() => {
    getPokemons();
  }, []);

  return (
    <Router>
      <Navbar />

      <div className={styles.pageContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
