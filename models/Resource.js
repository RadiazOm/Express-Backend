import mongoose from "mongoose";

const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    name: String,
    type: String,
    planet: String,
    quantity: String,
    recipe: String
});

const Resource = mongoose.model('Resource', resourceSchema)

export default Resource;