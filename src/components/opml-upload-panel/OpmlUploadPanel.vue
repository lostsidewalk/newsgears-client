<template>
  <v-card>
    <v-card-title
      class="text-center"
      :class="pa4r"
    >
      <h3 class="opml-upload">
        <v-icon icon="fa-file" />
        {{ $t('opmlUpload') }}
      </h3>
    </v-card-title>
    <v-card-subtitle
      class="text-center"
      :class="pa4r"
    >
      {{ $t('uploadOpmlHere') }}
    </v-card-subtitle>
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
      <v-sheet
        align="left"
        justify="center"
        class="d-flex flex-column"
        style="gap: 1rem;"
      >
        <v-card elevation="1">
          <v-card-title :class="pa4r">
            {{ atStep2 ? $t('weWillCreateTheFollowingSubscriptions') : $t('createQueuesFromOPML') }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <!-- TODO: extract OPML file list component -->
            <!-- OPML file list -- shows a list of files waiting to upload (step 1) -->
            <v-list
              v-if="!atStep2 && files.length > 0"
              :class="mb4r"
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
            <!-- TODO: extract OPML parse errors component -->
            <!-- OPML parse errors (if any, shown at step 2) -->
            <v-card :class="mb4r">
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
            <!-- TODO: extract OPML parse results component -->
            <!-- OPML parse results (if any, shown at step 2)-->
            <v-card
              v-if="atStep2 && queueConfigRequests.length > 0"
              :class="mb4r"
            >
              <v-data-table
                :expanded="expanded"
                :class="my4r"
                :headers="headers"
                :items="dataTableItems"
                item-value="description"
                :expand-on-click="true"
                show-expand
                items-per-page="-1"
                density="compact"
                hover
              >
                <template #expanded-row="{ columns, item }">
                  <tr
                    v-for="subscription in item.subscriptions"
                    :key="subscription.url"
                  >
                    <td :colspan="columns.length">
                      {{ subscription.url }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card>
            <v-btn
              v-if="!atStep2"
              :class="mb4r"
              :size="buttonSize"
              autofocus
              :disabled="atStep2"
              :title="$t('selectAnOpmlFile')" 
              :text="$t('addAnOpmlFile')"
              @click="$refs.fileInput.click()"
            />
          </v-card-text>
          <v-divider class="my-1" />
          <v-card-actions>
            <!-- continue to step 2 / finalize button (for step 2) -->
            <v-btn
              :size="buttonSize"
              autofocus 
              :disabled="!files.length"
              :loading="isLoading" 
              :title="submitTitle"
              :text="submitText"
              @click="submit"
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
        :text="$t('dismiss')" 
        @click="$emit('dismiss')"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, reactive, computed, nextTick } from 'vue';

import { useI18n } from 'vue-i18n';

import buttonSizeMixin from '@/mixins/buttonSizeMixin';
import spacingMixin from '@/mixins/spacingMixin';

export default {
  name: "OpmlUploadPanel",
  mixins: [buttonSizeMixin, spacingMixin],
  props: { 
    isLoading: { type: Boolean, default: false },
    atStep2: { type: Boolean, required: true },
    errors: { type: Array, default: null },
    queueConfigRequests: { type: Array, required: true },
  },
  emits: [
    "returnToStep1",
    "dismiss",
    "continueUpload",
    "finalizeUpload",
  ],
  setup(props, { emit }) {
    const { t } = useI18n();

    const files = ref([]);
    const expanded = reactive([]);

    const headers = computed(() => {
      return [
        { title: t('queueTitle'), value: 'title' },
        { title: t('queueDescription'), value: 'description' },
        { title: t('newSubscriptions'), value: 'subscriptionCt' },
        // { title: t('queueActions'), value: 'actions' },
      ];
    });

    const dataTableItems = computed(() => {
      let dataTableItems = [];
      for (let i = 0; i < props.queueConfigRequests.length; i++) {
        let q = props.queueConfigRequests[i];
        if (!q.title) {
          console.error("queue with no title: " + JSON.stringify(q));
        }
        dataTableItems.push({
          title: q.title,
          description: q.description,
          subscriptionCt: q.subscriptions.length,
          subscriptions: q.subscriptions,
        });
      }
      return dataTableItems;
    });

    const submitText = computed(() => {
      return props.atStep2 ?
        t('finalizeUpload') :
        t('continueToStep2');
    });

    const submitTitle = computed(() => {
      return props.atStep2 ?
        t('finalizeUpload') :
        t('continueToStep2');
    });

    function eventHandler(event) {
      addFiles(event.target.files)
      event.target.value = null
    }

    function addFiles(newFiles) {
        let newUploadableFiles = [...newFiles]
            .map((file) => {
              return {
                file: file,
                id: `${file.name}-${file.size}-${file.lastModified}-${file.type}`,
                url: URL.createObjectURL(file), 
                status: null
              }
            })
            .filter((file) => !fileExists(file.id))
        files.value = files.value.concat(newUploadableFiles)
    }

    function fileExists(otherId) {
        return files.value.some(({ id }) => id === otherId)
    }

    function removeFile(file) {
        const index = files.value.indexOf(file)
      if (index > -1) {
        files.value.splice(index, 1);
        emit('returnToStep1');
      }
    }

    function submit() {
      if (props.atStep2 && props.queueConfigRequests.length > 0) {
        emit('finalizeUpload')
        nextTick(() => files.value.splice(0));
      } else {
        emit('continueUpload', files.value);
      }  
    }

    return {
      files,
      expanded, 
      // 
      headers,
      dataTableItems,
      submitText,
      submitTitle,
      // 
      eventHandler,
      addFiles,
      fileExists,
      removeFile,
      submit,
    }

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