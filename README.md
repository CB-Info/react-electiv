# 🖼️ React Gallery Cloud App

Ce projet est une application web permettant aux utilisateurs d'uploader, liker et supprimer des images, avec une architecture cloud moderne, sécurisée et performante.

---

## 🚀 Fonctionnalités

- Authentification sécurisée
- Upload d'images vers **Google Cloud Storage** via des **URLs signées**
- Modération des images grâce à **Google Cloud Vision API**
- Gestion des métadonnées (titre, propriétaire, likes)
- Affichage des images publiques (gallery) ou personnelles (dashboard utilisateur)
- Supprimer ses propres images (cloud + BDD)
- Déploiement via **Cloud Run** (front et back)
- Base de données **MongoDB Atlas**

---

## 📦 Structure du projet

```
📁 api/                      → Backend NestJS
📁 front/                    → Frontend React (Vite)
```

---

## 🧠 Technologies

- **Frontend** : React + Vite + TailwindCSS
- **Backend** : NestJS + MongoDB + Vision API
- **Cloud** : Google Cloud Run + Google Cloud Storage + MongoDB Atlas

---

## ⚙️ Prérequis

- Node.js >= 18
- Compte Google Cloud Platform avec un projet configuré
- Base de données MongoDB Atlas
- Docker (uniquement pour déployer sur le cloud)
- Outils : `gcloud CLI`

---

## 🔐 Variables d'environnement

### Backend (`api/.env`)

```env
PORT=3000
MONGO_URL=mongodb+srv://admin:admin@cluster0.si3bv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
FRONT_URL=https://front-service-208091987949.europe-west9.run.app
JWT_SECRET="c11f5e5988bdd5ec1ce09d24d16253181a74bca9e17390264f0ac69874cbe5d7"
JWT_REFRESH_SECRET="8898058c69a92347217e3f683283bbb3f87b7bb6d791aa894ea63738d155787c"
JWT_EXPIRATION="15m"
#GCS_KEY= {credentials}   <==== local test
```

> En production (Cloud Run), la variable `GCS_KEY` est stockée dans Secret Manager.> En local, il faut penser à commenter la ligne **FRONT\_URL**

---

## ▶️ Lancer le projet en local

### 1. Cloner et installer les dépendances

```bash
git clone <repo>
cd api && npm install
cd ../front && npm install
```

### 2. Lancer l'API (NestJS)

```bash
cd api
npm run start:dev
```

> ⚠️ Assure-toi que `.env` est correctement configuré

### 3. Lancer le frontend (React)

```bash
cd front
npm run dev
```

Accessible sur : [http://localhost:4000](http://localhost:4000)

---

## ☁️ Déploiement sur le Cloud

### 🔧 1. Créer les images Docker & déployer (Back)

```bash
npm run cloud
```

Alias pour :

```bash
npm run build:back     # Docker build
npm run push:back      # Push vers Container Registry
npm run deploy:back    # Déploiement Cloud Run
```

### 🔧 2. Déployer le frontend

Même logique que le backend :

```bash
npm run cloud          # dans /front
```

---

## 🔑 Configuration Cloud

### Secrets

Le fichier de clé GCS est stocké dans **Secret Manager** sous le nom `GCS_KEY`, et monté dans Cloud Run.

### CORS

Le bucket Google Cloud Storage autorise les **origins** du front **cloud** ET **local.**Pour afficher la configuration du bucket, entrer cette commande dans le terminal :

```bash
gcloud storage buckets describe gs://cloud-pct
```

Configuration du bucket :

```json
cors_config:
- maxAgeSeconds: 3600
  method:
  - GET
  - HEAD
  - PUT
  - POST
  - DELETE
  origin:
  - http://localhost:4000
  - https://front-service-208091987949.europe-west9.run.app
  responseHeader:
  - Content-Type
  - Authorization
creation_time: 2025-02-07T15:18:46+0000
default_storage_class: STANDARD
generation: 1738941525452291775
location: EUROPE-WEST9
location_type: region
metageneration: 12
name: cloud-pct
public_access_prevention: inherited
satisfies_pzs: true
soft_delete_policy:
  effectiveTime: '2025-02-07T15:18:46.075000+00:00'
  retentionDurationSeconds: '604800'
storage_url: gs://cloud-pct/
uniform_bucket_level_access: true
update_time: 2025-03-24T10:15:56+0000
```

---

## 🖥️ Configuration Local

### Lancement local :

#### Frontend

- Modifier l'URL de l'API dans `/front/src/api/axios.jsx` par **http\://localhost:3000/api/v1**
- Lancer avec :

```bash
npm run dev
```

#### Backend

- Dans `.env` :
  - Soit commenter la ligne `FRONT_URL`
  - Soit remplacer sa valeur par `http://localhost:4000`
- Ajouter les credentials Google (via `GCS_KEY`)
- Lancer avec :

```bash
npm run start:dev
```

---

## 🤚 Vision API - Modération d'image

Lors de l’upload, une analyse est faite avec **Cloud Vision API** :

- ❌ Rejet si contenu explicite
- ❌ Rejet si étiquette `cat` (images de chat non autorisées 😼)

---

## ✅ TODO / Idées futures

- Intégrer Firebase Cloud Messaging (push notifications)
- Ajout d’un système de commentaires
- Pagination infinie sur la gallery
- Dashboard utilisateur plus complet
