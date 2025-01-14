<script setup lang="ts">
defineProps<{
  year: number,
  month: string
}>()
</script>

<template>
  <div class="calendar-icon">
    <div class="year">{{ year }}</div>
    <div class="month">{{ month }}</div>
  </div>
</template>

<style scoped>
.calendar-icon {
  /* border: 1px solid blue; */
  text-align: center;
  border-radius: .5em;
  width: 4em;
  height: 4em;
  display: inline-block;
  color: black;
  font-weight: bold;
}
.year {
  font-weight: bold;
  background-color: red;
  box-sizing: content-box;
  height: 1em;
  border-radius: .5em .5em 0 0;
  border: 1px solid black;
  border-bottom: none;
  color: white;
  padding: .25em;
}
.month {
  box-sizing: content-box;
  height: 1em;
  background-color: white;
  border-radius: 0 0 .5em .5em;
  border: 1px solid black;
  border-top: none;
  color: black;
  font-weight: bold;
  padding: .25em;
}
</style>