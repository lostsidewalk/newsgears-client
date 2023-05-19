<template>
  <v-app>
    <v-app-bar
      v-if="!$auth.$isAuthenticated"
      app
      location="top"
      :scrol-behavior="'elevate'"
    >
      <template #title>
        <span class="view-header-no-count">
          FeedGears RSS
        </span>
      </template>
      <template #prepend>
        <v-app-bar-nav-icon icon="fa-rss" />
      </template>
      <v-toolbar-items>
        <GoBack />
      </v-toolbar-items>
    </v-app-bar>

    <v-main v-if="!$auth.$isAuthenticated">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            align="center"
          >
            <h2 class="logotext">
              FeedGears RSS
            </h2>
          </v-col>
          <v-col
            cols="12"
            align="center"
          >
            <i class="fa fa-rss fa-3x" />
          </v-col>
          <v-col
            cols="12"
            align="center"
          >
            <h3 class="logosubtext fancy">
              {{ $t('whatIsFeedGears') }}
            </h3>
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="mt-8" />

      <AuthPanel ref="authentication" />
      <v-divider /> 
      <FooterPanel
        
        app
      />
    </v-main>

    <v-main v-show="$auth.$isAuthenticated">
      <v-progress-linear :indeterminate="inTransit || refreshFeedsInTransit" />

      <v-app-bar
        app
        :location="'top'"
      >
        <template #title>
          <span class="view-header-no-count">
            FeedGears RSS
          </span>
        </template>
        <template #prepend>
          <v-app-bar-nav-icon
            icon="fa-rss" 
            @click.stop="showQueueDashboard = !showQueueDashboard"
          />
        </template>
        <ControlPanel
          ref="controlPanel" 
          :base-url="baseUrl"
          :show-settings-panel="showSettingsPanel"
          :show-help-panel="showHelpPanel"
           
          @showSettings="showSettingsPanel = !showSettingsPanel"
          @showHelp="showHelpPanel = !showHelpPanel"
          @cancelSettings="cancelSettings"
          @updateServerMessage="setLastServerMessage" 
          @toggleDistractions="toggleDistractions"
        >
          <template #additional>
            <!-- upload OPML button -->
            <v-btn
              size="small" 
              accesskey="m"
              :title="$t('uploadOPML')" 
              append-icon="fa-file"
              :text="$t('uploadOPML')"
              @click.stop="uploadOpml"
            />
            <!-- new queue button -->
            <v-btn
              size="small" 
              accesskey="n"
              :title="$t('createNewQueue')" 
              append-icon="fa-plus"
              :text="$t('createNewQueue')"
              @click.stop="newFeed"
            />
          </template>
        </ControlPanel>
        <!-- TODO: finish this -->
        <!-- <template v-slot:append>
          <v-app-bar-nav-icon @click.stop="this.showControlPanelOverflow = !this.showControlPanelOverflow" />
        </template> -->
      </v-app-bar>

      <v-navigation-drawer
        v-model="showQueueDashboard"
        app
        class="w-25 overflow-y-visible"
        elevation="12" 
        temporary
      >
        <v-sheet>
          <v-hover
            v-for="feed in filteredFeedIdentOptions"
            v-slot="{ isHovering, props }"
            :key="feed.id"
          >
            <FeedSelectButton 
              variant="flat"
              :elevation="isHovering ? 12 : 0"
              :feed="feed" 
              :feed-url="feedUrl"
              :inbound-count="countInboundQueue(feed.id)" 
              :published-count="countOutboundQueue(feed.id)" 
              class="ma-4"
              :class="selectedFeedId === feed.id ? 'selected-feed' : ''"
               
              v-bind="props"
              @click.stop="$event => { setSelectedFeedId(feed.id); }"
              @selectFeed="$event => { setSelectedFeedId(feed.id); showQueueDashboard = false; }" 
              @manageSubscriptions="configureFeed(feed.id)" 
              @updatePostFeedFilter="updatePostFeedFilter"
            />
          </v-hover>
        </v-sheet>
      </v-navigation-drawer>

      <audio id="post-feed-audio" />

      <v-dialog
        v-model="showFeedDeleteConfirmation"
        width="100%"
        scrollable
      >
        <ConfirmationDialog 
          
          :prompt="$t('confirmDeleteQueue')" 
          @confirm="performFeedDelete"
          @cancel="cancelFeedDelete"
        />
      </v-dialog>

      <v-dialog
        v-model="showFeedMarkAsReadConfirmation"
        width="100%"
        scrollable
      >
        <ConfirmationDialog 
          class="rounded"
          
          :prompt="$t('confirmMarkQueueAsRead')" 
          @confirm="performFeedMarkAsRead"
          @cancel="cancelFeedMarkAsRead"
        />
      </v-dialog>

      <v-dialog
        v-model="showSettingsPanel"
        fullscreen
        scrollable
      >
        <SettingsPanel 
          class="rounded"
          :base-url="baseUrl"
          @dismiss="showSettingsPanel = false"
          @updateServerMessage="setLastServerMessage"
        />
      </v-dialog>

      <v-dialog
        v-model="showHelpPanel"
        fullscreen
        scrollable
      >
        <HelpPanel 
          class="overflow-auto rounded"
        />
      </v-dialog>

      <v-dialog
        v-model="showFeedConfigPanel"
        fullscreen
        scrollable
      >
        <FeedConfigPanel
          ref="feedConfigPanel"
          
          :base-url="baseUrl" 
          @saveOrUpdate="createOrUpdateFeed"
          @dismiss="dismissCreateOrUpdateFeed"
          @authError="handleServerError" 
          @updateServerMessage="setLastServerMessage" 
          @refreshFeedDefinition="$event => refreshFeeds([$event], true)"
        />
      </v-dialog>

      <v-dialog
        v-model="showOpmlUploadPanel"
        fullscreen
        scrollable
      >
        <OpmlUploadPanel
          ref="opmlUploadPanel"
          
          :base-url="baseUrl" 
          @finalizeUpload="createOpmlFeeds"
          @cancel="cancelOpmlUpload"
          @authError="handleServerError"
        />
      </v-dialog>

      <v-container class="post-feed-container d-flex flex-column flex-grow-1 rounded mt-4">
        <!-- feed filter  -->
        <FeedFilter
          v-if="selectedFeedId"
          class="rounded-0" 
          :class="{ 'mb-4': filteredInboundQueue.length > 0 }"
          :inbound-queue-filter="inboundQueueFilter"
          :inbound-queue-sort-order="inboundQueueSortOrder"
          :queue-length="filteredInboundQueue.length"
          :queue-name="getSelectedFeed().title"
          :all-filter-pills="allFilterPills"
           
          @toggleSortOrder="toggleInboundQueueSortOrder"
          @refreshFeeds="refreshFeeds(null, true)"
          @markAsRead="markFeedAsRead(selectedFeedId)"
          @update:modelValue="inboundQueueFilter = $event"
        />

        <!-- post feed audio controller -->
        <PostFeedAudio
          v-if="selectedFeedId"
          ref="postFeedAudio"
        />

        <!-- inbound queue -->
        <PostItem
          v-for="post in filteredInboundQueue"
          :id="'post_' + post.id" 
          :key="post.id"
          :ref="'post_' + post.id"
          :post="post"
           
          :base-url="baseUrl"
          :compact="layoutMode === 'TABLE'"
          :sharing-options="sharingOptions"
          class="ma-4"
          @openPostUrl="openPostUrl(post.id)"
          @updatePostReadStatus="updatePostReadStatus"
          @updatePostPubStatus="updatePostPubStatus" 
          @updatePostFeedFilter="updatePostFeedFilter" 
          @playing="onMediaPlaying" 
          @audioPlay="onAudioPlay" 
          @share="$event => share($event.sharingOption, $event.post)"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import debounce from 'lodash.debounce';
