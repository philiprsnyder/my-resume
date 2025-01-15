require('dotenv').config();

import express, { Request, Response } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import uuid from 'uuid';

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());

import JobInterface from './interfaces/job';
import SkillInterface from './interfaces/skill';
import ResumeInterface from './interfaces/resume';
interface ResumeRequest {
  resume: ResumeInterface;
}
interface GetSkillsetRequest {
}
interface SaveSkillsetRequest {
  skillset: SkillInterface[];
}
interface GetJobRequest {
  id: string;
}
interface SaveJobRequest {
  employer: string;
  title: string;
  description: string;
}
interface SaveJobResponse {
  job: JobInterface;
}
interface KeywordRequest {
  jobDescription: string;
  employerName: string;
  jobTitle: string;
}
interface GenerateResumeRequest {
  jobDescription: string;
  currentResume: string;
}


const data = {
  skillset: require('../data/skillset.json'),
  resumeData: require('../data/resume.json'),
  jobDescriptions: require('../data/job-descriptions.json'),
  jobs: require('../data/jobs.json'),
}

// ChatGPT API endpoints
app.get('/api/test', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/api/skillset', (req: Request, res: Response<SkillInterface[]|string>) => {
  try {
    res.json(data.skillset);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching skillset");
  }
});

app.post('/api/skillset', async (req: Request, res: Response<SkillInterface[]|String>) => {
  const { skillset } = req.body as SaveSkillsetRequest;
  try {
    console.log('skillset: ', skillset);
    fs.writeFileSync('./data/skillset.json', JSON.stringify(skillset));
    data.skillset = skillset;
    res.json(data.skillset);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error saving skillset");
  }
});

app.get('/api/resume', (req: Request, res: Response) => {
  res.json(data.resumeData);
});

app.post('/api/resume', async (req: Request, res: Response<ResumeInterface|String>) => {
  console.log('req.body: ', req.body);
  const { resume } = req.body as ResumeRequest;
  try {
    fs.writeFileSync('./data/resume.json', JSON.stringify(resume));
    data.resumeData = resume;
    res.json(data.resumeData);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error saving resume");
  }
});

app.get('/api/jobs', async (req: Request, res: Response<JobInterface[]|String>) => {
  try {
    res.json(Object.values(data.jobs));
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching jobs");
  }
});

app.get('/api/job', async (req: Request, res: Response<JobInterface|String>) => {
  try {
    const { id } = req.body as GetJobRequest;
    res.json(data.jobs[id]);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching job");
  }
});

app.post('/api/job', async (req: Request, res: Response<JobInterface|String>) => {
  const { employer, title, description } = req.body as SaveJobRequest;
  try {
    const _j = {
      id: uuid.v4(),
      employer,
      title,
      description,
    };
    console.log('saving job: ', _j);
    data.jobs[_j.id] = _j;
    fs.writeFileSync('./data/jobs.json', JSON.stringify(data.jobs));
    res.json(_j);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error saving job");
  }
});

app.post('/api/find-keywords', async (req: Request, res: Response) => {
  const { jobDescription, employerName, jobTitle } = req.body as KeywordRequest;
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

app.post('/api/generate-resume', async (req: Request, res: Response) => {
    const { jobDescription, currentResume } = req.body as GenerateResumeRequest;
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
