<template>
  <DemoFeature
    :title="$t('layoutOptions')"
    :details="[
      $t('layoutOptions_detail1'),
      $t('layoutOptions_detail2'),
    ]"
  >
    <template #body>
      <v-row cols="12">
        <v-col
          md="4"
          sm="12"
        >
          <v-card elevation="12">
            <v-card-title>{{ $t('listLayoutsScreenshot') }}</v-card-title>
            <v-card-text>
              <v-img
                :src="'list_layout_' + (isDark ? 'dark' : 'light') + '.png'"
                :alt="$t('listLayoutsScreenshot')"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          md="4"
          sm="12"
        >
          <v-card elevation="12">
            <v-card-title>{{ $t('cardLayoutsScreenshot') }}</v-card-title>
            <v-card-text>
              <v-img
                :src="'card_layout_' + (isDark ? 'dark' : 'light') + '.png'"
                :alt="$t('cardLayoutsScreenshot')"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          md="4"
          sm="12"
        >
          <v-card elevation="12">
            <v-card-title>{{ $t('tableLayoutsScreenshot') }}</v-card-title>
            <v-card-text>
              <v-img
                :src="'table_layout_' + (isDark ? 'dark' : 'light') + '.png'"
                :alt="$t('tableLayoutsScreenshot')"
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
