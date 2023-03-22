<template>
  <div class="feed-config-field" v-auto-animate>
    <NavbarFixedHeader :theme="theme" :inTransit="inTransit" />
    <!-- label -->
    <label>UPSTREAM RSS/ATOM SOURCES {{ needsPagination() ? ('Showing page ' + this.currentPage + '/' + this.totalPages) : '' }}:</label>
    <div class="feed-config-button-wrapper">
      <!-- add RSS/ATOM feed URL button -->
      <button 
        class="feed-config-button" 
        @click="this.$emit('addRssAtomUrl')" 
        :disabled="disabled || inTransit">
        Add feed from a URL 
      </button>
      <!-- browse feed catalog button -->
      <button  
        class="feed-config-button" 
        @click="toggleRssAtomUrlBrowser" 
        :disabled="disabled || inTransit">
        Feed catalog &nbsp; <span class="fa fa-expand" />
      </button>
    </div>
    <div v-if="this.showFeedCatalog && this.feedCatalogErrors.length > 0">
      <div class="error feed-catalog-error" v-for="error in this.feedCatalogErrors" :key="error">
          {{ error }}
      </div>
    </div>
    <UpstreamSourcesCatalog v-if="this.showFeedCatalog"
        :disabled="disabled || inTransit"
        :theme="theme"
        :feedCatalog="this.feedCatalog" 
        :rssAtomFeedUrls="this.rssAtomFeedUrls"
        @addCatalogFeed="this.addCatalogFeed" />
    <div v-else>
      <div class="feed-config-filter-buttons">
        <!-- first page button-->
        <button v-if="needsPagination()" title="first" class="feed-config-filter-button" @click="firstPage">
          <span class="fa fa-angle-double-left"/>
        </button>
        <!-- previous page button -->
        <button v-if="needsPagination()" title="previous" class="feed-config-filter-button" @click="previousPage">
          <span class="fa fa-angle-left"/>
        </button>
        <!-- next page button -->
        <button v-if="needsPagination()" title="next" class="feed-config-filter-button" @click="nextPage">
          <span class="fa fa-angle-right"/>
        </button>
        <!-- last page button-->
        <button v-if="needsPagination()" title="last" class="feed-config-filter-button" @click="lastPage">
          <span class="fa fa-angle-double-right"/>
        </button>
      </div>
      <div class="feed-config">
        <!-- feed config items -->
        <div class="rss-atom-url-wrapper" v-for="(rssAtomUrl, idx) in this.getCurrentPage(this.rssAtomFeedUrls)" :key="idx" v-auto-animate>
          SUBSCRIPTION {{ idx + 1 }}/{{ this.rssAtomFeedUrls.length }}
          <!-- url input field w/refresh and delete buttons -->
          <div class="rss-atom-url-row">
            <label>
              FEED URL
            </label>
            <input :ref="'rssAtomUrlRow_' + idx" type="text" v-model="rssAtomUrl.feedUrl" 
              :disabled="disabled || inTransit"
              placeholder="Feed URL" />
            <div class="rss-atom-url-row-buttons">
              <button 
                class="rss-atom-url-row-button"
                @click="this.refreshRssAtomUrlInfo(rssAtomUrl.id)" 
                :disabled="disabled || inTransit">
                <span class="fa fa-refresh"/>
              </button>
              <button 
                class="rss-atom-url-row-button" 
                @click="this.$emit('deleteRssAtomUrl', rssAtomUrl.id)" 
                :disabled="disabled || inTransit">
                <span class="fa fa-trash"/>
              </button>
              <button 
                class="rss-atom-url-row-button" 
                @click="rssAtomUrl.showDetails = !rssAtomUrl.showDetails" 
                :disabled="disabled || inTransit">
                <span class="fa fa-expand"/>
              </button>
            </div>
          </div>
          <label v-if="rssAtomUrl.showDetails">* The following credentials will be supplied if this feed requests authentication.</label>
          <div class="rss-atom-url-row" v-if="rssAtomUrl.showDetails">
            <label>USERNAME</label>
            <input type="text" v-model="rssAtomUrl.username" 
              :disabled="disabled || inTransit"
              placeholder="Username" style="margin-bottom: .75rem" />
            <label>PASSWORD</label>
            <input type="password" v-model="rssAtomUrl.password" 
              :disabled="disabled || inTransit"
              placeholder="Password" />
          </div>
          <RssAtomFeedInfo 
            v-if="rssAtomUrl.discoveryUrl || rssAtomUrl.error"
            :ref="'rss-atom-url-info-' + rssAtomUrl.id" 
            :info="rssAtomUrl" 
            :disabled="disabled || inTransit"
            :theme="theme" 
            :filterSupport="false" 
            style="margin-top: .75rem;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarFixedHeader from '@/components/layout/NavbarFixedHeader.vue';
import RssAtomFeedInfo from './RssAtomFeedInfo.vue';
import UpstreamSourcesCatalog from './UpstreamSourcesCatalog.vue';


