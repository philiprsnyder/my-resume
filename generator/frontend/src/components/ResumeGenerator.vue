<script setup lang="ts">
import { defineExpose, ref } from "vue";
import JsonEditorVue from 'json-editor-vue';
import axios from 'axios';
const data = ref({
  resume: {},
  skillset: [],
  jobUrl: '',
  employerName: '',
  jobTitle: '',
  jobDescription: '',
});
  
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

const findKeywords = async () => {
  try {
    const response = await axios.post('http://localhost:9000/api/find-keywords', {
      employerName: data.value.employerName,
      jobTitle: data.value.jobTitle,
      jobDescription: data.value.jobDescription,
    });
    console.log(response.data);
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
getSkillset();
getResume();

defineExpose({ data, storeResume, storeSkillset, findKeywords });
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
      <h2>Resume JSON</h2>
      <div class="json-editor"><JsonEditorVue v-model="data.resume" /></div>
      <button type="submit">Store Resume</button>
    </form>

    <form class="skillset" @submit.prevent="storeSkillset()">
      <h2>Skillset JSON</h2>
      <div class="json-editor"><JsonEditorVue v-model="data.skillset" /></div>
      <button type="submit">Save Skillset</button>
    </form>

    <form class="job-listing" @submit.prevent="findKeywords()">
      <h2>Job Listing</h2>
      <label>URL: <input type="text" v-model="data.jobUrl" placeholder="URL" /></label>
      <label>Job Title: <input type="text" v-model="data.jobTitle" placeholder="Job Title" /></label>
      <label>Employer: <input type="text" v-model="data.employerName" placeholder="Employer Name" /></label>
      <label>Job Description: <br/>
      <textarea v-model="data.jobDescription" placeholder="Paste Job Description Here"></textarea>
      </label>
      <button type="submit">Find Keywords</button>
    </form>
  </div>
</template>

<style>
form {
  max-height: 30wh;
  display: none;
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
.jse-main {
  height: 50vh !important;
  width: 75vw !important;
  margin-bottom: 10px;
}
</style>
