// This function securely hands the user's data to your local Node.js backend
export const generateResumeAPI = async (userData) => {
  console.log("🚀 Sending data to the secure backend...");
  
  try {
    // 1. Define the URL
    const API_URL = 'https://resume-api-rr5i.onrender.com/api/generate-resume';
    
    // 2. ACTUALLY CALL FETCH!
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData) // We package the entire profile into JSON
    });

    const data = await response.json();
    
    if (data.success) {
      return data.resume; // This is the real text from Gemini!
    } else {
      return "Something went wrong on the server. Check your VS Code terminal.";
    }

  } catch (error) {
    console.error("Connection failed!", error);
    return "Error: Could not connect to the backend. Make sure your VS Code server is running!";
  }
};