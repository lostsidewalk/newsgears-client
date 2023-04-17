<template>
  <div class="collections">
    <div class="collection-label-buttons">
      <button class="collection-label-button accessible-button" v-for="c in this.defaultCollections" :key="c"
        @click.stop="this.doCollectionDiscovery(c)">
        {{ this.$t(c) }}
      </button>
    </div>
    <div v-for="c in Object.keys(this.collections)" :key="c" class="collection-field" v-show="this.selectedCollection === c && this.collections[c]">
      <!-- label -->
      <!-- <div class="rss-atom-url-label" v-if="this.rssAtomFeedUrls">
        <label>{{ this.$t(c + '.details') }}</label>
      </div> -->
      <div class="collection-wrapper">
        <div class="rss-atom-url-wrapper" v-for="rssAtomUrl in this.collections[c].feeds" :key="rssAtomUrl">
          <!-- buttons (discovery, auth, subscribe) -->
          <div class="rss-atom-url-row-buttons">
            <button class="rss-atom-url-row-button accessible-button"
              @click="this.$emit('addRssAtomUrl', rssAtomUrl)"
              :disabled="disabled || inTransit || this.isSubscribed(rssAtomUrl)"
              :title="this.isSubscribed(rssAtomUrl) ? this.$t('subscribed') : this.$t('subscribe')">
              <span class="fa fa-plus" /> &nbsp; {{ this.isSubscribed(rssAtomUrl) ? this.$t('subscribed') : this.$t('subscribe') }}
            </button>
          </div>
          <RssAtomFeedInfo :info="rssAtomUrl"
            :disabled="disabled || inTransit"
            :theme="theme"
            :filterSupport="false"
            style="margin-top: 0.75rem" 
            @refreshFeed="this.refreshRssAtomUrlInfo(rssAtomUrl)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RssAtomFeedInfo from './RssAtomFeedInfo.vue';

