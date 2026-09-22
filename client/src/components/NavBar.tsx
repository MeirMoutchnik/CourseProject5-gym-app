import { Link } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../services/UserService";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function handleLogout() {
    await logoutUser();
    setIsAuthenticated(false);
    navigate("/login");
  }

  return (
    <nav className="site-nav">
      <>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/lessons">Lessons</Link>
        <Link to="/add-lesson">Add Lesson</Link>
      </>
      {isAuthenticated ? (
        <>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
