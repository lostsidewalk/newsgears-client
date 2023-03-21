<template>
  <div class="modal-container" v-if="this.showModal">
    <div class="modal-body">
      <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
      <div class="modal-actions">
        <div class="opml-upload-field">
          <input type="file" ref="fileInput" multiple @change="eventHandler" style="display: none;" />
          <label>OPML FILES:</label>
          <div class="opml-file-wrapper" v-for="file of this.files" :key="file.id">
            <div class="opml-file-row">
              FILENAME: <a :href="file.url" :target="file.id" title="Preview this file in a new window.">{{ file.file.name }}</a>
              <button v-if="!atStep2" 
                class="opml-file-action-button" 
                @click="this.feedConfigRequests = []; this.errors=[]; deleteOpmlFile(file)" 
                style="margin-left: .125rem;" 
                :disabled="disabled || inTransit">
                <span class="fa fa-trash"/>
              </button>
            </div>
          </div>
          <div class="opml-upload-errors" v-if="this.errors.length > 0">
            Your files contain the following problems.  Please resolve these issues and re-attempt your upload.
            <div class="error opml-upload-error" v-for="error in this.errors" :key="error">
              {{ error }}
            </div>
          </div>
          <div class="opml-upload-summary" v-if="this.feedConfigRequests.length > 0">
            <div class="opml-upload-summary-header">We will create the following feeds from your OPML file(s):</div>
            <div class="opml-upload-summary-wrapper" v-for="f in this.feedConfigRequests" :key="f.ident">
              <div class="opml-upload-summary-message">{{ f.title + (f.description ? (' (' + f.description + ')'): '') }}</div>
              <div class="opml-upload-summary-message-url" v-for="r in f.rssAtomFeedUrls" :key="r">
                {{ r.feedUrl }}
              </div>
            </div>
          </div>
          <div>
            <button ref="addOpmlFileButton" v-if="!atStep2"
              @click="this.errors = []; this.$refs.fileInput.click()"   
              class="opml-upload-button" 
              :disabled="disabled || inTransit" 
              title="Select an OPML file containing data about this feed.">
              Add OPML file
            </button>
          </div>
        </div>
      </div>
      <!-- save | cancel | back buttons -->
      <div class="opml-upload-button-wrapper">
        <!-- continue/finalize button -->
        <button class="opml-upload-button" 
          @click="this.feedConfigRequests.length > 0 ? finalizeOpmlUpload() : continueOpmlUpload()" 
          :disabled="disabled || inTransit || (!this.files.length)" 
          :title="this.feedConfigRequests.length > 0 ? 'Finalize upload' : (this.files.length ? 'Continue' : 'Add at least one OPML file to continue.')"
          ref="continueOrFinalizeButton">
          {{ this.feedConfigRequests.length > 0 ? 'Finalize upload' : 'Continue to step (2)' }}
        </button>
        <button v-if="atStep2" 
          @click="returnToStep1"   
          class="opml-upload-button" 
          :disabled="disabled || inTransit">
          Go back
        </button>
        <button @click="cancelOpmlUpload" 
          class="opml-upload-button" 
          :disabled="disabled || inTransit">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';


export default {
  name: "OpmlUploadPanel",
  components: {
    NavbarFixedHeader,
  },
  props: [ "disabled", "baseUrl", "theme" ],
  emits: [ "finalizeUpload", "cancel", "authError" ],
  data() {
    return {
      //
      showModal: false,
      // 
      files: [],
      atStep2: false,
      errors: [],
      feedConfigRequests: [],
      // 
      inTransit: false,
    }
  },
  methods: {
    //
    handleAuthError(error) {
      this.$emit('authError', error);
      this.inTransit = false;
    },
    eventHandler(event) {
      this.addFiles(event.target.files)
      event.target.value = null
    },
    show() {
      this.showModal = true;
      this.$nextTick(() => {
        if (!this.atStep2) {
          this.$refs.addOpmlFileButton.focus();
        } else {
          this.$refs.continueOrFinalizeButton.focus();
        }
      });
    },
    hide() {
      this.clearModel();
      this.showModal = false;
    },
    addFiles(newFiles) {
        let newUploadableFiles = [...newFiles]
            .map((file) => {
              return {
                file: file,
                id: `${file.name}-${file.size}-${file.lastModified}-${file.type}`,
                url: URL.createObjectURL(file), 
                status: null
              }
            })
            .filter((file) => !this.fileExists(file.id))
        this.files = this.files.concat(newUploadableFiles)
    },
    fileExists(otherId) {
        return this.files.some(({ id }) => id === otherId)
    },
    removeFile(file) {
        const index = this.files.indexOf(file)

        if (index > -1) this.files.splice(index, 1)
    },
    // 
    returnToStep1() {
      this.atStep2 = false;
      this.errors = [];
      this.feedConfigRequests = [];
    },
    finalizeOpmlUpload() {
      console.log("opml-upload-panel: finalizing OPML upload");
      this.$emit('finalizeUpload', this.feedConfigRequests);
    },
    continueOpmlUpload() {
      console.log("opml-upload-panel: continue upload of OPML files=" + JSON.stringify(this.files));
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        // form data 
        let formData = new FormData();
        for (let i = 0; i < this.files.length; i++) {
          let f = this.files[i];
          formData.append('files', f.file, f.file.name);
        }
        // request options 
        const requestOptions = {
              method: 'POST', 
              headers: { 
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include',
              body: formData,
            };
        fetch(this.baseUrl + "/feeds/opml", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Something horrible happened, please try to upload again later.  Please note that the maximum permissible size for OPML files is 1M.');
          }
        }).then((data) => {
          this.errors = data.errors;
          if (this.errors.length === 0) {
            this.feedConfigRequests = data.feedConfigRequests;
            this.atStep2 = true;
          }
        }).catch((error) => {
          console.error(error);
          if (error.name === 'TypeError') {
            this.errors.push('Something went wrong.  Please try again later.');
          } else {
            this.errors.push(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleAuthError(error);
      });
    },
    cancelOpmlUpload() {
      this.clearModel();
      this.$emit('cancel');
    },
    deleteOpmlFile(file) {
      this.removeFile(file);
    },
    clearModel() {
      // TODO: possibly warn of un-saved data / get confirmation if files or feedConfigRequests are non-empty 
      this.files.splice(0);
      this.atStep2 = false;
      this.errors.splice(0);
      this.feedConfigRequests.splice(0);
    }
  },
}
</script>

<style scoped>
.modal-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 96svh;
  overflow-y: auto;
  font-family: Arial, Helvetica, sans-serif;
}

