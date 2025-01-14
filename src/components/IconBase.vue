<script setup lang="ts">
import IconStackOverflow from './icons/IconStackOverflow.vue';
import IconGithub from './icons/IconGithub.vue';
import IconBitbucket from './icons/IconBitbucket.vue';
import IconLinkedIn from './icons/IconLinkedIn.vue';
import IconPhone from './icons/IconPhone.vue';
import IconEmail from './icons/IconEmail.vue';
defineProps<{
  type: string,
  value: string,
}>()
</script>

<template>
  <a :href=value class="icon-link">
    <div class="icon" :type @click="handleClick(value)">
      <IconPhone v-if="type == 'phone'" />
      <IconEmail v-if="type == 'email'" />
      <IconLinkedIn v-if="type == 'linkedIn'" />
      <IconStackOverflow v-if="type == 'stackOverflow'" />
      <IconGithub v-if="type == 'github'" />
      <IconBitbucket v-if="type == 'bitbucket'" />
      <span v-if="type == 'email' || type == 'phone'" class="label">{{ value }}</span>
      <span v-else class="label">{{ linkText(value) }}</span>
    </div>
  </a>
</template>

<script lang="ts">
function linkText(v: string) {
  return v.split('/').pop();
}
export default {  
  methods: {
    handleClick(urlParam: string) {
      let url;
      if (urlParam.match(/^http/)) {
        url = urlParam;
      } else if (urlParam.match('@')) {
        url = `mailto:${urlParam}`;
      } else {
        url = `tel:+1${urlParam}`;
      }
      window.open(url, '_blank');
    }
  }
}
</script>

<style scoped>
.icon > svg {
  height: 1.5em;
  width: 1.5em;
  position: relative;
  margin: .25em .25em .25em 0;
  color: currentColor;
}
.label {
  position: relative;
  top: -.75em;
  display: inline-block;
}
.icon-link {
  color: white;
}

@media print, (max-width: 1024px) {
  .icon .label {
    display: none;
  }
  .icon[type='phone'] .label,
  .icon[type='email'] .label {
    display: inline-block;
  }
  .icon[type="linkedIn"] {
    display: inline-block;
    max-width: 5em;
  }
/* }


@media print { */
  .icon-link,
  .icon {
    color: black;
  }

}
</style>