<template>
  <v-container>
    <v-sheet>
      <v-card elevation="1">
        <v-carousel
          show-delimiters
          :show-arrows="false"
          height="1050"
          class="rounded"
        >
          <!-- simplified organization -->
          <v-carousel-item>
            <SimplifiedOrganization_DemoFeature :is-dark="isDark" />
          </v-carousel-item>
          <!-- feed dashboard -->
          <v-carousel-item>
            <FeedDashboard_DemoFeature :is-dark="isDark" />
          </v-carousel-item>
          <!-- enhanced filtering and searching -->
          <v-carousel-item>
            <EnahcedFiltering_DemoFeature :is-dark="isDark" />
          </v-carousel-item>
          <!-- layout/theme options/material design -->
          <v-carousel-item>
            <LayoutOptions_DemoFeature :is-dark="isDark" /> 
          </v-carousel-item>
          <!-- streamlined reading experience -->
          <v-carousel-item>
            <ReadingExperience_DemoFeature :is-dark="isDark" />
          </v-carousel-item>
          <!-- OPML import -->
          <v-carousel-item>
            <OPML_DemoFeature :is-dark="isDark" /> 
          </v-carousel-item>
          <!-- misc. features -->
          <v-carousel-item>
            <Misc_DemoFeature />
          </v-carousel-item>
          <!-- api access -->
          <v-carousel-item>
            <ApiAccess_DemoFeature /> 
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import SimplifiedOrganization_DemoFeature from './demo/SimplifiedOrganization_DemoFeature.vue';
import FeedDashboard_DemoFeature from './demo/FeeeDashboard_DemoFeature.vue';
import EnahcedFiltering_DemoFeature from './demo/EnhancedFiltering_DemoFeature.vue';
import LayoutOptions_DemoFeature from './demo/LayoutOptions_DemoFeature.vue';
import ReadingExperience_DemoFeature from './demo/ReadingExperience_DemoFeature.vue';
import OPML_DemoFeature from './demo/OPML_DemoFeature.vue';
import Misc_DemoFeature from './demo/Misc_DemoFeature.vue';
import ApiAccess_DemoFeature from './demo/ApiAccess_DemoFeature.vue';

export default {
  name: "DemoPanel",
  components: {
    SimplifiedOrganization_DemoFeature,
    FeedDashboard_DemoFeature, 
    EnahcedFiltering_DemoFeature,
    LayoutOptions_DemoFeature,
    ReadingExperience_DemoFeature,
    OPML_DemoFeature,
    Misc_DemoFeature,
    ApiAccess_DemoFeature,
  },
  computed: {
    isDark: function () {
      return this.$vuetify.theme.name === "dark";
    },
    sampleOpml: function() {
      return '<?xml version="1.0" encoding="UTF-8"?>\n\
        <opml version="1.0">\n\
          <head>\n\
            <title>Science Feed</title>\n\
          </head>\n\
          <body>\n\
            <outline text="Science News" title="Science News">\n\
              <outline text="Futurity.org" title="Futurity.org" type="rss" xmlUrl="https://www.futurity.org/feed/" htmlUrl="https://www.futurity.org/"/>\n\
              <outline text="Latest Science News -- ScienceDaily" title="Latest Science News -- ScienceDaily" type="rss" xmlUrl="https://www.sciencedaily.com/rss/top.xml" htmlUrl="https://www.sciencedaily.com/"/>\n\
              <outline text="Livescience.com" title="Livescience.com" type="rss" xmlUrl="https://www.livescience.com/feeds/all" htmlUrl="https://www.livescience.com/feeds/all"/>\n\
              <outline text="Phys.org - latest science and technology news stories" title="Phys.org - latest science and technology news stories" type="rss" xmlUrl="https://phys.org/rss-feed/" htmlUrl="https://phys.org/"/>\n\
              <outline text="News from Science" title="News from Science" type="rss" xmlUrl="https://www.science.org/rss/news_current.xml" htmlUrl="http://news.sciencemag.org/rss/current.xml"/>\n\
              <outline text="Top News - MIT Technology Review" title="Top News - MIT Technology Review" type="rss" xmlUrl="https://www.technologyreview.com/topnews.rss" htmlUrl="https://www.technologyreview.com/topnews.rss"/>\n\
              <outline text="Quanta Magazine" title="Quanta Magazine" type="rss" xmlUrl="https://api.quantamagazine.org/feed/" htmlUrl="https://www.quantamagazine.org/"/>\n\
              <outline text="Science Latest" title="Science Latest" type="rss" xmlUrl="https://www.wired.com/feed/category/science/latest/rss" htmlUrl="https://www.wired.com/category/science/latest"/>\n\
              <outline text="NYT &gt; Science" title="NYT &gt; Science" type="rss" xmlUrl="http://www.nytimes.com/services/xml/rss/nyt/Science.xml" htmlUrl="http://www.nytimes.com/pages/science/index.html?partner=rss&amp;emc=rss"/>\n\
              <outline text="New Scientist - Online news" title="New Scientist - Online news" type="rss" xmlUrl="http://feeds.newscientist.com/science-news" htmlUrl="http://www.newscientist.com/"/>\n\
              <outline text="BBC News - Science &amp; Environment" title="BBC News - Science &amp; Environment" type="rss" xmlUrl="http://newsrss.bbc.co.uk/rss/newsonline_world_edition/science/nature/rss.xml" htmlUrl="http://www.bbc.co.uk/news/science_and_environment/#sa-ns_mchannel=rss&amp;ns_source=PublicRSS20-sa"/>\n\
              <outline text="Popular Science" title="Popular Science" type="rss" xmlUrl="https://www.popsci.com/feed/" htmlUrl="http://www.popsci.com/rss.xml"/>\n\
              <outline text="The Economist: Science and technology" title="The Economist: Science and technology" type="rss" xmlUrl="http://www.economist.com/rss/science_and_technology_rss.xml" htmlUrl="http://www.economist.com/"/>\n\
              <outline text="Scientific American Content: Global" title="Scientific American Content: Global" type="rss" xmlUrl="http://rss.sciam.com/ScientificAmerican-Global" htmlUrl="http://www.scientificamerican.com/"/>\n\
              <outline text="TEDTalks (video)" title="TEDTalks (video)" type="rss" xmlUrl="https://www.ted.com/feeds/talks.rss" htmlUrl="http://www.ted.com/talks/list"/>\n\
            </outline>\n\
          </body>\n\
        ';
    },
  }
}
</script>
