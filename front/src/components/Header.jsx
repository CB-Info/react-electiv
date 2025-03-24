import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500">
          <Link to="/">Projet Docker</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/gallery"
                    className="text-gray-600 hover:text-blue-500"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/upload"
                    className="text-gray-600 hover:text-green-500"
                  >
                    Upload
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-500"
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-500"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-blue-500"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
