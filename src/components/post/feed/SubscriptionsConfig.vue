<template>
  <div class="feed-config-field">

    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />

    <!-- label -->
    <div class="rss-atom-url-label" v-if="this.rssAtomFeedUrls">
      <label>{{ this.$t('addANewSubscription') }}</label>
    </div>

    <!-- add RSS/ATOM feed from URL -->
    <!-- TODO: component -->
    <div class="rss-atom-url-wrapper">
      <!-- url input field w/refresh and delete buttons -->
      <div class="rss-atom-url-row">
        <!-- label -->
        <label>{{ this.$t('feedUrl') }}</label>
        <!-- text field -->
        <input type="text"
          autofocus
          v-model="newRssAtomUrl.feedUrl"
          :disabled="disabled || inTransit"
          placeholder="Feed URL" />
        <!-- buttons (discovery, auth, subscribe) -->
        <div class="rss-atom-url-row-buttons">
          <button class="rss-atom-url-row-button accessible-button"
            @click="this.refreshRssAtomUrlInfo(newRssAtomUrl)"
            :disabled="disabled || inTransit || !newRssAtomUrl.feedUrl"
            :title="this.$t('discovery')">
            <span class="fa fa-refresh" /> &nbsp; {{ this.$t('discovery') }}
          </button>
          <button class="rss-atom-url-row-button accessible-button"
            @click="this.showNewFeedDetails = !this.showNewFeedDetails"
            :disabled="disabled || inTransit"
            :title="this.$t('auth')">
            <span class="fa fa-expand" /> &nbsp; {{ this.$t('auth') }}
          </button>
          <button class="rss-atom-url-row-button accessible-button"
            @click="addNewRssAtomUrl"
            :disabled="disabled || inTransit || !newRssAtomUrl.feedUrl"
            :title="this.$t('subscribe')">
            <span class="fa fa-plus" /> &nbsp; {{ this.$t('subscribe') }}
          </button>
        </div>
      </div>
      <!-- credentials -->
      <label v-if="showNewFeedDetails">{{ this.$t("credentialsUseMessage") }}</label>
      <div class="rss-atom-url-row" v-if="showNewFeedDetails">
        <!-- username label -->
        <label>{{ this.$t("username") }}</label>
        <!-- username text field -->
        <input type="text"
          v-model="newRssAtomUrl.username"
          :disabled="disabled || inTransit"
          :placeholder="this.$t('username')"
          style="margin-bottom: .75rem" />
        <!-- password label -->
        <label>{{ this.$t("password") }}</label>
        <!-- password text field -->
        <input type="password"
          v-model="newRssAtomUrl.password"
          :disabled="disabled || inTransit"
          :placeholder="this.$t('password')" />
      </div>
      <RssAtomFeedInfo v-if="newRssAtomUrl.discoveryUrl"
        :info="newRssAtomUrl"
        :disabled="disabled || inTransit"
        :theme="theme"
        :filterSupport="false"
        style="margin-top: .75rem" />
    </div>

    <div class="rss-atom-url-label" v-if="this.rssAtomFeedUrls && this.rssAtomFeedUrls.length > 0">
      <label>{{ this.$t('yourSubscriptions') }}</label>
    </div>

    <!-- all subscriptions pagination -->
    <div class="subscription-filter-buttons" v-if="needsPagination()">
      <!-- first page button-->
      <button :title="this.$t('first')" 
        :aria-label="this.$t('first')"
        class="subscription-filter-button accessible-button" 
        @click="firstPage">
        <span class="fa fa-angle-double-left"/>
      </button>
      <!-- previous page button -->
      <button :title="this.$t('previous')" 
        :aria-label="this.$t('previous')" 
        class="subscription-filter-button accessible-button" 
        @click="previousPage">
        <span class="fa fa-angle-left"/>
      </button>
      <!-- next page button -->
      <button :title="this.$t('next')" 
        :aria-label="this.$t('next')" 
        class="subscription-filter-button accessible-button" 
        @click="nextPage">
        <span class="fa fa-angle-right"/>
      </button>
      <!-- last page button-->
      <button :title="this.$t('last')" 
        :aria-label="this.$t('last')" 
        class="subscription-filter-button accessible-button" 
        @click="lastPage">
        <span class="fa fa-angle-double-right"/>
      </button>
    </div>

    <!-- 'your subscriptions' -->
    <div class="rss-atom-url-wrapper" v-for="(rssAtomUrl, idx) in this.getCurrentPage(this.rssAtomFeedUrls)" :key="idx">
      <!-- url input field w/refresh and delete buttons -->
      <div class="rss-atom-url-row">
        <label>
          {{ this.$t('feedUrl') }}
        </label>
        <input :ref="'rssAtomUrlRow_' + idx" type="text" v-model="rssAtomUrl.feedUrl"
          :disabled="disabled || inTransit"
          readonly="true"
          placeholder="Feed URL" />
        <div class="rss-atom-url-row-buttons">
          <button class="rss-atom-url-row-button accessible-button"
            @click="this.refreshRssAtomUrlInfo(rssAtomUrl)" 
            :disabled="disabled || inTransit"
            :title="this.$t('discovery')">
            <span class="fa fa-refresh"/> &nbsp; {{ this.$t('discovery') }}
          </button>
          <button class="rss-atom-url-row-button accessible-button" 
            @click="rssAtomUrl.showDetails = !rssAtomUrl.showDetails" 
            :disabled="disabled || inTransit"
            :title="this.$t('auth')">
            <span class="fa fa-expand"/> &nbsp; {{ this.$t('auth') }}
          </button>
          <button class="rss-atom-url-row-button accessible-button"
            @click="this.$emit('deleteRssAtomUrl', rssAtomUrl.id)"
            :disabled="disabled || inTransit"
            :title="this.$t('unsubscribe')">
            <span class="fa fa-trash" /> &nbsp; {{  this.$t('unsubscribe') }}
          </button>
        </div>
      </div>
      <label v-if="rssAtomUrl.showDetails">{{ this.$t("credentialsUseMessage") }}</label>
      <div class="rss-atom-url-row" v-if="rssAtomUrl.showDetails">
        <label>{{ this.$t('username') }}</label>
        <input type="text" v-model="rssAtomUrl.username"
          :disabled="disabled || inTransit"
          :placeholder="this.$t('username')" style="margin-bottom: 0.75rem" />
        <label>{{ this.$t('password') }}</label>
        <input type="password" v-model="rssAtomUrl.password"
          :disabled="disabled || inTransit"
          :placeholder="this.$t('password')" />
        <div class="rss-atom-url-row-buttons">
          <button class="rss-atom-url-row-button accessible-button"
            @click="this.$emit('updateRssAtomUrlAuth', rssAtomUrl)"
            :disabled="disabled || inTransit">
            <span class="fa fa-save" /> &nbsp; Update auth
          </button>
        </div>
      </div>
      <RssAtomFeedInfo :ref="'rss-atom-url-info-' + rssAtomUrl.id"
        :info="rssAtomUrl"
        :disabled="disabled || inTransit"
        :theme="theme"
        :filterSupport="false"
        style="margin-top: 0.75rem" 
        @refreshFeed="this.refreshRssAtomUrlInfo(rssAtomUrl)" />
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import RssAtomFeedInfo from './RssAtomFeedInfo.vue';