// components 
import GoBack from "@/components/layout/GoBack.vue";
import AuthPanel from "@/components/auth-panel/AuthPanel.vue";
import lunr from 'lunr';
// confirmation modal dialog 
import ConfirmationDialog from '@/components/layout/ConfirmationDialog.vue';
// feed configuration panel 
import FeedConfigPanel from "@/components/feed-config-panel/FeedConfigPanel.vue";
// OPML upload panel 
import OpmlUploadPanel from "@/components/opml-upload-panel/OpmlUploadPanel.vue";
// settings 
import ControlPanel from "@/components/control-panel/ControlPanel.vue";
import SettingsPanel from '@/components/settings-panel/SettingsPanel.vue';
import HelpPanel from '@/components/help-panel/HelpPanel.vue';
// post item filter 
import FeedFilter from "@/components/post-feed/FeedFilter.vue";
import PostFeedAudio from '@/components/post-feed-audio/PostFeedAudio.vue';
// post item 
import PostItem from "@/components/post-item/PostItem.vue";
// feed dashboard 
import FeedSelectButton from '@/components/post-feed/FeedSelectButton.vue';
import FooterPanel from "@/components/landing/FooterPanel.vue";
// import FeedDetails from '@/components/post-feed/FeedDetails.vue';

const sharingOptions = [
  {
    name: 'twitter',
    icon: 'twitter',
    url: 'https://twitter.com/intent/tweet?text={TITLE}&url={URL}',
  },
  {
    name: 'facebook',
    icon: 'facebook',
    url: 'http://www.facebook.com/share.php?u={URL}&title={TITLE}',
  },
  {
    name: 'telegram',
    icon: 'telegram',
    url: 'https://telegram.me/share/url?url={URL}&t={TITLE}', 
  },
  {
    name: 'linkedIn',
    icon: 'linkedin',
    url: 'http://www.linkedin.com/shareArticle?mini=true&url={URL}&title={TITLE}&source={SOURCE}', 
  },
  {
    name: 'blogger',
    icon: 'rss', // kind of generic 
    url: 'https://www.blogger.com/blog-this.g?n={TITLE}&t={CONTENT}&u={URL}', 
  },
  {
    name: 'buffer',
    icon: 'share', // generic 
    url: 'https://publish.buffer.com/compose?url={URL}&text={TITLE}', 
  },
  {
    name: 'hootsuite',
    icon: 'share', // generic 
    url: 'http://hootsuite.com/twitter/bookmark-tool-v2?address={URL}&title={TITLE}', 
  },
];

