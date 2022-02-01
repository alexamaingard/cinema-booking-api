const express = require("express");
const {
    getMovies
} = require('../controllers/movie');

const router = express.Router();

router.get("/", getMovies);
//movie?min=120
//movie?lt=120
//movie?gt=120
//movie?lt=140&gt=120

module.exports = router;