<template>
  <v-card variant="text">
    <v-card-title v-if="label">
      <v-label>{{ label }}</v-label>
    </v-card-title>
    <v-card-text
      for="feed-image-select"
      class="feed-image-select-label"
    >
      <v-file-input
        v-model="feedImages"
        clearable
        accept="image/*"
        :loading="selectFeedImageInTransit" 
        :error-messages="feedImageUploadErrors"
        @change="selectFeedImage"
      />
      <v-img
        v-if="modelValue"
        class="mt-2" 
        :src="'data:image/png;base64,' + modelValue" 
        :title="$t('clickToChangeQueueImage')"
        :alt="$t('queueLogoImage')" 
        height="140" 
        max-width="140"
        max-height="140"
      />
      <v-img
        v-else
        class="mt-2"
        src="feedgears.png"
        :title="$t('clickToAddQueueImage')"
        :alt="$t('queueLogoImage')" 
        height="140" 
        max-width="140"
        max-height="140"
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "FeedConfigImageField",
  props: {
    baseUrl: { type: String, required: true },
    label: { type: String, required: true },
    required: { type: Boolean, default: false },
    modeValue: { type: String, required: true },
  },
  emits: [ "authError", "update:modelValue" ],
  data() {
    return {
      feedImageUploadErrors: [],
      feedImages: [],
      // 
      selectFeedImageInTransit: false,
      randomizeFeedImageInTransit: false,
    }
  },
  methods: {
    handleFeedImageUploadError(error) {
      console.error(error);
      if (error.name === 'TypeError') {
        this.feedImageUploadErrors.push(this.$t('somethingHorribleHappened'));
      } else if (error.name === 'AbortError') {
        this.feedImageUploadErrors.push(this.$t('requestTimedOut'));
      } else {
        this.feedImageUploadErrors.push(error.message);
      }
    },
    selectFeedImage() {
      let prevFeedImgSrc = this.modelValue;
      this.feedImageUploadErrors.splice();
      let file = this.feedImages[0];
      console.log("here, file=" + file);
      let formData = new FormData();
      formData.append("file", file);
      this.selectFeedImageInTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'POST',
          headers: { 
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          body: formData,
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/feeds/thumbnail", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? response.json() : {};
          } else { // framework is rejecting the request 
            throw new Error(this.$t('unableToUseThisImage'));
          }
        }).then((data) => {
          if (!data.imgSrc) {
            if (data.errors) {
              this.feedImageUploadErrors = data.errors;
            } else {
              this.feedImageUploadErrors = ['Fuck'];
              // no errors 
            }
            this.feedImages.splice(0);
          }
          this.$emit('update:modelValue', data.imgSrc);
        }).catch((error) => {
          this.handleFeedImageUploadError(error);
          this.$emit('update:modelValue', prevFeedImgSrc);
        })
        .finally(() => {
          clearTimeout(timeoutId);
          this.selectFeedImageInTransit = false;
        })
      }).catch((error) => {
        this.$emit('authError', error);
        this.selectFeedImageInTransit = false;
      })
    },
    removeFeedImage() {
      this.$emit('update:modelValue', null);
      this.feedImages.splice(0);
    },
  }
}
</script>
