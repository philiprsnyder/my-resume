# My Resume
---

What is this?

In short, it is code that generates my resume in a printable PDF, web site, mobile and desktop application format - all from one source.

Why?

I got tired of rewriting my resume. All I needed was a data source I could update every so often and then a renderer. I decided since the jobs I'm applying for have these requirements, why not use my resume to show that I am capable.

Then after I had that done, I started asking ChatGPT to help me rephrase my often cludgy english. It started out innocently enough... rewrite my summary, rephrase the bit at the end about the code repo, etc.

And then it hit me. I need a simple UI where I can manage my resume data, add skills and proficiency levels. Then at anytime I should be able to put in a description from a job I just found and have ChatGPT perform a set of actions. Wouldnt it be even better if it could scrape LinkedIn and recommend jobs proactively? ooooOOOOO!

Basic idea of what the API would do:

1. scan the job description for keywords.
2. compare those keywords against my set of skills.
3. rephrase content of resume to highlight my skills that are keywords in the description.
4. generate a PDF of the resume specific to that position.
5. generate a cover letter geared towards the employer's industry.
6. prompt me to approve...
7. once approved, submit the application, and set calendar notifications for me to follow up.

If I can't get a job after all that, then its hopeless.