export default {
  name: "FeedCollectionsBrowser",
  props: ["rssAtomFeedUrls", "disabled", "theme", "baseUrl"],
  computed: {
    defaultCollections: function() {
      return [
        'topNews',
        'investing',
        'technology',
        'business',
        'science',
        'creative',
        'lifestyle',
      ];
    }
  },
  emits: [
    "addRssAtomFeedUrl", 
    "addRssAtomFeedUrls", 
    "deleteRssAtomFeedUrl",
    "authError",
    "updateServerMessage",
  ],
  components: {
    RssAtomFeedInfo,
  },
  mounted() {
    this.doCollectionDiscovery(this.selectedCollection);
  },
  methods: {
    isSubscribed(rssAtomUrl) {
      let isSubscribed = false;
      if (this.rssAtomFeedUrls) {
        for (let i = 0; i < this.rssAtomFeedUrls.length; i++) {
          if (this.rssAtomFeedUrls[i].feedUrl === rssAtomUrl.feedUrl) {
            isSubscribed = true;
            break;
          }
        }
      }
      return isSubscribed;
    },
    // 
    doCollectionDiscovery(collection) {
      if (!this.collections[collection]) {
        console.log("fetching collection: " + collection);
        this.inTransit = true;
        this.$auth.getTokenSilently().then((token) => {
          const requestOptions = {
              method: 'GET', 
              headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              credentials: 'include', 
            };
          fetch(this.baseUrl + "/discovery/collection/" + collection, requestOptions).then((response) => {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            if (response.status === 200) {
              return isJson ? response.json() : {};
            } else {
              return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
            }
          }).then((data) => {
            let feeds = [];
            for (let i = 0; i < data.length; i++) {
              let r = {};
              r.feedUrl = data[i].feedUrl; 
              r.title = data[i].title;
              r.description = data[i].description;
              r.icon = data[i].icon;
              r.image = data[i].image;
              r.language = data[i].language;
              r.publishedDate = data[i].publishedDate;
              r.sampleEntries = data[i].sampleEntries;
              feeds.push(r);
            }
            this.collections[collection] = {
              feeds: feeds
            };
            this.selectedCollection = collection;
          }).catch((error) => {
            if (error.name === 'TypeError') {
              this.setLastServerMessage(this.$t('somethingHorribleHappened'));
            } else {
              this.setLastServerMessage(error.message);
            }
          }).finally(() => {
            this.inTransit = false;
          });
        }).catch((error) => {
          this.handleAuthError(error);
        });
      } else {
        this.selectedCollection = collection;
      }
    },
    // 
    refreshRssAtomUrlInfo(rssAtomUrl) {
      rssAtomUrl.error = null;
      if (rssAtomUrl.feedUrl) {
        this.doDiscovery(rssAtomUrl);
      }
    },
    doDiscovery(r) {
      if (r.feedUrl) { // sanity check 
        this.inTransit = true;
        this.$auth.getTokenSilently().then((token) => {
          const requestOptions = {
            method: 'POST', 
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            credentials: 'include', 
            body: JSON.stringify({
              url: r.feedUrl,
              username: r.username,
              password: r.password,
              isIncludeRecommendations: false,
            })
          };
          fetch(this.baseUrl + "/discovery", requestOptions).then((response) => {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            if (response.status === 200) {
              return isJson ? response.json() : {};
            } else {
              return isJson ? response.json().then(j => {throw new Error(null, {cause: j})}) : response.text().then(t => {throw new Error(t)});
            }
          }).then((data) => {
            if (data.error) {
              r.error = data.error;
            } else {
              r.feedUrl = data.feedUrl; 
              r.title = data.title;
              r.description = data.description;
              r.author = data.author;
              r.copyright = data.copyright;
              r.docs = data.docs;
              r.icon = data.icon;
              r.image = data.image;
              r.language = data.language;
              r.link = data.link;
              r.publishedDate = data.publishedDate;
              r.sampleEntries = data.sampleEntries;
              // r.styleSheet = data.styleSheet;
              // r.categories = data.categories;
              // r.encoding = data.encoding;
              // r.feedType = data.feedType;
              // r.generator = data.generator;
              // r.managingEditor = data.managingEditor;
              // r.supportedTypes = data.supportedTypes;
              // r.webMaster = data.webMaster;
              // r.httpStatusCode = data.httpStatusCode;
              // r.httpStatusMessage = data.httpStatusMessage;
              // r.redirectFeedUrl = data.redirectFeedUrl;
              // r.redirectHttpStatusCode = data.redirectHttpStatusCode;
              // r.redirectHttpStatusMessage = data.redirectHttpStatusMessage;
            }
          }).catch((error) => {
            if (error.name === 'TypeError') {
              r.error = this.$t('somethingHorribleHappened');
            } else {
              let cause = error.cause;
              if (cause) {
                r.error = cause.details;
                r.httpStatusCode = cause.httpStatusCode;
                r.httpStatusMessage = cause.httpStatusMessage;
                r.redirectFeedUrl = cause.redirectFeedUrl;
                r.redirectHttpStatusCode = cause.redirectHttpStatusCode;
                r.redirectHttpStatusMessage = cause.redirectHttpStatusMessage;
              } else {
                r.error = error.message;
              }
            }
          }).finally(() => {
            this.inTransit = false;
          });
        }).catch((error) => {
          this.handleAuthError(error);
        });
      }
    },
    //
    handleAuthError(error) {
      this.$emit('authError', error);
      this.inTransit = false;
    },
    setLastServerMessage(message) {
      if (message) {
        this.$emit('updateServerMessage', message);
      }
    },
  },
  data() {
    return {
      selectedCollection: 'topNews',
      collections: {},
      // 
      inTransit: false,
    }
  }
}
</script>

<style scoped>

.collection-label-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  gap: .5rem;
  margin-bottom: .75rem;
}

.collection-label-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: left;
  border-radius: 4px;
  text-align: center;
}

.collection-label-button:disabled {
  cursor: auto;
}

.collection-label-button:hover, .collection-label-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.collection-label-button:hover:disabled {
  background-color: unset;
}

.collection-field {
  border: 1px solid v-bind('theme.sectionbordercolor');
  text-align: left;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  padding: .75rem;
  border-radius: 4px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  overflow-x: auto;
  font-family: Arial, Helvetica, sans-serif;
}

.collection-field label {
  font-size: smaller;
}

.rss-atom-url-label {
  padding-left: 0.56rem;
  margin-bottom: 0.75rem;
}

.rss-atom-url-wrapper {
  background-color: v-bind('theme.sectionbrighterhighlight');
  padding: .75rem;
  margin-bottom: .75rem;
  border-radius: 4px;
  border: 1px solid v-bind('theme.sectionbordercolor');
  contain: content;
  overflow: auto;
  display: flex;
  flex-direction: column;
  row-gap: .44rem;
}

.rss-atom-url-wrapper:last-of-type {
  margin-bottom: 0rem;
}

.rss-atom-url-row-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.rss-atom-url-row-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  border-radius: 4px;
  text-align: center;
}

.rss-atom-url-row-button:hover, .rss-atom-url-row-button:focus-visible {
  background: v-bind('theme.buttonhighlight');
}

.rss-atom-url-row-button:disabled {
  cursor: auto;
}

.rss-atom-url-row-button:hover:disabled {
  background-color: unset;
}
</style>
