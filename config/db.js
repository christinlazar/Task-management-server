const mongoose = require('mongoose')

const connectDB = async () =>{
    mongoose.connect('mongodb://localhost:27017/task-management', {
        useNewUrlParser: true,
      })
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("Could not connect to MongoDB", err));
}

module.exports = connectDB