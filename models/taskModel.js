
const mongoose = require('mongoose')

const taskSchema =  new mongoose.Schema({
    taskName:{
        type:String,
        required:true
    },
    dueDate:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'pending'
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true})

const taskModel = mongoose.model('Task',taskSchema)
module.exports = taskModel