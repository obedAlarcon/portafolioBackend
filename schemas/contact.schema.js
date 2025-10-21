const Joi = require ('joi')


const contactSchema = Joi.object({
    nombre:Joi.string().min(2).max(100).required(),
    email:Joi.string().email().required(),
    mensaje:Joi.string().min(5).max(1000).required()
})
module.exports ={contactSchema}