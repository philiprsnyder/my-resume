<template>
  <div class="tooltip-wrapper" @mouseenter="showTooltip" @mouseleave="hideTooltip" @mousemove="moveTooltip">
    <slot></slot>
    <div
      v-show="visible" 
      :style="tooltipStyles" 
      class="tooltip">
      {{ content }}
    </div>
  </div>
</template>


<script lang="ts">
export default {
  name: 'ToolTip',
  props: {
    content: {
      type: String,
      required: true
    },
    offset: {
      type: Number,
      default: 10 // Default offset for the tooltip
    }
  },
  data() {
    return {
      visible: false,
      tooltipStyles: {
        top: '0px',
        left: '0px',
      }
    };
  },
  methods: {
    showTooltip(event: MouseEvent) {
      this.visible = true;
      this.moveTooltip(event);
    },
    hideTooltip() {
      this.visible = false;
    },
    moveTooltip(event: MouseEvent) {
      const { offset, tooltipStyles } = this;
      tooltipStyles.left = `${event.layerX + offset}px`;
      tooltipStyles.top = `${event.layerY + offset}px`;
    }
  }
};
</script>

<style scoped>
.tooltip {
  background-color: black;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 1000;
  position: absolute;
  pointer-events: 'none';
  display: block;
  width: auto;
  box-sizing: border-box;
}
.tooltip-wrapper {
  display: inline-block;
}
</style>