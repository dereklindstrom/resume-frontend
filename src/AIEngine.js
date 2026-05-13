export const generateResumeAPI = async (userData, isPremium = false) => {
    console.log("🚀 Sending data to the secure backend...");
  
    let systemPrompt = `You are an expert executive resume writer. 
  Create a professional profile based on these details: ${JSON.stringify(userData)}.`;
 
  // 🌟 THE PREMIUM INJECTION
  if (isPremium === true) {
      prompt += `
    CRITICAL PREMIUM REQUIREMENT: 
    - You MUST quantify at least 80% of the bullet points. 
    - Use specific metrics: percentages, dollar amounts, headcount, or time-saved.
    - If no metric is provided in the data, use your expertise to infer realistic "Power Metrics" 
      based on the user's seniority (e.g., 'Optimized regional operations resulting in an estimated 15% efficiency gain').
    - Focus on 'Action -> Result' formatting.`;
  }
  try {
    const API_URL = 'https://resume-api-rr5i.onrender.com/api/generate-resume';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData) 
    });

    const data = await response.json();
    
    if (data.success) {
      try {
        // Strip any accidental markdown formatting the AI included
        let cleanJsonString = data.resume.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        // Parse it into a real JavaScript Object
        const aiData = JSON.parse(cleanJsonString);
        
        // 🔥 THE FIX: Stop translating it to text! 
        // Hand the pure JSON object directly to FinalResumeView.jsx!
        return aiData;

      } catch (parseError) {
        console.error("Failed to parse JSON from AI:", parseError);
        return { summary: "The AI returned a slightly malformed document. Please click Regenerate.", experience: [] };
      }
    } else {
      return { summary: "Something went wrong on the server. Check your VS Code terminal.", experience: [] };
    }

  } catch (error) {
    console.error("Connection failed!", error);
    return { summary: "Error: Could not connect to the backend.", experience: [] };
  }
};