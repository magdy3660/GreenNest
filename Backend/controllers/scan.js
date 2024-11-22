const multer = require('multer')
const upload = multer({dest: 'uploads/'})
exports.postScan = async (req, res) => {
    const {Img, user_id} = req.body
    // scan logic
     // send img directly to AI model and store to cloud later delete from server after scan

    
   
       // get response, maniupulate response, send response to user
    



       if (user_id != null) {

        // store image to CLoud 
              // store AI res, image reference..etc

    }
    console.log(" no session found, scan will not be saved saved")
   
    

}