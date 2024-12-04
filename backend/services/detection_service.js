class DetectionService {

    async analyzeImage(historyId, userId) {
        const history = await History.findOne({ _id: historyId, user: userId })
        .select('image_metadata.image_path image_metadata.image_name');


        if (!history) {
            return null;
        }
        try {
            const D = 'https://api.openai.com/v1/images/analyze';
            const response = await fetch(D, {
                method: 'POST',
                body: JSON.stringify({
                    image: history.image_metadata.image_path
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.AI_API_KEY}`
                }
            });
            
            // TODO: Process response and return analysis
            return response.data;

        } catch (error) {
            console.error('Error analyzing image:', error);
            throw new Error('Failed to analyze image with AI model');
        }
    }
}

module.exports = new DetectionService();