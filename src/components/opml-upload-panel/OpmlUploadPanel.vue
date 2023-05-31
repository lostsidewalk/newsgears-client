<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      <h3 class="view-header-no-count">
        <v-icon icon="fa-user" />
        {{ $t('opmlUpload') }}
      </h3>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- file input -->
      <input
        ref="fileInput"
        type="file"
        multiple
        style="display: none;"
        @change="eventHandler"
      >
      <!-- help text -->
      <v-alert
        v-if="shouldShowAlert('uploadOpmlHere')"
        closable
        variant="outlined"
        border="top"
        icon="fa-question-circle"
        :text="$t('uploadOpmlHere')"
        class="ma-4"
        @click.close="dismissAlert('uploadOpmlHere')"
      />
      <v-sheet>
        <!-- add OPML file button (for step 1) --> 
        <v-card variant="flat">
          <v-card-title class="pa-4">
            {{ atStep2 ? $t('weWillCreateTheFollowingSubscriptions') : $t('createQueuesFromOPML') }}
          </v-card-title>
          <v-divider class="mb-1 mt-1" />
          <v-card-text>
            <!-- OPML file list -- shows a list of files waiting to upload (step 1) -->
            <v-list
              v-if="!atStep2 && files.length > 0"
              class="mb-4"
            >
              <v-list-subheader>{{ $t('opmlFiles') }}</v-list-subheader>
              <v-list-item
                v-for="file of files"
                :key="file.id"
              >
                <template #prepend>
                  <v-list-item-action start>
                    <v-btn
                      :size="buttonSize"
                      variant="text"
                      :title="$t('previewThisFile')" 
                      :text="file.file.name"
                    />
                  </v-list-item-action>
                </template>
                <template #append>
                  <v-list-item-action end>
                    <v-btn
                      v-if="!atStep2"
                      :size="buttonSize"
                      variant="tonal" 
                      prepend-icon="fa-trash"
                      :text="$t('delete')" 
                      @click="queueConfigRequests=[]; errors=[]; deleteOpmlFile(file)"
                    />
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-list-item v-if="files.length === 0">
                {{ $t('selectAtLeastOneFile') }}
              </v-list-item>
            </v-list>
            <!-- OPML parse errors (if any, shown at step 2) -->
            <v-card class="mb-4">
              <v-card-item
                v-if="errors.length > 0"
                :subtitle="$t('opmlFilesContainErrors')"
              />
              <v-card-text
                v-for="error in errors"
                :key="error"
              >
                <v-alert
                  type="error"
                  theme="dark"
                  :title="$t('error')"
                  :text="error"
                />
              </v-card-text>
            </v-card>
            <!-- OPML parse results (if any, shown at step 2)-->
            <v-card
              v-if="queueConfigRequests.length > 0"
              class="mb-4"
            >
              <v-list
                v-for="f in queueConfigRequests"
                :key="f.ident"
              >
                <v-list-subheader>
                  {{ f.title + (f.description ? (' (' + f.description + ')'): '') }}
                </v-list-subheader>
                <v-divider />
                <v-list-item
                  v-for="r in f.subscriptions"
                  :key="r"
                  class="opml-upload-summary-message-url"
                >
                  {{ r.url }}
                </v-list-item>
              </v-list>
            </v-card>
            <v-btn
              v-if="!atStep2"
              class="mb-4"
              :size="buttonSize"
              autofocus
              :disabled="atStep2"
              :title="$t('selectAnOpmlFile')" 
              :text="$t('addAnOpmlFile')"
              @click="errors = []; $refs.fileInput.click()"
            />
          </v-card-text>
          <v-divider class="mb-1 mt-1" />
          <v-card-actions>
            <!-- continue to step 2 / finalize button (for step 2) -->
            <v-btn
              :size="buttonSize"
              autofocus 
              :disabled="!files.length"
              :loading="uploadIsLoading || isLoading" 
              :title="queueConfigRequests.length > 0 ? $t('finalizeUpload') : (files.length ? $t('continueToStep2') : null)"
              :text="queueConfigRequests.length > 0 ? $t('finalizeUpload') : $t('continueToStep2')"
              @click="queueConfigRequests.length > 0 ? finalizeOpmlUpload() : continueOpmlUpload()"
            />
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn
        v-if="atStep2"
        :size="buttonSize"
        :text="$t('goBack')" 
        @click="returnToStep1"
      />
      <v-btn
        :size="buttonSize"
        :text="$t('cancel')" 
        @click="cancelOpmlUpload"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "OpmlUploadPanel",
  mixins: [buttonSizeMixin],
  props: { 
    isLoading: { type: Boolean, default: false },
    baseUrl: { type: String, required: true } 
  },
  emits: [ "finalizeUpload", "cancel", "authError" ],
  data() {
    return {
      //
      showModal: false,
      // 
      files: [],
      atStep2: false,
      errors: [],
      queueConfigRequests: [],
      // 
      uploadIsLoading: false,
    }
  },
  methods: {
    shouldShowAlert(alertName) {
      return !localStorage.getItem(alertName); 
    },
    dismissAlert(alertName) {
      localStorage.setItem(alertName, new Date().toISOString())
    },
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
      this.queueConfigRequests = [];
    },
    finalizeOpmlUpload() {
      console.log("opml-upload-panel: finalizing OPML upload");
      this.$emit('finalizeUpload', this.queueConfigRequests);
    },
    continueOpmlUpload() {
      console.log("opml-upload-panel: continue upload of OPML files=" + JSON.stringify(this.files));
      this.uploadIsLoading = true;
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
        fetch(this.baseUrl + "/queues/opml", requestOptions)
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
            this.queueConfigRequests = data.queueConfigRequests;
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
          this.uploadIsLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.$emit('authError', error);
        this.uploadIsLoading = false;
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
      // TODO: (enhancement) possibly warn of un-saved data / get confirmation if files or queueConfigRequests are non-empty 
      this.files.splice(0);
      this.atStep2 = false;
      this.errors.splice(0);
      this.queueConfigRequests.splice(0);
    }
  },
}
</script>

<style scoped>
.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>