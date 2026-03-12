import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    console.log(userContent);

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.GEMINI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills , experience, and career objectives. Make it compelling and ATS-friendly and only return text no options or anything else.",
        },
        { role: "user", content: userContent },
      ],
    });

    console.log(response);

    const enhanceContent = response.choices[0].message.content;
    console.log(enhanceContent);

    return res.status(200).json({ enhanceContent });
  } catch (error) {}
  return res.status(400).json({ message: error.message });
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.GEMINI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key responsibilited and achievements. Us action verbs and quantifiable results when possible. Make it ATS-friendly and only return text no options or anything else.",
        },
        { role: "user", content: userContent },
      ],
    });

    const enhanceContent = response.choices[0].message.content;

    return res.status(200).json({ enhanceContent });
  } catch (error) {}
  return res.status(400).json({ message: error.message });
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract data from resume.";

    const userPrompt = `extract data from this resume: ${resumeText}
    
    Provide data in the following JSON format with no additional text before and after: 

    {
      "professional_summary": "",
      "skills": [],
      "personal_info": {
        "image": "",
        "full_name": "",
        "profession": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "website": ""
      },
      "experience": [
        {
          "company": "",
          "position": "",
          "start_date": "",
          "end_date": "",
          "description": "",
          "is_current": false
        }
      ],
      "project": [
        {
          "title": "",
          "type": "",
          "description": ""
        }
      ],
      "education": [
        {
          "institution": "",
          "degree": "",
          "field": "",
          "graduation_date": "",
          "gpa": ""
        }
      ]
    }
    `;

    const response = await ai.chat.completions.create({
      model: process.env.GEMINI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;

    const parsedData = JSON.parse(extractedData);

    const newResume = await Resume.create({ userId, title, ...parsedData });

    res.json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
