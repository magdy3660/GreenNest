const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const cors = require('cors');
const path = require('path')
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/apiRoutes');
const webRoutes = require('./routes/authRoutes');

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

// Routes come AFTER middleware
server.use('/api', apiRoutes);
server.use('/', webRoutes);

server.get('/register', (req, res) => {
    res.render('register', { error: null });
});

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

// Global error handler for JSON responses
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});
