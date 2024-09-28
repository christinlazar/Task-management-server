const taskModel = require('../models/taskModel')
const User  = require('../models/userModel')
const hash = require('../utils/hashPassword')
const JWT = require('../utils/JwtToken')
 const signUp = async(req,res) => {
    try {
        const userData = req.body.userData
        const hashedPassword = await hash.bcryptPassword(userData?.password)
        userData.password = hashedPassword 
        const isExistingUser = await User.findOne({email:userData?.email})
        if(isExistingUser){
            return res.status(200).json({success:false,userExists:true}) 
        }
        const user = new User(userData)
        const savedUser = await user.save()
        if(savedUser){
            return res.json({success:true}) 
        }
    } catch (error) {
        console.error(error)
    }
}

const login = async (req,res) =>{
    try {
        const {email,password} = req.body
        const isValidUser = await User.findOne({email:email})
        if(isValidUser){
            const hashedResult = await hash.comparePassword(password,isValidUser?.password)
            if(hashedResult){
                const accessToken = await JWT.createJWT(isValidUser._id)
                const refreshToken = await JWT.createRefreshToken(isValidUser._id)
                res.cookie('refreshToken',refreshToken,{httpOnly:true,secure:true})
                return res.status(200).json({success:true,accessToken})
            }else{
                return res.json({passwordIncorrect:true})
            }
        }else{
            return res.json({success:false})
        }
    } catch (error) {
        console.error(error)
    }
}

const addTask = async (req,res) =>{
    try {
        const {taskData} = req.body
        // const isExistingTask = await taskModel.findOne({taskName:taskData?.taskName})

        // if(isExistingTask){
        //     return res.status(200).json({success:false,sameTask:true})
        // }else{
            const task = new taskModel(taskData)
            const savedTaskData = await task.save()
            const tasks = await taskModel.find({})
            if(savedTaskData){
                req.io.emit('taskAdded',tasks)
                return res.status(200).json({success:true})
            }    
        // }
    } catch (error) {
        console.error(error)
    }
}

const getAllTasks = async (req,res)=>{
    try {
        const tasks = await taskModel.find({})
        return res.status(200).json({success:true,taskData:tasks})
    } catch (error) {
        console.error(error)
    }
}

const getTaskToEdit = async (req,res) =>{
    try {
        const taskId = req.body.taskId
        const taskToEdit = await taskModel.findOne({_id:taskId})
        return res.status(200).json({success:true,taskToEdit})
    } catch (error) {
        console.error(error)
    }
}

const submitTaskEdit = async (req,res)=>{
    try {
        const {taskId,taskEditedData} =  req.body
        const updatedTask = await taskModel.findOneAndUpdate({_id:taskId},{$set:{taskName:taskEditedData.taskName,dueDate:taskEditedData.dueDate,description:taskEditedData.description}},{new:true})
        req.io.emit('taskUpdated',updatedTask)
        return res.status(200).json({success:true})
    } catch (error) {
        console.error(error)
    }
}

const deleteTask = async (req,res)=>{
    try {
        const {taskId} = req.body
        const tasksAfterDeletion = await taskModel.findOneAndDelete({_id:taskId},{new:true})
        const completedTasks  = await taskModel.find({status:'completed'})
        const tasks = await taskModel.find({})
        req.io.emit('deletedTask',tasks)
        req.io.emit('tasksForCompleted',completedTasks)
        return res.status(200).json({success:true})
    } catch (error) {
        console.error(error)
    }
}

const completeTask = async (req,res)=>{
    try {
        const {taskId} = req.body
        await taskModel.findOneAndUpdate({_id:taskId},{$set:{status:'completed'}})
        const completedTasks  = await taskModel.find({status:'completed'})
        const allTasks = await taskModel.find({})
        req.io.emit('completed',allTasks)
        req.io.emit('taskCompleted',completedTasks)
        return res.status(200).json({success:true})
    } catch (error){
        console.error(error)
    }
}

const getCompletedTasks = async (req,res)=>{
    try {
        const completedTasks  = await taskModel.find({status:'completed'})
        return res.status(200).json({success:true,completedTasks})
    } catch (error) {
        console.error(error)
    }
}

const fetchStats = async (req,res)=>{
   try {
        const today = new Date()
        const completedTasks = await taskModel.countDocuments({status:'completed'})
        const pendingTasks = await taskModel.countDocuments({status:'pending'})
        const overDueTasks = await taskModel.countDocuments({status:'pending',dueDate:{$lt:today}})
        console.log("c",completedTasks,"p",pendingTasks,"ov",overDueTasks)
        return res.status(200).json({completedTasks,pendingTasks,overDueTasks})
   } catch (error) {
    console.error(error)
   }
}

module.exports = {
    signUp,
    login,
    addTask,
    getAllTasks,
    getTaskToEdit,
    submitTaskEdit,
    deleteTask,
    completeTask,
    getCompletedTasks,
    fetchStats
}