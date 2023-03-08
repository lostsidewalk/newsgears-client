<template>
  <div class="feed-config-field">
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <label v-if="label">
      <span v-if="required" class="required">*</span>
      {{ label }}
    </label>
    <input
      class="feed-image-select"
      type="file"
      accept="image/*"
      ref="selectFeedImage"
      @change="selectFeedImage"
      :disabled="disabled || inTransit" />
    <label for="feed-image-select" class="feed-image-select-label">
      <img v-if="modelValue" 
        class="feed-image" 
        :src="'data:image/png;base64,' + modelValue" 
        title="Click here to change the feed image."
        alt="Queue logo image" />
      <img v-else 
        class="feed-image"
        src="feedgears.png"
        title="Click here to add a feed image."
        alt="Queue logo image" />
    </label>
    <span>
    <button :disabled="disabled || inTransit || !modelValue" class="feed-image-clear" @click="removeFeedImage">
      <span class="fa fa-trash-o" />
    </button>
    <button :disabled="disabled || inTransit" class="feed-image-randomize" @click="randomizeFeedImage">
      <span class="fa fa-paw" />
    </button>
    </span>
    <div class="feed-image-upload-errors" v-if="this.feedImageUploadErrors.length > 0">
      <div class="error feed-image-upload-error" v-for="error in this.feedImageUploadErrors" :key="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';

export default {
  name: "FeedConfigImageField",
  props: [ "baseUrl", "label", "required", "disabled", "theme", "modelValue" ],
  components: {
    NavbarFixedHeader,
  },
  emits: [ "authError", "update:modelValue" ],
  methods: {
    //
    handleAuthError(error) {
      this.$emit('authError', error);
      this.inTransit = false;
    },
    handleFeedImageUploadError(error) {
      console.error(error);
      if (error.name === 'TypeError') {
        this.feedImageUploadErrors.push('Something went wrong.  Please try again later.');
      } else {
        this.feedImageUploadErrors.push(error.message);
      }
    },
    selectFeedImage() {
      let prevFeedImgSrc = this.modelValue;
      this.feedImageUploadErrors.splice();
      let file = this.$refs.selectFeedImage.files[0];
      let formData = new FormData();
      formData.append("file", file);
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
              method: 'POST',
              headers: { 
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include',
              body: formData
            };
        fetch(this.baseUrl + "/feeds/thumbnail", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else { // framework is rejecting the request 
            throw Error('We weren\'t able to use this image.  Please try another, and note that the maximum size for image files is 1M.');
          }
        }).then((data) => {
          this.feedImageUploadErrors = data.errors;
          if (this.feedImageUploadErrors.length === 0) {
            this.$emit('update:modelValue', data.imgSrc);
          }
        }).catch((error) => {
          this.handleFeedImageUploadError(error);
          this.$emit('update:modelValue', prevFeedImgSrc);
        })
        .finally(() => {
          this.inTransit = false;
        })
      }).catch((error) => {
        this.handleAuthError(error);
      })
    },
    removeFeedImage() {
      this.$emit('update:modelValue', null);
      this.$refs.selectFeedImage.value = '';
    },
    randomizeFeedImage() {
      let prevFeedImgSrc = this.modelValue;
      this.feedImageUploadErrors.splice(0, this.feedImageUploadErrors.length);
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
              method: 'GET',
              headers: { 
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include',
            };
        fetch(this.baseUrl + "/feeds/thumbnail/random", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else { // framework is rejecting the request 
            throw Error('We weren\'t able to fetch an image.  Please try again later.');
          }
        }).then((data) => {
          this.$emit('update:modelValue', data.imgSrc);
        }).catch((error) => {
          this.handleFeedImageUploadError(error);
          this.$emit('update:modelValue', prevFeedImgSrc);
        }).finally(() => {
          this.inTransit = false;
        })
      }).catch((error) => {
        this.handleAuthError(error);
      });
    },
  },
  data() {
    return {
      feedImageUploadErrors: [],
      // 
      inTransit: false,
    }
  }
}
</script>

<style scoped>
.feed-config-field {
  border: 1px solid v-bind('theme.sectionbordercolor');
  text-align: left;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  padding: .75rem;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  overflow-x: auto;
}

.feed-image {
  border: 1px solid v-bind('theme.sectionbrighthighlight');
  width: 140px;
  height: 140px;
  max-width: 140px;
  max-height: 140px;
  display: inline-block; 
  background-size: cover; 
  background-position: center center;
  background-repeat: no-repeat;
  align-self: stretch;
  border-radius: 3px;
}

.feed-image-select {
  display: none;
}

.feed-image-select-label {
  display: inline-block;
  width: fit-content;
  height: fit-content;
  cursor: pointer;
}

.feed-image-clear, .feed-image-randomize {
  color: v-bind('theme.buttonfg');
  background-color: v-bind('theme.buttonbg');
  border: 1px solid v-bind('theme.buttonborder');
  z-index: 3;
  border-radius: 3px;
  width: fit-content;
}

.feed-image-upload-errors {
  background-color: v-bind('theme.sectionnegativehighlight');
  padding: .75rem;
  margin-top: .75rem;
  border-radius: 3px;
}

.feed-image-upload-error, .feed-catalog-error {
  width: 100%;
}
</style>
