<template>
  <v-card>
    <v-card-title class="text-center pa-4">
      {{ $t('feedGearsHelp') }}
    </v-card-title>
    <v-divider />
    <v-card-text>
      <!-- global -->
      <v-card
        elevation="6"
        class="mb-4 pa-1"
      >
        <v-card-title>
          {{ $t('globalShortcutKeys') }}
        </v-card-title>
        <v-divider />
        <v-card-text class="d-flex flex-row flex-wrap">
          <v-hover
            v-for="desc in helpModel.fromAnywhere"
            v-slot="{ isHovering, props }"
            :key="desc"
          >
            <v-card
              :elevation="isHovering ? 7 : 6"
              class="ma-4" 
              max-width="320" 
              v-bind="props"
              variant="tonal"
            >
              <v-card-title class="pa-4">
                {{ desc.label }}
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-btn
                  variant="tonal" 
                  :prepend-icon="desc.icon" 
                  :text="desc.key"
                />
              </v-card-text>
            </v-card>
          </v-hover>
          <v-hover
            v-for="desc in helpModel.aQueueIsSelected"
            v-slot="{ isHovering, props }"
            :key="desc"
          >
            <v-card
              :elevation="isHovering ? 7 : 6"
              class="ma-4" 
              max-width="320" 
              v-bind="props"
              variant="tonal"
            >
              <v-card-title class="pa-4">
                {{ desc.label }}
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-btn
                  variant="tonal" 
                  :prepend-icon="desc.icon" 
                  :text="desc.key"
                />
              </v-card-text>
            </v-card>
          </v-hover>
        </v-card-text>
      </v-card>
      <!-- queue selected -->
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "HelpPanel",
  data() {
    return {
      helpModel: {
        fromAnywhere: [
          {
            label: this.$t('switchMode'),
            key: "ALT + L", // global accel 
          },
          {
            label: this.$t('logout'),
            key: "ALT + O", // global accel 
          },
          {
            label: this.$t('settings'),
            key: "ALT + T", // global accel 
          },
          {
            label: this.$t('uploadOPML'),
            key: "ALT + M", // global accel 
          },
          {
            label: this.$t('toggleDistractions'),
            key: "ALT + Z", // global accel 
          },
          {
            label: this.$t('createNewQueue'),
            key: "SHIFT + Q" // key handler from anywhere 
          },
          {
            label: this.$t('refreshQueues'),
            key: "SHIFT + R" // key handler from anywhere 
          },
        ],
        aQueueIsSelected: [
          {
            label: this.$t('configureSelectedQueue'),
            key: "SHIFT + E", // key handler when queue is selected 
          },
          {
            label: this.$t('markSelectedQueueAsRead'),
            key: "SHIFT + A", // key handler when queue is selected 
          },
          {
            label: this.$t('deleteSelectedQueue'),
            key: "SHIFT + D", // key handler when queue is selected 
          },
          {
            label: this.$t('addSubscriptionToSelectedQueue'),
            key: "SHIFT + S", // key handler when queue is selected 
          },
          {
            label: this.$t('showStarred'),
            key: "SHIFT + T", // key handler when queue is selected 
          },
          {
            label: this.$t('showReadLater'),
            key: "SHIFT + L", // key handler when queue is selected 
          },
          {
            label: this.$t('showRead'),
            key: "SHIFT + H", // key handler when queue is selected 
          },
          {
            label: this.$t('search'),
            key: "/", // key handler when queue is selected 
          },
        ],
      }
    }
  }
}
</script>