.modal-header {
  text-align: left;
}

.modal-body {
  color: v-bind('theme.normalmessage');
  text-align: left;
  width: 100%;
  height: fit-content;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.modal-actions {
  padding-top: .75rem;
}

.opml-upload-button-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  gap: .5rem;
}

.opml-upload-field {
  text-align: left;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  padding: .75rem;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  border: 1px solid v-bind('theme.sectionbordercolor');
}

.opml-upload-field label {
  padding-bottom: .125rem;
}

.opml-upload-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.opml-upload-button:disabled {
  cursor: auto;
}

.opml-upload-button:hover, .opml-upload-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.opml-upload-button:hover:disabled {
  background-color: unset;
}

.error > input, .error > textarea {
  border: 1px solid v-bind('theme.errorborder') !important;
  box-shadow: 1px 1px 1px v-bind('theme.errorshadow') !important;
  background-color: v-bind('theme.errorbg') !important;
}

.opml-file-action-button {
  border: 1px solid v-bind('theme.buttonborder');
  cursor: pointer;
  text-align: center;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding-top: .125rem;
  float: right;
  margin-top: .125rem;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  float: right;
  min-width: 3rem;
  min-height: 3rem;
}

.opml-file-action-button:disabled {
  cursor: auto;
}

.opml-file-action-button:hover:enabled {
  background-color: v-bind('theme.buttonhighlight') !important;
}

.opml-file-action-button span {
  padding: .125rem;
}

.opml-file-wrapper {
  background-color: v-bind('theme.sectionbrighterhighlight');
  padding: .75rem;
  border-radius: 3px;
}

.opml-file-wrapper input {
  width: inherit;
  border-radius: 3px;
}

.opml-file-row {
  display: inline;
  width: 100%;
}

.opml-file-row > a {
  color: v-bind('theme.subduedmessage');
}

.opml-file-row > a:hover, .opml-file-row > a:focus-visible {
  color: v-bind('theme.highlightedmessage');
}

.opml-upload-summary {
  padding: .75rem;
  border-top: 1px solid black;
}

.opml-upload-errors {
  background-color: v-bind('theme.sectionnegativehighlight');
  padding: .75rem;
  margin-bottom: .75rem;
  border-radius: 3px;
}

.opml-upload-errors input {
  width: inherit;
  border-radius: 3px;
}

.opml-upload-error {
  margin-top: .75rem;
  width: 100%;
}

.opml-upload-summary-wrapper {
  padding: .75rem;
  margin-bottom: .75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 75svh;
  overflow-y: auto;
  border: 1px solid;
  border-radius: 3px;
}

.opml-upload-summary-wrapper:last-of-type {
  margin-bottom: 0rem;
}

.opml-upload-summary-header {
  padding-bottom: .75rem;
  border-bottom: 1px solid black;
}

@keyframes load {
    0% {
        width: 0%;
    }

    87.5% {
        width: 100%;
    }
}

@keyframes turn {
    0% {
        transform: rotateY(0deg);
    }

    6.25%,
    50% {
        transform: rotateY(180deg);
    }

    56.25%,
    100% {
        transform: rotateY(360deg);
    }
}

@keyframes bounce {

    0%,
    100% {
        top: .75rem;
    }

    12.5% {
        top: 30px;
    }
}
</style>
