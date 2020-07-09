const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({   
    name: { 
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value<0){
                throw new Error('Must provide a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (value.length<7) {
                throw new Error('password must greater than 6')
            }
            if(value.toLowerCase().includes('password')) {
                throw new Error('password cannot contain the word "password"')
            }
        },
        trim : true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//methods available on instances of the model
userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() },'secretcharacters')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//modified user information sent back so as to not expose password/tokens and optimise without avatar 
userSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//statics available on the model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    
    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

// hash the plain text password before save
userSchema.pre('save', async function (next) {
    //no arrow function as this would not bind
    const user = this

    //ensure password isn't already hashed - isModified checks for modified property by user most recently
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)        
    }

    next()
})

//middleware to remove all user tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

const User = mongoose.model('User', userSchema)

module.exports = User