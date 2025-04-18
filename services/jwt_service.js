const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class JWT {
    constructor() {
      
    }

 generateJWT(user) {

  const payload = { userId: user.id,
     email: user.email,
     firstName: user.firstName,
     lastName: user.lastName,
     photoPath: user.photoPath? user.photoPath : null
    };
  const secret = process.env.JWT_SECRET
  const options = { expiresIn: '24h' };

  return jwt.sign(payload, secret, options);  // returns a string
}

}
module.exports = new JWT()