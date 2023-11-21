import mongoose from 'mongoose';
import express from 'express';
import 'dotenv/config';
import notesRoutes from './routes/notesRoutes.js'
import resourceRoutes from "./routes/resourceRoutes.js";




mongoose.connect(process.env.DB_CONNECTION + process.env.DB_NAME);

const app = express();

app.use('/resource', resourceRoutes)
app.use('/notes', notesRoutes)

app.listen(process.env.EXPRESS_PORT);

// app.get("/", (req, res) => {
//     res.send("PRG6");
// });
