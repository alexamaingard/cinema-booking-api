const express = require("express");
const {
    getMovies,
    createMovie,
    getMoviesByRuntime,
    //addScreening
    getMovieByIdOrName
} = require('../controllers/movie');

const router = express.Router();

router.get("/", getMovies);
router.get("/runtime", getMoviesByRuntime);
// /movie/runtime?min=120
// /movie/runtime?lt=120
// /movie/runtime?gt=120
// /movie/runtime?lt=150&gt=120

router.post("/create", createMovie);
//router.put("/addScreening", addScreening);
router.get("/:idOrName", getMovieByIdOrName);

module.exports = router;