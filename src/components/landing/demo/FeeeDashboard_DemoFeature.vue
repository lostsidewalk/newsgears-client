<template>
  <DemoFeature
    :title="$t('feedDashboard')"
    :details="[
      $t('feedDashboard_detail1'),
      $t('feedDashboard_detail2'),
    ]"
  >
    <template #body>
      <v-row
        cols="12"
        class="mb-16"
      >
        <v-col
          md="6"
          sm="12"
        >
          <v-card elevation="12">
            <v-card-title>
              {{ $t('dashboardCardScreenshot') }}
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-img
                :src="'dashboard_card_' + (isDark ? 'dark' : 'light') + '.png'"
                :alt="$t('dashboardCardScreenshot')"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          md="6"
          sm="12"
        >
          <v-card elevation="12">
            <v-card-title>
              {{ $t('queueSettingsScreenshot') }}
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-img
                :src="'queue_settings_' + (isDark ? 'dark' : 'light') + '.png'"
                :alt="$t('queueSettingsScreenshot')"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </DemoFeature>
</template>

<script>
import DemoFeature from './DemoFeature.vue';

export default {
  components: {
    DemoFeature, 
  },
  props: {
    isDark: { type: Boolean, default: false },
  }
}
</script>
