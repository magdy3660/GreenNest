const DBService = require("../services/DB_service");
const DetectionService = require("../services/detection_service");
const RemediationService = require("../services/remediation_service")


// SCANS ===================================================================================
exports.sendForDetection = async (req, res) => {
  const userId = req.params.userId
  if (userId != req.user.userId) {     
      res.status(403).json({
      success:false,
      message:"UnAuthorized access to profile, Missing userId"
  })}
  const filePath = req.file?.path;

  if (!filePath) {

    return res.status(400).json({
      success: false,
      message: "No file uploaded or file path missing."
    });
  }

  try {

    const analysisResult = await DetectionService.analyzeImageFromPath(filePath, userId);

    if (analysisResult.status === 400) {
      const analysisError = analysisResult.err
      return res.status(400).json({
        success: false,
        error: {
            message: analysisError.message,
            supportedSpecies: analysisError.supported_plants
        }
    } );
    }
    // clean the data
    const { disease, confidence } = analysisResult.scanResult
    const imageMetadata = {imageName: req.file?.originalname, imagePath: req.file?.path}
    return res.status(200).json({
      success: true,
      message: "Successfully identified plant condition",
      data: {
        disease,
        confidence,
        imageMetadata
      }
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Flask server unavailable",
      error: {
        message: "SERVER_ERROR, AI service unavailable",
        details: err.flaskData || null
      }
    })
  }
}

// HISTORY/ ===================================================================================

// SCANS
exports.getAllScans = async (req, res) => {
  console.log("get all scans hit")

  const userId = req.params.userId
    if (userId != req.user.userId) {     
        res.status(403).json({
        success:false,
        message:"UnAuthorized access to profile, Missing userId"
    })}

  try {
    const scans = await DBService.getAllScans(userId)

     

    res.status(200).json({
      success: true,
      data: scans || [],
    })

  } catch (err) {
    res.status(500).json({
      success:false,
      message: "server_error",
      error: {
        details: err,
        message:"SERVER_ERROR"
      }
    })

  }
}


exports.getScanEntity = async (req, res) => {
  const { userId, historyId } = req.params;

  if (userId != req.user.userId) {     
    res.status(403).json({
      success:false,
      message:"UnAuthorized access to profile, Missing userId"
  })}

  if (!historyId) {
    return res.status(400).json({
      success: false,
      message: "missing history id",
      error: {
        message: "Scan Id is required"
      }
    });
  }

  try {
    const historyEntity = await DBService.getScanEntity(userId, historyId);

    if (!historyEntity) {
      return res.status(404).json({
        success: false,
        message: " the requested species could not be found, 404, Scan entry not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scan entry retrieved successfully",
      data: historyEntity
    });

  } catch (error) {
    console.error('Error fetching Scan entry:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Scan entry",
      error: error.message
    });
  }
};
// save to history

exports.saveToScans = async (req, res) => {
 
  const userId = req.params.userId
    if (userId != req.user.userId) {     
        res.status(403).json({
        success:false,
        message:"UnAuthorized access to profile, Missing userId"
    })}

  const { disease, imageMetadata, confidence ,remediations} = req.body;

   
    console.log("scans userId", userId)
    if (!disease || !imageMetadata || !confidence ) {
      return res.status(400).json({
        success: false,
        message: "Invalid scan details, missing disease or image metadata",
        error: {
          message: "Disease and image metadata are required"
        }
      });
    }
    // object to be saved
    const scanInfo = {
      disease,
      confidence,
      imageMetadata,
      remediations: remediations || null
        }

    try {
      const savedEntry = await DBService.saveScanEntry(userId,scanInfo);
      if (savedEntry) {
        return res.status(201).json({
      success: true,
      message: "Scan results saved to DB",
      data: {message: "succesfully saved Scan to history"}
    });
  }

  } catch (error) {
    console.error('Save to Scan error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: "SERVER_ERROR"
      }
    });
  }
};
//============================== REMEDIATION===============================

exports.getRemediation = async (req, res) => {
  const disease = req.body.disease;
  if (!disease) {
    return res.status(400).json({
      success: false,
      message: "Disease key is required",
      error: {
        message: "Disease name is required"
      }
    });
  }

  try {
    const chat_response = await RemediationService.getRemediation(disease);

    return res.status(200).json({
      success: true,
      message: "Succesfully retrieved remediation steps",
      data: {
        disease: disease,
        remediations: chat_response
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "SERVER_ERROR",
      error: {
        message: error.message
      }
    });
  }



}