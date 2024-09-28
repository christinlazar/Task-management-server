
const express = require('express')
const userRoute = express()
const userController = require('../controllers/userController')
const authenticateUser = require('../middleware/userAuth')
userRoute.post('/signup',userController.signUp)
userRoute.post('/login',userController.login)
userRoute.post('/addtask',authenticateUser.authenticateUser,userController.addTask)
userRoute.get('/getTasks',authenticateUser.authenticateUser,userController.getAllTasks)
userRoute.post('/getTaskToEdit',authenticateUser.authenticateUser,userController.getTaskToEdit)
userRoute.post('/editTask',authenticateUser.authenticateUser,userController.submitTaskEdit)
userRoute.post('/deleteTask',authenticateUser.authenticateUser,userController.deleteTask)
userRoute.post('/completeTask',authenticateUser.authenticateUser,userController.completeTask)
userRoute.get('/completedTasks',authenticateUser.authenticateUser,userController.getCompletedTasks)
userRoute.get('/stats',authenticateUser.authenticateUser,userController.fetchStats)

module.exports =  userRoute