export default {
  name: "HomeView",
  components: {
    GoBack,
    AuthPanel,
    // modal 
    ConfirmationDialog,
    FeedConfigPanel,
    OpmlUploadPanel,
    // settings 
    ControlPanel,
    SettingsPanel,
    HelpPanel,
    // filter 
    FeedFilter,
    PostFeedAudio,
    // item 
    PostItem,
    // dashboard 
    FeedSelectButton,
    FooterPanel
  },
  props: {
    baseUrl: { type: String, required: true },
    feedUrl: { type: String, required: true },
  },
  data() {
    return {
      theme: this.$theme.currentTheme,
      serverMessages: [],
      inTransit: false,
      refreshFeedsInTransit: false,
      // reactive window (inner) width 
      windowWidth: window.innerWidth,
      // operating mode 
      feedIdToDelete: null, 
      feedIdToMarkAsRead: null,
      // show the queue dashboard (t/f) 
      showQueueDashboard: false,
      // show the feed config modal (t/f) 
      showFeedConfigPanel: false,
      configuredFeedId: null, 
      // show the OPML config modal (t/f) 
      showOpmlUploadPanel: false,
      // show the help modal (t/f) 
      showSettingsPanel: false,
      showHelpPanel: false,
      // 
      showFeedDeleteConfirmation: false,
      showFeedMarkAsReadConfirmation: false,
      // 
      atBottomOfPage: false,
      // feed material 
      feeds: [], // all feeds 
      selectedFeedId: null, // currently selected feed Id 
      previousFeedId: null, // previously selected feed Id 
      // queue material 
      inboundQueuesByFeed: {}, // all queues 
      inboundQueue: { values: [] }, // inbound queue for the currently selected feed  
      // queue pagination material 
      itemsPerPage: 100,
      currentPage: 0,
      itemCount: 0,
      // queue filter material 
      inboundQueueFilter: '', // user-supplied filter text (lunrjs query expression) 
      feedFilterModes: [], // currently selected filter modes 
      // queue sorting material 
      inboundQueueSortOrder: 'DSC',
    };
  },
  computed: {
    // 
    totalPages: function() {
      let t = Math.ceil(this.filteredInboundQueue.length / this.itemsPerPage);
      return t;
    },
    filteredInboundQueue: function() {
      if (this.inboundQueue) {
        let unfilteredResults = null;
        // if a lunr query expression is specified .. 
        // then fetch the preliminary results from lunrjs 
        if (this.inboundQueueFilter) {
          let lunrLambda = () => this.inboundQueue.index.search(this.inboundQueueFilter);
          try {
            let lunrResults = lunrLambda.apply();
            if (lunrResults) {
              lunrResults = lunrResults.map(item => parseInt(item.ref));
              unfilteredResults = this.inboundQueue.values.filter(item => {
                return lunrResults.includes(item.id);
              });
            }
          } catch (error) {
            if (error instanceof lunr.QueryParseError) {
              console.debug("lunrjs search query exception due to: " + JSON.stringify(error));
            } else {
              console.error(error);
              throw error;
            }
          }
        } else {
          // (otherwise the preliminary results are the entire queue) 
          unfilteredResults = this.inboundQueue.values;
        }
        // apply filters from here .. 
        let filtered = unfilteredResults ? unfilteredResults.filter((post) => {
          // check the mode (i.e., post status) 
          if (!this.modeMatches(post)) {
            return false;
          }
          return true;
        }) : null;
        // 
        // sort the filtered result 
        // 
        if (filtered) {
          this.sortQueue(filtered, this.inboundQueueSortOrder);
        }
        // 
        // return the final (sorted) result 
        // 
        return filtered ? filtered : [];
      } else {
        return [];
      }
    },
    filteredFeedIdentOptions: function() {
      let feedIdentOptions = [];
      let t = Array.from(this.feeds);
      for (let i = 0; i < Math.min(128, t.length); i++) {
        feedIdentOptions.push({
          "label": t[i].title ? t[i].title : t[i].ident,
          "value": t[i].ident,
          "description": t[i].description,
          "title": t[i].title,
          "id": t[i].id,
          "imgSrc": t[i].feedImgSrc,
          "feedStatus": t[i].feedStatus,
          "lastDeployed": t[i].lastDeployed,
          "rssAtomFeedUrls": t[i].rssAtomFeedUrls,
          "transportIdent": t[i].transportIdent,
        });
      }
      feedIdentOptions.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
      return feedIdentOptions;
    },
    allFilterPills: function() {
      let filterPills = [
        {
          isSelected: this.lcSetContainsStr('READ_LATER', this.feedFilterModes),
          invoke: () => this.toggleFeedFilterMode('READ_LATER'), 
          label: this.$t('readLater'),
          title: 'Add read-later items to the filter',
        },
        {
          isSelected: this.lcSetContainsStr('PUBLISHED', this.feedFilterModes),
          invoke: () => this.toggleFeedFilterMode('PUBLISHED'), 
          label: this.$t('starred'),
          title: 'Add starred items to the filter',
        },
      ];

      return filterPills;
    },
    isModalShowing: function() {
      return (this.feedIdToDelete !== null || this.feedIdToMarkAsRead !== null);
    },
    layoutMode: function() {
      return this.$theme.layoutMode;
    },
    sharingOptions: function() {
      return sharingOptions;
    }
  },
  watch: {
    '$auth.$isAuthenticated' (isAuthenticated) {
      if (isAuthenticated) {
        const storedFeeds = localStorage.getItem('feeds');
        if (storedFeeds) {
          this.feeds = JSON.parse(storedFeeds);
        }
        const storedQueues = localStorage.getItem('inboundQueuesByFeed');
        if (storedQueues) {
          this.inboundQueuesByFeed = JSON.parse(storedQueues);
        }
        if (this.feeds.length > 0 && this.inboundQueuesByFeed) {
          if (!this.selectedFeedId) {
            this.setSelectedFeedId(this.feeds[0].id);
          } else {
            this.inboundQueue = this.inboundQueuesByFeed[this.selectedFeedId];
          }
        } else {
          this.refreshFeeds(null, true); // need staging posts for all feeds and feed definitions 
        }
      }
    }
  },
  mounted() {
    this.$auth.getTokenSilently()
      .catch(() => {})
      .finally(() => {
        if (this.$auth.$isAuthenticated) {
          console.log("home: authenticated on mount");
        } else {
          console.log("home: not authenticated on mount");
        }
    });
    window.addEventListener("keydown", this.keyHandler);
    if (this.$auth.$isAuthenticated) {
        this.refreshFeeds(null, true); // need staging posts for all feeds and feed definitions 
    }
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.keyHandler);
  },
  methods: {
    setLastServerMessage(messageObj) {
      this.$notification.requestPermission().then(p => {
        if (p !== "granted") {
          this.clearLastServerMessage();
          let serverMessageId = Math.random();
          this.serverMessages.push({
            timestamp: new Date(),
            id: serverMessageId,
            text: messageObj.message
          });
          this.$announcer.polite(messageObj.message);
          setTimeout(() => {
            let idxToSplice = -1;
            for(let i = 0; i < this.serverMessages.length; i++) {
              if (this.serverMessages[i].id == serverMessageId) {
                idxToSplice = i;
                break;
              }
            }
            if (idxToSplice >= 0) {
              this.serverMessages.splice(idxToSplice, 1);
            }
          }, 4000);
        } else {
          this.$notification.show('FeedGears message', {
           body: messageObj.message
          }, {
            onerror: function() {
              console.error("unable to show notification, message=" + messageObj.message);
            }
          });
        }
      });
      this.$announcer.polite(messageObj.message);
    },
    clearLastServerMessage() {
      this.serverMessages.pop();
    },
    // 
    // 
    cancelSettings() {
      this.showSettingsPanel = false;
      this.showHelpPanel = false;
    },
    modeMatches(post) {
      let modeMatches = false;
      if (this.feedFilterModes.length === 0) {
        modeMatches = true;
      } else {
        modeMatches = this.lcSetContainsStr('PUBLISHED', this.feedFilterModes) && post.isPublished;
        modeMatches = modeMatches || this.lcSetContainsStr(post.postReadStatus, this.feedFilterModes);
        modeMatches = modeMatches || this.lcSetContainsStr(post.postPubStatus, this.feedFilterModes);
      }
      return modeMatches;
    },
    onAudioPlay(bundle) {
      let f = this.inboundQueue.values;
      for (let j = 0; j < f.length; j++) {
        let id = f[j].id;
        let r = this.$refs['post_' + id];
        if (r && r.length > 0) {
          r[0].pauseMedia();
        }
      }
      this.$refs.postFeedAudio.play(bundle);
    },
    onMediaPlaying(postId) {
      let f = this.inboundQueue.values;
      for (let j = 0; j < f.length; j++) {
        let id = f[j].id;
        if (id !== postId) {
          let r = this.$refs['post_' + id];
          if (r && r.length > 0) {
            r[0].pauseMedia();
          }
        }
      }
      this.$refs.postFeedAudio.pausePlaying();
    },
    getPostIdx(postId) {
      let currentPostIdx = null;
      for (let i = 0; i < this.filteredInboundQueue.length; i++) {
        if (this.filteredInboundQueue[i].id === postId) {
          currentPostIdx = i;
          break;
        }
      }
      return currentPostIdx;
    },
    // 
    // open post URL in new window
    // 
    openPostUrl(postId) {
      window.open(this.getPostFromQueue(postId).postUrl, '_blank');
    },
    // 
    // share 
    // 
    share(sharingOption, post) {
      let title = encodeURIComponent(post.postTitle.value);
      let link = encodeURIComponent(post.postUrl);
      let source = encodeURIComponent(post.importerDesc);
      let content = encodeURIComponent(post.postDesc ? post.postDesc.value : '');
      let url = this.replaceArray(sharingOption.url, 
        ["{URL}", "{TITLE}", "{SOURCE}", "{CONTENT}"], 
        [ link, title, source, content ]
      );
      window.open(url, '_blank');
    },
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
    // 
    // toggle distractions (if queue dashboard if the full inbound queue are showing, collapse everything; otherwise show everything) 
    // 
    toggleDistractions() {
      // if (this.showQueueDashboard || this.showFullInboundQueueHeader) {
      //   this.showQueueDashboard = false;
      //   this.showFullInboundQueueHeader = false;
      // } else {
      //   this.showQueueDashboard = true;
      //   this.showFullInboundQueueHeader = true;
      // }
    },
    // 
    // sorting / filtering 
    // 
    sortQueue(queue, sortOrder) {
      // 
      // when sorted 'descending': 
      // 
      // articles w/published timestamp go to the top 
      // article w/more recent published timestamp goes before article w/older timestamp 
      //
      queue.sort((l, r) => {
        let r1, l1;
        if (sortOrder === 'DSC') {
          l1 = r;
          r1 = l;
        } else {
          l1 = l;
          r1 = r;
        }

        let leftDate = l1.publishTimestamp == null ? l1.lastUpdatedTimestamp : l1.publishTimestamp;
        let rightDate = r1.publishTimestamp == null ? r1.lastUpdatedTimestamp : r1.publishTimestamp;

        if (leftDate && !rightDate) {
          return 1;
        }
        if (!leftDate && rightDate) {
          return -1;
        }
        if (leftDate && rightDate) {
          return leftDate > rightDate ? 1 : -1;
        } else {
          return l1.id > r1.id ? 1 : -1;
        }
      });
    },
    // 
    // 
    //
    toggleInboundQueueSortOrder() {
      if (this.inboundQueueSortOrder === 'DSC') {
        this.inboundQueueSortOrder = 'ASC';
      } else {
        this.inboundQueueSortOrder = 'DSC';
      }
    },
    // 
    // invoked when the user clicks the mode pill in the feed filter; 
    // this method should add the mode to feedFilterModes, 
    // or remove it if it already present. 
    // 
    toggleFeedFilterMode(filterMode) {
      if (this.lcSetContainsStr(filterMode, this.feedFilterModes)) {
        let idxToSplice = -1;
        for (let i = 0; i < this.feedFilterModes.length; i++) {
          if (this.feedFilterModes[i] === filterMode) {
            idxToSplice = i;
            break;
          }
        }
        if (idxToSplice >= 0) {
          this.feedFilterModes.splice(idxToSplice, 1);
        }
      } else {
        this.feedFilterModes.push(filterMode);
      }
    },
    // 
    // invoked when the user clicks the category pill in the feed filter; 
    // this method should add the category to the lunrjs query, 
    // or remove it if it is already present. 
    // 
    toggleFeedFilterCategory(category) {
      if (this.inboundQueueFilter) {
        this.inboundQueueFilter = this.inboundQueueFilter + ' ' + category;
      } else {
        this.inboundQueueFilter = category;
      }
    },
    // 
    // invoked when the user clicks the subscription pill in the feed filter; 
    // this method should add the subscription to the lunrjs query, 
    // or remove it if it is already present. 
    // 
    toggleFeedFilterSubscription(subscription) {
      if (this.inboundQueueFilter) {
        this.inboundQueueFilter = this.inboundQueueFilter + ' +feed:' + subscription;
      } else {
        this.inboundQueueFilter = '+feed:' + subscription;
      }
    },
    // 
    // invoked under two conditions: 
    // 
    //   1.  user clicks the subscription pill in the queue dashboard (we select the queue and add the subscription to the lunrjs query); 
    // 
    //   2.  user clicks the category pill in the post item (we add the category to the lunrjs query) 
    // 
    // f.name = 'subscription' | 'category'
    // f.feedId = queue Id (* required for subscription) 
    // f.value = <subscription | category name> 
    // 
    updatePostFeedFilter(f) {
      if (f.name === "subscription") {
        if (f.feedId !== this.selectedFeedId) {
          this.setSelectedFeedId(f.feedId);
          this.inboundQueueFilter = '';
          this.$nextTick(() => {
            this.addSubscriptionToFeedFilter(f.value);
          })
        } else {
          this.addSubscriptionToFeedFilter(f.value);
        }
      } else if (f.name === "category") {
        this.addCategoryToFeedFilter(f.value);
      }
    },
    // 
    // convenience method (invoked from above) to add the subscriptionId to the lunrjs query expression 
    // 
    addSubscriptionToFeedFilter(subscription) {
      if (this.inboundQueueFilter) {
        let expr = '+feed:' + subscription;
        if (this.inboundQueueFilter.indexOf(expr) < 0) {
          this.inboundQueueFilter = this.inboundQueueFilter + ' +feed:' + subscription;
        }
      } else {
        this.inboundQueueFilter = ' +feed:' + subscription;
      }
    },
    // 
    // convenience method (invoked from above) to add the category to the lunrjs query expression 
    // 
    addCategoryToFeedFilter(category) {
      // TODO: update the lunrjs query (this.inboundQueueFilter)
      console.log("addCategoryToFeedFilter=" + category);
    }, 
    // 
    // 
    // 
    countInboundQueue(feedId) {
      let iq = this.inboundQueuesByFeed[feedId];
      if (iq) {
        let unreadCt = 0;
        for (let i = 0; i < iq.values.length; i++) {
          if (iq.values[i].isRead !== true) {
            unreadCt++;
          }
        }
        return unreadCt;
      }
      return 0;
    },
    countOutboundQueue(feedId) {
      let iq = this.inboundQueuesByFeed[feedId];
      return iq ? iq.values.filter(p => p.isPublished).length : 0;
    },
    // 
    // feed refresh 
    // 
    // feedsToFetch = fetch staging posts for the feed Ids in this array, empty -> all feeds 
    // fetchFeedDefinitions = t/f -> include/exclude feed definition updates 
    refreshFeeds(feedsToFetch, fetchFeedDefinitions) {
      console.log("post-feed: refreshing feeds");
      let rawPosts = [];
      this.refreshFeedsInTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const stagingPostRefreshController = new AbortController();
        const stagingPostRefreshTimeoutId = setTimeout(() => stagingPostRefreshController.abort(), 45000);
        let feedDefinitionRefreshTimeoutId;
        let refreshPromises = [
          fetch(this.baseUrl + "/staging" + (feedsToFetch ? ("?feedIds=" + feedsToFetch) : ''), { 
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include',
            signal: stagingPostRefreshController.signal
          })
          .then((response) => {
            // server returns JSON or empty string on success 
            if (response.status === 200) {
              let contentType = response.headers.get("content-type");
              let isJson = contentType && contentType.indexOf("application/json") !== -1;
              return isJson ? response.json() : {};
            } else {
              throw new Error(this.$t('refreshFailedDueTo') + 
                " HTTP " + response.status + ": " + 
                  (response.statusText ? 
                    response.statusText : ("(" + this.$t('noMessage') + ")")
                  )
                );
            }
          })
          .then((data) => {
            let ct = 0;
            let stagingPosts = data.stagingPosts;
            if (stagingPosts) {
              for (let i = 0; i < stagingPosts.length; i++) {
                let p = stagingPosts[i].post;
                p.isPublished = p.published || (p.postPubStatus === 'PUB_PENDING') || (p.postPubStatus === 'DEPUB_PENDING');
                p.isRead = p.postReadStatus === 'READ';
                p.isReadLater = p.postReadStatus === 'READ_LATER';
                p.postImgSrc = stagingPosts[i].postImgSrc;
                rawPosts.push(p);
                ct++;
              }
              console.log("post-feed: staging post refresh complete, ct=" + ct);
            }
          })
        ];

        let queryDefinitionImagesById = {};
        if (fetchFeedDefinitions) {
          const feedDefinitionRefreshController = new AbortController();
          feedDefinitionRefreshTimeoutId = setTimeout(() => feedDefinitionRefreshController.abort(), 5000);
          refreshPromises.push(
            fetch(this.baseUrl + "/feeds", {
              headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include', 
              signal: feedDefinitionRefreshController.signal,
            })
            .then((response) => {
              // server returns JSON or empty string on success 
              if (response.status === 200) {
                let contentType = response.headers.get("content-type");
                let isJson = contentType && contentType.indexOf("application/json") !== -1;
                return isJson ? response.json() : {};
              } else {
                throw new Error(this.$t('refreshFailedDueTo') + 
                  " HTTP " + response.status + ": " + 
                    (response.statusText ? 
                      response.statusText : ("(" + this.$t('noMessage') + ")")
                    )
                  );
              }
            })
            .then((data) => {
              // clear queryDefinitionImagesById 
              // populate feeds and queryDefinitionImagesById
              let feedDefinitionData = data.feedDefinitions; // all feed definition data objects 
              let queryDefinitionData = data.queryDefinitions; // all query definition data objects 
              if (feedDefinitionData) {
                for (let i = 0; i < feedDefinitionData.length; i++) {
                  let fd = feedDefinitionData[i]; // feed definition data for this feed 
                  let qd = queryDefinitionData[fd.id]; // query definitions for this feed 
                  // merge query definition and metrics data into feed definition 
                  this.decorateFeedWithQueryDefinitions(fd, qd, data.queryMetrics);
                  // marshall up all query definitions by Id for later reference 
                  if (qd) {
                    for (let j = 0; j < qd.length; j++) {
                      let wrapper = qd[j];
                      queryDefinitionImagesById[wrapper.queryDefinition.id] = wrapper.queryDefinitionImageUrl;
                    }
                  }
                  // parse feed definition export config (if present) 
                  fd.exportConfig = fd.exportConfig ? JSON.parse(fd.exportConfig) : fd.exportConfig;
                  // locate the feed to update by id 
                  let idxToUpdate = -1;
                  for (let i = 0; i < this.feeds.length; i++) {
                    if (this.feeds[i].id === fd.id) {
                      idxToUpdate = i;
                    }
                  }
                  if (idxToUpdate >= 0) {
                    this.feeds[idxToUpdate] = fd;
                  } else {
                    fd.showMoreInformation = false;
                    this.feeds.push(fd);
                  }
                }
                // update feeds localStorage 
                localStorage.setItem('feeds', JSON.stringify(this.feeds));
              }
            })
          );
        }

        Promise.all(refreshPromises)
        .catch((error) => {
          this.handleServerError(error);
        })
        .finally(() => {
          clearTimeout(stagingPostRefreshTimeoutId);
          if (feedDefinitionRefreshTimeoutId) {
            clearTimeout(feedDefinitionRefreshTimeoutId);
          }
          for (let i = 0; i < this.feeds.length; i++) {
            let feedId = this.feeds[i].id;
            let iq = this.inboundQueuesByFeed[feedId];
            if (iq) {
              if (!feedsToFetch || feedsToFetch.indexOf(this.feeds[i].id) >= 0) {
                iq.values.splice(0);
                iq.index = null;
              }
            } else {
              this.inboundQueuesByFeed[feedId] = { values: [] };
            }
          }
          for (let i = 0; i < rawPosts.length; i++) {
            let post = rawPosts[i];
            // set the post subscription image property 
            post.sourceImgUrl = queryDefinitionImagesById[post.queryId];
            if (!post.sourceImgUrl) {
              post.sourceImgUrl =  'rss_logo.svg';
            }
            this.inboundQueuesByFeed[post.feedId].values.push(post);
          }
          for (let i = 0; i < this.feeds.length; i++) {
            if (!feedsToFetch || feedsToFetch.indexOf(this.feeds[i].id) >= 0) {
              let iq = this.inboundQueuesByFeed[this.feeds[i].id];
              console.log("building lunr index for feedId=" + this.feeds[i].id);
              iq.index = lunr(function () {
                this.ref('id')
                this.field('title', {
                  extractor: function(doc = {}) {
                    return doc.postTitle ? doc.postTitle.value : null;
                  }
                })
                this.field('description', {
                  extractor: function(doc = {}) {
                    return doc.postDesc ? doc.postDesc.value : null;
                  }
                })
                this.field('feed', {
                  extractor: function(doc = {}) {
                    return doc.importerDesc;
                  }
                })
                iq.values.forEach(function (doc) {
                  this.add(doc)
                }, this)
              });
            }            
          }
          // update queues localStorage 
          localStorage.setItem('inboundQueuesByFeed', JSON.stringify(this.inboundQueuesByFeed));
          // set selected feed Id and inbound queue 
          if (this.feeds.length > 0 && !this.selectedFeedId) {
            // TODO: (enhancement) should be a configurable 'default' feed 
            this.setSelectedFeedId(this.feeds[0].id);
          } else {
            this.inboundQueue = this.inboundQueuesByFeed[this.selectedFeedId];
          }
          this.refreshFeedsInTransit = false; // end of refreshFeeds 
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.refreshFeedsInTransit = false;
      });
    },
    decorateFeedWithQueryDefinitions(fd, qd, qm) {
      fd.rssAtomFeedUrls = [];
      if (qd) {
        for (let i = 0; i < qd.length; i++) {
          let wrapper = qd[i];
          let queryDefinition = wrapper.queryDefinition;
          let r = {
            id: queryDefinition.id,
            feedMetrics: qm ? qm[queryDefinition.id] : null,
            feedUrl: queryDefinition.queryText,
            feedId: fd.id,
          };
          // title
          let queryTitle = queryDefinition.queryTitle;
          if (queryTitle) {
            r.title = queryDefinition.queryTitle;
          }
          // auth 
          let queryConfig = queryDefinition.queryConfig ? JSON.parse(queryDefinition.queryConfig) : queryDefinition.queryConfig;
          if (queryConfig) {
            r.username = queryConfig.username;
            r.password = queryConfig.password;
          }
          // image 
          let queryDefinitionImageUrl = wrapper.queryDefinitionImageUrl;
          if (queryDefinitionImageUrl) {
            r.image = {
              title: null,
              url: queryDefinitionImageUrl,
            }
          }
          // add to FD 
          fd.rssAtomFeedUrls.push(r);
        }
      }
    },
    // 
    // 
    // 
    updatePostReadStatus(result) {
      console.log("post-feed: updating post status");
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ newStatus: result.newStatus }),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/staging/read-status/post/" + result.id, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return;
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
              response.text().then(t => {throw new Error(t)});
          }
        }).then(() => {
          let originator = result.originator;
          if (originator === "togglePostReadStatus") { // NOTE: this happens when the user toggles the 'mark as read' button 
            this.onTogglePostReadStatus(result);
          } else if (originator === "togglePostReadLaterStatus") { // NOTE: this happens when the user toggles the 'mark as read-later' button 
            this.onTogglePostReadLaterStatus(result);
          }
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.inTransit = false;
      });
    },
    updatePostPubStatus(result) {
      console.log("post-feed: updating post status");
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ newStatus: result.newStatus }),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/staging/pub-status/" + result.id, requestOptions)
        .then((response) => {
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
          // update the post 
          let originator = result.originator;
          let p = this.getPostFromQueue(result.id);
          if (originator === "stagePost") {
            p.isPublished = true;
          } else if (originator === "unstagePost") {
            p.isPublished = false;
          }
          p.postPubStatus = null;
          // update the feed last deployed timestamp 
          let updateLocalStorage = false;
          for (let i = 0; i < this.feeds.length; i++) {
              if (this.feeds[i].id === result.feedId) {
                this.feeds[i].lastDeployed = data.timestamp;
                updateLocalStorage = true;
                break;
              }
          }
          if (updateLocalStorage) {
            // update feeds localStorage 
            localStorage.setItem('feeds', JSON.stringify(this.feeds));
          }
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.inTransit = false;
      });
    },
    onTogglePostReadStatus(result) {
      let p = this.getPostFromQueue(result.id);
      p.isRead = !p.isRead;
      p.postReadStatus = p.isRead ? 'READ' : null;
      if (p.isRead) {
        p.isReadLater = false;
      }
    },
    onTogglePostReadLaterStatus(result) {
      let p = this.getPostFromQueue(result.id);
      p.isReadLater = !p.isReadLater;
      p.postReadStatus = p.isReadLater ? 'READ_LATER' : null;
      if (p.isReadLater) {
        p.isRead = false;
      }
    },
    onPostItemError(message) {
      console.error(message);
      this.setLastServerMessage(message);
    },
    // 
    // create / update queue 
    // 
    newFeed() {
      document.activeElement.blur();
      this.setSelectedFeedId(this.selectedFeedId);
      this.showFeedConfigPanel = true;
      this.$nextTick(() => this.$refs.feedConfigPanel.setup({ rssAtomFeedUrls: [] }));
    },
    uploadOpml() {
      document.activeElement.blur();
      this.setSelectedFeedId(this.selectedFeedId);
      this.showOpmlUploadPanel = true;
      this.$nextTick(() => this.$refs.opmlUploadPanel.show());
    },
    createOpmlFeeds(feeds) {
      let method = 'POST';
      this.inTransit = true;
      console.log("post-feed: pushing feeds to remote, ct=" + feeds.length);
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: method,
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(feeds),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/feeds/", requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : [];
          } else {
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
              response.text().then(t => {throw new Error(t)});
          }
        })
        .then((data) => {
          let feedIds = [];
          for (let i = 0; i < data.length; i++) {
            let f = data[i].feedDefinition;
            this.decorateFeedWithQueryDefinitions(f, data[i].queryDefinitions, data[i].queryMetrics);
            this.feeds.push(f);
            feedIds.push(f.id);
          }
          // update feeds localStorage 
          localStorage.setItem('feeds', JSON.stringify(this.feeds));
          this.setLastServerMessage(feeds.length + " " + this.$t('nQueuesCreated'));
          this.$refs.opmlUploadPanel.hide();
          this.showOpmlUploadPanel = false;
          this.refreshFeeds(feedIds, false);
        })
        .catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.inTransit = false;
      });
    },
    cancelOpmlUpload() {
      if (this.$refs.opmlUploadPanel) {
        this.$refs.opmlUploadPanel.hide();
        this.showOpmlUploadPanel = false;
        this.restorePreviousFeedId();
      }
    },
    configureFeed(feedId) {
      document.activeElement.blur();
      this.showFeedConfigPanel = true;
      this.configuredFeedId = feedId;
      this.$nextTick(() => this.$refs.feedConfigPanel.setup(this.getFeedById(feedId)));
    },
    createOrUpdateFeed(feed) {
      let isUpdate = feed.id ? true : false;
      let method = isUpdate ? 'PUT' : 'POST';
      this.inTransit = true;
      console.log("post-feed: pushing updated feed to remote..");
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: method,
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(isUpdate ? feed : [feed]),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/feeds/" + (isUpdate ? feed.id : ''), requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ? response.json().then(j => {
              throw new Error(j.message, { cause: {} });
            }) : response.text().then(t => {
              throw new Error(t, { cause: {} })
            });
          }
        })
        .then((data) => {
          if (isUpdate) {
            let updated = data.feedDefinition;
            let current = this.getFeedById(updated.id);
            current.ident = updated.ident;
            current.title = updated.title;
            current.description = updated.description;
            current.generator = updated.generator;
            current.copyright = updated.copyright;
            current.language = updated.language;
            current.feedImgSrc = updated.feedImgSrc; // NOTE: limited on the backend to 16384 chars 
            current.categoryTerm = updated.categoryTerm;
            current.categoryLabel = updated.categoryLabel;
            current.categoryScheme = updated.categoryScheme;
            current.categoryValue = updated.categoryValue;
            current.categoryDomain = updated.categoryDomain;
            this.decorateFeedWithQueryDefinitions(current, data.queryDefinitions, data.queryMetrics);
            this.setLastServerMessage(this.$t('queueUpdated') + ' (' + feed.ident + ')');
            this.refreshFeeds([current.id], false); // TODO: (enhancement) the refresh should be returned from the update call 
          } else {
            let created = data[0].feedDefinition;
            this.feeds.push(created);
            // update feeds localStorage 
            localStorage.setItem('feeds', JSON.stringify(this.feeds));
            this.inboundQueuesByFeed[created.id] = { values: [] };
            // update queues localStorage 
            localStorage.setItem('inboundQueuesByFeed', JSON.stringify(this.inboundQueuesByFeed));
            this.$refs.feedConfigPanel.setupSubscriptionConfig(created.id);
            this.setLastServerMessage(this.$t('queueCreated') + ' (' + created.ident + ")'");
            this.setSelectedFeedId(created.id);
          }
        }).catch((error) => {
          this.handleServerError(error); 
        }).finally(() => {
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error); 
        this.inTransit = false;
      });
    },
    dismissCreateOrUpdateFeed() {
      if (this.$refs.feedConfigPanel) {
        this.$refs.feedConfigPanel.tearDown();
        this.showFeedConfigPanel = false;
        this.configuredFeedId = null;
        if (!this.selectedFeedId) {
          this.restorePreviousFeedId();
        }
      }
    },
    // 
    // RSS/ATOM URL quick add (to currently selected queue) 
    // 
    rssAtomUrlQuickAdd() {
      if (this.selectedFeedId) {
        document.activeElement.blur();
        this.showFeedConfigPanel = true;
        this.configuredFeedId = this.selectedFeedId;
        this.$nextTick(() => this.$refs.feedConfigPanel.setupQuickAdd(this.getFeedById(this.selectedFeedId)));
      }
    },
    // 
    // delete queue 
    // 
    deleteSelectedFeed() {
      document.activeElement.blur();
      this.feedIdToDelete = this.selectedFeedId;
      this.showFeedDeleteConfirmation = true;
    },
    deleteFeed(feedId) {
      document.activeElement.blur();
      this.feedIdToDelete = feedId;
      this.showFeedDeleteConfirmation = true;
    },
    performFeedDelete() {
      console.log("post-feed: deleting feed id=" + this.feedIdToDelete);
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/feeds/" + this.feedIdToDelete, {
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
          },
          method: 'DELETE',
          credentials: 'include',
          signal: controller.signal
        }).then((response) => {
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
          console.log("post-feed: deleted feedId=" + this.feedIdToDelete);
          delete this.inboundQueuesByFeed[this.feedIdToDelete];
          // update queues localStorage 
          localStorage.setItem('inboundQueuesByFeed', JSON.stringify(this.inboundQueuesByFeed));
          let idxToSplice = -1;
          for (let i = 0; i < this.feeds.length; i++) {
            if (this.feeds[i].id === this.feedIdToDelete) {
              idxToSplice = i;
              break;
            }
          }
          if (idxToSplice > -1) {
            let nextFeedId = this.feeds.length > idxToSplice + 1 ? this.feeds[idxToSplice + 1].id : null;
            this.feeds.splice(idxToSplice, 1);
            // update feeds localStorage 
            localStorage.setItem('feeds', JSON.stringify(this.feeds));
            if (this.selectedFeedId === this.feedIdToDelete) {
              this.setSelectedFeedId(nextFeedId); // TODO: (enhancement) should be a configurable 'default' feed 
            }
          }
          this.setLastServerMessage(data.message);
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.feedIdToDelete = null;
          this.showFeedDeleteConfirmation = false;
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.feedIdToDelete = null;
        this.showFeedDeleteConfirmation = false;
        this.inTransit = false;
      });
    },
    cancelFeedDelete() {
      this.feedIdToDelete = null;
      this.showFeedDeleteConfirmation = false;
    },
    // 
    // mark queue as read 
    // 
    markSelectedFeedAsRead() {
      document.activeElement.blur();
      this.feedIdToMarkAsRead = this.selectedFeedId;
      this.showFeedMarkAsReadConfirmation = true;
    },
    markFeedAsRead(feedId) {
      document.activeElement.blur();
      this.feedIdToMarkAsRead = feedId;
      this.showFeedMarkAsReadConfirmation = true;
    },
    performFeedMarkAsRead() {
      console.log("post-feed: updating feed status, id=" + this.feedIdToMarkAsRead);
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ newStatus: 'READ' }),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/staging/read-status/feed/" + this.feedIdToMarkAsRead, requestOptions)
        .then((response) => {
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
          this.inboundQueuesByFeed[this.feedIdToMarkAsRead].values.forEach((p) => { 
            p.isRead = true;
            p.postReadStatus = 'READ';
            p.isReadLater = false;
          });
          // update queue localStorage
          localStorage.setItem('inboundQueuesByFeed', JSON.stringify(this.inboundQueuesByFeed));
          this.setLastServerMessage(data.message);
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.feedIdToMarkAsRead = null;
          this.showFeedMarkAsReadConfirmation = false;
          this.inTransit = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.feedIdToMarkAsRead = null;
        this.showFeedMarkAsReadConfirmation = false;
        this.inTransit = false;
      });
    },
    cancelFeedMarkAsRead() {
      this.feedIdToMarkAsRead = null;
      this.showFeedMarkAsReadConfirmation = false;
    },
    // 
    // data model methods 
    // 
    setSelectedFeedId(feedId) {
      this.previousFeedId = this.selectedFeedId;
      this.selectedFeedId = feedId;
      this.inboundQueue = feedId ? this.inboundQueuesByFeed[feedId] : null;
      this.currentPage = 0;
      this.itemCount = 0;
    },
    restorePreviousFeedId() {
      this.setSelectedFeedId(this.previousFeedId);
    },
    getSelectedFeed() {
      if (this.selectedFeedId) {
        for (let i = 0; i < this.feeds.length; i++) {
          if (this.feeds[i].id === this.selectedFeedId) {
            return this.feeds[i];
          }
        }
      }
      return {};
    },
    getFeedById(feedId) {
      for (let i = 0; i < this.feeds.length; i++) {
        if (this.feeds[i].id === feedId) {
          return this.feeds[i];
        }
      }
    },
    getPostFromQueue(id) {
      let f = this.inboundQueue.values;
      for (let j = 0; j < f.length; j++) {
        if (f[j].id === id) {
          return f[j];
        }
      }
    },
    // 
    // utility methods 
    // 
    // setContains is true IFF obj1 is contained in objSet 
    setContains(obj1, objSet) {
      if (obj1 && objSet) {
        for (let i = 0; i < objSet.length; i++) {
          if (obj1 === objSet[i]) {
            return true;
          }
        }
      }
      return false;
    },
    // lcStrEq is true IFF str1 and str2 are LC-EQ 
    lcStrEq(str1, str2) {
      return str1 && str2 && str1.toLowerCase() === str2.toLowerCase();
    },
    // lcStrContains is true IFF str2 is contained within str1 
    lcStrContains(str1, str2) {
      return str1 && str2 && str1.toLowerCase().indexOf(str2.toLowerCase()) >= 0;
    },
    // lcSetContainsStr is true IFF str1 is contained in strSet 
    lcSetContainsStr(str1, strSet) {
      if (str1 && strSet) {
        for (let i = 0; i < strSet.length; i++) {
          if (this.lcStrEq(str1, strSet[i])) {
            return true;
          }
        }
      }
      return false;
    },
    len(str) {
      return (str !== null && str !== undefined) ? str.length : 0;
    },
    sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    },
    replaceArray(str, find, replace) {
      let replaceString = str;
      let regex;
      for (let i = 0; i < find.length; i++) {
          regex = new RegExp(find[i], "g");
          replaceString = replaceString.replace(regex, replace[i]);
      }
      return replaceString;
    },
    // 
    // 
    // 
    keyHandler(event) {
      if (!event.key) {
        return;
      }
      // 
      // ESC key handling 
      // 
      if (event.key === 'Escape') {
        if (!this.isModalShowing && !this.showSettingsPanel && !this.showHelpPanel && !this.showFeedConfigPanel && !this.showOpmlUploadPanel) {
          document.activeElement.blur();
        } else {
          // TODO: extract to 'cancelFeedDelete' 
          this.feedIdToDelete = null;
          this.showFeedDeleteConfirmation = false;
          // TODO: extract to 'cancelFeedMarkAsRead' 
          this.feedIdToMarkAsRead = null;
          this.showFeedMarkAsReadConfirmation = false;
          // 
          this.dismissCreateOrUpdateFeed();
          this.cancelOpmlUpload();
          // this.showSettingsPanel = false;
          // this.showHelpPanel = false;
        }
        return;
      }
      // bail if a modal is showing
      if (this.isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel) {
        return;
      }
      // handle feed-related key events 
      if (this.selectedFeedId) {
        let t = event.target.getAttribute("type") || event.target.type;
        if (t === 'text') {
          return;
        }
        // 
        // SHIFT + E KEY (CONFIGURE SELECTED QUEUE)
        // 
        if (event.key === 'E' && event.shiftKey === true) {
          this.configureFeed(this.selectedFeedId);
          event.stopPropagation();
          event.preventDefault();
        // 
        // SHFIT + S KEY (QUICK-ADD TO SELECTED QUEUE)
        // 
        } else if (event.key === 'S' && event.shiftKey === true) {
          this.rssAtomUrlQuickAdd();
          event.stopPropagation();
          event.preventDefault();
        // 
        // SLASH KEY (SEARCH SELECTED QUEUE)
        // 
        } else if (event.key === '/') {
          this.$nextTick(() => {
            let filterElem = document.getElementById('feed-filter');
            if (filterElem) {
              filterElem.focus();
            } else {
              this.$nextTick(() => {
                let filterElem = document.getElementById('feed-filter');
                if (filterElem) {
                  filterElem.focus();
                }
              });
            }
          });
          event.stopPropagation();
          event.preventDefault();
        // 
        // SHIFT + L KEY (TOGGLE QUEUE FILTER MODE)
        // 
        } else if (event.key === 'L' && event.shiftKey) {
          this.toggleFeedFilterMode('READ_LATER');
          event.stopPropagation();
          event.preventDefault();
        // 
        // SHIFT + H KEY (TOGGLE QUEUE FILTER MODE)
        // 
        } else if (event.key === 'H' && event.shiftKey) {
          this.toggleFeedFilterMode('READ');
          event.stopPropagation();
          event.preventDefault();
        // 
        // SHIFT + T KEY (TOGGLE QUEUE FILTER MODE)
        // 
        } else if (event.key === 'T' && event.shiftKey) {
          this.toggleFeedFilterMode('PUBLISHED');
          event.stopPropagation();
          event.preventDefault();
        // 
        // SHIFT + A KEY (MARK QUEUE AS READ)
        // 
        } else if (event.key === 'A' && event.shiftKey === true) {
          this.markSelectedFeedAsRead();
          event.stopPropagation();
          event.preventDefault();
        // 
        // SHIFT + D KEY (DELETE QUEUE) 
        // 
        } else if (event.key === 'D' && event.shiftKey === true) {
          this.deleteSelectedFeed();
          event.stopPropagation();
          event.preventDefault();
        }
      }
      // 
      // SHIFT + R KEY (REFRESH QUEUES)
      // 
      if (event.key === 'R' && event.shiftKey === true) {
        this.refreshFeeds(null, true);
        event.stopPropagation();
        event.preventDefault();
      // 
      // SHIFT + Q KEY (NEW QUEUE)
      // 
      } else if (event.key === 'Q' && event.shiftKey === true) {
        this.newFeed();
        event.stopPropagation();
        event.preventDefault();
      }
    },
  }
};
</script>

<style>
*:focus-visible {
  outline-style: outset;
}

pre {
  white-space: break-spaces !important;
}

body {
  margin: 0rem !important;
}

@media (max-width: 640px) {
  .server-message {
    padding-left: 2%;
    padding-right: 2%;
  }
}

@media (max-width: 320px) {
  .server-message {
    padding-left: 0;
    padding-right: 0;
  }
}

.selected-feed {
  border: 1px solid !important;
}

.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}

/** has references */
.v-navigation-drawer__content {
 overflow-y: scroll !important;
 overflow-x: auto !important;
}

.post-feed-container {
  background-color: ghostwhite;
  border: 1px solid;
}
</style>

<style scoped>
.logotext {
  font-family: 'Russo One';
}

.logosubtext {
  font-size: 1.5rem;
}

.fancy {
  font-family: 'Merriweather';
  font-weight: bold;
}
</style>
