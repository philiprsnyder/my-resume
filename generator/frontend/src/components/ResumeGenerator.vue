<script setup lang="ts">
import { defineExpose, ref } from "vue";
import JsonEditorVue from 'json-editor-vue';
import axios from 'axios';
import { Icon } from "@iconify/vue";

interface DataInterface {
  resume: object;
  skillset: object[];
  jobListings: Record<string, JobInterface>;
  jobUrl: string;
  employerName: string;
  jobTitle: string;
  jobDescription: string;
  keywords?: string[];
}
const data = ref<DataInterface>({
  resume: {},
  skillset: [],
  jobListings: {},
  jobUrl: '',
  employerName: '',
  jobTitle: '',
  jobDescription: '',
});

interface JobInterface {
  id?: string;
  title: string;
  employer: string;
  description: string;
  url?: string;
  keywords?: string[];
}
const getResume = async () => {
  console.log('get resume called');
  try {
    const response = await axios.get('http://localhost:9000/api/resume');
    data.value.resume = response.data;
  } catch (error) {
    console.error("Error getting resume:", error);
  }
};

const storeResume = async () => {
  console.log('store resume called');
  try {
    const response = await axios.post('http://localhost:9000/api/store-resume', {
      resume: data.value.resume,
    });
    return response.data;
  } catch (error) {
    console.error("Error storing resume:", error);
  }
};

const getSkillset = async () => {
  try {
    const response = await axios.get('http://localhost:9000/api/skillset');
    console.log('response data: ', response.data);
    data.value.skillset = response.data;
  } catch (error) {
    console.error("Error getting skillset:", error);
  }
};

const storeSkillset = async () => {
  try {
    const response = await axios.post('http://localhost:9000/api/skillset', {
      skillset: data.value.skillset,
    });
    return response.data;
  } catch (error) {
    console.error("Error storing skillset:", error);
  }
};

const getJobs = async () => {
  try {
    const response = await axios.get('http://localhost:9000/api/jobs');
    const jobs = response.data as Record<string, JobInterface>; // {id: string, title: string, employer: string, description: string}[];
    data.value.jobListings = jobs;
    return response.data;
  } catch (error) {
    console.error("Error getting job listing:", error);
  }
};

const selectJob = (evt: Event, job: JobInterface) => {
  const elem = evt.target as HTMLElement;
  console.log('elem: ', elem);
  const elems = document.querySelectorAll('.job-listings > li');
  elems.forEach((elem) => elem.classList.remove('selected'));
  if (elem) elem.classList.add('selected');
  const { url, title, employer, description, keywords } = job;
  if (url) data.value.jobUrl = url;
  data.value.jobTitle = title;
  data.value.employerName = employer;
  data.value.jobDescription = description;
  data.value.keywords = keywords;
};

const selectKeyword = (evt: Event, job: JobInterface) => {
  const elems = document.querySelectorAll('.job-listing-keywords > li');
  elems.forEach((elem) => elem.classList.remove('selected'));
  const elem = evt.target as HTMLElement;
  if (elem) elem.classList.add('selected');
};
const unselectKeyword = () => {
  const elems = document.querySelectorAll('.job-listing-keywords > li');
  elems.forEach((elem) => elem.classList.remove('selected'));
};

const newJobListing = () => {
  const elems = document.querySelectorAll('.job-listings > li');
  elems.forEach((elem) => elem.classList.remove('selected'));
  data.value.jobUrl = '';
  data.value.jobTitle = '';
  data.value.employerName = '';
  data.value.jobDescription = '';
  data.value.keywords = [];
};

const storeJobListing = async () => {
  try {
    const response = await axios.post('http://localhost:9000/api/job', {
      url: data.value.jobUrl,
      title: data.value.jobTitle,
      employer: data.value.employerName,
      description: data.value.jobDescription,
      keywords: data.value.keywords,
    });
    const { id } = response.data as {id: string};
    console.log('response data: ', response.data);
    if (id) {
      data.value.jobListings[id] = response.data;
    }
    return response.data;
  } catch (error) {
    console.error("Error storing job listing:", error);
  }
};
const viewJobListing = async (job: JobInterface) => {
  console.log('view job listing: ', job);
  window.open(job.url, '_blank');
};
const deleteJobListing = async (job: JobInterface) => {
  try {
    const response = await axios.delete(`http://localhost:9000/api/job/${job.id}`);
    console.log('response data: ', response.data);
    if (job.id) delete data.value.jobListings[job.id];
    data.value.jobListings = response.data;
    return response.data;
  } catch (error) {
    console.error("Error deleting job listing:", error);
  }
};

