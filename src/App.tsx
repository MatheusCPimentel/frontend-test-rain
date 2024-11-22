import { useEffect } from "react";
import { fetchWrapper } from "./services/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "./pages/main";
import { Favorites } from "./pages/favorites";
import { Login } from "./pages/login";

function App() {
  const getPokemons = async () => {
    const response = await fetchWrapper("test");
    console.log(response);
  };

  useEffect(() => {
    getPokemons();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
