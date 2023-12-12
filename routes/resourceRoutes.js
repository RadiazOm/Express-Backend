import express from "express";
import {da, faker} from "@faker-js/faker";
import Resource from "../models/Resource.js";
import 'dotenv/config';
import pagination from '../pagination/Pagination.js'
import Pagination from "../pagination/Pagination.js";

const routes = express.Router();

routes.options('/', function(req, res, next){
    res.header('Allow', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});

routes.options('/:id', function(req, res, next){
    res.header('Allow', 'GET,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});



routes.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (!req.accepts('application/json')) {
        res.sendStatus(400)
        return;
    }
    console.log(`METHOD = ${req.method}`)
    if (req.method !== 'GET' && req.method !== 'DELETE' && req.header('Method') !== 'seed') {
        if (![req.body.name, req.body.type, req.body.planet, req.body.quantity, req.body.recipe].every(string => string !== undefined && string !== '')) {
            console.log('Invalid format')
            res.sendStatus(400);
        } else {
            // if (isNaN(req.body.quantity)) {
            //     console.log(`Not a number with: ${req.body.quantity}`)
            //     res.sendStatus(400)
            // } else {
                console.log('json file correctly formed');
                next()
            // }
        }
    } else {
        console.log('no json file');
        next()
    }
})


/**
 Get all the resources
 **/
routes.get('/', async (req, res) => {

    let resources = await Resource.find()

    // for (const resource of resources) {
    //     resource._links = {
    //         self: `https://${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/${resource._id}`,
    //         collection: `https://${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}`
    //     }
    // }

    let items = formatJSON(resources, req.query)

    let paginationObject = Pagination.format(resources, req.query)

    res.json({
        items: items,
        _links: {
            self: {
                href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/`
            }
        },
        pagination: paginationObject
    })
})



/**
 Get a specific resource by id
 **/
routes.get('/:id', async (req, res) => {
    try {
        let resource = await Resource.findOne({'_id' : req.params.id})

        let items = formatDetailJSON(resource)
        console.log(items)

        res.json(
            items
        )
    } catch (e) {
        res.status(404).json({
            message: 'Could not find resource'
        })
    }
})

/**
 Create a new resource
 **/
routes.post('/', async (req, res) => {
    await Resource.create({
        name: req.body.name,
        type: req.body.type,
        planet: req.body.planet,
        quantity: req.body.quantity,
        recipe: req.body.recipe
    })

    res.status(201).json({
        message: 'Created resource'
    })
})

/**
 Updates an existing resource
 **/
routes.put('/:id', async (req, res) => {
    console.log('got in here')
    try {
        console.log(req.body)
        await Resource.updateOne({_id: req.params.id}, {
            name: req.body.name,
            type: req.body.type,
            planet: req.body.planet,
            quantity: req.body.quantity,
            recipe: req.body.recipe
        })
        console.log('updated resource')
        let item = await Resource.findOne({_id: req.params.id})
        console.log(item)
        res.status(200).json(item)
    }   catch (e) {
        res.status(400).json({
            message: 'Invalid format or incorrect id'
        })
    }
})

/**
 Deletes a resource
 **/
routes.delete('/:id', async (req, res) => {
    try {
        let resource = await Resource.findOne({'_id' : req.params.id})

        if (resource) {
            await Resource.deleteOne({_id: req.params.id})
        }

        res.status(204).json({
            message: 'Deleted resource'
        })
    } catch (e) {
        res.status(404).json({
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

function formatDetailJSON(data) {
    let JSON = {};

    JSON.id = data._id
    JSON.name = data.name
    JSON.type = data.type
    JSON.planet = data.planet
    JSON.quantity = data.quantity
    JSON.recipe = data.recipe
    JSON._links = {
        self: {
            href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/${data._id}`
        },
        collection: {
            href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/`
        }
    }

    return JSON
}

function formatJSON(data, query) {
    let JSON = [];
    let start = query.start - 1
    let limit = Math.min(data.length, query.limit)
    if (isNaN(start) || start <= 0) {
        start = 0
    }
    if (isNaN(limit)) {
        limit = Pagination.currentItems(data.length, start, limit)
    }
    // I have no idea why but i turns into an index instead of objects from data
    for (let i = start; i < Math.min(data.length, start + limit); i++) {
        let newJson = {}
        newJson.id = data[i]._id
        newJson.name = data[i].name
        newJson.type = data[i].type
        newJson.planet = data[i].planet
        newJson.quantity = data[i].quantity
        newJson.recipe = data[i].recipe
        newJson._links = {
            self: {
                href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/${data[i]._id}`
            },
            collection: {
                href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/`
            }
        }
        JSON.push(newJson)
    }

    return JSON
}

export default routes