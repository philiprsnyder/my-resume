<script setup lang="ts">
import IconBase from './IconBase.vue';

defineProps<{
  name: {
    first: string,
    last: string
  },
  address: {
    street1: string,
    street2: string,
    city: string,
    state: string,
    postalCode: string
  },
  contactInfo: {
    phone: string,
    email: string,
    linkedIn: string,
    stackOverflow: string,
    github: string,
    bitbucket: string
  }
}>()
</script>

<template>
  <div class="applicant">
    <div>
      <h1 class="name">{{ name.first }} {{ name.last }}</h1>
      <div class="address">
        <div>
          {{ address.street1 }}
          {{ address.street2 }}
        </div>
        <div>{{ address.city }}, {{ address.state }} {{ address.postalCode }}</div>
      </div>
    </div>
    <ul class="contact-info">
      <li v-for="(value, key) in contactInfo" :key :type=key>
        <IconBase :type=key :value />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.applicant {
  font-size: 1rem;
  min-width: 13em;
  max-width: 20em;
}
.address {
  font-size: small;
}
.contact-info {
  padding: 0;
  margin: 0;
  margin-top: 2em;
  list-style: none;
}
.name {
  font-weight: bold;
}
@media print, (max-width: 1024px) {
  .address {
    position: relative;
    top: .9em;
  }
  .applicant {
    font-size: .75rem;
    width: 100%;
  }
  .contact-info {
    position: absolute;
    top: 2em;
    right: 0em;
    margin-top: 0;
  }
  .contact-info li {
    margin: 0;
  }
  .contact-info li[type="linkedIn"],
  .contact-info li[type="stackOverflow"],
  .contact-info li[type="github"],
  .contact-info li[type="bitbucket"] {
    float: left;
    margin-right: 1.8em;
  }
}

</style>
