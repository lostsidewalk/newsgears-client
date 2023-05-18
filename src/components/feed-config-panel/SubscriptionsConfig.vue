<template>
  <v-sheet align="left" justify="center">
    <!-- add RSS/ATOM feed from URL -->
    <v-card>
      <v-card-title class="pa-4">{{ this.$t('addANewSubscription') }}</v-card-title>
      <v-divider />
      <v-card-text>
        <!-- text field -->
        <v-text-field type="text"
          autofocus
          :label="this.$t('feedUrl')"
          v-model="newRssAtomUrl.feedUrl"
          :placeholder="this.$t('feedUrl')" />
        <v-text-field type="text" readonly variant="plain">
          {{ this.$t("credentialsUseMessage") }}
        </v-text-field>
        <!-- username text field -->
        <v-text-field type="text"
          :label="this.$t('username')"
          v-model="newRssAtomUrl.username"
          :placeholder="this.$t('username')" />
        <!-- password text field -->
        <v-text-field type="password"
          :label="this.$t('password')"
          v-model="newRssAtomUrl.password"
          :placeholder="this.$t('password')" />
        <RssAtomFeedInfo v-if="newRssAtomUrl.discoveryUrl || newRssAtomUrl.error"
          :info="newRssAtomUrl"
          :theme="theme"
          :filterSupport="false"
          @followRecommendation="followRecommendation">
          <template v-slot:additional>
            <v-btn @click="addNewRssAtomUrl"
              size="small"
              prepend-icon="fa-plus"
              :loading="addNewInTransit"
              :title="this.$t('subscribe')"
              :text="this.$t('subscribe')" />
          </template>
        </RssAtomFeedInfo>
      </v-card-text>
      <v-divider />
      <!-- buttons (discovery, auth, subscribe) -->
      <v-card-actions>
        <v-btn @click="this.refreshRssAtomUrlInfo(newRssAtomUrl)"
          size="small"
          prepend-icon="fa-refresh"
          :loading="discoveryInTransit"
          :disabled="!newRssAtomUrl.feedUrl"
          :title="this.$t('discovery')"
          :text="this.$t('discovery')" />
      </v-card-actions>
    </v-card>
    <!-- -->
    <!-- manage existing RSS/ATOM feed subscriptions -->
    <!-- -->
    <v-card v-if="this.rssAtomFeedUrls && this.rssAtomFeedUrls.length > 0">
      <v-card-title class="pa-4">{{ this.$t('yourSubscriptions') }}</v-card-title>
      <v-divider />
      <v-card-text>
        <RssAtomFeedInfo v-for="(rssAtomUrl, idx) in this.getCurrentPage(this.rssAtomFeedUrls)" :key="idx" 
          class="mb-4" elevation="6"
          :info="rssAtomUrl"
          :theme="theme"
          :filterSupport="false"
          @refreshFeed="this.refreshRssAtomUrlInfo(rssAtomUrl)" 
          @followRecommendation="followRecommendation">
          <template v-slot:additional>
            <v-btn @click="rssAtomUrl.showDetails = !rssAtomUrl.showDetails" 
              size="small"
              prepend-icon="fa-expand"
              :title="this.$t('auth')"
              :text="this.$t('auth')" />
            <v-btn @click="this.deleteRssAtomUrl(rssAtomUrl.id)"
              size="small"
              prepend-icon="fa-trash"
              :loading="deleteInTransit"
              :title="this.$t('unsubscribe')"
              :text="this.$t('unsubscribe')" />
          </template>
        </RssAtomFeedInfo>
          <!-- TODO: make this a modal dialogs -->
          <!-- <v-label v-if="rssAtomUrl.showDetails">{{ this.$t("credentialsUseMessage") }}</v-label> -->
          <!-- <div v-if="rssAtomUrl.showDetails">
            <v-label>{{ this.$t('username') }}</v-label>
            <v-text-field type="text" v-model="rssAtomUrl.username"
              :placeholder="this.$t('username')" style="margin-bottom: 0.75rem" />
            <v-label>{{ this.$t('password') }}</v-label>
            <v-text-field type="password" v-model="rssAtomUrl.password"
              :placeholder="this.$t('password')" />
            <div>
              <v-btn class="rss-atom-url-row-button accessible-button"
                density="comfortable"
                variant="tonal"
                @click="this.updateRssAtomUrlAuth(rssAtomUrl)"
                prepend-icon="fa-save"
                :loading=updateAuthInTransit" 
                text="Update auth" />
            </div>
          </div> -->
      </v-card-text>
    </v-card>
  </v-sheet>

  <!-- TODO: replace pagination -->

  <!-- all subscriptions pagination -->
  <!-- <div class="subscription-filter-buttons" v-if="needsPagination()">
    <v-btn :title="this.$t('first')" 
      :aria-label="this.$t('first')"
      class="subscription-filter-button accessible-button" 
      density="compact"
      variant="tonal"
      @click="firstPage"
      icon="fa-angle-double-left" />
    <v-btn :title="this.$t('previous')" 
      :aria-label="this.$t('previous')" 
      class="subscription-filter-button accessible-button" 
      density="compact"
      variant="tonal"
      @click="previousPage"
      icon="fa-angle-left" />
    <v-btn :title="this.$t('next')" 
      :aria-label="this.$t('next')" 
      class="subscription-filter-button accessible-button" 
      density="compact"
      variant="tonal"
      @click="nextPage"
      icon="fa-angle-right" />
    <v-btn :title="this.$t('last')" 
      :aria-label="this.$t('last')" 
      class="subscription-filter-button accessible-button" 
      density="compact"
      variant="tonal"
      @click="lastPage"
      icon="fa-angle-double-right" />
  </div> -->

