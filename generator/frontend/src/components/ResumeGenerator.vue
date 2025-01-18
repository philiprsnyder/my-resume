<script setup lang="ts">
import { defineExpose, ref } from "vue";
import JsonEditorVue from 'json-editor-vue';
import axios from 'axios';
import ToolTipIcon from "./SvgIcon.vue";
import { Icon } from "@iconify/vue";
import ToolTip from "./ToolTip.vue";

interface DataInterface {
  resume: object;
  skillset: object[];
  jobListings: Record<string, JobInterface>;
  job?: JobInterface;
  jobId?: string;
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
  jobId: '',
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
  const elems = document.querySelectorAll('.job-listings > li.job.selected');
  elems.forEach((elem) => elem.classList.remove('selected'));
  const elem = evt.currentTarget as HTMLElement;
  if (elem) elem.classList.add('selected');
  // const { url, title, employer, description, keywords } = job;
  data.value.jobUrl = job?.url ?? '';
  data.value.jobId = job?.id ?? '';
  data.value.jobTitle = job?.title ?? '';
  data.value.employerName = job?.employer ?? '';
  data.value.jobDescription = job?.description ?? '';
  data.value.keywords = job?.keywords ?? [];
  unselectKeyword();
};

const selectKeyword = (evt: Event) => {
  const elems = document.querySelectorAll('.job-listing-keywords > li');
  elems.forEach((elem) => elem.classList.remove('selected'));
  const elem = evt.currentTarget as HTMLElement;
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
const createJobListing = async () => {
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
    console.error("Error creating job listing:", error);
  }
};
const updateJobListing = async () => {
  try {
    const response = await axios.put(`http://localhost:9000/api/job/${data.value.jobId}`, {
      url: data.value.jobUrl,
      title: data.value.jobTitle,
      employer: data.value.employerName,
      description: data.value.jobDescription,
      keywords: data.value.keywords,
    });
    console.log('response data: ', response.data);
    if (data.value.jobId) data.value.jobListings[data.value.jobId] = response.data;
    return response.data;
  } catch (error) {
    console.error("Error updating job listing:", error);
  }
};
const storeJobListing = async () => {
  try {
    if (data.value.jobId) {
      return updateJobListing();
    } else {
      return createJobListing();
    }
  } catch (error) {
    console.error("Error storing job listing:", error);
  }
};    
  //   const response = await axios.post('http://localhost:9000/api/job', {
  //     url: data.value.jobUrl,
  //     title: data.value.jobTitle,
  //     employer: data.value.employerName,
  //     description: data.value.jobDescription,
  //     keywords: data.value.keywords,
  //   });
  //   const { id } = response.data as {id: string};
  //   console.log('response data: ', response.data);
  //   if (id) {
  //     data.value.jobListings[id] = response.data;
  //   }
  //   return response.data;
  // } catch (error) {
  //   console.error("Error storing job listing:", error);
  // }
// };

