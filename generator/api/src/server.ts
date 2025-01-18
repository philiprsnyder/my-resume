import dotenv from 'dotenv';
dotenv.config();

import {inspect} from 'util';
import express, { Request, Response } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as cheerio from "cheerio";
import fs from 'fs';
import {v4 as uuidv4} from 'uuid';

interface ParseListingRequest {
  url: string;
}

import {
  // Data interfaces
  JobInterface,
  SkillInterface,
  ResumeInterface,
  // Request interfaces
  GetJobRequest,
  GetKeywordRequest,
  SaveResumeRequest,
  SaveSkillsetRequest,
  SaveJobRequest,
} from './interfaces';
import { all } from 'cypress/types/bluebird';

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());


const data = {
  skillset: require('../data/skillset.json'),
  extendedSkillset: require('../data/skillset.extended.json'),
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
    fs.writeFileSync('./data/skillset.json', JSON.stringify(skillset));
    data.skillset = skillset;
    res.json(data.skillset);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error saving skillset");
  }
});

app.get('/api/resume', (req: Request, res: Response<ResumeInterface|String>) => {
  try {
    res.json(data.resumeData);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching resume");
  }
});

app.post('/api/resume', async (req: Request, res: Response<ResumeInterface|String>) => {
  const { resume } = req.body as SaveResumeRequest;
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
  const { url, employer, title, description, keywords } = req.body as SaveJobRequest;
  try {
    const _j = {
      id: uuidv4(),
      url,
      employer,
      title,
      description,
      keywords,
    };
    data.jobs[_j.id] = _j;
    fs.writeFileSync('./data/jobs.json', JSON.stringify(data.jobs));
    res.json(_j);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error saving job");
  }
});

app.put('/api/job/:id', async (req: Request, res: Response<JobInterface[]|String>) => {
  try {
    const { id } = req.params;
    const { url, employer, title, description, keywords } = req.body as SaveJobRequest;
    data.jobs[id] = {
      id,
      url,
      employer,
      title,
      description,
      keywords,
    };
    fs.writeFileSync('./data/jobs.json', JSON.stringify(data.jobs));
    res.json(data.jobs);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error updating job");
  }
});

app.delete('/api/job/:id', async (req: Request, res: Response<JobInterface[]|String>) => {
  try {
    const { id } = req.params;
    delete data.jobs[id];
    fs.writeFileSync('./data/jobs.json', JSON.stringify(data.jobs));
    res.json(data.jobs);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting job");
  }
});

function getSkillsAndRelated() {
  // Initialize a Set to store unique terms
  const uniqueTerms = new Set();
  // Iterate over each keyword object
  data.extendedSkillset.forEach((s: {name: string; related: string[];}) => {
    // Add the 'name' property to the Set
    uniqueTerms.add(s.name);
    // Add each related term to the Set
    s.related.forEach((term: string) => uniqueTerms.add(term));
  });
  // Convert the Set to an array
  const uniqueArray = Array.from(uniqueTerms);
  return uniqueArray;
}

async function getKeywordsFromOpenAI(messages: any): Promise<string[]> {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini", // Use GPT-4 for better results
      messages,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices[0].message.content.split(', ').map((keyword: string) => keyword.trim());
  } catch (error) {
    console.error("Error querying OpenAI:", error);
    return [];
  }
}

