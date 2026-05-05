# Bar-ometre

Bar-ometre is a local bar discovery app with an interactive map, basic search, and filtering over the current Paris bar dataset.

The backend has been refactored from Flask/Python to an Express API designed around small, expandable layers:

```txt
request -> route -> controller -> service -> repository -> database
```

## Current Stack

- Frontend: static HTML, CSS, and browser JavaScript
- Backend: Node.js, Express, native ES Modules
- Database: PostgreSQL
- Packages: `express`, `cors`, `dotenv`, `pg`
- Development runner: `nodemon`

## Planned Future Stack

The codebase is prepared for future database-specific repositories without installing unused integrations yet:

- PostgreSQL for current structured bar records
- Neo4j later for graph relationships and recommendations
- Redis later for caching and temporary fast data
- MongoDB later for user profiles, reviews, saved lists, photos, and flexible metadata

## Folder Structure

```txt
.
├── client
│   ├── css
│   │   └── style.css
│   ├── index.html
│   └── map.html
├── database
│   ├── db set up intructions.txt
│   └── paris_bars_v02_normalized.sql
├── README.md
└── server
    ├── app.js
    ├── index.js
    ├── package.json
    ├── package-lock.json
    ├── .env.example
    ├── config
    │   └── config.js
    ├── controllers
    │   ├── barController.js
    │   ├── filterController.js
    │   └── healthController.js
    ├── data
    │   ├── postgres
    │   │   ├── postgresClient.js
    │   │   └── barRepository.js
    │   ├── neo4j
    │   │   └── README.md
    │   ├── redis
    │   │   └── README.md
    │   └── mongodb
    │       └── README.md
    ├── middleware
    │   ├── errorHandler.js
    │   └── notFoundHandler.js
    ├── routes
    │   ├── index.js
    │   ├── barRoutes.js
    │   ├── filterRoutes.js
    │   └── healthRoutes.js
    ├── services
    │   ├── barService.js
    │   └── filterService.js
    └── utils
        └── asyncHandler.js
```

## Setup

Install backend dependencies:

```bash
cd server
npm install
```

Create the backend environment file:

```bash
cp .env.example .env
```

Edit `server/.env` for your local PostgreSQL database:

```env
NODE_ENV=development
PORT=3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=bar_ometre
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
```

## Database Setup

The current dump lives at:

```txt
database/paris_bars_v02_normalized.sql
```

It is a PostgreSQL dump containing the `bars` table. The API expects these columns:

```txt
id, name, addr_street, addr_housenumber, addr_postcode, addr_city,
phone, website, opening_hours, latitude, longitude
```

Import the dump into the database named in `POSTGRES_DB`, then start the server.

## Run Commands

Development:

```bash
cd server
npm run dev
```

Production-style start:

```bash
cd server
npm start
```

The app serves the frontend and API from the same Express server:

- `GET /` serves `client/index.html`, which forwards to the map page
- `GET /map` serves the interactive map
- API routes are mounted under `/api`

## API Routes

Primary routes:

```txt
GET  /api/health
GET  /api/bars
GET  /api/bars?name=<name>&city=<city>&arrondissement=<01-20>
GET  /api/bars/:id
GET  /api/bars/search?term=<term>
POST /api/bars/search
GET  /api/bars/city/:city
GET  /api/bars/arrondissement/:arrondissement
GET  /api/filters
GET  /api/filters/cities
GET  /api/filters/stats
```

Legacy compatibility aliases:

```txt
GET  /api/cities
GET  /api/stats
GET  /api/arrondissement/:arrondissement
POST /api/search
```

Successful responses use:

```json
{
  "data": []
}
```

Errors use:

```json
{
  "message": "Something went wrong"
}
```

## Architecture

- `server/app.js` configures Express, middleware, static frontend serving, routes, and error handling.
- `server/index.js` starts the HTTP server.
- `server/routes` defines URL groups.
- `server/controllers` handles HTTP request and response details.
- `server/services` contains application logic and can later combine several databases.
- `server/data/postgres` owns PostgreSQL connection and SQL queries.
- `server/middleware` centralizes error and not-found responses.

Controllers do not query databases directly. SQL stays in repositories and uses parameterized queries.

## Adding a New Feature

To add a new feature:

1. Create a route file in `server/routes`.
2. Create a controller in `server/controllers`.
3. Create a service in `server/services`.
4. Create or update the appropriate repository in `server/data/<database>`.
5. Mount the route in `server/routes/index.js`.
6. Document the endpoint in this README.

Example future review feature:

```txt
routes/reviewRoutes.js
controllers/reviewController.js
services/reviewService.js
data/mongodb/reviewRepository.js
```

Example future recommendation feature:

```txt
routes/recommendationRoutes.js
controllers/recommendationController.js
services/recommendationService.js
data/neo4j/recommendationRepository.js
```

Example future search cache:

```txt
services/searchCacheService.js
data/redis/searchCacheRepository.js
```

## Future Database Integrations

Do not add Neo4j, Redis, or MongoDB packages until a real feature needs them.

When a feature needs another database:

1. Add the package and environment variables for that database.
2. Add a client module only if it is actually used.
3. Add repositories under that database folder.
4. Keep controllers database-agnostic.
5. Combine data in services when needed.

Placeholder READMEs already exist in:

```txt
server/data/neo4j/README.md
server/data/redis/README.md
server/data/mongodb/README.md
```