const fetchJobListing = async () => {
  const url = data.value.jobUrl;
  try {
    const response = await axios.post(`http://localhost:9000/api/parse-job-listing`, { url });
    const job = response.data as JobInterface;
    data.value.jobUrl = job.url || '';
    data.value.jobTitle = job.title;
    data.value.employerName = job.employer;
    data.value.jobDescription = job.description;
    data.value.keywords = job.keywords || [];
  } catch (error) {
    console.error("Error fetching job listing:", error);
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

const deleteKeyword = (keyword: string) => {
  // const elem = evt.target as HTMLElement;
  // console.log('elem: ', elem);
  // if (elem) elem.classList.add('selected');
  console.log('selected keyword: ', keyword);
  if (data.value.jobId) {
    console.log('job id: ', data.value.jobId);
    const keywords = data.value.keywords;
    if (keywords) {
      console.log('keywords: ', keywords);
      const index = keywords.indexOf(keyword);
      if (index > -1) {
        keywords.splice(index, 1);
        data.value.jobListings[data.value.jobId].keywords = keywords;
        console.log('new keywords: ', keywords);
      }
    }
  }
};

// const findKeywords = async (job: JobInterface) => {
const findKeywords = async () => {
  try {
    const response = await axios.post('http://localhost:9000/api/find-keywords', { jobId: data.value.jobId });
    console.log(response.data);
    data.value.keywords = response.data;
    if (data.value.jobId) data.value.jobListings[data.value.jobId].keywords = response.data;
    return response.data;
  } catch (error) {
    console.error("Error finding keywords:", error);
  }
};

const selectedPanel = ref('job-listing');
const selectPanel = (panel: string) => selectedPanel.value = panel;
getResume();
getSkillset();
getJobs();

defineExpose({
  data,
  getResume, storeResume,
  getSkillset, storeSkillset,
  fetchJobListing,
  findKeywords
});
</script>

<template>
  <div :selected="selectedPanel">
    <ul class="panels">
      <div class="app-title">Resume Generator</div>
      <li class="job-listing" @click="selectPanel('job-listing')">Jobs</li>
      <li class="resume" @click.stop.prevent="selectPanel('resume')">Resume</li>
      <li class="skillset" @click="selectPanel('skillset')">Skillset</li>
    </ul>

    <div class="page-content">

    <form class="resume" @submit.prevent="storeResume()">
      <!-- <h2>Resume JSON</h2> -->
      <div class="json-editor"><JsonEditorVue v-model="data.resume" /></div>
      <button type="submit">Save</button>
    </form>

    <form class="skillset" @submit.prevent="storeSkillset()">
      <!-- <h2>Skillset JSON</h2> -->
      <div class="json-editor"><JsonEditorVue v-model="data.skillset" /></div>
      <button type="submit">Save</button>
    </form>

    <form class="job-listing" @submit.prevent="storeJobListing()">
      <ul class="job-listings" @click="newJobListing()">
        <li class="job" v-for="(job, id) in data.jobListings" :key="id" @click.prevent.stop="selectJob($event, job)">
          <span class="label"><ToolTip :content="job.title"><span class="employer">{{ job.employer }}</span> - {{ job.title }}</ToolTip></span>
          <span class="icons">
            <!-- <ToolTipIcon title="Find Keywords" icon="carbon:password" @click="findKeywords(job)" /> -->
            <ToolTipIcon title="View Listing" icon="carbon:link" @click="viewJobListing(job)" />
            <ToolTipIcon title="Delete Listing" icon="carbon:trash-can" @click="deleteJobListing(job)" />
          </span>
        </li>
      </ul>
      <!-- <h2>Job Listing</h2> -->
      <div class="panel-wrapper">
        <div class="panel">
          <label>
            Keywords ({{ data.keywords?.length }})
            <ToolTipIcon title="Find Keywords" icon="carbon:password" @click.stop="findKeywords()" />
            <ul class="job-listing-keywords" @click.stop="unselectKeyword()">
              <li v-for="(keyword, id) in data.keywords" :key="id" @click.stop="selectKeyword($event)">
                <span class="label"><ToolTip :content="keyword">{{ keyword }}</ToolTip></span>
                <span class="icons">
                  <ToolTipIcon title="Delete" icon="carbon:trash-can" @click.stop="deleteKeyword(keyword)" />
                </span>
              </li>
            </ul>
          </label>
        </div>

        <div class="panel">
          <label><span>Title: </span><input type="text" v-model="data.jobTitle" placeholder="Job Title" /></label>
          <label><span>Employer: </span><input type="text" v-model="data.employerName" placeholder="Employer Name" /></label>
          <label><span>URL: </span>
            <input type="text" v-model="data.jobUrl" placeholder="URL" />
            <span class="icon" @click="fetchJobListing()"><Icon title="Fetch Job Listing" icon="carbon:search" /></span>
          </label>
          <label v-if="0"><span>ID: </span><input type="text" v-model="data.jobId" placeholder="ID" disabled class="disabled" /></label>
          <label>Description: <br/>
            <textarea class="job-listing-description" v-model="data.jobDescription" placeholder="Paste Job Description Here"></textarea>
          </label>
        </div>
      </div>
      <div class="button-bar">
        <button class="right" @click="storeJobListing()">Save</button>
        <button @click="newJobListing()">New</button>
        <!-- <button @click="findKeywords()">Find Keywords</button> -->
      </div>
    </form>
  </div>
  </div>
</template>

<style>
.right {
  float: right;
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.job-listing-keywords > li > .label,
.job-listings > li.job > .label {
  left: 0;
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
}
.job-listing-keywords .icons,
.job-listings .icons {
  /* float: right; */
  white-space: nowrap;
}
.job-listing-keywords .icons svg,
.job-listings .icons svg {
  margin: 0 .5rem;
}
form {
  /* max-height: 30vh; */
  /* left: 5vw;
  right: 5vw; */
  /* top: 10em; */
  /* bottom: 10em; */
  position: relative;
  display: none;
}
.panels {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: black;
  border-bottom: 3px solid #2ECC71;
}
.panels .app-title {
  display: inline-block;
  padding: .5em 1em;
  /* color: green; */
  color: #2ECC71;
  font-weight: bold;
  cursor: default;
}
.panels > li {
  cursor: pointer;
  padding: .5em 1em;
}
div[selected="job-listing"] form.job-listing,
div[selected="skillset"] form.skillset,
div[selected="resume"] form.resume {
  display: block;
}
ul.panels {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
ul.panels li {
  display: inline-block;
  background-color: black;
  color: white;
}
div[selected="resume"] li.resume,
div[selected="skillset"] li.skillset,
div[selected="job-listing"] li.job-listing {
  /* background-color: green; */
  background-color: #2ECC71;
  color: white;
  font-weight: bold;
}
button {
  padding: 10px 20px;
  /* background-color: #4CAF50; */
  background-color: #2ECC71;
  color: black;
  font-weight: bold;
  border: none;
  cursor: pointer;
  border: 1px outset;
  border-radius: .5rem;
}
button:hover {
  background-color: #45a049;
}
label {
  display: block;
}
label > span {
  display: inline-block;
  width: 10rem;
}
label > input {
  margin-bottom: .25rem;
  width: calc(100% - 10rem);
}
.jse-main {
  height: 50vh !important;
  /* width: 75vw !important; */
  /* margin-bottom: 10px; */
}
.job-listings {
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;
  height: 10rem;
  width: 100%;
  overflow-y: scroll;
  background-color: white;
}
.job-listing-keywords li,
.job-listings li {
  background-color: #f2f2f2;
  color: black;
  padding: .25rem .75rem;
  border-bottom: 1px solid #c3c3c3;
  display: inline-flex;
  width: 100%;
  box-sizing: border-box;
  cursor: default;
}
.job-listing-keywords li:nth-child(odd),
.job-listings li:nth-child(odd) {
  background-color: rgb(249, 249, 249);
  color: black;
}
.job-listing-keywords > li.selected,
.job-listings > li.selected {
  /* background-color: rgba(125, 68, 240, .75) !important; */
  background-color: #333333 !important;
  color: white;
}
.job-listings,
.job-listing-keywords {
  background-color: white;
  border-style: inset;
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  box-sizing: border-box;
}
.job-listing-keywords {
  height: 15rem;
}
.job-listing-keywords li {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 2em;
  width: 100%;
}
textarea {
  resize: none;
  height: 10rem;
  width: 100%;
  overflow-x: hidden;
  /* max-width: 30rem; */
}
.job-listing .panel-wrapper {
  margin-top: .5rem;
  display: inline-block;
  width: 100%;
}
.job-listing .panel {
  width: calc(50% - 1em);
}
.job-listing .panel:nth-child(2) {
  /* background-color: green; */
  float: left;
  margin-left: .2em;
  width: 70%;
}
.job-listing .panel:nth-child(1) {
  width: calc(30% - 1em);
  /* width: 29%; */
  float: right;
}
.button-bar button {
  margin-right: 1rem;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
  border-left: 1px solid #a0a0a0;
  box-sizing: border-box;
}

*:focus-visible {
  outline: 1px solid #2ECC71;
}
*::-webkit-scrollbar-track {
  /* border-radius: 5px; */
  border-left: 1px solid rgba(0, 0, 0, .25);
  background-color: #d3d3d3;
}

*::-webkit-scrollbar-track:hover {
  background-color: #B8C0C2;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  width: 2px;
  background-color: rgba(0, 0, 0, .25);
  /* background-color: rgba(0, 0, 0, .5); */
  box-shadow: 0 0 1px rgba(255, 255, 255, .25);
}
label > input + button {
  position: relative;
  top: .3rem;
  margin: .3rem;
  background-color: transparent;
  /* border: 1px solid black; */
  padding: 0;
  color: blue;
  opacity: .5;
}
label > input {
  padding-right: 1.15rem;
  text-overflow: ellipsis;
}
label > input .icon {
  position: absolute;
  top: 50%;
  right: 0.5rem; /* Distance from the right edge */
  transform: translateY(-50%);
  pointer-events: none; /* Prevent icon from blocking input clicks */
  font-size: 1rem; /* Adjust icon size */
  color: #888; /* Icon color */
}
label > input + .icon {
  float: right;
  top: -1.5rem;
  color: white;
  position: relative;
  width: 1.15rem;
  left: -0.1rem;
  padding: 0 0.125em;
  height: 1.15rem;
  border-radius: .25rem;
  background-color: #45a049;
  box-sizing: border-box;
}
.page-content {
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#2ecc71+0,c3c3c3+22,2ecc71+100&1+0,0+47,1+100 */
  /* background: linear-gradient(to bottom,  rgba(46,204,113,1) 0%,rgba(195,195,195,0.53) 22%,rgba(147,198,169,0) 47%,rgba(46,204,113,1) 100%); */


  background-color: rgb(80%, 80%, 80%);
  position: absolute;
  /* margin-top: 5rem; */
  /* height: calc(100vh - 5rem); */
  top: calc(2.5rem + 2px);
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  color: black;
}
.json-editor {
  border: 1px solid black;
}
</style>
