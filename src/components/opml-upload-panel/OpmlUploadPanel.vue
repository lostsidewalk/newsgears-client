<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      <h3 class="view-header-no-count">
        <v-icon icon="fa-user"/>
        {{ this.$t('opmlUpload') }}
      </h3>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <input type="file" ref="fileInput" multiple @change="eventHandler" style="display: none;" />
      <!-- continue/finalize button -->
      <v-container>
        <v-row class="align-center" v-if="!atStep2">
          <v-col cols=3>
            <v-btn @click="this.errors = []; this.$refs.fileInput.click()" 
              block
              autofocus
              :disabled="atStep2" 
              :title="this.$t('selectAnOpmlFile')"
              :text="this.$t('addAnOpmlFile')" />
          </v-col>
          <v-col cols=9>
            {{ this.$t('addOneOrMoreFilesToUpload') }}
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col cols=3>
            <v-btn @click="this.feedConfigRequests.length > 0 ? finalizeOpmlUpload() : continueOpmlUpload()" 
              autofocus
              block
              :disabled="!this.files.length" 
              :loading="uploadInTransit"
              :title="this.feedConfigRequests.length > 0 ? this.$t('finalizeUpload') : (this.files.length ? this.$t('continue') : this.$t('addAtLeastOneFile'))"
              :text="this.feedConfigRequests.length > 0 ? this.$t('finalizeUpload') : this.$t('continueToStep2')" />
          </v-col>
          <v-col cols=9>
            {{ this.$t('clickHereWHenYourFilesAreStaged') }}
          </v-col>
        </v-row>
      </v-container>
      <v-list class="mt-4" v-if="!atStep2">
        <v-list-subheader>{{ this.$t('opmlFiles') }}</v-list-subheader>
        <v-list-item v-for="file of this.files" :key="file.id">
          <template v-slot:prepend>
            <v-list-item-action start>
              <v-btn variant="text"
                :title="this.$t('previewThisFile')" 
                :text="file.file.name" />
            </v-list-item-action>
          </template>
          <template v-slot:append>
            <v-list-item-action end>
              <v-btn v-if="!atStep2" 
                @click="this.feedConfigRequests = []; this.errors=[]; deleteOpmlFile(file)" 
                variant="tonal"
                prepend-icon="fa-trash" 
                :text="this.$t('delete')" />
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-list-item v-if="this.files.length === 0">
          {{  this.$t('selectAtLeastOneFile') }}
        </v-list-item>
      </v-list>
      <v-card class="mt-2">
        <v-card-item v-if="this.errors.length > 0" :subtitle="this.$t('opmlFilesContainErrors')" />
        <v-card-text v-for="error in this.errors" :key="error">
          <v-alert type="error" theme="dark" :title="this.$t('error')" :text="error"  />
        </v-card-text>
      </v-card>
      <v-card class="mt-2" v-if="this.feedConfigRequests.length > 0" variant="text">
        <v-card-title class="text-center pa-2" align="left" justify="left">
          {{ this.$t('weWillCreateTheFollowingSubscriptions') }}
        </v-card-title>
        <v-card-text v-for="f in this.feedConfigRequests" :key="f.ident">
          <v-list>
            <v-list-subheader>
              {{ f.title + (f.description ? (' (' + f.description + ')'): '') }}
            </v-list-subheader>
            <v-divider />
            <v-list-item class="opml-upload-summary-message-url" v-for="r in f.rssAtomFeedUrls" :key="r">
              {{ r.feedUrl }}
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn v-if="atStep2" 
        @click="returnToStep1" 
        :text="this.$t('goBack')" />
      <v-btn @click="cancelOpmlUpload" 
        :text="this.$t('cancel')" />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "OpmlUploadPanel",
  props: [ "baseUrl", "theme" ],
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
      uploadInTransit: false,
    }
  },
  methods: {
    //
    eventHandler(event) {
      this.addFiles(event.target.files)
      event.target.value = null
    },
    show() {
      this.showModal = true;
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
      this.uploadInTransit = true;
      this.errors.splice(0);
      this.$auth.getTokenSilently().then((token) => {
        // form data 
        let formData = new FormData();
        for (let i = 0; i < this.files.length; i++) {
          let f = this.files[i];
          formData.append('files', f.file, f.file.name);
        }
        // request options 
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
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/feeds/opml", requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
              response.text().then(t => {throw new Error(t)});
          }
        }).then((data) => {
          if (data.errors && data.errors.length > 0) {
            this.errors = data.errors;
          } else {
            this.feedConfigRequests = data.feedConfigRequests;
            this.atStep2 = true;
          }
        }).catch((error) => {
          console.error(error);
          if (error.name === 'TypeError') {
            this.errors.push(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.errors.push(this.$t('requestTimedOut'));
          } else {
            this.errors.push(error.message);
          }
        }).finally(() => {
          this.uploadInTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.$emit('authError', error);
        this.uploadInTransit = false;
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
      // TODO: (enhancement) possibly warn of un-saved data / get confirmation if files or feedConfigRequests are non-empty 
      this.files.splice(0);
      this.atStep2 = false;
      this.errors.splice(0);
      this.feedConfigRequests.splice(0);
    }
  },
}
</script>