export default {
  name: "SubscriptionsConfig",
  components: {
    NavbarFixedHeader,
    RssAtomFeedInfo,
  },
  props: [ "rssAtomFeedUrls", "disabled", "theme", "baseUrl" ],
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
    "fdeleteRssAtomUrl", 
    "updateRssAtomUrlAuth",
    "authError",
  ],
  methods: {
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
    //
    handleAuthError(error) {
      this.$emit('authError', error);
      this.inTransit = false;
    },
    focus() {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    },
    // 
    addNewRssAtomUrl() {
      this.$emit('addRssAtomUrl', this.newRssAtomUrl);
      this.newRssAtomUrl = {};
    },
    // 
    refreshRssAtomUrlInfo(rssAtomUrl) {
      rssAtomUrl.error = null;
      rssAtomUrl.discoveryUrl = null;
      if (rssAtomUrl.feedUrl) {
        this.doDiscovery(rssAtomUrl);
      }
    },
    doDiscovery(r) {
      if (r.feedUrl && r.feedUrl !== r.discoveryUrl) {
        if (this.len(r.feedUrl) > 2048) {
          // TODO: fix this 
          console.log("RSS/ATOM feed URL is too long (max 2048 characters).");
        }
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
              password: r.password
            })
          };
          fetch(this.baseUrl + "/discovery", requestOptions).then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              return response.json().then(j => {
                throw new Error(null, { cause: j });
              })
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
              r.discoveryUrl = data.feedUrl;
              r.httpStatusCode = data.httpStatusCode;
              r.httpStatusMessage = data.httpStatusMessage;
              r.redirectFeedUrl = data.redirectFeedUrl;
              r.redirectHttpStatusCode = data.redirectHttpStatusCode;
              r.redirectHttpStatusMessage = data.redirectHttpStatusMessage;
            }
          }).catch((error) => {
            console.error(error);
            if (error.name === 'TypeError') {
              r.error = this.$t('somethingHorribleHappened');
            } else {
              let cause = error.cause;
              let data = {};
              data.id = r.id;
              data.discoveryUrl = null;
              data.error = cause.details;
              data.httpStatusCode = cause.httpStatusCode;
              data.httpStatusMessage = cause.httpStatusMessage;
              data.redirectFeedUrl = cause.redirectFeedUrl;
              data.redirectHttpStatusCode = cause.redirectHttpStatusCode;
              data.redirectHttpStatusMessage = cause.redirectHttpStatusMessage;
            }
          })
          .finally(() => {
            this.inTransit = false;
          });
        }).catch((error) => {
          this.handleAuthError(error);
        });
      }
    },
    len(str) {
      return (str !== null && str !== undefined) ? str.length : 0;
    },
    // 
    toggleBrowseCollections() {
      if (this.showBrowseCollections) {
        this.cancelBrowseCollections();
      } else {
        this.showBrowseCollections();
      }
    },
    // doCatalogSearch() {
    //   this.showFeedCatalog = true;
    //   if (!this.feedCatalog) {
    //     console.log("feed-config-panel: loading feed catalog...');
    //     this.inTransit = true;
    //     this.$auth.getTokenSilently().then((token) => {
    //       const requestOptions = {
    //           method: 'GET',
    //           headers: {
    //             "Authorization": `Bearer ${token}`
    //           },
    //           credentials: 'include',
    //         };
    //         fetch(this.baseUrl + "/catalog", requestOptions)
    //         .then((response) => {
    //           if (response.status === 200) {
    //             return response.json();
    //           } else { // framework is rejecting the request
    //             throw Error(this.$t('unableToFetchCatalog'));
    //           }
    //         }).then((data) => {
    //           this.feedCatalog = data;
    //           for (let i = 0; i < this.feedCatalog.length; i++) {
    //             let c = this.feedCatalog[i];
    //             c.discoveryUrl = c.feedUrl;
    //           }
    //         }).catch((error) => {
    //           console.error(error);
    //           if (error.name === 'TypeError') {
    //             this.feedCatalogErrors.push(this.$t('somethingHorribleHappened'));
    //           } else {
    //             this.feedCatalogErrors.push(error.message);
    //           }
    //         }).finally(() => {
    //           this.inTransit = false;
    //         });
    //     }).catch((error) => {
    //       this.handleAuthError(error);
    //       this.inTransit = false;
    //     })
    //     this.feedCatalog = [];
    //   }
    // },
    // cancelCatalogSearch() {
    //   this.showFeedCatalog = false;
    // },
  },
  data() {
    return {
      itemsPerPage: 10,
      currentPage: 0,
      itemCount: 0,
      showNewFeedDetails: false,
      mode: "ADD_FROM_URL",
      //
      newFeedDiscoveryError: null,
      newRssAtomUrl: {},
      //
      inTransit: false,
    }
  }
}
</script>

