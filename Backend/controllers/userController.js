const mongoose = require('mongoose')


exports.getRegistery = async (req, res) => {}
exports.getRegistery = async (req, res) => {}

exports.getLogin = async (req, res) => {}

exports.postLogin = async (req, res) => {

  const {identifier, password} = req.body
    try {
        const user = await User.findOne({ $or: [
                                                { email: identifier }, 
                                                { username: identifier }] })
    
    
    } catch (error) {
        console.log(error)
        
        }
}
exports.postLogin = async (req, res) => {}


exports.getDashboard = async (req, res) => {
         // GET USER INFO FROM DB

        //  const userPlants = //get plants from TRACKING
        // const  ScanHIstory = //get history from scanHIstory
        // const userDEtails  /// get user details from users

const userDetails = {
    user_id: '1234567890',
    username: 'user',
    password: '#2$GGEGRHHRH_HASHED_24@#fCE',
    email: 'user@example.com',
    profilePicture: 'https://example.com/profile.jpg'
}
const scanHistory = [
    {Plant: 'POtato Leafs',image:'https://example.com/plant.jpg', scanDate: '2024-01-01', scanTime: '10:00', scanResult: 'healthy' },
    {Plant: 'POtato Leafs',image:'https://example.com/plant.jpg', scanDate: '2024-01-01', scanTime: '10:00', scanResult: 'Unhealthy', diseaseName: "Leaf BLight" },
]
const trackedPlants = [ {
    name: 'rice leafs',
    image: 'https://example.com/plant.jpg',
    lastScan: '2024-01-01',
    disease: 'Leaf BLight'
}]
const userDashboard = []
       userDashboard.push({
        userdetails:userDetails,
        plants: trackedPlants,
        history: scanHistory
       })
    console.log("user dashboard:" +userDashboard)
res.status(200).json(userDashboard)
}




exports.getHistory = async (req, res) => {
    const scanHistory = [
        {Plant: 'POtato Leafs',image:'https://example.com/plant.jpg', scanDate: '2024-01-01', scanTime: '10:00', scanResult: 'healthy' },
        {Plant: 'POtato Leafs',image:'https://example.com/plant.jpg', scanDate: '2024-01-01', scanTime: '10:00', scanResult: 'Unhealthy', diseaseName: "Leaf BLight" },
    ]
    res.status(200).json(scanHistory)
}