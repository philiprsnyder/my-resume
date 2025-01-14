<template>
  <div>
    <h1>Resume Generator</h1>
    <form @submit.prevent="findKeywords()">
      <input type="text" v-model="jobTitle" placeholder="Job Title" />
      <input type="text" v-model="employerName" placeholder="Employer Name" />
      <textarea v-model="jobDescription" placeholder="Paste Job Description Here"></textarea>
      <textarea v-model="currentResume" placeholder="Paste Current Resume Here"></textarea>
      <button type="submit">Generate Resume</button>
    </form>
    <div v-if="generatedResume">
      <h2>Generated Resume</h2>
      <pre>{{ generatedResume }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';

export default {
  data() {
    return {
      employerName: '',
      jobTitle: '',
      jobDescription: '',
      currentResume: '',
      generatedResume: null,
    };
  },
  methods: {
    async generateResume() {
    },
    async findKeywords() {
      try {
        const response = await axios.post('http://localhost:9000/api/find-keywords', {
          employerName: this.employerName,
          jobTitle: this.jobTitle,
          jobDescription: this.jobDescription,
        });
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error("Error finding keywords:", error);
      }
    },
  },
};
</script>

<style>
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
</style>

