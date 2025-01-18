<template>
  <ToolTip :content="title">
    <Icon :icon="icon" :title="title"></Icon>
  </ToolTip>
</template>

<script lang="ts">
import { Icon } from "@iconify/vue";
import ToolTip from "./ToolTip.vue";

export default {
  name: "SvgIcon",
  components: {
    Icon,
    ToolTip,
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ""
    }
  }
};
</script>