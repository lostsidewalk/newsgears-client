<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      <h3 class="opml-upload">
        <v-icon icon="fa-file" />
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
        <v-card variant="flat">
          <v-card-title class="pa-4">
            {{ atStep2 ? $t('weWillCreateTheFollowingSubscriptions') : $t('createQueuesFromOPML') }}
          </v-card-title>
          <v-divider class="mb-1 mt-1" />
          <v-card-text>
            <!-- TODO: extract this -->
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
                      @click="removeFile(file)"
                    />
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-list-item v-if="files.length === 0">
                {{ $t('selectAtLeastOneFile') }}
              </v-list-item>
            </v-list>
            <!-- TODO: extract this -->
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
            <!-- TODO: extract this -->
            <!-- OPML parse results (if any, shown at step 2)-->
            <v-card
              v-if="atStep2 && queueConfigRequests.length > 0"
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
              @click="$refs.fileInput.click()"
            />
          </v-card-text>
          <v-divider class="mb-1 mt-1" />
          <v-card-actions>
            <!-- continue to step 2 / finalize button (for step 2) -->
            <v-btn
              :size="buttonSize"
              autofocus 
              :disabled="!files.length"
              :loading="isLoading" 
              :title="queueConfigRequests.length > 0 ? $t('finalizeUpload') : (files.length ? $t('continueToStep2') : null)"
              :text="queueConfigRequests.length > 0 ? $t('finalizeUpload') : $t('continueToStep2')"
              @click="queueConfigRequests.length > 0 ? $emit('finalizeUpload') : $emit('continueUpload', files)"
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
        @click="$emit('returnToStep1')"
      />
      <v-btn
        :size="buttonSize"
        :text="$t('cancel')" 
        @click="$emit('cancel')"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { useNotifications } from '@/composable/useNotifications';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';

export default {
  name: "OpmlUploadPanel",
  mixins: [buttonSizeMixin],
  props: { 
    isLoading: { type: Boolean, default: false },
    atStep2: { type: Boolean, required: true },
    errors: { type: Array, default: null },
    queueConfigRequests: { type: Array, required: true },
  },
  emits: [ "continueUpload", "finalizeUpload", "returnToStep1", "cancel" ],
  setup() {
    const { shouldShowAlert, dismissAlert } = useNotifications();

    return {
      shouldShowAlert,
      dismissAlert,
    }
  },
  data() {
    return {
      // 
      files: [], // TODO: extract this and associated methods to a composable 
    }
  },
  methods: {
    eventHandler(event) {
      this.addFiles(event.target.files)
      event.target.value = null
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
  },
}
</script>

<style scoped>
.opml-upload {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}
</style>