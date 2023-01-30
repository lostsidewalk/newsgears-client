<template>
  <div class="modal-container" v-if="this.showModal">
    <div class="modal-body">
      <div class="modal-header">
        <h3 class="view-header-no-count">
          <i class="fa fa-feed fa-1x"/>
          OPML UPLOAD
          <div class="loader" v-if="inTransit">
              <div class="loading_1"></div>
          </div>
        </h3>
      </div>
      <div class="modal-actions">
        <div class="opml-upload-field">
          <input type="file" ref="fileInput" multiple @change="onInputChange" style="display: none;" />
          <label>OPML FILES:</label>
          <div class="opml-file-wrapper" v-for="file of files" :key="file.id">
            <div class="opml-file-row">
              FILENAME: <a :href="file.url" :target="file.id" title="Preview this file in a new window.">{{ file.file.name }}</a>
              <button v-if="!atStep2" class="opml-file-action-button" @click="this.feedConfigRequests = []; this.errors=[]; deleteOpmlFile(file)" style="margin-left: 2px;" :disabled="inTransit">
                <i class="fa fa-trash"/>
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
              <div class="opml-upload-summary-message">TITLE: {{ f.title }}</div>
              <div class="opml-upload-summary-message">DESCRIPTION: {{ f.description }}</div>
              <div class="opml-upload-summary-message" v-if="f.rssAtomFeedUrls">UPSTREAM RSS/ATOM FEEDS: </div>
              <div class="opml-upload-summary-message-url" v-for="r in f.rssAtomFeedUrls" :key="r">
                {{ r.feedUrl }}
              </div>
            </div>
          </div>
          <div>
            <button class="opml-upload-button" 
              v-if="!atStep2"
              @click="this.errors = []; this.$refs.fileInput.click()" 
              :disabled="inTransit" title="Select an OPML file containing data about this feed."
            >
              Add OPML file
            </button>
          </div>
        </div>
      </div>
      <!-- save | cancel | back buttons -->
      <div>
        <button class="opml-upload-button" 
          @click="this.feedConfigRequests.length > 0 ? finalizeOpmlUpload() : continueOpmlUpload()" 
          :disabled="inTransit || (!files.length)" 
          :title="this.feedConfigRequests.length > 0 ? 'Finalize upload' : (files.length ? 'Continue' : 'Add at least one OPML file to continue.')">
          {{ this.feedConfigRequests.length > 0 ? 'Finalize upload' : 'Continue to step (2)' }}
        </button>
        <button v-if="atStep2" class="opml-upload-button" @click="returnToStep1" :disabled="inTransit">
          Go back
        </button>
        <button class="opml-upload-button" @click="cancelOpmlUpload" :disabled="inTransit">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
function onInputChange(e) {
  addFiles(e.target.files)
  e.target.value = null
}
</script>

<script>
import useFileList from '../../../compositions/file-list.js';

const { files, addFiles, removeFile, clearFiles } = useFileList();

export default {
  name: "OpmlUploadPanel",
  components: {},
  props: ["showModal", "inTransit", "baseUrl", "theme"],
  emits: ["finalizeUpload", "cancel", "authError"],
  mounted() {
    console.log("opml-upload-panel: mounted, baseUrl=" + this.baseUrl);
  },
  data() {
    return {
      //
      overflowClass: 'hidden',
      // 
      atStep2: false,
      errors: [],
      feedConfigRequests: [],
    }
  },
  methods: {
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
      console.log("opml-upload-panel: continue upload of OPML files=" + JSON.stringify(files));
      this.$auth.getTokenSilently().then((token) => {
        // form data 
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          let f = files[i];
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
          console.log(error);
          if (error.name === 'TypeError') {
            this.errors.push('Something went wrong.  Please try again later.');
          } else {
            this.errors.push(error.message);
          }
        });
      }).catch((error) => {
        this.$emit("authError", error);
      });
    },
    cancelOpmlUpload() {
      clearFiles();
      this.$emit('cancel');
    },
    deleteOpmlFile(file) {
      removeFile(file);
    }
  },
}
</script>

<style scoped>
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  background: rgba(0,0,0,0.8);
}

.modal-header {
  text-align: left;
}

.modal-body {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  color: v-bind('theme.normalmessage');
  text-align: left;
  width: 75%;
  padding: 32px;
  border: 1px solid v-bind('theme.buttonborder');
  border-radius: 5px;
}

.modal-actions {
  padding-top: 10px;
  /* display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center; */
}

.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: large;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0px;
  overflow: hidden;
}

.opml-upload-field {
  text-align: left;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
}

.opml-upload-field label {
  font-size: small;
  padding-bottom: 3px;
}

.opml-upload-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  margin-right: 10px;
  text-align: center;
  font-size: unset;
}

.opml-upload-button:disabled {
  cursor: auto;
}

.opml-upload-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.opml-upload-button:hover:disabled {
  background-color: unset;
}

.opml-file-action-button {
  border: 1px solid v-bind('theme.buttonborder');
  cursor: pointer;
  text-align: center;
  border-radius: 3px;
  /* margin-left: 5px; */
  /* margin-right: 5px; */
  /* margin-bottom: 5px; */
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding-top: 3px;
  float: right;
  margin-top: 2px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  float: right;
}

.opml-file-action-button:disabled {
  cursor: auto;
}

.opml-file-action-button:hover:enabled {
  background-color: v-bind('theme.buttonhighlight') !important;
}

.opml-file-action-button i {
  padding: 3px;
}

.opml-file-wrapper:nth-of-type(1) {
  margin-top: 2px;
}

.opml-file-wrapper {
  background-color: v-bind('theme.sectionbrighterhighlight');
  padding: 10px;
  margin-bottom: 10px;
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

.opml-file-row > a:hover {
  color: v-bind('theme.highlightedmessage');
}

.opml-upload-summary {
  background-color: v-bind('theme.sectionpositivehighlight');
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 0px;
  padding-right: 10px;
  margin-bottom: 10px;
  border-radius: 3px;
}

.opml-upload-errors {
  background-color: v-bind('theme.sectionnegativehighlight');
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 3px;
}

.opml-upload-errors input {
  width: inherit;
  border-radius: 3px;
}

.opml-upload-error {
  margin-top: 10px;
  width: 100%;
}

.opml-upload-summary-wrapper {
  margin-top: 10px;
  margin-left: 0px;
  margin-bottom: 10px;
  margin-right: 0px;
  padding: 5px;
  border-radius: 3px;
}

.opml-upload-summary-wrapper:hover {
  background-color: v-bind('theme.sectionpositiveaccent');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow') !important;
  cursor: auto;
}

.opml-upload-summary-message {
  margin-bottom: 2px;
}

.opml-upload-summary-message-url {
  margin-left: 5px;
}

.opml-upload-summary-header {
  margin-bottom: 10px;
}

.error > input, .error > textarea {
  border: 1px solid v-bind('theme.errorborder') !important;
  box-shadow: 1px 1px 1px v-bind('theme.errorshadow') !important;
  background-color: v-bind('theme.errorbg') !important;
}


.loader {
    width: 100%;
    position: relative;
}

.loader .loading_1 {
    position: relative;
    height: 1px;
    animation: turn 4s linear 1.75s infinite;
}

.loader .loading_1:before {
    content: "";
    display: block;
    position: absolute;
    width: 0;
    height: 100%;
    background-color: v-bind('theme.navbarshadow');
    animation: load 2s linear infinite;
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
        top: 10px;
    }

    12.5% {
        top: 30px;
    }
}
</style>