export default {
  name: "UpstreamSourcesConfig",
  components: {
    NavbarFixedHeader,
    RssAtomFeedInfo,
    UpstreamSourcesCatalog
  },
  props: [ "rssAtomFeedUrls", "disabled", "theme", "baseUrl" ],
  computed: {
    totalPages: function() {
      let t = Math.ceil(this.rssAtomFeedUrls.length / this.itemsPerPage);
      return t;
    },
  },
  emits: [
    "addRssAtomUrl",
    "deleteRssAtomUrl", 
    "update:rssAtomFeedUrl",
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
      this.$refs.rssAtomUrlRow_0[0].focus();
    },
    refreshRssAtomUrlInfo(id) {
      let r = null;
      for (let i = 0; i < this.rssAtomFeedUrls.length; i++) {
        if (this.rssAtomFeedUrls[i].id === id) {
          r = this.rssAtomFeedUrls[i];
          break;
        }
      }
      r.error = null;
      r.discoveryUrl = null;
      if (r.feedUrl) {
        this.doDiscovery(r);
      }
    },
    doDiscovery(r) {
      if (r.feedUrl && r.feedUrl !== r.discoveryUrl) {
        if (this.len(r.feedUrl) > 2048) {
          console.log("RSS/ATOM feed URL is too long (max 2048 characters).");
        }
        this.inTransit = true;
        this.$auth.getTokenSilently().then((token) => {
          const requestOptions = {
            method: 'POST', 
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
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
            data.id = r.id;
            data.discoveryUrl = r.feedUrl;
            data.username = r.username;
            data.password = r.password;
            this.$emit('update:rssAtomFeedUrl', data);
          }).catch((error) => {
            console.error(error);
            if (error.name === 'TypeError') {
              r.error = 'Something went wrong.  Please try again later.';
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
              this.$emit('update:rssAtomFeedUrl', data);
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
    toggleRssAtomUrlBrowser() {
      if (this.showFeedCatalog) {
        this.cancelRssAtomUrlBrowser();
      } else {
        this.showRssAtomUrlBrowser();
      }
    },
    showRssAtomUrlBrowser() {
      this.showFeedCatalog = true;
      if (!this.feedCatalog) {
        console.log("feed-config-panel: loading feed catalog...");
        this.inTransit = true;
        this.$auth.getTokenSilently().then((token) => {
          const requestOptions = {
              method: 'GET',
              headers: { 
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include',
            };
            fetch(this.baseUrl + "/catalog", requestOptions)
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else { // framework is rejecting the request 
                throw Error('We weren\'t able to fetch our feed catalog.  Please try again later.');
              }
            }).then((data) => {
              this.feedCatalog = data;
              for (let i = 0; i < this.feedCatalog.length; i++) {
                let c = this.feedCatalog[i];
                c.discoveryUrl = c.feedUrl;
              }
            }).catch((error) => {
              console.error(error);
              if (error.name === 'TypeError') {
                this.feedCatalogErrors.push('Something went wrong.  Please try again later.');
              } else {
                this.feedCatalogErrors.push(error.message);
              }
            }).finally(() => {
              this.inTransit = false;
            });
        }).catch((error) => {
          this.handleAuthError(error);
          this.inTransit = false;
        })
        this.feedCatalog = [];
      }
    },
    cancelRssAtomUrlBrowser() {
      this.showFeedCatalog = false;
    },
    addCatalogFeed(source) {
      this.$emit('addRssAtomUrl', source);
    },
  },
  data() {
    return {
      itemsPerPage: 10,
      currentPage: 0,
      itemCount: 0,
      // feed catalog 
      feedCatalog: null,
      showFeedCatalog: false,
      feedCatalogErrors: [],
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
  border-radius: 5px;
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
  border-radius: 3px;
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

.rss-atom-url-wrapper:last-of-type {
  margin-bottom: 0rem;
}

.rss-atom-url-wrapper {
  background-color: v-bind('theme.sectionbrighterhighlight');;
  padding: .75rem;
  margin-bottom: .75rem;
  border-radius: 3px;
  border: 1px solid v-bind('theme.sectionbordercolor');
  contain: content;
  overflow: auto;
  display: flex;
  flex-direction: column;
  row-gap: .44rem;
}

.rss-atom-url-wrapper input {
  width: inherit;
  border-radius: 3px;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
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
  border-radius: 3px 0px 0px 3px;
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
  padding-bottom: .75rem;
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
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
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

.feed-config-button-wrapper {
  display: inline-grid;
  grid-auto-flow: column;
  grid-column-gap: .75rem;
  margin-top: .75rem;
  margin-bottom: .75rem;
}

.feed-config-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.feed-config-button:disabled {
  cursor: auto;
}

.feed-config-button:hover, .feed-config-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.feed-config-button:hover:disabled {
  background-color: unset;
}

.feed-catalog-error {
  width: 100%;
}

.feed-config-filter-buttons {
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

.feed-config-filter-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.feed-config-filter-button:hover, .feed-config-filter-button:focus-visible {
  background: v-bind('theme.buttonhighlight');
}

.feed-config-filter-button:disabled {
  cursor: auto;
}

.feed-config-filter-button:hover:disabled {
  background-color: unset;
}

.feed-config-filter-button:last-child {
  border-radius: 0px 3px 3px 0px;
}
</style>