</template>

<script>
import RssAtomFeedInfo from './RssAtomFeedInfo.vue';

export default {
  name: "SubscriptionsConfig",
  components: {
    RssAtomFeedInfo,
  },
  props: [ "rssAtomFeedUrls", "feedId", "theme", "baseUrl" ],
  computed: {
    totalPages: function() {
      if (this.rssAtomFeedUrls) {
        let t = Math.ceil(this.rssAtomFeedUrls.length / this.itemsPerPage);
        return t;
      }
      
      return 0;
    },
  },
  emits: [
    "addRssAtomUrl",
    "deleteRssAtomUrl",
    "updateRssAtomUrlAuth",
    "updateServerMessage",
  ],
  methods: {
    // 
    // server error 
    // 
    handleServerError(error) {
      console.error(error);
      if (error.name === 'TypeError') {
        this.setLastServerMessage(this.$t('somethingHorribleHappened'));
      } else if (error.name === 'AbortError') {
        this.setLastServerMessage(this.$t('requestTimedOut'));
      } else if (error.message) {
        this.setLastServerMessage(error.message); 
      } else {
        this.setLastServerMessage(error); // $auth plugin errors 
      }
    },
    setLastServerMessage(message) {
      if (message) {
        this.$emit('updateServerMessage', message);
      }
    },
    // 
    // pagination 
    // 
    needsPagination() {
      return this.itemCount > this.itemsPerPage;
    },
    getCurrentPage(items) {
      if (!items) {
        return [];
      }
      if (items.length !== this.itemCount) {
        this.itemCount = items.length; 
        this.currentPage = 0;
      }
      let startIdx = this.currentPage * 10;
      let endIdx = startIdx + 10;
      return items.slice(startIdx, endIdx);
    },
    firstPage() {
      this.currentPage = 0;
    },
    nextPage() {
      let n = this.currentPage + 1;
      if (n === this.totalPages) {
        n -= 1;
      }
      this.currentPage = n;
    },
    previousPage() {
      let p = this.currentPage - 1;
      if (p < 0) {
        p = 0;
      }
      this.currentPage = p;
    },
    lastPage() {
      this.currentPage = this.totalPages - 1;
    },
    // make POST call to feed controller/query definitions endpoint 
    addNewRssAtomUrl() {
      this.addNewInTransit = true;
      console.log("subscription-config: pushing new subscription to remote..");
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'POST',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify([this.newRssAtomUrl]),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/feeds/" + this.feedId + '/queries/', requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''), { cause: {} })}) : 
              response.text().then(t => {throw new Error(t, { cause: {} })});
          }
        }).then((data) => {
          let queryDefinitions = data.queryDefinitions;
          if (queryDefinitions && queryDefinitions.length > 0) {
            let qd = queryDefinitions[0];
            this.$emit('addRssAtomUrl', qd);
            this.newRssAtomUrl = {};
            this.setLastServerMessage(this.$t('subscriptionAdded'));
          }
        }).catch((error) => {
          this.handleServerError(error); 
        }).finally(() => {
          this.addNewInTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error); 
        this.addNewInTransit = false;
      });
    },
    // make DELETE call to feed controller/query definitions endpoint 
    deleteRssAtomUrl(id) {
      this.deleteInTransit = true;
      console.log("subscription-config: deleteing subscription..");
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'DELETE',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/feeds/" + this.feedId + '/queries/' + id, requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''), { cause: {} })}) : 
              response.text().then(t => {throw new Error(t, { cause: {} })});
          }
        }).then(() => {
          this.$emit('deleteRssAtomUrl', id);
          this.setLastServerMessage(this.$t('subscriptionDeleted'));
        }).catch((error) => {
          this.handleServerError(error); 
        }).finally(() => {
          this.deleteInTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error); 
        this.deleteInTransit = false;
      });
    },
    // make PUT call to feed controller/query definitions endpoint 
    updateRssAtomUrlAuth(rssAtomUrl) {
      try {
        this.validateRssAtomUrl(rssAtomUrl);
      } catch (error) {
        console.error(error);
        return;
      }
      this.updateAuthInTransit = true;
      console.log("subscription-config: pushing updated subscription to remote..");
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'PUT',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(rssAtomUrl),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/feeds/" + this.feedId + '/queries/' + rssAtomUrl.id, requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''), { cause: {} })}) : 
              response.text().then(t => {throw new Error(t, { cause: {} })});
          }
        }).then((data) => {
          let queryDefinitions = data.queryDefinitions;
          if (queryDefinitions && queryDefinitions.length > 0) {
            let qd = queryDefinitions[0];
            this.$emit('updateRssAtomUrlAuth', qd);
            this.setLastServerMessage(this.$t('subscriptionUpdated'));
          }
        }).catch((error) => {
          this.handleServerError(error); 
        }).finally(() => {
          this.updateAuthInTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error); 
        this.updateAuthInTransit = false;
      });
    },
    // 
    // discovery 
    // 
    refreshRssAtomUrlInfo(r) {
      if (r.feedUrl) {
        this.doDiscovery(r);
      }
    },
    doDiscovery(r) {
      if (r.feedUrl && r.feedUrl !== r.discoveryUrl) {
        this.discoveryInTransit = true;
        this.$auth.getTokenSilently().then((token) => {
          const controller = new AbortController();
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
              includeRecommendations: false,
            }),
            signal: controller.signal
          };
          const timeoutId = setTimeout(() => controller.abort(), 45000);
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
              r.discoveryUrl = data.feedUrl;
              r.title = data.title;
              r.description = data.description;
              r.author = data.author;
              r.categories = data.categories;
              r.copyright = data.copyright;
              r.docs = data.docs;
              r.encoding = data.encoding;
              r.feedType = data.feedType;
              r.generator = data.generator;
              r.icon = data.icon;
              r.image = data.image;
              r.language = data.language;
              r.link = data.link;
              r.managingEditor = data.managingEditor;
              r.publishedDate = data.publishedDate;
              r.styleSheet = data.styleSheet;
              r.supportedTypes = data.supportedTypes;
              r.webMaster = data.webMaster;
              r.sampleEntries = data.sampleEntries;
              r.feedRecommendationInfo = data.feedRecommendationInfo;
              r.discoveryUrl = data.feedUrl;
              r.httpStatusCode = data.httpStatusCode;
              r.httpStatusMessage = data.httpStatusMessage;
              r.redirectFeedUrl = data.redirectFeedUrl;
              r.redirectHttpStatusCode = data.redirectHttpStatusCode;
              r.redirectHttpStatusMessage = data.redirectHttpStatusMessage;
            }
          }).catch((error) => {
            if (error.name === 'TypeError') {
              r.error = this.$t('somethingHorribleHappened');
            } else if (error.name === 'AbortError') {
              r.error = this.$t('requestTimedOut');
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
          })
          .finally(() => {
            this.discoveryInTransit = false;
            clearTimeout(timeoutId);
          });
        }).catch((error) => {
          this.handleServerError(error);
          this.discoveryInTransit = false;
        });
      }
    },
    len(str) {
      return (str !== null && str !== undefined) ? str.length : 0;
    },
    // 
    // recommendation 
    // 
    followRecommendation(url) {
      this.newRssAtomUrl.feedUrl = url;
      this.refreshRssAtomUrlInfo(this.newRssAtomUrl);
    },
    // 
    // misc 
    //
    focus() {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    },
  },
  data() {
    return {
      itemsPerPage: 10,
      currentPage: 0,
      itemCount: 0,
      mode: "ADD_FROM_URL",
      //
      newFeedDiscoveryError: null,
      newRssAtomUrl: {},
      //
      addNewInTransit: false,
      deleteInTransit: false,
      updateAuthInTransit: false,
      discoveryInTransit: false,
    }
  }
}
</script>
