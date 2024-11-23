const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const errorController = require('./controllers/error')
const cors = require('cors');

// ROUTES ===================================================++++
const appRoutes = require('./routes/appRoutes')
const authRoutes = require('./routes/authRoutes')
server.use(express.json());
server.use(cors())

server.use(bodyParser.urlencoded({extended:false}))
server.use('/uploads', express.static('uploads'));
// Routes
server.use(appRoutes);
server.use('/api', authRoutes);

server.use(errorController.get404)

const { mongoConnect } = require('./util/database');

async function startServer() {
    try {
        await mongoConnect();
        // Start your Express app here
        server.listen(4000, () => {
            console.log('Backend server running on localhost:4000');
        });
    } catch (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    }
}

startServer();
