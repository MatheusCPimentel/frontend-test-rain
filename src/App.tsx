import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./pages/login";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/home";
import { Pokedex } from "./pages/pokedex";
import styles from "./App.module.css";

function App() {
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
