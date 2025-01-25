const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 8080;
const cors = require('cors')
const connection = require('./config/db') // connectToDB function
require('dotenv').config()
const User = require('./models/User');





app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('welcome home')
})

let userRouter = require('./routes/userRoutes')
let mailRouter = require('./routes/mailRoutes')

app.use('/users', userRouter)
app.use('/mail', mailRouter)

let usersMap = new Map();

io.on('connection', (socket) => {
    // console.log(socket.id)
    socket.on('addUser', (userId) => {
        console.log(userId, socket.id)
        usersMap.set(userId, socket.id)
        console.log(usersMap)
    })

    socket.on('sendMsg', async (ans) => {
        console.log("event running")
        console.log(ans)
        console.log("ans= ", ans); //{to--email, from , body , subject}

        let friendId = await User.findOne({ email: ans.to }) //{_id, name , email , passowrd}
        console.log(friendId)
        console.log(friendId._id.toString())
        let friendSocket = usersMap.get(friendId._id.toString());
        console.log("friendSocket = ", friendSocket)
        if (friendSocket) {
            io.to(friendSocket).emit('recieveMsg', ans);
        }
    })

});




server.listen(port, () => {
    console.log(`server is running on port ${port}`)
    connection()
})