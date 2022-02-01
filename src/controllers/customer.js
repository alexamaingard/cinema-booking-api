const { customer } = require('../utils/prisma');
const prisma = require('../utils/prisma');

const createCustomer = async (req, res) => {
    const {
        name,
        phone,
        email
    } = req.body;

    /**
     * This `create` will create a Customer AND create a new Contact, then automatically relate them with each other
     * @tutorial https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-related-record
     */
    const createdCustomer = await prisma.customer.create({
        data: {
            name,
            contact: {
                create: {
                    phone,
                    email
                }
            }
        },
        // We add an `include` outside of the `data` object to make sure the new contact is returned in the result
        // This is like doing RETURNING in SQL
        include: { 
            contact: true
        }
    })

    res.json({ data: createdCustomer });
}

const updateCustomerById = async (req, res) => {
    console.log("Parameters:", req.params, "Body:", req.body);
    const { id } = req.params;
    const { name, phone, email } = req.body;
    
    try {
        const customerToUpdate = await prisma.customer.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                contact: true
            }
        });
        console.log("Customer to update:", customerToUpdate);

        if(customerToUpdate){
            const updatedCustomer = await prisma.customer.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name,
                    contact: {
                        update: {
                            phone: phone? phone : customerToUpdate.contact.phone,
                            email: email? email: customerToUpdate.contact.email
                        }
                    }
                },
                include: {
                    contact: true
                }
            });

            console.log("Updated customer:", updatedCustomer);
            res.json({ data: updatedCustomer });
        }
        else{
            throw "Customer to update not found.";
        }
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    createCustomer,
    updateCustomerById
};
