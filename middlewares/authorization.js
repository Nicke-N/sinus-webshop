const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = {
    user: (req, res, next) => {
        if (!req.headers.authorization) {

            return res.sendStatus(401)
        }

        const token = req.headers.authorization.replace('Bearer ', '');

        try {
            const payload = jwt.verify(token, process.env.SECRET)
            req.user = payload

            next()
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    },
    admin: (req, res, next) => {
        if (!req.headers.authorization) {

            return res.sendStatus(401)
        }

        const token = req.headers.authorization.replace('Bearer ', '');

        try {
            const payload = jwt.verify(token,  process.env.SECRET)
     
            if (payload.userRole != 'admin') {
                return res.sendStatus(401)
            }
            req.user = payload

            next()
        } catch (error) {
            console.log(error)
            res.sendStatus(401)
        }
    },
    authorizedUser: (req, res, next) => {
        res.send({title: req.user.role})
    }
}