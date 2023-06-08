<template>
  <v-container>
    <v-carousel
      height="750"
      class="rounded"
    >
      <!-- simplified organization -->
      <v-carousel-item>
        <v-card
          class="h-100"
          variant="flat"
        >
          <v-card-title class="text-center pa-4">
            <h3 class="view-header-no-count">
              Simplified Organization 
            </h3>
          </v-card-title>
          <v-card-subtitle class="text-center pa-4">
            With FeedGears queue-based system, you can easily organize your RSS feed subscriptions into topical groups. You can create <b>queues</b> for different topics of interest, such as gaming, technology, or sports, allowing you to stay focused and access articles from multiple sources in one place. 
          </v-card-subtitle>
          <v-card-subtitle class="text-center pa-4">
            By importing articles from all the feeds in a queue, FeedGears creates a unified collection of articles. This means you don't have to navigate through multiple individual feeds or switch between different sources manually. You can enjoy a seamless reading experience with all relevant articles conveniently accessible in a single queue.
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            <v-img
              class="reader-image" 
              :src="'reader_global_news_' + ($vuetify.theme.dark ? 'dark' : 'light') + '.png'" 
              :alt="$t('queuePageScreenshot')"
            />
          </v-card-text>
        </v-card>
      </v-carousel-item>
      <!-- queue dashboard -->
      <v-carousel-item>
        <v-card
          class="h-100"
          variant="flat"
        >
          <v-card-title class="text-center pa-4">
            <h3 class="view-header-no-count">
              Queue Dashboard
            </h3>
          </v-card-title>
          <v-card-subtitle class="text-center pa-4">
            FeedGears Queue Dashboard shows summary information about each queue.  Each queue dashboard card is configurable; you can add and remove details and action buttons according to your needs.
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            <v-img
              class="reader-image" 
              :src="'reader_global_news_' + ($vuetify.theme.dark ? 'dark' : 'light') + '.png'" 
              :alt="$t('queuePageScreenshot')"
            />
          </v-card-text>
        </v-card>
      </v-carousel-item>
      <!-- streamlined reading -->
      <v-carousel-item>
        <v-card
          class="h-100"
          variant="flat"
        >
          <v-card-title class="text-center pa-4">
            <h3 class="view-header-no-count">
              Streamlined Reading Experience
            </h3>
          </v-card-title>
          <v-card-subtitle class="text-center pa-4" />
          <v-divider />
          <v-card-text>
            <v-img
              class="reader-image" 
              :src="'reader_global_news_' + ($vuetify.theme.dark ? 'dark' : 'light') + '.png'" 
              :alt="$t('queuePageScreenshot')"
            />
          </v-card-text>
        </v-card>
      </v-carousel-item>
      <!-- enhanced filtering and searching -->
      <v-carousel-item>
        <v-card
          class="h-100"
          variant="flat"
        >
          <v-card-title class="text-center pa-4">
            <h3 class="view-header-no-count">
              Enhanced Filtering and Searching 
            </h3>
          </v-card-title>
          <v-card-subtitle class="text-center pa-4">
            The aggregator's queue-based approach enables users to apply filters and search within a specific queue. This functionality allows them to narrow down their reading options based on their preferences or specific topics of interest. Users can easily find articles related to a particular subject within a queue, saving time and improving their overall experience.
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            <v-img
              class="reader-image" 
              :src="'reader_global_news_' + ($vuetify.theme.dark ? 'dark' : 'light') + '.png'" 
              :alt="$t('queuePageScreenshot')"
            />
          </v-card-text>
        </v-card>
      </v-carousel-item>
      <!-- customizable queues -->
      <v-carousel-item>
        <v-card
          class="h-100"
          variant="flat"
        >
          <v-card-title class="text-center pa-4">
            <h3 class="view-header-no-count">
              Customizable Queues
            </h3>
          </v-card-title>
          <v-card-subtitle class="text-center pa-4">
            Users have the flexibility to create and customize queues according to their specific interests. They can add or remove feeds from queues, modify queue settings, and tailor their reading experience to suit their preferences. This empowers users to curate their content and ensure they receive articles from the sources they value most.
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            <v-img
              class="reader-image" 
              :src="'reader_global_news_' + ($vuetify.theme.dark ? 'dark' : 'light') + '.png'" 
              :alt="$t('queuePageScreenshot')"
            />
          </v-card-text>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
export default {
  name: "DemoPanel",
}
</script>