<style scoped>
.feed-config-field {
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

.feed-config-field label {
  font-size: smaller;
}

.feed-config-field > input, .feed-config-field > textarea {
  padding: .44rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 4px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  margin-top: .125rem;
  resize: none;
}

.feed-config-field input:hover, .feed-config-field textarea:hover, 
.feed-config-field input:focus-visible, .feed-config-field textarea:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-config-field input:disabled, .feed-config-field textarea:disabled {
  cursor: auto;
}

.rss-atom-url-label {
  padding-left: 0.56rem;
  margin-bottom: 0.75rem;
}

.rss-atom-url-wrapper:last-of-type {
  margin-bottom: 0rem;
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

.rss-atom-url-wrapper input {
  width: inherit;
  border-radius: 4px;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 4px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}

.rss-atom-url-wrapper input:hover, .rss-atom-url-wrapper input:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.rss-atom-url-row {
  text-align: left;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  margin-top: .125rem;
  resize: none;
  width: 100%;
}

.rss-atom-url-row input {
  padding: .44rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 4px 0px 0px 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  margin-top: .125rem;
  width: 100%;
}

.rss-atom-url-row input:hover, .rss-atom-url-row > input:focus-visible {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.rss-atom-url-row > input:disabled {
  cursor: auto;
}

.rss-atom-url-row-buttons {
  padding-top: .75rem;
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

.rss-atom-url-row-button:last-child {
  border-radius: 0px 3px 3px 0px;
}

.subscription-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  text-align: left;
  align-items: baseline;
  justify-content: flex-start;
  margin-top: .125rem;
  margin-bottom: .75rem;
  resize: none;
}

.subscription-filter-button {
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

.subscription-filter-button:hover, .subscription-filter-button:focus-visible {
  background: v-bind('theme.buttonhighlight');
}

.subscription-filter-button:disabled {
  cursor: auto;
}

.subscription-filter-button:hover:disabled {
  background-color: unset;
}

.subscription-filter-button:last-child {
  border-radius: 0px 3px 3px 0px;
}
</style>
