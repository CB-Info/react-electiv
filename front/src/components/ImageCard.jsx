import { useState } from "react";
import PropTypes from "prop-types";
import API from "../api/axios.jsx";
import { isAccessTokenExpired } from "../api/refreshToken.js";

function ImageCard({ image, mode, onDelete }) {
  const [likes, setLikes] = useState(image.likes.length);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("JWT");
      if (isAccessTokenExpired(token)) {
        await refresh();
      }
      const currentToken = localStorage.getItem("JWT");
      const response = await API.post(
        `/galleries/${image._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      if (response.data.isLike !== null) {
        setLikes(likes + 1);
      }
    } catch (err) {
      console.error("Erreur lors du like:", err);
    }
  };

  const refresh = async () => {
    try {
      const refreshToken = localStorage.getItem("REFRESH_TOKEN");
      const response = await API.post("/auth/refresh", { refreshToken });
      localStorage.setItem("JWT", response.data.token.accessToken);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      const token = localStorage.getItem("JWT");
      if (isAccessTokenExpired(token)) {
        await refresh();
      }
      const currentToken = localStorage.getItem("JWT");
      const response = await API.post(
        `/galleries/${image._id}/unlike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      if (response.data.isUnlike !== null) {
        setLikes(likes - 1);
      }
    } catch (err) {
      console.error("Erreur lors du dislike:", err);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(image._id); 
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={image.image}
        alt={image.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{image.title}</h2>
        <p className="mt-2 text-gray-600">
          <span className="font-bold">{likes}</span> Likes
        </p>
        {mode === "gallery" && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleLike}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Like
            </button>
            <button
              onClick={handleUnlike}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Dislike
            </button>
          </div>
        )}

        {mode === "user" && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleDeleteClick}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

ImageCard.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.array.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  mode: PropTypes.oneOf(["gallery", "user"]),
  onDelete: PropTypes.func,
};

ImageCard.defaultProps = {
  mode: "gallery",
  onDelete: null,
};

export default ImageCard;
