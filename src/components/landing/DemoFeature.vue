<template>
  <v-card
    class="h-100"
    style="overflow-y: auto;"
  >
    <v-card-title class="text-center pa-4">
      <h3 class="demo-verbiage">
        {{ title }}
      </h3>
    </v-card-title>
    <v-card-text>
      <p
        v-for="detail in details"
        :key="detail"
        class="demo-detail pt-2 pb-2"
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
export default {
  name: "DemoFeature", 
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