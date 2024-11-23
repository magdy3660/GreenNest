const axios = require('axios');

const testScan = async () => {
    try {
        // Send the data directly, not nested in scanData
        const response = await axios.post('http://localhost:4000/api/scan', {
            img: 'https://www.google.com/image.png',
            user_id: 'ObjectId:24366rf24',
            plantTrackingId: 'obj135355rfg',
            scanResult: "healthy",
            scanDate: new Date()
        });
        
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

const testRegister = async () => {
    try {
    const response = await axios.post('http://localhost:4000/api/register', {
       
        email: 'your  email here',
        password: 'your pass',
         name: 'john doe'
    })
        console.log(response.data.message)

    }
    catch (err) {
        console.log(err.response?.data || err.message)
    }
}
const testLogin = async () => {
    try {
    const response = await axios.post('http://localhost:4000/api/login', {
       
        email:'your email here',
        password: 'your password here',
       
    })
        console.log(response.data.message)

    }
    catch (err) {
        console.log(err.response?.data || err.message)
    }
}
testLogin()