// This function securely hands the user's data to your local Node.js backend
export const generateResumeAPI = async (userData) => {
  console.log("🚀 Sending data to the secure backend...");
  
  try {
    // We send a POST request to the exact port your server is listening on
    const API_URL = 'https://resume-api-YOUR-UNIQUE-ID.onrender.com/api/generate-resume', {
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