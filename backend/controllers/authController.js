const User = require('../models/user')
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
      
    try {
        console.log('Registration request body:', req.body);
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
            return res.status(400).json({
                message: 'Registration failed: All fields are required',
             
            });
        }

        console.log('Registration attempt:', { email, name });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Registration failed: Email already exists:', email);
            return res.status(400).json({
                message: 'Registration failed: User Already Exists',
            });
        }
        
        // create new user
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
        // send response     
          return res.status(201).json({
              message: 'Registration successful, Please check your inbox for email for verification',
              token,
              user: {
                  id: user._id,
                  email: user.email,
                  name: user.name,
                  isEmailVerified: user.isEmailVerified
              }
          });
     
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', { error: 'Error registering user' });
    }
};




exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt", { email });
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in',
                isEmailVerified: false
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '48h' }
        );

        console.log("User logged in successfully:", {
            name: user.name,
            email: user.email
        });

        // Set token in cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 48 * 60 * 60 * 1000, // 48 hours
            sameSite: 'lax'
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Login failed' 
        });
    }
};