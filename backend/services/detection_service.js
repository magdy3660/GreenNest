async function analyzeImage(imagePath) {
    try {
        const D = 'https://api.openai.com/v1/images/analyze';
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));
        
        const response = await axios.post(aiEndpoint, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${process.env.AI_API_KEY}`
            }
        });
        
        // For testing, return mock AI analysis
        return {
            diagnosis: d,
            confidence:c,
            recommendations: [
               r,
               r,
               r,
            ],
            analysis: [{
                user: req.user._id,
                plantName: req.body.plantName,
                plantType: req.body.plantType,
                image: image._id,
                health: aiAnalysis.diagnosis,
                notes: req.body.notes,
                aiAnalysis: aiAnalysis
            
        }]
        };
        
        // TODO: Implement actual AI analysis
        /*
     
        
        return response.data;
        */// Helper function to analyze plant image with AI model

    } catch (error) {
        console.error('Error analyzing image:', error);
        throw new Error('Failed to analyze image with AI model');
    }
}