const express = require("express");

const {
    getAllTickets,
    createTicket
} = require('../controllers/ticket');

const router = express.Router();

router.get("/", getAllTickets);
router.post("/create", createTicket);

module.exports = router;