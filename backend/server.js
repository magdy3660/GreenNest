const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const cors = require('cors');
const path = require('path')
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');

// Middleware must come BEFORE routes
server.use(express.json());
server.use(cors());
server.use(bodyParser.urlencoded({extended: false}));
server.use(cookieParser());

// View engine setup
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// Static files
server.use('/uploads', express.static('uploads'));
server.use(express.static(path.join(__dirname, 'public')));

server.use(routes)

const { mongoConnect } = require('./util/database');

async function startServer() {
    try {
        await mongoConnect();
        server.listen(4000, () => {
            console.log('Backend server running on localhost:4000');
        });
    } catch (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    }
}

startServer();

// Error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    if (req.xhr || req.path.startsWith('/api')) {
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    } else {
        res.status(500).render('error', { 
            message: 'Something went wrong!' 
        });
    }
});
