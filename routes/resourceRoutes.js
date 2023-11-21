import express from "express";
import { faker } from "@faker-js/faker";
import Resource from "../models/Resource.js";

import { Faker } from "@faker-js/faker";

const routes = express.Router();

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

routes.get('/', async (req, res) => {

    let resources = await Resource.find()

    res.json(resources)
})

routes.get('/:uid', async (req, res) => {
    let resource = await Resource.findById(req.params.uid)

    res.json(resource)
})

export default routes