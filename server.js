
const  express  =  require('express')
const connectDB = require('./config/db')
const userRoute = require('./routes/userRoute')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')
connectDB()
const app = express()
const PORT = 5000
const server = http.createServer(app)
const io = socketIO(server,{
    cors:{
        origin:['http://localhost:3000'],
        methods:['GET','POST','PUT','DELETE'],
        credentials:true
    }
})

app.use((req, res, next) => {
    req.io = io;  
    next();
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


app.use(cors({
    origin:['http://localhost:3000'],
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true,
    optionsSuccessStatus:200}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/',userRoute)

server.listen(PORT,()=>{
    console.log(`Server listening on ${PORT}`)
})
