const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT || 3000

//middleware function - needs to be in separate file
// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req,res,next) => {
//     res.status(503).send('Site is down')
// })

const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('file must be a .doc or .docx'))   
        }
        //accept file if .pdf
        cb(undefined,true)
    }
})

app.post('/upload', upload.single('upload'), (req,res) => {
    res.send()
}, (error,req,res,next) => {
    res.status(400).send({ error: error.message })    
})

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.listen(port, () => {
    console.log('Server is up on port: '+ port)
})

const Task = require('./models/task')
const User = require('./models/user')


// const main = async () => {
//     // const task = await Task.findById('5ed1ca2093e9cd4cac2847ee')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('5ed1c9fb93e9cd4cac2847ec')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// };

// main()
// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id:'abc123' }, 'secretcharacters', { expiresIn: '12 seconds' })
//     //token can be decoded with base64 

//     const payload = jwt.verify(token, 'secretcharacters')

//     console.log(payload)
// }

// myFunction()
// const bcrypt = require('bcryptjs')

// const myFunc = async () => {
//     const password = 'Red1234'
//     const hashedPass = await bcrypt.hash(password, 8)

//     console.log(password)
//     console.log(hashedPass)

//     const isMatch = await bcrypt.compare('Red1234', hashedPass)
//     console.log(isMatch)
// }

// myFunc()