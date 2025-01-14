<template>
  <div>
    <h1>Resume Generator</h1>
    <form @submit.prevent="generateResume">
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

<script>
import axios from 'axios';

export default {
  data() {
    return {
      jobDescription: '',
      currentResume: '',
      generatedResume: null,
    };
  },
  methods: {
    async generateResume() {
      try {
        const response = await axios.post('http://localhost:5000/api/generate-resume', {
          jobDescription: this.jobDescription,
          currentResume: this.currentResume,
        });
        this.generatedResume = response.data.choices[0].message.content;
      } catch (error) {
        console.error("Error generating resume:", error);
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

