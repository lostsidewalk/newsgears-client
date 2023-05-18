<template>
  <v-card elevation="6">
    <v-card-title class="question-verbiage pa-4">RSS Made Easy</v-card-title>
    <v-divider />
    <v-card-text class="answer" align="center">
      <vue-plyr style="width: 100%;height: auto;">
        <div class="plyr__video-embed">
          <iframe
            src="https://www.youtube.com/watch?v=6HNUqDL-pI8"
            allowfullscreen
            allowtransparency
            allow="autoplay" />
        </div>
      </vue-plyr>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "VideoPanel",
  props: ["theme"],
}
</script>

<style scoped>
.question-verbiage {
  font-family: "Russo One", system-ui, sans-serif;
}
</style>
