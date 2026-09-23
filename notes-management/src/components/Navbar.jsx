import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully!");

    navigate("/");
  };

  return (
    <nav className="navbar">

      <h2>Notes App</h2>

      <div className="nav-links">

        <button onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;