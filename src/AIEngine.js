export const generateResumeAPI = async (userData) => {
  console.log("🚀 Sending data to the secure backend...");
  
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