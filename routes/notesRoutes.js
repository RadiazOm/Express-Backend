import express from "express";

import Note from "../models/Note.js";

import { Faker } from "@faker-js/faker";

const routes = express.Router();

routes.post('/seed', async (req, res) => {
    console.log('Seed DB')

    await Note.deleteMany({});

    // for (let i = 0; i < 10; i++) {
    //     await Note.create({
    //         title: faker.lorem.sentence({max: 100, min: 10}),
    //         body: faker.lorem.
    //         author: `author`
    //     })
    // }

    res.json({
        message: "het werkt"
    })
})

export default routes