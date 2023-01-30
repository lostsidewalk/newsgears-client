<template>
  <div class="feed-config-field">
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
    />
    <label for="feed-image-select" class="feed-image-select-label">
      <img v-if="modelValue" class="feed-image" :src="'data:image/png;base64,' + modelValue" title="Click here to change the feed image."/>
      <div v-else class="feed-image" title="Click here to add a feed image."></div>
    </label>
    <span>
    <button :disabled="inTransit || !modelValue" class="feed-image-clear" @click="removeFeedImage">
      <i class="fa fa-trash-o"></i>
    </button>
    <button :disabled="inTransit" class="feed-image-randomize" @click="randomizeFeedImage">
      <i class="fa fa-paw"></i>
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
export default {
  name: "FeedConfigImageField",
  props: [ "baseUrl", "label", "required", "inTransit", "theme", "modelValue" ],
  emits: [ "updateInTransit", "authError", "update:modelValue" ],
  methods: {
    //
    handleAuthError(error) {
      this.$emit('authError', error);
      this.$emit('updateInTransit', false);
    },
    handleFeedImageUploadError(error) {
      console.log(error);
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
      this.$emit('updateInTransit', true);
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
          this.$emit('updateInTransit', false);
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
      this.$emit('updateInTransit', true);
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
          this.$emit('updateInTransit', false);
        })
      }).catch((error) => {
        this.handleAuthError(error);
      });
    },
  },
  data() {
    return {
      feedImageUploadErrors: [],
    }
  }
}
</script>

<style scoped>
.feed-config-field {
  border: 1px solid v-bind('theme.sectionbordercolor');
  text-align: left;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  overflow-x: auto;
}

.feed-config-field label {
  font-size: small;
  /* padding-bottom: 3px; */
}

.feed-image {
  border: 1px solid v-bind('theme.sectionbrighthighlight');
  width: 70px;
  height: 70px;
  max-width: 70px;
  max-height: 70px;
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
  color: v-bind('theme.normalmessage');
  background-color: transparent;
  border: 1px solid transparent;
  z-index: 3;
  border-radius: 3px;
  width: fit-content;
}

.feed-image-clear:hover, .feed-image-randomize:hover {
  border: 1px solid v-bind('theme.normalmessage');
}

.feed-image-clear > i, .feed-image-randomize > i {
  font-size: smaller;
}

.feed-image-upload-errors {
  background-color: v-bind('theme.sectionnegativehighlight');
  padding: 10px;
  margin-top: 10px;
  border-radius: 3px;
}

.feed-image-upload-error, .feed-catalog-error {
  width: 100%;
}
</style>
