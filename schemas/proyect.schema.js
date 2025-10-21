const Joi = require('joi');

// Definimos los campos
const id = Joi.number().integer();
const name = Joi.string();
const backend = Joi.string();
const frontend = Joi.string();
const librarys = Joi.string();
const image = Joi.string();
const urlgit=Joi.string();

// Esquema para crear proyectos
const createProyectSchema = Joi.object({
    name: name.required(),
    backend: backend.required(),
    frontend: frontend.required(),
    librarys: librarys.required(),
    image: image,
    urlgit:urlgit.required(),
});

// Esquema para actualizar proyectos
const updateProyectSchema = Joi.object({
    name: name,
    backend: backend,
    frontend: frontend,
    librarys: librarys,
    image: image,
    urlgit:urlgit
});

// Esquema para obtener proyectos por ID
const getProyectSchema = Joi.object({
    id:id.required()
});

module.exports = {updateProyectSchema,createProyectSchema,getProyectSchema};
