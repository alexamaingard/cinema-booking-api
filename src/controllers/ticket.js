const prisma = require('../utils/prisma');

const getAllTickets = async (req, res) => {
    const tickets = await prisma.ticket.findMany({
        include: {
            customer: true,
            screening: {
                include: {
                    movie: true,
                    screen: true
                }
            }
        }
    });
    console.log("Tickets:", tickets);
    res.json({ data: tickets });
}

const createTicket = async (req, res) => {
    const { screeningId, customerId } = req.body;

    const createdTicket = await prisma.ticket.create({
        data: {
            customerId: customerId,
            screeningId: screeningId
        },
        include: {
            customer: true,
            screening: {
                include: {
                    movie: true,
                    screen: true
                }
            }
        }
    });
    console.log("Created Ticket:", createdTicket);
    res.json({ data: createdTicket });
}

module.exports = {
    getAllTickets,
    createTicket
}