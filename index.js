import mongoose from 'mongoose';
import express from 'express';
import 'dotenv/config';
import resourceRoutes from "./routes/resourceRoutes.js";




mongoose.connect(process.env.DB_CONNECTION + process.env.DB_NAME);

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/resource', resourceRoutes)
app.use(function errorHandler(err, req, res, next) { res.send('error happened ' + err.message) });

console.log('started!')

app.listen(process.env.EXPRESS_PORT);

