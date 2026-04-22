require("dotenv").config();


const express = require("express");
const cors = require("cors");

const fetch = (...args) =>
    import('node-fetch').then(({default: fetch})=> fetch(...args));

const app = express();
app.use(cors());

const API_KEY = process.env.TMDB_API_KEY;

app.get("/", (req, res) => {
    res.send("EmmyFlix Backend is Running");
});


app.get("/movies", async (req, res) => {
    try {

        const search = req.query.search;

        let url;
        if(search){
            // SEARCH MOVIES
            url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(search)}&region=NG`;
        } else {
            // POPULAR MOVIES
             url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&region=NG`;
        }


        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.log("FETCH ERROR:", error.message);
        res.status(500).json({ error: "Failed to fetch movies" });
    }
});

// watch page
app.get("/movie/:id", async (req, res) => {
    try {
        const movieID = req.params.id;
        const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.log("FETCH ERROR:", error.message);
        res.status(500).json({ error: "Failed to fetch movie" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});