const deleteKeyword = (keyword: string, job: JobInterface) => {
  // const elem = evt.target as HTMLElement;
  // console.log('elem: ', elem);
  // if (elem) elem.classList.add('selected');
  console.log('selected keyword: ', keyword, job);
  if (job.id) {
    console.log('job id: ', job.id);
    // const newKeywords = data.value.jobListings[job.id].keywords?.filter((kw) => kw !== keyword);
    // const keywords = data.value.jobListings[job.id].keywords;
    const keywords = data.value.keywords;
    if (keywords) {
      console.log('keywords: ', keywords);
      const index = keywords.indexOf(keyword);
      if (index > -1) {
        keywords.splice(index, 1);
        data.value.jobListings[job.id].keywords = keywords;
        console.log('new keywords: ', keywords);
      }
    }
  }
};


const findKeywords = async (job: JobInterface) => {
  try {
    const response = await axios.post('http://localhost:9000/api/find-keywords', { jobId: job.id });
    console.log(response.data);
    data.value.keywords = response.data;
    if (job.id) data.value.jobListings[job.id].keywords = response.data;
    return response.data;
  } catch (error) {
    console.error("Error finding keywords:", error);
  }
};

const selectedPanel = ref('resume');
const selectPanel = (panel: string) => {
  console.log('selected panel: ', panel);
  selectedPanel.value = panel;
};
getResume();
getSkillset();
getJobs();

defineExpose({
  data,
  getResume, storeResume,
  getSkillset, storeSkillset,
  findKeywords
});
</script>

<template>
  <div :selected="selectedPanel">
    <ul class="panels">
      <h1>Resume Generator</h1>
      <li class="resume"><a href="#" @click="selectPanel('resume')">Resume</a></li>
      <li class="skillset"><a href="#" @click="selectPanel('skillset')">Skillset</a></li>
      <li class="job-listing"><a href="#" @click="selectPanel('job-listing')">Job Listing</a></li>
    </ul>

    <form class="resume" @submit.prevent="storeResume()">
      <!-- <h2>Resume JSON</h2> -->
      <div class="json-editor"><JsonEditorVue v-model="data.resume" /></div>
      <button type="submit">Store Resume</button>
    </form>

    <form class="skillset" @submit.prevent="storeSkillset()">
      <!-- <h2>Skillset JSON</h2> -->
      <div class="json-editor"><JsonEditorVue v-model="data.skillset" /></div>
      <button type="submit">Save Skillset</button>
    </form>

    <form class="job-listing" @submit.prevent="storeJobListing()">
      <ul class="job-listings" @click="newJobListing()">
        <li class="job" v-for="(job, id) in data.jobListings" :key="id" @click.stop="selectJob($event, job)">
          {{ job.title }} - {{ job.employer }}
          <span class="icons">
            <Icon icon="carbon:password" @click="findKeywords(job)" />
            <Icon icon="carbon:link" @click="viewJobListing(job)" />
            <Icon icon="carbon:trash-can" @click="deleteJobListing(job)" />
          </span>
        </li>
      </ul>
      <!-- <h2>Job Listing</h2> -->
      <div class="job-listing-panel-wrapper">
        <div class="job-listing-left-panel">
          <label><span>URL: </span><input type="text" v-model="data.jobUrl" placeholder="URL" /></label>
          <label><span>Title: </span><input type="text" v-model="data.jobTitle" placeholder="Job Title" /></label>
          <label><span>Employer: </span><input type="text" v-model="data.employerName" placeholder="Employer Name" /></label>
          <label>Description: <br/>
            <textarea class="job-listing-description" v-model="data.jobDescription" placeholder="Paste Job Description Here"></textarea>
          </label>
        </div>
        <div class="job-listing-right-panel">
          <label>Keywords: <br/>
            <ul class="job-listing-keywords" @click.stop="unselectKeyword()">
              <li v-for="(keyword, id) in data.keywords" :key="id" @click.stop="selectKeyword($event, keyword)">
                {{ keyword }}
                <span class="icons">
                  <Icon icon="carbon:trash-can" @click="deleteKeyword(keyword, data.jobListings[id])" />
                </span>
              </li>
            </ul>
          </label>
        </div>
      </div>
      <div class="button-bar">
        <button @click="newJobListing()">New</button>
        <button type="submit">Save</button>
        <!-- <button @click="findKeywords()">Find Keywords</button> -->
      </div>
    </form>
  </div>
