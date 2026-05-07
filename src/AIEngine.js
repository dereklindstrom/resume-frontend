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
        const aiData = JSON.parse(cleanJsonString);
        
        // 🏗️ BUILD THE RESUME USING THE EXACT KEYS FROM YOUR JSON
        let formattedResume = `## Professional Summary\n\n`;
        formattedResume += `${aiData.summary || "Summary not provided."}\n\n`;

        if (aiData.skills && Array.isArray(aiData.skills)) {
          formattedResume += `## Core Competencies\n\n`;
          formattedResume += aiData.skills.map(skill => `- ${skill.trim()}`).join('\n') + `\n\n`;
        }

        if (aiData.experience && Array.isArray(aiData.experience)) {
          formattedResume += `## Professional Experience\n\n`;
          aiData.experience.forEach(job => {
            formattedResume += `### ${job.title} | ${job.company}\n`;
            formattedResume += `*${job.dates}*\n\n`;
            formattedResume += `${job.roleOverview}\n\n`;
            
            if (job.metrics && Array.isArray(job.metrics)) {
              job.metrics.forEach(metric => {
                formattedResume += `- ${metric}\n`;
              });
            }
            formattedResume += `\n`;
          });
        }

        if (aiData.education && aiData.education.degree) {
          formattedResume += `## Education\n\n`;
          formattedResume += `**${aiData.education.degree}**\n`;
          formattedResume += `${aiData.education.school}\n\n`;
        }

        if (aiData.coaching) {
          formattedResume += `## 💡 AI Career Coaching Insights\n\n`;
          
          if (aiData.coaching.suggestedRoles) {
            formattedResume += `**Suggested Next Roles:** ${aiData.coaching.suggestedRoles.join(', ')}\n\n`;
          }
          
          if (aiData.coaching.skillGaps && Array.isArray(aiData.coaching.skillGaps)) {
            formattedResume += `### Targeted Skill Development\n\n`;
            aiData.coaching.skillGaps.forEach(gap => {
              formattedResume += `- **${gap.skill}**: ${gap.reason}\n`;
              formattedResume += `  - *Free Path:* ${gap.freeResource}\n`;
              formattedResume += `  - *Premium Path:* ${gap.paidResource}\n\n`;
            });
          }
        }
console.log("📝 FINAL OUTPUT STRING:", formattedResume);
        return formattedResume;

      } catch (parseError) {
        console.error("Failed to parse JSON from AI:", parseError);
        return "The AI returned a slightly malformed document. Please click Regenerate.";
      }
    } else {
      return "Something went wrong on the server. Check your VS Code terminal.";
    }

  } catch (error) {
    console.error("Connection failed!", error);
    return "Error: Could not connect to the backend.";
  }
};