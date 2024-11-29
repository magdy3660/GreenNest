const jwt = require('jsonwebtoken');
const User = require('../../models/user');

exports.getRegisterPage = (req, res) => {
    res.render('register', { error: null });
};

exports.register = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
            return res.render('register', { error: 'All fields are required' });
        }

        console.log('Registration attempt:', { email, name });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Registration failed: Email already exists:', email);
            return res.render('register', { error: 'Email already registered' });
        }

        const user = new User({
            email,
            password,
            name
        });

        await user.save();
        console.log('User registered successfully:', { id: user._id, email: user.email });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }

        );           
         console.log('User registered successfully:', { id: user._id, email: user.email, token:token });

        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(201).json({
              message: 'Registration successful',
              token,
              user: {
                  id: user._id,
                  email: user.email,
                  name: user.name,
                  isEmailVerified: user.isEmailVerified
              }
          });
      }
      return res.render('dashboard', {
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            isEmailVerified: user.isEmailVerified,
            token: token
        }
    });
        // Render dashboard with user info
      
       
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', { error: 'Error registering user' });
    }
};