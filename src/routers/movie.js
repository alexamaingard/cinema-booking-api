const express = require("express");
const {
    getAllMovies,
    createMovie,
    getMoviesByRuntime,
    getMovieByIdOrName,
    updateMovieById,
    createScreen
} = require('../controllers/movie');

const router = express.Router();

router.get("/", getAllMovies);
router.get("/runtime", getMoviesByRuntime);
// /movie/runtime?min=120
// /movie/runtime?lt=120
// /movie/runtime?gt=120
// /movie/runtime?lt=150&gt=120

router.post("/create", createMovie);
router.get("/:idOrName", getMovieByIdOrName);
router.patch("/update/:id", updateMovieById);
router.post("/screen/create", createScreen);

module.exports = router;