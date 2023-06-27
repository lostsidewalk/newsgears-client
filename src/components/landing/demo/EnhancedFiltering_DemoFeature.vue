<template>
  <DemoFeature
    :title="$t('enhancedFiltering')"
    :details="[
      $t('enhancedFiltering_detail1'),
      $t('enhancedFiltering_detail2')
    ]"
  >
    <template #body>
      <v-card elevation="12">
        <v-card-text>
          <v-img
            :src="'filter_' + (isDark ? 'dark' : 'light') + '.png'"
            :alt="$t('filterScreenshot')"
          />
        </v-card-text>
      </v-card>
      <v-card
        variant="text"
        class="mt-4 mb-16"
      >
        <v-card-text>
          <section>
            <v-table
              class="mt-2 mb-2 overflow-auto flex-grow-1"
              style="white-space: nowrap;"
              fixed-header
            >
              <thead style="text-align: left;white-space: nowrap;">
                <th class="pa-1">
                  {{ $t('syntax') }}
                </th>
                <th class="pa-1">
                  {{ $t('explanation') }}
                </th>
              </thead>
              <tbody>
                <tr>
                  <td>title:technology</td>
                  <td>{{ $t('searchForArticlesWithWord') }}</td>
                </tr>
                <tr>
                  <td>author:Jay*</td>
                  <td>{{ $t('searchForArticlesPublishedBy') }}</td>
                </tr>
                <tr>
                  <td>published:[2023-01-01 TO 2023-12-31]</td>
                  <td>{{ $t('searchForArticlesPublishedBetween') }}</td>
                </tr>
                <tr>
                  <td>contents:JavaScript title:tutorial</td>
                  <td>{{ $t('searchForArticlesWithWords') }}</td>
                </tr>
                <tr>
                  <td>category:programming</td>
                  <td>{{ $t('searchForArticlesInASpecificFeedAndCategory') }}</td>
                </tr>
              </tbody>
            </v-table>
          </section>
        </v-card-text>
      </v-card>
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
