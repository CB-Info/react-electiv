function HomePage() {
  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <p className="mb-4 text-gray-700">
        Cette application illustre l'utilisation de divers services Cloud :
      </p>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Hébergement sur Google Cloud Run</li>
        <li>Stockage des images dans Google Cloud Storage</li>
        <li>Base de donnée Mongo DB Atlas</li>
        <li>Modération des images via Google Vision API</li>
      </ul>

      <p className="mb-4 text-gray-700">
        Vision API vérifie automatiquement si l’image est appropriée (par
        exemple, il refuse l’image si elle contient du contenu
        explicite ou même un chat ! PS: C'est plus simple pour tester la modération des images 😅 ). Créez un compte ou connectez vous
        pour profiter de la galerie et uploader vos propres images.
      </p>

      <p className="font-semibold text-gray-800">
        <strong>Actions possibles :</strong>
      </p>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>
          <strong>Créer un compte</strong> sur la page{" "}
          <em>Sign Up</em>.
        </li>
        <li>
          <strong>Se connecter</strong> sur la page <em>Login</em>.
        </li>
        <li>
          Accéder à la <strong>Galerie publique</strong> sur l’onglet <em>Gallery</em>.
        </li>
        <li>
          <strong>Uploadez vos images</strong> sur l’onglet <em>Upload</em>.
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
