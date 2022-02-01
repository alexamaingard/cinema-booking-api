const { parse } = require('dotenv');
const prisma = require('../utils/prisma');

//const controller = new AbortController();

const getMovies = async (req, res) => {
    //console.log("Query:", req.query);
    //exact minutes
    if(req.query.min){
        const filteredMovies = await prisma.movie.findMany({
            where: {
                runtimeMins: {
                    equals: parseInt(req.query.min)
                }
            },
            include: {
                screenings: true
            }
        });
        //console.log("Filtered:", filteredMovies);
        res.json({ data: filteredMovies })
    }
    //less than minutes
    else if(req.query.lt){
        const filteredMovies = await prisma.movie.findMany({
            where: {
                runtimeMins: {
                    lt: parseInt(req.query.lt)
                }
            },
            include: {
                screenings: true
            }
        });
        //console.log("Filtered:", filteredMovies);
        res.json({ data: filteredMovies })
    }
    //greater than minutes
    else if(req.query.gt){
        const filteredMovies = await prisma.movie.findMany({
            where: {
                runtimeMins: {
                    gt: parseInt(req.query.gt)
                }
            },
            include: {
                screenings: true
            }
        });
        //console.log("Filtered:", filteredMovies);
        res.json({ data: filteredMovies })
    }
    //more than and less than
    else if(req.query.lt && req.query.gt){
        const filteredMovies = await prisma.movie.findMany({
            where: {
                runtimeMins: {
                    lt: parseInt(req.quert.lt),
                    gt: parseInt(req.query.gt)
                }
            },
            include: {
                screenings: true
            }
        });
        //console.log("Filtered:", filteredMovies);
        res.json({ data: filteredMovies })
    }
    //no filters
    else{
        const movies = await prisma.movie.findMany({
            include: {
                screenings: true
            }
        });
        //console.log("Movies:", movies);
        res.json({ data: movies });
    }
}

const createMovie = async (req, res) => {
    console.log(req.body);
    const {
        title,
        runtimeMins
    } = req.body;

    const existingMovie = await prisma.movie.findMany({
        where: {
            title: {
                equals: title,
                mode: 'insensitive'
            }
        }
    });

    try {
        if(existingMovie){
            throw "Movie title already exists in database";
        }
        else{
            const createdMovie = await prisma.movie.create({
                data: {
                    title,
                    runtimeMins,
                    screenings: req.screenings? 
                    {
                        createMany: {
                            data: req.screenings
                        }
                    } : {}
                }
            });
    
            console.log("Created Movie:", createdMovie);
            res.json({ data: createdMovie })
        }
    }
    catch (error) {
        console.log(error);
    }
}


// const addScreening = async (req, res) => {

// }

const getMovieByIdOrName = async (req, res) => {
    console.log("Parameters:", req.params);
    const { idOrName } = req.params;

    const movieFound = await prisma.movie.findMany({
        where: {
            OR: [
                    {
                        title: {
                            equals: idOrName,
                            mode: 'insensitive'
                        }
                    },
                    {
                        id: {
                            equals: isNaN(parseInt(idOrName)) ? 0 : parseInt(idOrName)
                        }
                    }
            ]
        }
    });

    if(movieFound.length === 0){
        console.log("Movie not found in database");
        //controller.abort();
    }
    else{
        console.log("Movie Found:", movieFound);
        res.json({ data: movieFound });
    }
}

module.exports = {
    getMovies, 
    createMovie,
    //addScreening
    getMovieByIdOrName
}