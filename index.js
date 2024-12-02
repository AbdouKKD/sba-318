const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

// Updated movie data including the required changes and organization by director
const movieList = {
  "Christopher Nolan": [
    { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi" },
    { id: 2, title: "The Dark Knight", year: 2008, genre: "Action" },
    { id: 12, title: "Memento", year: 2000, genre: "Thriller" },
  ],
  "Martin Scorsese": [
    { id: 3, title: "Taxi Driver", year: 1976, genre: "Crime" },
    { id: 4, title: "Goodfellas", year: 1990, genre: "Crime" },
    {
      id: 14,
      title: "The Wolf of Wall Street",
      year: 2013,
      genre: "Biography",
    },
  ],
  "Stanley Kubrick": [
    { id: 5, title: "2001: A Space Odyssey", year: 1968, genre: "Sci-Fi" },
    { id: 6, title: "A Clockwork Orange", year: 1971, genre: "Sci-Fi" },
    { id: 15, title: "Full Metal Jacket", year: 1987, genre: "War" },
  ],
  "Francis Ford Coppola": [
    { id: 7, title: "The Godfather", year: 1972, genre: "Crime" },
    { id: 8, title: "The Godfather Part II", year: 1974, genre: "Crime" },
    { id: 9, title: "Apocalypse Now", year: 1979, genre: "War" },
  ],
  "Steven Spielberg": [
    { id: 10, title: "Schindler's List", year: 1993, genre: "History" },
    { id: 11, title: "Saving Private Ryan", year: 1998, genre: "War" },
    { id: 13, title: "Jaws", year: 1975, genre: "Thriller" },
  ],
};
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse POST request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Home page route
app.get("/", (req, res) => {
  res.render("index", { movieList });
});

// Movies list route
app.get("/movies", (req, res) => {
  res.render("movies", { movieList });
});

// Movie detail route
app.get("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  let movie = null;
  for (const director in movieList) {
    movie = movieList[director].find((m) => m.id === parseInt(movieId));
    if (movie) break;
  }

  if (!movie) {
    return res.status(404).send("Movie not found");
  }

  res.render("movie", { movie });
});

// Route to display the form for adding a new movie
app.get("/movies/new", (req, res) => {
  res.render("newMovie");
});

// Route to handle form submission for a new movie
app.post("/movies/create", (req, res) => {
  const newMovie = {
    id: Date.now(),
    title: req.body.title,
    director: req.body.director,
    year: parseInt(req.body.year),
    genre: req.body.genre,
  };

  // Add the new movie to the correct director's list
  if (!movieList[newMovie.director]) {
    movieList[newMovie.director] = [];
  }
  movieList[newMovie.director].push(newMovie);

  res.redirect("/movies");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
