import mongoose from 'mongoose'
const TaskSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Projects"
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["todo","in-progress","done"],
        default:"todo"
    },
    priority:{
        type:String,
        enum:["low","medium","high"],
        default:"low"
    },
    due_date:{
        type:Date,
        required:true,
    }

},{timestamps:true})
export const Task = mongoose.model("Task",TaskSchema);