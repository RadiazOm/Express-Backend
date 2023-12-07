import express from "express";
import {da, faker} from "@faker-js/faker";
import Resource from "../models/Resource.js";
import 'dotenv/config';

const routes = express.Router();

routes.options('/', function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

routes.options('/:uid', function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

routes.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'DELETE' && req.header('Method') !== 'seed') {
        if (![req.body.name, req.body.type, req.body.planet, req.body.quantity, req.body.recipe].every(string => string !== undefined)) {
            res.sendStatus(400);
        } else {
            console.log('json file correctly formed');
            next()
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

    let items = formatJSON(resources)

    res.json({
        items: items,
        _links: {
            self: {
                href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/`
            }
        },
        pagination: {
            currentPage: 1,
            currentItems: items.length,
            totalPages: 1,
            totalItems: items.length,
            _links: {
                first: {
                    page: 1,
                    href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/`
                },
                last: {
                    page: 1,
                    href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/`
                },
                previous: {
                    page: 1,
                    href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/`
                },
                next: {
                    page: 1,
                    href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/`
                }
            }
        }
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
        res.json({
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

    res.json({
        message: 'Created Resource'
    })
})

/**
 Updates an existing resource
 **/
routes.put('/:uid', async (req, res) => {
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

function formatJSON(data){
    let JSON = [];

    // I have no idea why but dataIndex turns into an index instead of objects from data
    for (const dataIndex in data) {
        let newJson = {}
        newJson.id = data[dataIndex]._id
        newJson.name = data[dataIndex].name
        newJson.type = data[dataIndex].type
        newJson.planet = data[dataIndex].planet
        newJson.quantity = data[dataIndex].quantity
        newJson.recipe = data[dataIndex].recipe
        newJson._links = {
            self: {
                href: `${process.env.EXPRESS_URI}:${process.env.EXPRESS_PORT}/resource/${data[dataIndex]._id}`
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