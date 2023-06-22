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
            <DemoFeature
              title="Simplified Organization"
              :details="[
                'With FeedGears article queue system, you can easily organize your RSS feed subscriptions into topical groups. You can create queues for different topics of interest, such as gaming, technology, or sports, allowing you to stay focused and access articles from multiple sources in one place.',
                'By importing articles from all the feeds in a queue, FeedGears creates a unified collection of articles. This means you don\'t have to navigate through multiple individual feeds or switch between different sources manually. You can enjoy a seamless reading experience with all relevant articles conveniently accessible in a single queue.',
              ]"
            >
              <template #body>
                <v-card
                  elevation="12"
                  class="mb-16"
                >
                  <v-card-text>
                    <v-img
                      :src="'reader_' + (isDark ? 'dark' : 'light') + '_2.png'"
                      :alt="$t('queuePageScreenshot')"
                    />
                  </v-card-text>
                </v-card>
              </template>
            </DemoFeature>
          </v-carousel-item>
          <!-- feed dashboard -->
          <v-carousel-item>
            <DemoFeature
              title="Feed Dashboard"
              :details="[
                'The feed dashboard shows summary information about each article queue.  Each dashboard card is configurable; you can add and remove details and action buttons according to your needs.',
                'By default, FeedGears shows the number of unread items, number of \'starred\' items, and the most recently published or updated article across all subscriptions in a queue.  The dashboard card also gives quick access to manage subscriptions, and get at-a-glance details about each feed in a queue: ',
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
                        Queue Dashboard Card
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
                        Subscription Management
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
          </v-carousel-item>
          <!-- enhanced filtering and searching -->
          <v-carousel-item>
            <DemoFeature
              title="Enhanced Filtering and Searching Using LunrJS"
              :details="[
                'Apply filters and search within an article queue to focus your reading options based on your preferences or specific topics of interest.',
                'Easily locate articles using a variety of data points, saving time and streamlining your reading experience.  FeedGears search capabilities are backed by lunrjs.'
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
          </v-carousel-item>
          <!-- layout/theme options/material design -->
          <v-carousel-item>
            <DemoFeature
              title="Layouts and Themes"
              :details="[
                'Choose from three reading layouts: tabular, list, or card views. The list view offers a streamlined presentation, allowing you to scroll through articles. The card view displays featured images and snippets for a more engaging reading experience. The tabular view provides a structured format, useful for a quick overview of headlines.',
                'Light and dark themes are available to reduce eye strain in low-light environments.',
              ]"
            >
              <template #body>
                <v-row cols="12">
                  <v-col
                    md="4"
                    sm="12"
                  >
                    <v-card elevation="12">
                      <v-card-title>List Layout</v-card-title>
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
                      <v-card-title>Card Layout</v-card-title>
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
                      <v-card-title>Table Layout</v-card-title>
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
          </v-carousel-item>
          <!-- streamlined reading experience -->
          <v-carousel-item>
            <DemoFeature
              title="Streamlined Reading Experience"
              :details="[
                'The FeedGears article view integrates a robust media player, allowing you to conveniently view media content directly within the application.',
                'Share articles effortlessly through popular platforms like Twitter, LinkedIn, Facebook, Telegram, and Blogger.',
                'Filter articles by their RSS categories for quick navigation.',
              ]"
            >
              <template #body>
                <v-row cols="12">
                  <v-col
                    md="6"
                    sm="12"
                  >
                    <v-card
                      elevation="12"
                      class="mt-4"
                    >
                      <v-card-title>
                        Text/HTML Article
                      </v-card-title>
                      <v-card-text>
                        <v-img
                          :src="'text_post_' + (isDark ? 'dark' : 'light') + '.png'"
                          :alt="$t('postCardScreenshot')"
                        />
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col
                    md="6"
                    sm="12"
                  >
                    <v-card
                      elevation="12"
                      class="mt-4"
                    >
                      <v-card-title>
                        Podcast Audio
                      </v-card-title>
                      <v-card-text>
                        <v-img
                          :src="'podcast_post_' + (isDark ? 'dark' : 'light') + '.png'"
                          :alt="$t('postCardScreenshot')"
                        />
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row
                  cols="12"
                  class="mb-16"
                >
                  <v-col
                    md="6"
                    sm="12"
                  >
                    <v-card
                      elevation="12"
                      class="mt-4"
                    >
                      <v-card-title>
                        YouTube Video
                      </v-card-title>
                      <v-card-text>
                        <v-img
                          :src="'youtube_post_' + (isDark ? 'dark' : 'light') + '.png'"
                          :alt="$t('postCardScreenshot')"
                        />
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col
                    md="6"
                    sm="12"
                  >
                    <v-card
                      elevation="12"
                      class="mt-4"
                    >
                      <v-card-title>
                        Article with Images
                      </v-card-title>
                      <v-card-text>
                        <v-img
                          :src="'pic_post_' + (isDark ? 'dark' : 'light') + '.png'"
                          :alt="$t('postCardScreenshot')"
                        />
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </DemoFeature>
          </v-carousel-item>
          <!-- OPML import -->
          <v-carousel-item>
            <DemoFeature
              title="OPML Import"
              :details="[
                'FeedGears supports OPML import/export, making it easy to migrate your RSS subscriptions. Import feeds from OPML files produced by other readers, and consolidate multiple sources. Export your feeds, queue structures, and metadata as OPML files for backups or sharing with others.',
                'OPML ensures compatibility and interoperability with other RSS readers.',
              ]"
            >
              <template #body>
                <v-card
                  elevation="12"
                  class="mb-16"
                >
                  <v-card-text>
                    <v-img
                      :src="'opml_upload_' + (isDark ? 'dark' : 'light') + '.png'"
                      :alt="$t('opmlUploadScreenshot')"
                    />
                  </v-card-text>
                </v-card>
              </template>
            </DemoFeature>
          </v-carousel-item>
          <!-- misc. features -->
          <v-carousel-item>
            <DemoFeature title="About FeedGears">
              <template #body>
                <!-- accessibility / wcaf -->
                <v-card elevation="12">
                  <v-card-title>
                    ACCESSIBILE
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <p class="ma-4">
                      Accessibility is a top priority. We are committed to ensuring an inclusive experience for all
                      users of FeedGears. To achieve this, we utilize vue-announcer, a tool that makes important messages
                      accessible to screen readers and other assistive technologies. By leveraging vue-announcer, we
                      ensure that everyone can access the information they need seamlessly.
                    </p>
                    <p class="ma-4">
                      Moreover, we strive to meet the Web Content Accessibility Guidelines (WCAG) compliance standards.
                      WCAG provides a set of guidelines to make digital content more accessible to people with
                      disabilities. By adhering to these guidelines, we ensure that FeedGears is designed and developed
                      with accessibility in mind, providing an optimal experience for all users.
                    </p>
                  </v-card-text>
                </v-card>
                <!-- mobile optimized -->
                <v-card
                  elevation="12"
                  class="mt-4"
                >
                  <v-card-title>
                    MOBILE OPTIMIZED
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <p class="ma-4">
                      FeedGears has a mobile-optimized and responsive interface, designed with practicality in mind. Our
                      UI ensures a smooth and consistent experience across different devices, including smartphones and
                      tablets.
                    </p>
                    <p class="ma-4">
                      The responsive design principles of Vuetify allow our interface to adapt seamlessly to various
                      screen sizes. Whether you're using a smaller mobile device or a larger tablet, the functionality
                      and visual presentation remain consistent. This means you can enjoy the same features and
                      user-friendly interface, regardless of the device you choose to use.
                    </p>
                    <p class="ma-4">
                      We've carefully designed our interface to be intuitive and efficient on mobile devices. Navigating
                      through articles, exploring categories, and customizing your reading preferences is easy and
                      convenient. The layout and controls are optimized for touch interaction, ensuring a seamless
                      experience on your mobile device.
                    </p>
                  </v-card-text>
                </v-card>
                <!-- secure -->
                <v-card
                  elevation="12"
                  class="mt-4"
                >
                  <v-card-title>
                    SECURE
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <p class="ma-4">
                      One of our key privacy features is the secure image proxy. With this feature, all images within the
                      RSS feeds are routed through our secure server before being displayed. This helps prevent any
                      potential privacy risks associated with loading external images directly. By proxying the images, we
                      can analyze and sanitize them, reducing the likelihood of malicious or unwanted content reaching
                      your device.
                    </p>
                    <p class="ma-4">
                      Additionally, we implement a sensible Content Security Policy (CSP) to safeguard against cross-site
                      scripting (XSS) attacks and other potential security vulnerabilities. The CSP allows us to define
                      trusted sources for various types of content. By enforcing these policies, we mitigate the risks associated 
                      with unauthorized code execution and unauthorized data access.
                    </p>
                    <p class="ma-4">
                      Your privacy and security are of utmost importance to us. By utilizing a secure image proxy and
                      implementing a sensible Content Security Policy, we aim to provide you with a worry-free
                      browsing experience. Enjoy peace of mind as you explore your RSS feeds, knowing that we have taken
                      proactive steps to protect your privacy and ensure the integrity of your data.
                    </p>
                  </v-card-text>
                </v-card>
                <!-- internationalization/localization -->
                <v-card
                  elevation="12"
                  class="mt-4"
                >
                  <v-card-title>
                    LOCALIZED 
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <p class="ma-4">
                      FeedGears is presently available in English and Spanish.  Adding support for additional languages is our on short-term roadmap.
                    </p>
                  </v-card-text>
                </v-card>
                <!-- free as in beer -->
                <v-card
                  elevation="12"
                  class="mt-4"
                >
                  <v-card-title>
                    FREE AS IN BEER
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <p class="ma-4">
                      Lost Sidewalk Software embraces the principles of free and open source software (FOSS) for all of our products.
                      All our source code is freely available on GitHub and covered by the GNU General Public License
                      version 3 (GPLv3). This means that anyone can access, study, modify, and distribute our software.
                    </p>
                    <p class="ma-4">
                      We welcome developers and enthusiasts to join our community and contribute to the project. Whether
                      it's through code contributions, bug fixes, feature suggestions, or documentation improvements, we
                      value and appreciate all forms of involvement. Together, we can make the FeedGears platform even better and
                      meet the evolving needs of our users.
                    </p>
                    <p class="ma-4">
                      In the spirit of FOSS, we believe in the freedom to use, examine, modify, and redistribute
                      software. Our goal is to foster collaboration, knowledge sharing, and innovation. We invite you to
                      join our journey, where we aim to build an active and supportive community of developers,
                      contributors, and users. Your contributions, regardless of their size, are highly valued and
                      instrumental in shaping the future of FeedGears. Let's celebrate the power of FOSS and work
                      together to create a better and more inclusive experience for all.
                    </p>
                  </v-card-text>
                </v-card>
                <!-- self-hostable / pre-built containers -->
                <v-card
                  elevation="12"
                  class="mt-4 mb-16"
                >
                  <v-card-title>
                    SELF-HOSTABLE / PRE-BUILT CONTAINERS
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <p class="ma-4">
                      You can run FeedGears in your preferred environment. Our pre-built containers and compatible with
                      various OCI-compliant runtimes such as Docker and Podman. This gives you the freedom to deploy and
                      manage FeedGears according to your specific requirements.
                    </p>
                    <p class="ma-4">
                      Self-hosting allows you to keep your data within your own environment, offering you full control
                      over the entire RSS aggration process. You decide to run it on your local machine, private server,
                      or within your containerized infrastructure.
                    </p>
                  </v-card-text>
                </v-card>
              </template>
            </DemoFeature>
          </v-carousel-item>
          <!-- api access -->
          <v-carousel-item>
            <DemoFeature
              title="API Access"
              :details="[
                'Coming soon!',
              ]"
            />
          </v-carousel-item>
          <!-- about Lost Sidewalk -->
          <v-carousel-item>
            <DemoFeature
              title="Lost Sidewalk Software"
              :details="[
                '',
              ]"
            />
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import DemoFeature from '@/components/landing/DemoFeature.vue';

export default {
  name: "DemoPanel",
  components: {
    DemoFeature,
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

<style scoped>
.layout-image-container {
  position: relative;
}

.background-image {
  position: absolute;
  top: -20px;
  /* Adjust the top and left values as per your requirement */
  left: -20px;
  /* Adjust the top and left values as per your requirement */
  z-index: -1;
  /* Additional styling */
  opacity: 0.8;
}

.background-image1 {
  z-index: -2;
}

.foreground-image {
  position: relative;
  z-index: 1;
}
</style>