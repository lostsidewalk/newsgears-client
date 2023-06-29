<template>
  <v-container>
    <v-sheet>
      <v-card elevation="1">
        <v-card-title class="question-verbiage text-center pa-4">
          {{ $t('whatIsRSS') }}
        </v-card-title>
        <v-divider />
        <v-card-text
          align="left"
        >
          <p class="mb-2 faq-detail">
            {{ $t('rssIs') }}
          </p>
      
          <p class="mb-2 faq-detail">
            {{ $t('rssAllows') }}
          </p>
      
          <p class="mb-2 faq-detail">
            {{ $t('feedGearsIs') }}
          </p>
      
          <p class="mb-2 faq-detail">
            {{ $t('overTheYears') }}

            <v-list
              density="compact"
              role="list"
              :aria-label="$t('listOfLinksToRSSSpecs')"
            >
              <v-list-item
                role="listitem"
                aria-posinset="1"
                aria-setsize="5"
              >
                <a
                  href="https://www.rssboard.org/rss-0-9-0"
                  target="_blank"
                >RSS 0.90</a>
              </v-list-item>
              <v-list-item
                role="listitem"
                aria-posinset="2"
                aria-setsize="5"
              >
                <a
                  href="https://www.rssboard.org/rss-0-9-1-netscape"
                  target="_blank"
                >RSS 0.91</a>
              </v-list-item>
              <v-list-item
                role="listitem"
                aria-posinset="3"
                aria-setsize="5"
              >
                <a
                  href="https://web.resource.org/rss/1.0/"
                  target="_blank"
                >RSS 1.0</a>
              </v-list-item>
              <v-list-item
                role="listitem"
                aria-posinset="4"
                aria-setsize="5"
              >
                <a
                  href="https://www.rssboard.org/rss-specification"
                  target="_blank"
                >RSS 2.0</a>
              </v-list-item>
              <v-list-item
                role="listitem"
                aria-posinset="5"
                aria-setsize="5"
              >
                <a
                  href="http://www.aaronsw.com/2002/rss30"
                  target="_blank"
                >RSS 3.0</a>
              </v-list-item>
            </v-list>
            {{ $t('eachVersionAdded') }}
          </p>
      
          <p class="mb-2 faq-detail">
            {{ $t('atomOTOH') }}
          </p>
      
          <p class="mb-2 faq-detail">
            {{ $t('keyDifferences') }}
          </p>
      
          <p class="mb-2 faq-detail">
            {{ $t('overallRoles') }}
          </p>
      
          <p class="mb-2 faq-detail">
            <v-list
              density="compact"
              role="list"
              aria-label="listOfLinksOfInterest"
            >
              <v-list-item
                role="listitem"
                aria-posinset=""
                aria-setsize="6"
              >
                <a
                  href="https://aboutfeeds.com/"
                  target="_blank"
                >About Feeds</a>
              </v-list-item>
              <v-list-item
                role="listitem"
                aria-posinset="1"
                aria-setsize="6"
              >
                <a
                  href="https://en.wikipedia.org/wiki/RSS"
                  target="_blank"
                >Wikipedia: RSS</a>
              </v-list-item>
              <v-list-item
                role="listitem"
                aria-posinset="2"
                aria-setsize="6"
              >
                <a
                  href="https://meganesulli.com/blog/how-rss-works"
                  target="_blank"
                >An Intro to RSS Feeds</a>
              </v-list-item>
              <v-list-item
                role="listitem"
                aria-posinset="3"
                aria-setsize="6"
              >
                <a
                  href="https://www.youneedfeeds.com/"
                  target="_blank"
                >You Need Feeds</a>
              </v-list-item>
              <v-list-item
                role="listitem"
                aria-posinset="4"
                aria-setsize="6"
              >
                <a
                  href="https://huey.xyz/posts/2021-07-18-rss"
                  target="_blank"
                >Why you should consider using RSS</a>
              </v-list-item>
              <v-list-item
                role="listitem"
                aria-posinset="5"
                aria-setsize="6"
              >
                <a
                  href="https://ncase.me/rss/"
                  target="_blank"
                >Back to the Future with RSS</a>
              </v-list-item>
            </v-list>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-dialog v-model="showVideo">
            <VideoPanel @dismiss="showVideo = false" />
          </v-dialog>
          <v-btn
            prepend-icon="fa-file-video-o"
            text="RSS Made Easy"
            @click="showVideo = true"
          />
          <v-dialog v-model="showImage">
            <ImagePanel @dismiss="showImage = false" />
          </v-dialog>
          <v-btn
            prepend-icon="fa-file-image-o"
            text="With And Without RSS"
            @click="showImage = true"
          />
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import VideoPanel from '@/components/landing/VideoPanel.vue';
import ImagePanel from '@/components/landing/ImagePanel.vue';

export default {
  name: "FAQPanel",
  components: {
    VideoPanel,
    ImagePanel,
  },
  data() {
    return {
      showVideo: false,
      showImage: false,
    }
  }
}
</script>

<style scoped>
.question-verbiage {
  font-family: "Russo One", system-ui, sans-serif;
}

.faq-detail {
  font-size: larger;
}
</style>
