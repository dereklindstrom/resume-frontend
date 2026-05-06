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
      body: JSON.stringify(userData) 
    });

    const data = await response.json();
    
    if (data.success) {
      // 3. THE TRANSLATOR: Turn the AI's strict JSON back into beautiful Markdown
      try {
        // Parse the raw JSON string from your backend
        const aiData = JSON.parse(data.resume);
        
        let formattedResume = `## Professional Summary\n`;
        formattedResume += `${aiData.summary}\n\n`;

        formattedResume += `## Core Competencies\n`;
        // Handle skills (sometimes AI returns a string instead of an array, this makes it safe)
        const skillsArray = Array.isArray(aiData.skills) ? aiData.skills : aiData.skills.split(',');
        formattedResume += skillsArray.map(skill => `- ${skill.trim()}`).join('\n') + `\n\n`;

        formattedResume += `## Professional Experience\n`;
        aiData.experience.forEach(job => {
          formattedResume += `### ${job.title} | ${job.company}\n`;
          formattedResume += `*${job.dates}*\n\n`;
          formattedResume += `${job.roleOverview}\n\n`; // The 2-sentence leadership overview
          
          job.metrics.forEach(metric => {
            formattedResume += `- ${metric}\n`;
          });
          formattedResume += `\n`;
        });

        // Ensure education exists before adding it
        if (aiData.education && aiData.education.degree && aiData.education.degree !== "N/A") {
          formattedResume += `## Education\n`;
          formattedResume += `**${aiData.education.degree}**\n`;
          formattedResume += `${aiData.education.school}\n\n`;
        }

        // Add your custom AI Coaching Section!
        if (aiData.coaching) {
          formattedResume += `## 💡 AI Career Coaching Insights\n`;
          formattedResume += `**Suggested Next Roles:** ${aiData.coaching.suggestedRoles.join(', ')}\n\n`;
          
          formattedResume += `### Targeted Skill Development\n`;
          aiData.coaching.skillGaps.forEach(gap => {
            formattedResume += `- **${gap.skill}**: ${gap.reason}\n`;
            formattedResume += `  - *Free Path:* ${gap.freeResource}\n`;
            formattedResume += `  - *Premium Path:* ${gap.paidResource}\n`;
          });
        }

        return formattedResume; // Send the perfectly formatted text to the UI!

      } catch (parseError) {
        console.error("Failed to parse JSON from AI:", parseError);
        console.log("Raw AI response was:", data.resume);
        return "The AI engine is formatting the data. Please click Regenerate.";
      }
    } else {
      return "Something went wrong on the server. Check your VS Code terminal.";
    }

  } catch (error) {
    console.error("Connection failed!", error);
    return "Error: Could not connect to the backend. Make sure your server is running!";
  }
};