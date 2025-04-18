const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const REQUEST_TIMEOUT = 30000; // 30 seconds timeout

const validateApiKey = (apiKey) => {
    if (!apiKey) {
        throw new Error("Gemini API key not found. Please set the GEMINI_API_KEY environment variable.");
    }
    if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
        throw new Error("Invalid Gemini API key format. Please check your environment configuration.");
    }
};

exports.getRemediation = async (diseaseName) => {
    
    console.log(" [+] Starting disease remediation request for:", diseaseName);
    const prompt = `Provide detailed information about the disease "${diseaseName}", including symptoms, causes, and, most importantly, remediation steps (treatment, management, prevention). Present it in a clear and concise way. make it 100 lines max`;

    // Access and validate API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        console.log(" [+] Validating API key...");
        validateApiKey(apiKey);
        console.log(" [+] API key validation successful");

        const genAI = new GoogleGenerativeAI(apiKey);
        console.log(genAI)

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
                console.log(" [+] Initializing Gemini model....");
        
        console.log(" [+] Sending request to Gemini API...");
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out after 30 seconds')), REQUEST_TIMEOUT);
        });
        
        const apiPromise = model.generateContent(prompt);
        const result = await Promise.race([apiPromise, timeoutPromise])
            .catch(error => {
                if (error.message.includes('timed out')) {
                    throw new Error('The request to Gemini API timed out. Please try again.');
                }
                throw error;
            });
            
        console.log(" [+] Received response from Gemini API");
        
        const response = result.response;
        const information = response.text();
        console.log(" [+] Successfully processed response data");
        
        return information;
    } catch (error) {
        console.error(" [-] Gemini API Error:", {
            message: error.message,
            stack: error.stack,
            details: error
        });
        throw new Error(`Failed to get disease information: ${error.message}`);
    }
}