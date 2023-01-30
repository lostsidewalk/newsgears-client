<template>
  <div class="feed-config-field">
    <!-- label -->
    <label>UPSTREAM RSS/ATOM SOURCES:</label>
    <div class="feed-config-button-wrapper">
      <!-- add RSS/ATOM feed URL button -->
      <button  
        class="feed-config-button" 
        @click="this.$emit('addRssAtomUrl')" 
        :disabled="inTransit">
        Add RSS/ATOM feed (you already have a URL)
      </button>
      <!-- browse feed catalog button -->
      <button  
        class="feed-config-button" 
        @click="this.$emit('showRssAtomUrlBrowser')" 
        :disabled="inTransit">
        Browse our catalog of RSS/ATOM feeds  
      </button>
    </div>
    <div class="rss-atom-url-wrapper" v-for="(rssAtomUrl, idx) in this.rssAtomFeedUrls" :key="idx">
      <!-- url input field w/refresh and delete buttons -->
      <div class="rss-atom-url-row">
        <input type="text" v-model="rssAtomUrl.feedUrl" 
          :disabled="inTransit" 
          placeholder="RSS/ATOM URL" />
        <button 
          class="rss-atom-url-row-button"
          @click="this.refreshRssAtomUrlInfo(rssAtomUrl.id)" 
          :disabled="inTransit">
          <i class="fa fa-refresh"/>
        </button>
        <button 
          class="rss-atom-url-row-button" 
          @click="this.$emit('deleteRssAtomUrl', rssAtomUrl.id)" 
          :disabled="inTransit">
          <i class="fa fa-trash"/>
        </button>
      </div>
      <RssAtomFeedInfo 
        v-if="rssAtomUrl.discoveryUrl || rssAtomUrl.error"
        :ref="'rss-atom-url-info-' + rssAtomUrl.id" 
        :info="rssAtomUrl" 
        :inTransit="inTransit" 
        :theme="theme" 
        :filterSupport="false" 
        style="margin-top: 10px;" />
    </div>
  </div>
</template>

<script>
import RssAtomFeedInfo from './RssAtomFeedInfo.vue';


export default {
  name: "UpstreamRssAtomFeedsConfig",
  components: {
    RssAtomFeedInfo,
  },
  props: [ "rssAtomFeedUrls", "inTransit", "theme", "baseUrl" ],
  emits: [
    "addRssAtomUrl",
    "showRssAtomUrlBrowser",
    "deleteRssAtomUrl", 
    "updateInTransit",
    "update:rssAtomFeedUrl",
  ],
  methods: {
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
        let u = encodeURIComponent(r.feedUrl);
        console.log("feed-config: starting discovery for rssAtomFeedUrl id=" + r.id + ", feedUrl=" + r.feedUrl);
        this.$emit('updateInTransit', true);
        setTimeout(() => {
          this.$auth.getTokenSilently().then((token) => {
            const requestOptions = {
                headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                credentials: 'include' 
              };
            fetch(this.baseUrl + "/discovery/?url=" + u, requestOptions).then((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                return response.json().then(j => {throw new Error(j.message)})
              }
            }).then((data) => {
              data.id = r.id;
              data.discoveryUrl = r.feedUrl;
              this.$emit('update:rssAtomFeedUrl', data);
            }).catch((error) => {
              console.log(error);
              if (error.name === 'TypeError') {
                r.error = 'Something went wrong.  Please try again later.';
              } else {
                let data = {};
                data.id = r.id;
                data.discoveryUrl = null;
                data.error = error.message;
                this.$emit('update:rssAtomFeedUrl', data);
              }
            })
            .finally(() => {
              this.$emit('updateInTransit', false);
            });
          }).catch((error) => {
            this.handleAuthError(error);
          });
        }, 2000);
      }
    },
    len(str) {
      return (str !== null && str !== undefined) ? str.length : 0;
    },
  },
  data() {
    return {
      
    }
  }
}
</script>

<style scoped>
.feed-config-field {
  border: 1px solid v-bind('theme.sectionbordercolor');
  text-align: left;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px v-bind('theme.lightshadow');
  overflow-x: auto;
}

.feed-config-field label {
  font-size: small;
}

.feed-config-field > input, .feed-config-field > textarea {
  padding: 5px;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  margin-top: 2px;
  resize: none;
}

.feed-config-field input:hover, .feed-config-field textarea:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-config-field input:focus, .feed-config-field textarea:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
}

.feed-config-field input:disabled, .feed-config-field textarea:disabled {
  cursor: auto;
}

.rss-atom-url-wrapper:last-of-type {
  margin-bottom: 0px;
}

.rss-atom-url-wrapper {
  background-color: v-bind('theme.sectionbrighterhighlight');;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 3px;
  border: 1px solid v-bind('theme.sectionbordercolor');
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

.rss-atom-url-wrapper input:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.rss-atom-url-wrapper input:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
}

.rss-atom-url-row {
  display: inline-flex;
  flex-direction: row;
  margin-top: 2px;
  width: 100%;
}

.rss-atom-url-row input {
  padding: 5px;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px 0px 0px 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}

.rss-atom-url-row input:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.rss-atom-url-row > input:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
}

.rss-atom-url-row > input:disabled {
  cursor: auto;
}

.rss-atom-url-row-button {
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: right;
  text-align: center;
}

.rss-atom-url-row-button:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.rss-atom-url-row-button:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
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
  grid-column-gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.feed-config-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  text-align: center;
  font-size: unset;
}

.feed-config-button:disabled {
  cursor: auto;
}

.feed-config-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.feed-config-button:hover:disabled {
  background-color: unset;
}
</style>
