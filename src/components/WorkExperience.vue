<script setup lang="ts">
import CalendarIcon from './CalendarIcon.vue';

defineProps<{
  index: number,
  item: {
    employer: string,
    startDate: string,
    endDate: string,
    title: string,
    bulletPoints: string[]
  }
}>()
</script>

<template>
  <li class="work-experience">
    <div class="experience-header">
    <div class="dates">
      <CalendarIcon
        :month=getDateMonth(item.startDate)
        :year=getDateYear(item.startDate) />
      <div class="thru">thru</div>
      <CalendarIcon
        :month=getDateMonth(item.endDate)
        :year=getDateYear(item.endDate) />
      <!-- {{ formatDate(item.startDate) }}
       - 
      {{ formatDate(item.endDate) }} -->
    </div>
    <div class="employer">{{ item.employer }}</div>
    <div class="job-title">{{ item.title }}</div>
    </div>
    <ul class="highlights">
      <li v-for="(point, index) in item.bulletPoints" :key="index">{{ point }}</li>
    </ul>
  </li>
</template>

<script lang="ts">
const MONTHS = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec',
];
export default {
  components: {
    CalendarIcon
  },
  methods: {
    formatDate(date: string) {      
      const d = new Date(`${date}T00:00:00`);
      const monthStr = MONTHS[d.getMonth()];
      return `${monthStr} ${d.getFullYear()}`;
      // const options = { year: numeric, month: 'short' };
      // return new Intl.DateTimeFormat('en-US').format(d); 
    },
    getDateMonth(date: string) {
      const d = new Date(`${date}T00:00:00`);
      return MONTHS[d.getMonth()];
    },
    getDateYear(date: string) {
      const d = new Date(`${date}T00:00:00`);
      return d.getFullYear();
    }
  }
};
</script>

<style scoped>
li {
  list-style-type: none;
}
.work-experience {
  margin-top: .5em;
}
.experience-header {
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#ffffff+0,f1f1f1+50,e1e1e1+51,f6f6f6+100;White+Gloss+%231 */
  background: linear-gradient(to bottom,  rgba(255,255,255,1) 0%,rgba(241,241,241,1) 50%,rgba(225,225,225,1) 51%,rgba(246,246,246,1) 100%);

  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#feccb1+0,f17432+50,ea5507+51,fb955e+100;Red+Gloss+%232 */
  /* background: linear-gradient(to bottom,  rgba(254,204,177,1) 0%,rgba(241,116,50,1) 50%,rgba(234,85,7,1) 51%,rgba(251,149,94,1) 100%); */

  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#1e5799+0,7db9e8+100&1+0,0+100;Blue+to+Transparent */
  /* background: linear-gradient(to bottom,  rgba(30,87,153,1) 0%,rgba(125,185,232,0) 100%); */
  color: black;
  padding-left: 1em;
}

.employer {
  font-size: 1rem;
  font-weight: bold;
}
.job-title {
  font-size: .8rem;
}
.highlights {
  margin-top: .5em;
  margin-bottom: 1em;
  padding-inline-start: 2em;
}
.highlights li {
  margin-bottom: .5em;
  font-size: .8em;
  list-style-type: square;
}
.dates {
  float: right;
  font-size: .5em;
  margin-top: .75em;
  margin-right: 1em;
}
.thru {
  text-align: center;
  display: inline-block;
  width: 4em;
  position: relative;
  top: -1em;
}
</style>