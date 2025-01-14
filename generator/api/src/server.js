require('dotenv').config();

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs')

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const data = {
  skillset: require('../data/skillset.json'),
  resumeData: require('../data/resume.json'),
}
// ChatGPT API endpoints
app.get('/api/test', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/skillset', async (req, res) => {
  const { skillset } = req.body;
  try {
    const _s = { ...data.skillset, ...skillset };
    console.log('saving skillset: ', _s);
    // Save the skillset to the database
    fs.writeFileSync('./data/skillset.json', JSON.stringify(_s, null, 2));
    data.skillset = _s;
    res.json({ message: "Skillset saved successfully", data: data.skillset });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error saving skillset");
  }
});

app.post('/api/find-keywords', async (req, res) => {
  const { jobDescription, employerName, jobTitle } = req.body;
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini", // Use GPT-4 for better results
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": "You will be provided with an employer name, a job title, and a job description, and your task is to extract a list of keywords from it."
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": `Employer Name: ${employerName}\n\nJob Title: ${jobTitle}\n\nJob Description: ${jobDescription}`,
            },
          ],
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating resume");
  }
});


app.post('/api/generate-resume', async (req, res) => {
    const { jobDescription, currentResume } = req.body;
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4", // Use GPT-4 for better results
            messages: [
                { role: "system", content: "You are an expert resume writer." },
                { role: "user", content: `Generate a tailored resume for the following job description based on this resume: \n\nJob Description: ${jobDescription}\n\nCurrent Resume: ${currentResume}` }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating resume");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
