<template>
  <v-card
    class="h-100"
    style="overflow-y: auto;"
  >
    <v-card-title
      class="text-center"
      :class="pa4r"
    >
      <h3 class="demo-verbiage">
        {{ title }}
      </h3>
    </v-card-title>
    <v-card-text>
      <p
        v-for="detail in details"
        :key="detail"
        class="demo-detail py-2"
      >
        {{ detail }}
      </p>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <slot name="body" />
    </v-card-text>
    <!-- <v-divider /> -->
  </v-card>
</template>

<script>
import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "DemoFeature", 
  mixins: [spacingMixin],
  props: {
    title: { type: String, required: true },
    details: { type: Array, default: null },
  }
}
</script>

<style scoped>
.demo-verbiage {
  font-family: "Russo One", system-ui, sans-serif;
}

.demo-detail {
  font-size: larger;
}
</style>