<template>
  <div class="resume">
    <Applicant
      :name=resume.applicant.name
      :address=resume.applicant.address
      :contactInfo=resume.applicant.contactInfo />
    <div class="content">
      <div class="title">{{ resume.title }}</div>
      <div class="intro">{{ resume.intro }}</div>
      <div class="section-title">Experience</div>
      <ul class="experience">
        <WorkExperience v-for="(item, index) in resume.experience" :item :index :key="index" />
      </ul>
      <!-- <div class="section-title">Expertise</div>
      <WordCloud :skills=resume.skills /> -->
      <div class="section-title">Education</div>
      <ul class="education">
        <li v-for="(item, key) in resume.education" :key>
          <div class="school-name">{{ item.schoolName }}</div>
          <div class="school-degree">{{ item.degree }}</div>
          <div class="school-years">{{ item.dateString }}</div>
        </li>
      </ul>
    </div>
    <div class="about-resume">
      <div class="qr-code"><IconQrCode /></div>
      <div class="blurb">This resume was created using a custom-built application designed to showcase my expertise in software development. The app features responsive design, cross-platform compatibility, and a dynamic user interface. Explore the source code in this GitHub repository for an in-depth look at my skills and capabilities.</div>
      <!-- <div class="blurb">This resume was generated via code I wrote to showcase my knowledge. I invite you to check out the source in the repository. It is a complete app, able to be built on any major platform, responsive design, and much more interesting than a simple resume.</div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Applicant from '@/components/ApplicantDetails.vue'
import IconQrCode from "@/components/icons/IconQrCode.vue";
// import WordCloud from "@/components/WordCloud.vue";
import WorkExperience from "@/components/WorkExperience.vue";
// Importing data from local JSON file
import json from "@/assets/resume-data.json";

export default defineComponent({
  name: "ResumeView",
  components: {
    Applicant,
    IconQrCode,
    WorkExperience
  },
  data: function() {
    return { resume: json };
  },
  // mounted: function() {
  //   // Checking if everything works, delete this right after you see that everything works
  //   console.log(this);
  // },
});
</script>

<style>
.resume {
  width: 100%;
}
.about-resume {
  padding: 1em;
  margin-top: 1em auto;
}
.about-resume .blurb {
  padding-left: 1em;
  display: flex;
  max-width: 20em;
  position: relative;
}
.about-resume .qr-code {
  zoom: .25;
  /* display: inline-block; */
  float: left;
}
.title {
  width: 100%;
  text-align: right;
}
.intro {
  margin: 1em 0 1em;
}
.experience {
  padding: 0;
}
.education {
  padding-inline-start: 0;
}
.education > li {
  list-style-type: none;
  margin: 1em;
}
.school-name {
  font-weight: bold;
}
.skill-groups {
  padding-inline-start: 0;
  /* border: 1px solid black; */
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.skill-groups > li {
  list-style-type: none;
  min-width: 15vw;
  max-width: 25vw;
  margin: 2vw;
  border: 1px solid black;
  display: inline-block;
}

.skill-group-skills {
  padding-inline-start: 0;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.skill-group-skills > li.skill {
  display: inline-block;
  background-color: yellow;
  color: black;
  max-width: 10em;
  min-width: 2em;
  padding: .2em;
  margin: .2em;
  font-size: .5rem;
}
.skill-group-header {
  display: inline-block;
  width: 100%;
  background-color: green;
  position: relative;
  padding: .2em;
  box-sizing: content-box;
}
.skill-group-name {
  display: inline-block;
}
.skill-badge {
  display: inline;
  background-color: red;
  position: absolute;
  top: 0;
  right: 0;
}

.section-title {
  /* background-color: black;
  color: white; */
  margin-top: 1.5rem;
  border-top: 1px solid black;
  font-weight: bold;
  font-size: 1.25rem;
}
@media (min-width: 1024px) {
  .resume {
    min-height: 100vh;
    display: flex;
  }
}
@media print, (max-width: 1024px) {
  .title {
    border-bottom: 1px solid rgba(0, 0, 0, 0.635);
    font-size: .75rem;
    text-align: center;
    clear: both;
    /* margin-top: 2em; */
  }
}
@media print {
  body {
    padding: 0;
    margin: 0;
  }
  .title {
    display: none;
  }
  .content {
    margin-top: 1.5em;
  }
}
</style>

