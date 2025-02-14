import ImageCard from "./ImageCard";
import { useEffect, useState, useContext } from "react";
import API from "../api/axios.jsx";
import { isAccessTokenExpired } from "../api/refreshToken.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Gallery() {
  const [isLoading, setIsLoading] = useState(false);
  const [galleries, setGalleries] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { login, logout } = useContext(AuthContext);

  useEffect(() => {
    const loadGallery = async () => {
      setIsLoading(true);

      const token = localStorage.getItem("JWT");
      if (!token) {
        setIsLoading(false);
        return navigate("/login");
      }

      if (isAccessTokenExpired(token)) {
        await refresh();
      }

      try {
        const validToken = localStorage.getItem("JWT");
        const response = await API.get("/galleries/", {
          headers: {
            Authorization: `Bearer ${validToken}`,
          },
        });
        setGalleries(response.data.data);
        console.log(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      }

      setIsLoading(false);
    };

    const refresh = async () => {
      try {
        const refreshToken = localStorage.getItem("REFRESH_TOKEN");
        const response = await API.post("/auth/refresh", { refreshToken });

        const newToken = response.data.token.accessToken;

        login(newToken);
      } catch (err) {
        logout();
        navigate("/login");
      }
    };

    loadGallery();
  }, [navigate, login, logout]);

  return (
    <div className="container mx-auto">
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div>Loading</div>
        ) : galleries && galleries.length > 0 ? (
          galleries.map((image) => (
            <ImageCard key={image._id} image={image} mode="gallery" />
          ))
        ) : (
          <div>No images available</div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
