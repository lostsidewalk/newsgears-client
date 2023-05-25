<template>
  <v-card>
    <v-card-title class="pa-4">
      {{ $t('filtering') }}
    </v-card-title>
    <v-card-subtitle class="mt-2 mb-2">
      {{ $t('filteringProvides') }}
    </v-card-subtitle>
    <v-divider />
    <v-card-text>
      <v-label class="text-subtitle-1 pa-2">
        {{ $t('syntax') }}
      </v-label>

      <section class="pa-2">
        {{ $t('feedGearsFilterSupports') }}
      </section>

      <section class="mt-4 mb-4 pa-2">
        <code>{{ $t('fieldColonValue') }}</code>
      </section>
    
      <section class="pa-2">
        {{ $t('syntaxAllows') }}
      </section>
    
      <!-- -->

      <v-label class="text-subtitle-1 pa-2">
        {{ $t('supportedFields') }}
      </v-label>

      <v-list>
        <v-list-item
          title="feed"
          :subtitle="$t('feedFieldDesc')"
        />
        <v-list-item
          title="category"
          :subtitle="$t('categoryFieldDesc')"
        />
        <v-list-item
          title="description"
          :subtitle="$t('descriptionFieldDesc')"
        />
        <v-list-item
          title="title"
          :subtitle="$t('titleFieldDesc')"
        />
        <v-list-item
          title="author"
          :subtitle="$t('authorFieldDesc')"
        />
        <v-list-item
          title="authors"
          :subtitle="$t('authorsFieldDesc')"
        />
        <v-list-item
          title="contributors"
          :subtitle="$t('contributorsFieldDesc')"
        />
        <v-list-item
          title="published"
          :subtitle="$t('publishedFieldDesc')"
        />
        <v-list-item
          title="updated"
          :subtitle="$t('updatedFieldDesc')"
        />
        <v-list-item
          title="contents"
          :subtitle="$t('contentsFieldDesc')"
        />
        <v-list-item
          title="url"
          :subtitle="$t('urlFieldDesc')"
        />
        <v-list-item
          title="status"
          :subtitle="$t('statusFieldDesc')"
        />
        <v-list-item
          title="starred"
          :subtitle="$t('starredFieldDesc')"
        />
      </v-list>

      <!-- -->

      <v-label class="text-subtitle-1 pa-2">
        {{ $t('exampleQueries') }}
      </v-label>

      <section class="pa-2">
        {{ $t('hereAreSomeExamples') }}

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

      <!-- -->

      <v-label class="text-subtitle-1 pa-2">
        {{ $t('advancedQueries') }}
      </v-label>

      <section class="pa-2">
        {{ $t('inAdditionTo') }}
      </section>
    </v-card-text>
    <v-card-actions>
      <v-btn 
        density="comfortable"
        :text="$t('dismiss')"
        @click="$emit('dismiss')"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "FilterHelp",
  emits: ["dismiss"],
}
</script>

