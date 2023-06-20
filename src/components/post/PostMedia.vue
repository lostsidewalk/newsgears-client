<template>
  <v-card
    variant="flat"
    align="left"
    justify="left"
  >
    <v-card-subtitle v-if="hasMediaMetadata">
      <!-- top-level metadata -->
      <PostMediaMetadata
        class="ma-2 pa-2"
        :metadata="media.postMediaMetadata"
      />
    </v-card-subtitle>
    <!-- top-level contents array -->
    <v-sheet v-if="media.postMediaContents && showContents">
      <PostMediaContent
        v-for="(mc,idx) of media.postMediaContents"
        :key="mc" 
        :ref="'postMediaContent_' + idx"
        :media-content="mc" 
        :show-content-on-load="idx === 0"
      />
    </v-sheet>
    <!-- top-level media-groups array -->
    <v-sheet v-if="media.postMediaGroups && showContents">
      <PostMediaGroup
        v-for="(mg,idx) of media.postMediaGroups"
        :key="mg" 
        :ref="'postMediaGroup_' + idx"
        :media-group="mg" 
      />
    </v-sheet>
  </v-card>
</template>

<script>
import PostMediaMetadata from '@/components/post/PostMediaMetadata.vue';
import PostMediaContent from '@/components/post/PostMediaContent.vue';
import PostMediaGroup from '@/components/post/PostMediaGroup.vue';

export default {
  name: "PostMedia",
  components: {
    PostMediaMetadata,
    PostMediaContent, 
    PostMediaGroup
  },
  props: {
    media: { type: Object, required: true },
  },
  data() {
    return {
      showContents: true,
    }
  },
  computed: {
    hasMediaMetadata: function () {
      return this.media.postMediaMetadata && Object.keys(this.media.postMediaMetadata).length > 0;
    }
  },
  mounted() {
    console.log("media=" + JSON.stringify(this.media));
  },
  methods: {
    pause() {
      if (this.media.postMediaContents) {
        for (let i = 0; i < this.media.postMediaContents.length; i++) {
          let r = this.$refs['postMediaContent_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
      if (this.media.postMediaGroups) {
        for (let i = 0; i < this.media.postMediaGroups.length; i++) {
          let r = this.$refs['postMediaGroup_' + i];
          if (r && r.length > 0) {
            r[0].pause();
          }
        }
      }
    },
  }
}
</script>
