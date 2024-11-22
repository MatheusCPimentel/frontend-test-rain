import { useEffect } from "react";
import { fetchWrapper } from "./services/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "./pages/main";
import { Favorites } from "./pages/favorites";
import { Login } from "./pages/login";
import { Navbar } from "./components/Navbar";

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

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