</template>

<style>
.job-listing-keywords .icons,
.job-listings .icons {
  /* margin-right: 1rem; */
  float: right;
}
.job-listing-keywords:hover,
.job-listings:hover {
  cursor: pointer;
}
.job-listing-keywords .icons svg,
.job-listings .icons svg {
  margin: 0 .5rem;
}
form {
  max-height: 30wh;
  display: none;
  position: absolute;
  left: 10vw;
  right: 10vw;
  top: 10em;
  bottom: 10em;
}
.panels {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.panels h1, .panels li {
  padding: .5em 1em;
}
div[selected="job-listing"] > form.job-listing,
div[selected="skillset"] > form.skillset,
div[selected="resume"] > form.resume {
  display: block;
}
ul.panels {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
ul.panels li {
  display: inline-block;
  margin-right: 10px;
  background-color: black;
  color: white;
}
div[selected="resume"] li.resume,
div[selected="skillset"] li.skillset,
div[selected="job-listing"] li.job-listing {
  background-color: white;
  color: black;
}
textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}
button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
label {
  display: block;
}
label > span {
  display: inline-block;
  width: 5rem;
}
label > input {
  margin-bottom: .25rem;
  width: 15rem;
}
textarea {
  width: 15rem;
}
.jse-main {
  height: 50vh !important;
  width: 75vw !important;
  margin-bottom: 10px;
}
.job-listings {
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
  /* height: 10rem; */
  min-height: 13rem;
  max-height: 15rem;
  /* max-width: 50vw; */
  width: 68%;
  overflow-y: scroll;
  /* border: 1px solid black; */
  background-color: white;
}
.job-listing-keywords li,
.job-listings li {
  background-color: #f2f2f2;
  color: black;
  /* background-color: rgb(69, 66, 66); */
  /* color: white; */
  padding: .25rem .75rem;
  border-bottom: 1px solid black;
}
.job-listing-keywords li:nth-child(odd),
.job-listings li:nth-child(odd) {
  background-color: rgb(249, 249, 249);
  color: black;
}
.job-listing-keywords > li.selected,
.job-listings > li.selected {
  background-color: rgba(125, 68, 240, .75) !important;
  color: white;
}

.job-listing-keywords {
  background-color: white;
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow-y: scroll;
  height: 15rem;
  width: 50vw;
  border-top: 2px solid black;
  border-left: 2px solid black;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
}
.job-listing-left-panel textarea {
  height: 10rem;
  width: 100%;
}
.job-listing-panel-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}
.job-listing-left-panel {
  display: inline-block;
  /* border: 1px solid white; */
  height: 20rem;
  position: absolute;
  top: 0;
  width: 33%;
  /* padding-right: 1rem; */
}
.job-listing-right-panel {
  display: inline-block;
  /* border: 1px solid blue; */
  height: 20rem;
  position: absolute;
  top: 0;
  left: 33%;
  width: 33%;
  margin-left: 1em;
}
.button-bar {
  position: absolute;
  top: 33rem;
  left: 0;
  width: 66%;
  /* text-align: right; */
}
.button-bar button {
  margin-right: 1rem;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, .25);
  /* background-color: rgba(0, 0, 0, .5); */
  box-shadow: 0 0 1px rgba(255, 255, 255, .25);
}
</style>
