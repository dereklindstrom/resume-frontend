// 🌟 Now accepting the specific tier instead of just true/false
export const generateResumeAPI = async (userData, subscriptionTier = 'free') => {
  console.log(`🚀 Sending data to the secure backend... (Tier: ${subscriptionTier})`);
  
  // 1. Establish who gets the Power Metrics
  const isPremiumAI = subscriptionTier === 'pro' || subscriptionTier === 'executive';

  // 2. Build the base prompt
  let systemPrompt = `You are an expert executive resume writer. 
  Create a professional profile based on these details: ${JSON.stringify(userData)}.
  Return the output STRICTLY in JSON format.`;

  // 🌟 3. THE 3-TIER PREMIUM INJECTION
  if (isPremiumAI) {
    systemPrompt += `
    CRITICAL PREMIUM REQUIREMENT: 
    - You MUST quantify at least 80% of the bullet points. 
    - Use specific metrics: percentages, dollar amounts, headcount, or time-saved.
    - If no metric is provided in the data, use your expertise to infer realistic "Power Metrics" 
      based on the user's seniority (e.g., 'Optimized regional operations resulting in an estimated 15% efficiency gain').
    - Focus aggressively on 'Action -> Result' formatting.`;
  } else {
    systemPrompt += `
    STANDARD REQUIREMENT:
    - Format the work experience clearly and professionally.
    - Do NOT invent metrics, percentages, or numbers that are not explicitly provided in the raw data.
    - Ensure a professional and polite tone.`;
  }

  try {
    const API_URL = 'https://resume-api-rr5i.onrender.com/api/generate-resume';
    
    // 🚨 4. CRITICAL FIX: We are now sending BOTH the userData AND the systemPrompt to your backend!
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userData: userData,
        customPrompt: systemPrompt, // Passing the instructions!
        tier: subscriptionTier
      }) 
    });

    const data = await response.json();
    
    if (data.success) {
      try {
        // Strip any accidental markdown formatting the AI included
        let cleanJsonString = data.resume.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        // Parse it into a real JavaScript Object
        const aiData = JSON.parse(cleanJsonString);
        
        // 🔥 Hand the pure JSON object directly to FinalResumeView.jsx
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