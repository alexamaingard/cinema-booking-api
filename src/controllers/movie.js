const { parse } = require('dotenv');
const { screening } = require('../utils/prisma');
const prisma = require('../utils/prisma');

//const controller = new AbortController();

const getMoviesByRuntime = async (req, res) => {
    console.log("Query:", req.query);

    if(req.query.min){
        console.log("Get by exact runtime");
        
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
        
        console.log("Filtered:", filteredMovies);
        res.json({ data: filteredMovies })
    }
    else if(req.query.lt){
        console.log("Get by less than-runtime");
        
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
        
        console.log("Filtered:", filteredMovies);
        res.json({ data: filteredMovies })
    }
    else if(req.query.gt){
        console.log("Get by greater than-runtime");
        
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
        
        console.log("Filtered:", filteredMovies);
        res.json({ data: filteredMovies })
    }
    else{
        console.log("Get by less than- and greater than-runtime");
        
        const filteredMovies = await prisma.movie.findMany({
            where: {
                AND: [
                    {
                        runtimeMins: {
                            lt: parseInt(req.quert.lt)
                        }
                    },
                    {
                        runtimeMins: {
                            gt: parseInt(req.quert.gt)
                        }
                    }
                ]

            },
            include: {
                screenings: true
            }
        });
        
        console.log("Filtered:", filteredMovies);
        res.json({ data: filteredMovies })
    }
}

const getAllMovies = async (req, res) => {
    const movies = await prisma.movie.findMany({
        include: {
            screenings: true
        }
    });

    console.log("Movies:", movies);
    res.json({ data: movies });
}

const createMovie = async (req, res) => {
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

const findMovieByIdOrName = async (req) => {
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
        },
        include: {
            screenings: true
        }
    });

    return movieFound;
}

const getMovieByIdOrName = async (req, res) => {
    const movieFound = await findMovieByIdOrName(req);

    if(movieFound.length === 0){
        console.log("Movie not found in database");
        //controller.abort();
    }
    else{
        console.log("Movie Found:", movieFound);
        res.json({ data: movieFound });
    }
}

const updateMovieById = async (req, res) => {
    const { id } = req.params;
    const { title, runtimeMins, screenings } = req.body;

    try{
        const movieToUpdate = await findMovieByIdOrName(req); 

        if(movieToUpdate){
            if(screenings){
                console.log("Screenings found");

                for(let i = 0; i < screenings.length; i++){
                    const updatedScreening = await prisma.screening.update({
                        where: {
                            id: screenings[i].id
                        },
                        data: {
                            screenId: screenings[i].screenId,
                            startsAt: screenings[i].startsAt
                        }
                    });
                    console.log("Updated Screening", updatedScreening);
                }
            }

            const updatedMovie = await prisma.movie.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    title: title? title : movieToUpdate.title,
                    runtimeMins: runtimeMins? runtimeMins : movieToUpdate.runtimeMins
                },
                include: {
                    screenings: true
                }
            });
            
            console.log("Updated Movie:", updatedMovie);
            res.json({ data: updatedMovie });
        }
        else {
            throw "Movie to update not found.";
        }
    }
    catch(error){
        console.log(error);
    }
}

const createScreen = async (req, res) => {
    console.log("Connected");
}

module.exports = {
    getAllMovies, 
    createMovie,
    getMoviesByRuntime,
    getMovieByIdOrName,
    updateMovieById,
    createScreen
}