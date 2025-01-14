const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 9000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ChatGPT API endpoint
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
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
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
