// src/Navbar.js
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ThemeToggle from "./components/ThemeToggle"; // Komponen toggle terpisah

function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header className="navbar">
      {/* === LOGO === */}
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <h2>lendspace</h2>
        </Link>
      </div>

      {/* === NAVIGATION === */}
      <nav className="navbar-links">
        <NavLink to="/">Home</NavLink>
        {isAuthenticated && <NavLink to="/catalog">Catalog</NavLink>}
        {isAuthenticated && <NavLink to="/lend">Lend an Item</NavLink>}
      </nav>

      {/* === AUTH + THEME === */}
      <div className="auth-buttons">
        {/* Toggle tema */}
        <ThemeToggle />

        {/* Jika user login */}
        {isAuthenticated ? (
          <Link to="/profile">
            <button className="login-button">My Profile</button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
            <Link to="/register">
              <button className="cta-button">Register</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
