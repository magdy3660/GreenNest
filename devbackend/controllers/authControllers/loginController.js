const User = require('../../models/user')

exports.getLoginPage = (req, res) => {
    res.render('login', { error: null });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt", { email, password });
        
        const user = await User.findOne({ email });
        
        if (!user) {
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            return res.render('login', { error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            return res.render('login', { error: 'Invalid credentials' });
        }

        const token = user.generateAuthToken();
        console.log("User logged in successfully:", {
            name: user.name,
            email: user.email
        });

        // Set token in cookie for both API and web interface
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax'
        });

        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.json({
                message: 'Login successful',
                token, // Include token in response for API clients
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            });
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(500).json({ error: 'Login failed' });
        }
        res.render('login', { error: 'Login failed' });
    }
};