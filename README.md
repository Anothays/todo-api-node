# Todo API

API REST de gestion de tâches (todos), construite avec Express et SQLite (sql.js).

## Badges

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Anothays_todo-api-node&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Anothays_todo-api-node)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.x-brightgreen.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-10.x-red.svg)](https://www.npmjs.com/)
[![Express](https://img.shields.io/badge/express-5.x-000000.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Technologies et versions

| Technologie | Version |
| ----------- | ------- |
| Node.js     | ≥ 24    |
| npm         | 10.x    |
| Express     | 5.x     |
| sql.js      | 1.6.x   |
| Jest        | 30.x    |
| ESLint      | 10.x    |

Le projet utilise **ES modules** (`"type": "module"` dans `package.json`).

## Démarche pour déployer en local

### Prérequis

- **Node.js** ≥ 24 ([nodejs.org](https://nodejs.org/))
- **npm** (livré avec Node.js)

Vérifier les versions :

```bash
node -v   # v24.x ou supérieur
npm -v    # 10.x ou supérieur
```

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd todo-api-node
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Variables d’environnement (optionnel)

Pour personnaliser le serveur et les clés (debug, etc.), créez un fichier `.env` à la racine :

```env
PORT=3000
SECRET_KEY=votre_secret
API_KEY=votre_api_key
NODE_ENV=development
```

- `PORT` : port d’écoute (défaut : 3000)
- `SECRET_KEY` / `API_KEY` : utilisés par l’endpoint `/debug` en développement
- `NODE_ENV` : `development` ou `production`

Sans `.env`, l’API tourne avec les valeurs par défaut (port 3000).

### 4. Lancer l’API

```bash
npm start
```

Le serveur écoute sur `http://localhost:3000` (ou le port défini par `PORT`).

### 5. Vérifier que l’API répond

- **Page d’accueil** : [http://localhost:3000](http://localhost:3000)
- **Health check** : [http://localhost:3000/health](http://localhost:3000/health)
- **Documentation Swagger** : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Scripts disponibles

| Commande       | Description                          |
| -------------- | ------------------------------------ |
| `npm start`    | Démarre le serveur                   |
| `npm run dev`  | Démarre le serveur en mode watch     |
| `npm run lint` | Lance ESLint                         |
| `npm test`     | Lance les tests Jest avec couverture |

## Structure du projet

- `app.js` – Application Express, routes racine (`/`, `/health`, `/debug`), Swagger
- `main.js` – Point d’entrée, démarrage du serveur
- `routes/todo.js` – Routes CRUD et recherche pour les todos
- `database/database.js` – Accès base SQLite (sql.js)
- `helpers/utils.js` – Utilitaires (formatage, etc.)
- `tests/` – Tests Jest et supertest

## Licence

MIT (ou celle indiquée dans le dépôt).

## How to deploy with Docker

Write .env file to inject into your docker container:

```
// .env file
SECRET_KEY=changeMe
API_KEY=changeMe
DB_PASSWORD=changeMe
NODE_ENV=production
```

```shell
docker pull ghcr.io/anothays/todo-api-node:main
docker run -d --env-file ".env" --name todo-api-node -p 3000:3000 ghcr.io/anothays/todo-api-node:main
```
