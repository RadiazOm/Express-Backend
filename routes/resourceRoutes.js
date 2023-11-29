import express from "express";
import { faker } from "@faker-js/faker";
import Resource from "../models/Resource.js";

import { Faker } from "@faker-js/faker";

const routes = express.Router();

/**
 Get all the resources
 **/
routes.get('/', async (req, res) => {

    let resources = await Resource.find()

    res.json(resources)
})



/**
 Get a specific resource by id
 **/
routes.get('/:uid', async (req, res) => {
    try {
        let resource = await Resource.findOne({'_id' : req.params.uid})

        res.json(resource)
    } catch (e) {
        res.json({
            message: 'Could not find resource'
        })
    }
})

/**
 Create a new resource
 **/
routes.post('/', async (req, res) => {
    if (!req.is('application/json') || ![req.body.name, req.body.type, req.body.planet, req.body.quantity, req.body.recipe].every(string => string !== undefined)) {
        res.sendStatus(400);
    } else {
        await Resource.create({
            name: req.body.name,
            type: req.body.type,
            planet: req.body.planet,
            quantity: req.body.quantity,
            recipe: req.body.recipe
        })

        res.json({
            message: 'Created Resource'
        })
    }
})

/**
 Updates an existing resource
 **/
routes.put('/:uid', async (req, res) => {
    if (!req.is('application/json') || ![req.body.name, req.body.type, req.body.planet, req.body.quantity, req.body.recipe].every(string => string !== undefined)) {
        res.sendStatus(400);
    } else {
        try {
            let item = await Resource.updateOne({_id: req.params.uid}, {
                name: req.body.name,
                type: req.body.type,
                planet: req.body.planet,
                quantity: req.body.quantity,
                recipe: req.body.recipe
            })
            res.json({
                message: 'Updated resource'
            })
        }   catch (e) {
            res.json({
                message: 'Invalid format or incorrect id'
            })
        }
    }
})

/**
 Deletes a resource
 **/
routes.delete('/:uid', async (req, res) => {
    try {
        let resource = await Resource.findOne({'_id' : req.params.uid})

        if (resource) {
            await Resource.deleteOne({_id: req.params.uid})
        }

        res.json({
            message: 'Deleted resource'
        })
    } catch (e) {
        res.json({
            message: 'Could not find resource'
        })
    }
})

/**
 Seed the database with resources
 **/
routes.post('/seed', async (req, res) => {
    console.log('Seed DB')

    await Resource.deleteMany();

    for (let i = 0; i < 10; i++) {
        await Resource.create({
            name: faker.science.chemicalElement().name,
            type: faker.lorem.word({length: {min: 5, max: 10}, strategy: 'closest'}),
            planet: faker.lorem.word({length: {min: 5, max: 15}, strategy: 'closest'}),
            quantity: faker.number.int({min: 0, max: 100}),
            recipe: faker.lorem.words({min: 2, max: 3})
        })
    }

    res.json({
        message: "Seeded database"
    })
})

export default routes