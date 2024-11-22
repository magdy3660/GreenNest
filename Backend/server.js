const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const errorController = require('./controllers/error')
const { mongoConnect } = require('./util/database')

// ROUTES ===================================================++++
const appRoutes = require('./routes/appRoutes')
const UserRoutes = require('./routes/userRoutes')
server.use('/',appRoutes)
server.use('/user',UserRoutes)
// PARSER
server.use(bodyParser.urlencoded({extended:false}))


server.use(errorController.get404)


mongoConnect().then(() => {
    server.listen(4000, () => {
        console.log("Backend server running on localhost:3000");
    })
  })
  .catch(err => {
    console.log(err)
  })

