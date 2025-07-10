# WebbyLabMovies - Express.js movies server for WebbyLab

WebbyLabMovies is fully functional Express.js server for any kind of website in this topic.

## Key Features

### User Authentication and Authorization

### CRUD operations for movies

### Movies search and sort by different filters and without them

### Import txt files

## Technology Stack

- **Framework**: Express.js 24
- **Language**: Javascript
- **Authentication**: JWT Middleware
- **ORM**: Sequlize (SQLite)

## Getting Started

To get started with WebbyLabMovies, first set up your environment variables by creating a `.env` file:

```env
SECRET_KEY = 
HOST = 
DIALECT = 
APP_PORT = 

Next, install the dependencies and set up the database:

# Init

npm init

# Install dependencies
npm install
# Start the server
npm run dev
```

Check [http://localhost:80*0](http://localhost:80*0) in your app or Postamn to see the server in action.

## Getting Started with Docker

1. Download Docker Desktop
2. Setup your Dockerfile:
```
FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV APP_PORT=
ENV HOST=
ENV DIALECT=
ENV SECRET_KEY=
EXPOSE ${APP_PORT}
CMD ["npm", "run", "dev"]
```
3. Build an image
```
docker build --no-cache -t your_account/movies
```
4. Run with Docker
```
docker run --name movies -p 8000:8050 -e APP_PORT=8050 your_account/movies
```
5. Enjoy the process

## Project Structure

The project is organized into several key directories:

- `controllers`: Cntrollers that work with routes.
- `db`: Database config and models.
- `errors`: Models for custom errors.
- `middleware`: Middleware for auth.
- `routes`: Endpoints for users and movies.
