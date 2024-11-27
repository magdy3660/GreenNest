const axios = require('axios');

async function testAuth() {
    try {
        // First login
        const loginRes = await axios.post('http://localhost:4000/api/login', {
            email: 'magdy@greenNest.com',
            password: 'reksio333'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Login successful, token received');

        // Then fetch dashboard
        const dashboardRes = await axios.get('http://localhost:4000/api/dashboard', {
            headers: {
                'Authorization': `Bearer ${loginRes.data.token}`,
                'Accept': 'application/json'
            }
        });

        console.log('Dashboard data:', dashboardRes.data);

    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response:', error.response.status);
            console.error('Error data:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
        }
    }
}

testAuth();