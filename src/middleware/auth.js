const jwt = require('jsonwebtoken')
const User = require('../models/user')

// without middleware express processes a request by mapping it to the correct route
//
// with middleware the request is intercepted to do something before going to the route handler e.g. check authentication token

const auth = async (req,res,next) => {
    try {
        //client must pass header with bearer property
        const token = req.header('Authorization').replace('Bearer ', '')
        //validate the token
        const decoded = jwt.verify(token, 'secretcharacters')
        //finds user with the correct id that has the authentication token still stored
        const user = await User.findOne({ _id: decoded._id, 'tokens.token':token})

        if(!user){
            throw new Error() //triggers catch below
        }

        //pass on token as request property
        req.token = token
        //below adds property to request that is passed on to the route handler 
        req.user = user

        next()
    } catch(e) {
        res.status(401).send({ error: 'Please authenticate' })
    } 
}

module.exports = auth