app.post('/api/find-keywords', async (req: Request, res: Response) => {
  const { jobId } = req.body as GetKeywordRequest;
  try {
    const job = data.jobs[jobId];
    const allRelatedSkills = getSkillsAndRelated();
    const messages = [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "You will be provided with an employer name, a job title, and a job description, and my skillset. Your task is to extract a list of keywords from it that are included in my skillset. Return that list as comma separated values."
          }
        ]
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": `Employer Name: ${job.employer}\n\nJob Title: ${job.title}\n\nJob Description: ${job.description}\n\nMy Skillset: ${allRelatedSkills.join(', ')}`,
          },
        ],
      }
    ];
    console.log('ai message: ', inspect(messages, {depth: 5, colors: true}));

    // Query OpenAI 3 times
    const [response1, response2, response3] = await Promise.all([
      getKeywordsFromOpenAI(messages),
      getKeywordsFromOpenAI(messages),
      getKeywordsFromOpenAI(messages),
    ]);

    // Merge and deduplicate the responses
    const mergedKeywords = Array.from(new Set([...response1, ...response2, ...response3]));

    // Save the deduplicated keywords to the job data
    data.jobs[jobId].keywords = mergedKeywords;
    fs.writeFileSync('./data/jobs.json', JSON.stringify(data.jobs));

    res.json(mergedKeywords);

    // const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    //   model: "gpt-4o-mini", // Use GPT-4 for better results
    //   messages,
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // console.log('ai keyword response: ', response.data.choices[0].message.content);
    // const keywords = response.data.choices[0].message.content.split(', ');
    // data.jobs[jobId].keywords = keywords;
    // fs.writeFileSync('./data/jobs.json', JSON.stringify(data.jobs));
    // res.json(keywords);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error finding keywords");
  }
});


app.post('/api/parse-job-listing', async (req: Request, res: Response) => {
  const { url } = req.body as ParseListingRequest;
  try {
    // Fetch the web page content
    const { data: html } = await axios.get(url);
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    // Extract the content of the element using the selector
    const selectors = {
      description: '.show-more-less-html__markup',
      title: '.top-card-layout__title',
      employerName: '.topcard__org-name-link',
    };
    const job: JobInterface = {
      url,
      description: $(selectors.description).text(),
      title: $(selectors.title).text(),
      employer: $(selectors.employerName).text(),
    };
    console.log('job: ', job);
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error parsing job listing");
  }
});

app.post('/api/generate-resume', async (req: Request, res: Response) => {
  const { id } = req.body as { id: string };
  try {
    const aiData = {
      job: data.jobs[id],
      resume: data.resumeData,
      // skillset: data.skillset
    };

    const content = `Generate a tailored resume for the following job description, with emphasis on supplied keywords, based on this resume in json format: \n\nJob Description: ${aiData.job.description}\n\nResume: ${JSON.stringify(aiData.resume)}\n\nKeywords: ${aiData.job.keywords.join(', ')}`;
    console.log('content: ', content);
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini", // Use GPT-4 for better results
      messages: [
        { role: "system", content: "You are an expert resume writer." },
        { role: "user", content },
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('ai response: ', response);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating resume");
  }
});

app.post('/api/generate-cover-letter', async (req: Request, res: Response) => {
  const { id, contactName } = req.body as { id: string; contactName: string; };
  console.log('id: ', id, 'contactName: ', contactName);
  try {
    const job = data.jobs[id];
    const aiData = {
      jobTitle: job.title,
      jobDescription: job.description,
      resume: JSON.stringify(data.resumeData),
      skillset: data.skillset.map((s: {name: string}) => s.name).join(', '),
      jobContactName: contactName,
      jobCompanyName: job.employer,
      jobKeywords: job.keywords.join(', '),
    }
    const content = `
given:
  - resume data supplied in json format identified by [RESUME]
  - skillset identified by [SKILLSET]
  - company name identified by [JOB_COMPANY_NAME]
  - job title identified by [JOB_TITLE]
  - job description identified by [JOB_DESCRIPTION]
  - contact name identified by [JOB_CONTACT_NAME]
  - keywords identified by [JOB_KEYWORDS]
then:
  construct a concise and short linkedin message to contact name at company name as a cover letter for job title.


[RESUME]
${aiData.resume}


[SKILLSET]
${aiData.skillset}


[JOB_DESCRIPTION] 
${aiData.jobDescription}


[JOB_KEYWORDS]
${aiData.jobKeywords}


[JOB_TITLE]
${aiData.jobTitle}


[JOB_COMPANY_NAME]
${aiData.jobCompanyName}


[JOB_CONTACT_NAME]
${aiData.jobContactName}
`;
    console.log('content: ', content);
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini", // Use GPT-4 for better results
      messages: [
        { role: "system", content: "You are an expert resume writer." },
        { role: "user", content },
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('ai response: ', response.data.choices[0].message.content);
    res.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating cover letter");
  }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
