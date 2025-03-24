import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ImageCard from "../components/ImageCard";
import { isAccessTokenExpired } from "../api/refreshToken";

function UploadPage() {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const { login, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
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
      const response = await API.get("/galleries/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setUserImages(response.data.data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des images:", err);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const token = localStorage.getItem("JWT");
    if (!token) {
      setIsLoading(false);
      return navigate("/login");
    }

    if (isAccessTokenExpired(token)) {
      await refresh();
    }

    if (!title || !selectedFile) {
      return setError(
        "Veuillez renseigner un titre et choisir un fichier à uploader."
      );
    }

    try {
      const fileName = selectedFile.name;
      const signedUrlRes = await API.get(
        `/galleries/signed-url?filename=${encodeURIComponent(fileName)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { signedUrl, publicUrl } = signedUrlRes.data.data;

      await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      const createResponse = await API.post(
        "/galleries",
        {
          title,
          image: publicUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (createResponse.status === 201 || createResponse.status === 200) {
        setSuccess("Image uploadée avec succès !");
        setTitle("");
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchUserImages();
      } else {
        setError("Une erreur est survenue lors de l’upload.");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.error);
      } else if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(
          err.response?.data?.error ||
            "Une erreur est survenue lors de l’upload."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    setError("");
    setIsLoading(true);
    const token = localStorage.getItem("JWT");
    if (!token) return;

    if (isAccessTokenExpired(token)) {
      await refresh();
    }

    try {
      const token = localStorage.getItem("JWT");
      if (!token) return;

      const response = await API.delete(`/galleries/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setUserImages((old) => old.filter((img) => img._id !== imageId));
      } else {
        setError("Impossible de supprimer l'image.");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'image:", err);
      setError("Impossible de supprimer l'image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
          Uploader une image
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="title"
            >
              Titre de l’image
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
                       focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Mon super paysage"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="fileInput"
            >
              Choisir une image
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-900
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       cursor-pointer"
            />
          </div>

          {previewUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Aperçu de l’image :</p>
              <div className="flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="max-h-48 object-cover rounded"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {isLoading ? "Chargement..." : "Uploader"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-center text-gray-700">
          Mes images
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-500 mt-4">
            Chargement des images...
          </p>
        ) : userImages.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            Aucune image trouvée.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {userImages.map((img) => (
              <ImageCard
                key={img._id}
                image={img}
                mode="user"
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPage;
