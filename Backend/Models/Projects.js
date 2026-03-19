import mongoose, { model, mongo } from "mongoose";
const projectSchema = new mongoose.Schema({
    name:{
        type:"String",
        required:"true",

    },
    description:{
        type:"String",
        required:"true"
    }
},{timestamps:true})
export const Project = mongoose.model("Projects",projectSchema)