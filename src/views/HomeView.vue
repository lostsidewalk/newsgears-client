<template>
  <v-app>
    <!-- pre-auth app bar -->
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
        <DisplayModeButton />
      </v-toolbar-items>
    </v-app-bar>

    <!-- pre-auth main -->
    <v-main
      v-show="!$auth.$isAuthenticated"
    >
      <BannerPanel :show-auth="false" />

      <AuthPanel ref="authentication" />
      <FooterPanel app />
    </v-main>

    <!-- post-auth main -->
    <v-main
      v-show="$auth.$isAuthenticated"
    >
      <!-- progress bar -->
      <v-progress-linear :indeterminate="isLoading || refreshFeedsIsLoading" />
      <!-- app bar (top-level)-->
      <v-app-bar
        app
        :location="'top'"
      >
        <template #title>
          <span class="view-header-no-count d-none d-sm-flex">
            FeedGears RSS
          </span>
        </template>
        <template #prepend>
          <v-app-bar-nav-icon
            icon="fa-rss" 
            @click.stop="showQueueDashboard = !showQueueDashboard"
          />
        </template>
        <template #append>
          <ControlPanel
            ref="controlPanel" 
            :base-url="baseUrl"
            :show-settings-panel="showSettingsPanel"
            :show-help-panel="showHelpPanel"
            :show-notification-warning="showNotificationWarning"
            @showSettings="showSettingsPanel = !showSettingsPanel"
            @showHelp="showHelpPanel = !showHelpPanel"
          >
            <template #additional>
              <!-- upload OPML button -->
              <v-btn
                :size="buttonSize" 
                accesskey="m"
                :title="$t('uploadOPML')" 
                append-icon="fa-file"
                :text="$t('uploadOPML')"
                @click.stop="uploadOpml"
              />
              <!-- new queue button -->
              <v-btn
                :size="buttonSize" 
                accesskey="q"
                :title="$t('createNewQueue')" 
                append-icon="fa-plus"
                :text="$t('createNewQueue')"
                @click.stop="newFeed"
              />
            </template>
          </ControlPanel>
        </template>
      </v-app-bar>
      <!-- app bar (feed filter) -->
      <v-app-bar
        v-show="selectedFeedId"
        app
      >
        <!-- feed filter  -->
        <FeedFilter
          :inbound-queue-filter="inboundQueueFilter"
          :inbound-queue-sort-order="inboundQueueSortOrder"
          :queue-length="filteredInboundQueue.length"
          :queue-name="getSelectedFeed().title"
          @toggleSortOrder="toggleInboundQueueSortOrder"
          @refreshFeeds="refreshFeeds(null, true)"
          @markAsRead="markFeedAsRead(selectedFeedId)"
          @update:modelValue="inboundQueueFilter = $event"
          @toggleFeedFilterPills="showFeedFilterPills = !showFeedFilterPills"
        />
        <!-- help buton -->
        <v-btn
          :size="buttonSize" 
          :title="$t('toggleSortOrder')" 
          :aria-label="$t('toggleSortOrder')" 
          :icon="showFilterHelp ? 'fa-compress' : 'fa-question-circle'"
          @click="showFilterHelp = !showFilterHelp"
        />
      </v-app-bar>
      <!-- app bar (filter pills) -->
      <v-expand-transition>
        <v-app-bar
          v-if="selectedFeedId && allFilterPills.length > 0 && showFeedFilterPills"
          app
        >
          <FeedFilterPills :filter-pills="allFilterPills" />
        </v-app-bar>
      </v-expand-transition>
      <!-- navigation drawer / left side -->
      <v-navigation-drawer
        v-model="showQueueDashboard"
        app
        :location="'start'"
        :class="$vuetify.display.xs ? 'w-100' : 'w-50'"
        elevation="12" 
        temporary
      >
        <v-sheet>
          <v-alert
            v-if="shouldShowAlert('thisIsYourQueueDashboard')"
            closable
            variant="outlined"
            border="top"
            icon="fa-question-circle"
            :text="$t('thisIsYourQueueDashboard')"
            class="ma-4"
            @click.close="dismissAlert('thisIsYourQueueDashboard')"
          />
          <v-hover
            v-for="feed in filteredFeedIdentOptions"
            v-slot="{ isHovering, props }"
            :key="feed.value"
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
      <!-- filter help card -->
      <v-dialog
        v-model="showFilterHelp"
        fullscreen
        scrollable
      >
        <FilterHelp @dismiss="showFilterHelp = false" />
      </v-dialog>
      <!-- delete confirmation modal -->
      <v-dialog
        v-model="showFeedDeleteConfirmation"
        scrollable
      >
        <ConfirmationDialog 
          class="rounded"
          :prompt="$t('confirmDeleteQueue')" 
          @confirm="performFeedDelete"
          @cancel="cancelFeedDelete"
        />
      </v-dialog>
      <!-- mark as read confirmation modal -->
      <v-dialog
        v-model="showFeedMarkAsReadConfirmation"
        scrollable
      >
        <ConfirmationDialog 
          class="rounded"
          :prompt="$t('confirmMarkQueueAsRead')" 
          @confirm="performFeedMarkAsRead"
          @cancel="cancelFeedMarkAsRead"
        />
      </v-dialog>
      <!-- settings modal -->
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
      <!-- help modal -->
      <v-dialog
        v-model="showHelpPanel"
        fullscreen
        scrollable
      >
        <HelpPanel 
          class="overflow-auto rounded"
          @dismiss="showHelpPanel = false"
        />
      </v-dialog>
      <!-- queue config modal -->
      <v-dialog
        v-model="showFeedConfigPanel"
        fullscreen
        scrollable
      >
        <FeedConfigPanel
          ref="feedConfigPanel"
          :base-url="baseUrl" 
          @save="createFeed"
          @update="updateFeed"
          @dismiss="dismissFeedConfigPanel"
          @authError="handleServerError" 
          @updateServerMessage="setLastServerMessage" 
          @refreshFeedDefinition="$event => refreshFeeds([$event], true)"
        />
      </v-dialog>
      <!-- opml upload modal -->
      <v-dialog
        v-model="showOpmlUploadPanel"
        fullscreen
        scrollable
      >
        <OpmlUploadPanel
          ref="opmlUploadPanel"
          :base-url="baseUrl" 
          :is-loading="uploadIsLoading"
          @finalizeUpload="createOpmlFeeds"
          @cancel="cancelOpmlUpload"
          @authError="handleServerError"
        />
      </v-dialog>
      <!-- post feed layout control -->
      <v-container class="post-feed-container d-flex flex-grow-1 rounded justify-space-between flex-wrap">
        <FeedLayout
          :show-list-layout="showListLayout"
          :show-card-layout="showCardLayout"
          @list="postFeedLayout = 'LIST'"
          @card="postFeedLayout = 'CARD'"
        />
        <v-label
          v-if="selectedFeedId"
          class="ma-2 font-weight-bold"
        >
          {{ getSelectedFeed().title }}
        </v-label>
      </v-container>
      <!-- divider -->
      <v-divider />
      <!-- post feed container (cards) -->
      <v-container
        v-if="selectedFeedId && showCardLayout"
        class="post-feed-container d-flex flex-column flex-grow-1 rounded"
      >
        <PostCard
          v-for="post in filteredInboundQueue"
          :id="'post_' + post.id" 
          :key="post.id"
          :post="post"
          :sharing-options="sharingOptions"
          :collapsed="true"
          class="mb-4"
          @openPostUrl="openPostUrl(post.id)"
          @updatePostReadStatus="updatePostReadStatus"
          @updatePostPubStatus="updatePostPubStatus" 
          @updatePostFeedFilter="updatePostFeedFilter" 
          @share="$event => share($event.sharingOption, $event.post)"
        />
      </v-container>
      <!-- post feed container (list) -->
      <v-container
        v-if="selectedFeedId && showListLayout"
        class="post-feed-container d-flex flex-column flex-grow-1 rounded"
      >
        <v-dialog
          v-model="showSelectedPost"
          scrollable
          fullscreen
        >
          <PostCard
            :id="'post_' + selectedPost.id" 
            :post="selectedPost"
            :sharing-options="sharingOptions"
            @openPostUrl="openPostUrl(selectedPost.id)"
            @updatePostReadStatus="updatePostReadStatus"
            @updatePostPubStatus="updatePostPubStatus" 
            @updatePostFeedFilter="updatePostFeedFilter" 
            @share="$event => share($event.sharingOption, $event.post)"
          >
            <template #additional>
              <v-btn
                :size="buttonSize"
                accesskey="n"
                icon="fa-arrow-down"
                class="ma-1"
                :title="$t('goToNextPost')"
                @click.stop="selectNextPost"
              />
              <v-btn
                :size="buttonSize" 
                accesskey="p"
                icon="fa-arrow-up"
                class="ma-1"
                :title="$t('goToPreviousPost')"
                @click.stop="selectPreviousPost"
              />
            </template>
          </PostCard>
        </v-dialog>
        <v-list
          v-if="filteredInboundQueue.length > 0"
          v-model="selectedItem"
          class="rounded"
        >
          <PostListItem
            v-for="post in filteredInboundQueue"
            :id="'post_' + post.id" 
            :key="post"
            :post="post"
            :sharing-options="sharingOptions"
            class="ma-4 rounded"
            @openPost="openPost(post.id)"
            @updatePostReadStatus="updatePostReadStatus"
            @updatePostPubStatus="updatePostPubStatus" 
            @updatePostFeedFilter="updatePostFeedFilter" 
            @share="$event => share($event.sharingOption, $event.post)"
          />
        </v-list>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import debounce from 'lodash.debounce';
// components 
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";
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
// feed layout 
import FeedLayout from "@/components/post-feed/FeedLayout.vue";
// feed filter 
import FeedFilter from "@/components/post-feed/FeedFilter.vue";
import FeedFilterPills from "@/components/post-feed/FeedFilterPills.vue";
import FilterHelp from "@/components/post-feed/FilterHelp.vue";
// post 
import PostCard from "@/components/post/PostCard.vue";
import PostListItem from "@/components/post/PostListItem.vue";
// feed dashboard 
import FeedSelectButton from '@/components/post-feed/FeedSelectButton.vue';
import FooterPanel from "@/components/footer-panel/FooterPanel.vue";
// import FeedDetails from '@/components/post-feed/FeedDetails.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';


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
];

const replaceArray = function (str, find, replace) {
  let replaceString = str;
  let regex;
  for (let i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};

const toLunrToken = function (str) {
  if (str) {
    let pieces = str.split(' ');
    let token = pieces[0];
    return token + (pieces.length > 1 ? '*' : '');
  }
};

export default {
  name: "HomeView",
  components: {
    BannerPanel,
    GoBack,
    DisplayModeButton,
    AuthPanel,
    // modal 
    ConfirmationDialog,
    FeedConfigPanel,
    OpmlUploadPanel,
    // settings 
    ControlPanel,
    SettingsPanel,
    HelpPanel,
    // layout 
    FeedLayout,
    // filter 
    FeedFilter,
    FeedFilterPills,
    FilterHelp,
    // item 
    PostCard,
    PostListItem,
    // dashboard 
    FeedSelectButton,
    FooterPanel
  },
  mixins: [buttonSizeMixin],
  props: {
    baseUrl: { type: String, required: true },
    feedUrl: { type: String, required: true },
  },
  data() {
    return {
      selectedItem: null,
      isLoading: false,
      uploadIsLoading: false,
      refreshFeedsIsLoading: false,
      // reactive window (inner) width 
      windowWidth: window.innerWidth,
      // operating mode 
      feedIdToDelete: null, 
      feedIdToMarkAsRead: null,
      // show notification warning 
      showNotificationWarning: false, 
      // show filter help
      showFilterHelp: false,
      showFeedFilterPills: false,
      // show the queue dashboard (t/f) 
      showQueueDashboard: false,
      // 
      postFeedLayout: 'LIST', // 'CARD' 
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
      showSelectedPost: false,
      selectedPost: null,
      // feed material 
      feeds: [], // all feeds 
      selectedFeedId: null, // currently selected feed Id 
      previousFeedId: null, // previously selected feed Id 
      // queue material 
      inboundQueuesByFeed: {}, // all queues 
      inboundQueue: { values: [] }, // inbound queue for the currently selected feed  
      // queue filter material 
      inboundQueueFilter: '', // user-supplied filter text (lunrjs query expression) 
      // queue sorting material 
      inboundQueueSortOrder: 'DSC',
    };
  },
  computed: {
    isModalShowing: function() {
      return this.showSettingsPanel || this.showHelpPanel || this.showFeedConfigPanel || this.showOpmlUploadPanel;
    },
    filteredInboundQueue: function() {
      if (this.inboundQueue) {
        let results = null;
        // if a lunr query expression is specified .. 
        // then fetch the preliminary results from lunrjs 
        if (this.inboundQueueFilter) {
          let lunrLambda = () => this.inboundQueue.index.search(this.inboundQueueFilter);
          try {
            let lunrResults = lunrLambda.apply();
            if (lunrResults) {
              lunrResults = lunrResults.map(item => parseInt(item.ref));
              results = this.inboundQueue.values.filter(item => {
                return lunrResults.includes(item.id);
              });
            }
          } catch (error) {
            if (error instanceof lunr.QueryParseError) {
              // console.debug("lunrjs search query exception due to: " + JSON.stringify(error));
            } else {
              console.error(error);
              throw error;
            }
          }
        } else {
          // (otherwise the preliminary results are the entire queue) 
          results = this.inboundQueue.values;
        }
        // 
        // sort the filtered result 
        // 
        if (results) {
          this.sortQueue(results, this.inboundQueueSortOrder);
        }
        // 
        // return the final (sorted) result 
        // 
        return results ? results : [];
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
          isSelected: this.inboundQueueFilter.indexOf('status:READ_LATER') >= 0, 
          invoke: () => this.toggleFeedFilterMode('READ_LATER'), 
          label: this.$t('readLater'),
          title: 'View items marked as read-later',
        },
        {
          isSelected: this.inboundQueueFilter.indexOf('status:PUBLISHED') >= 0,
          invoke: () => this.toggleFeedFilterMode('PUBLISHED'), 
          label: this.$t('starred'),
          title: 'View starred items',
        },
        {
          isSelected: false,
          invoke: () => this.inboundQueueFilter = '',
          label: this.$t('clear'),
          title: 'Clear filter',
        }
      ];

      return filterPills;
    },
    sharingOptions: function() {
      return sharingOptions;
    },
    showCardLayout: function() {
      return this.postFeedLayout === 'CARD';
    },
    showListLayout: function() {
      return this.postFeedLayout === 'LIST';
    },
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
          this.rebuildLunrIndexes();
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
    shouldShowAlert(alertName) {
      return !localStorage.getItem(alertName); 
    },
    dismissAlert(alertName) {
      localStorage.setItem(alertName, new Date().toISOString())
    },
    setLastServerMessage(message) {
      this.$notification.requestPermission().then(p => {
        if (p === "granted") {
          this.showNotificationWarning = false;
          this.$notification.show('FeedGears message', {
           body: message
          }, {
            onerror: function() {
              console.error("unable to show notification, message=" + message);
            }
          });
        } else {
          this.showNotificationWarning = true;
        }
      });
      this.$announcer.polite(message);
    },
    // 
    // open post card in a modal dialog
    // 
    openPost(postId) {
      this.selectedPost = this.getPostFromQueue(postId);
      this.showSelectedPost = true;
    },
    // 
    //
    // 
    selectNextPost() {
      if (this.selectedPost) {
        let nextIdx = null;
        let id = this.selectedPost.id;
        let queue = this.filteredInboundQueue;
        for (let i = 0; i < queue.length; i++) {
          if (queue[i].id === id) {
            nextIdx = i + 1;
            break;
          }
        }
        if (nextIdx < queue.length) {
          this.selectedPost = queue[nextIdx];
        }
      }
    },
    // 
    //
    // 
    selectPreviousPost() {
      if (this.selectedPost) {
        let prevIdx = null;
        let id = this.selectedPost.id;
        let queue = this.filteredInboundQueue;
        for (let i = 0; i < queue.length; i++) {
          if (queue[i].id === id) {
            prevIdx = i - 1;
            break;
          }
        }
        if (prevIdx >= 0) {
          this.selectedPost = queue[prevIdx];
        }
      }
    },
    // 
    // open post URL in new window
    // 
    openPostUrl(postId) {
      window.open(this.getPostFromQueue(postId).postUrl, '_blank');
    },
    // 
    // share a post using the given sharing option 
    // 
    share(sharingOption, post) {
      let title = encodeURIComponent(post.postTitle.value);
      let link = encodeURIComponent(post.postUrl);
      let source = encodeURIComponent(post.importerDesc);
      let content = encodeURIComponent(post.postDesc ? post.postDesc.value : '');
      let url = replaceArray(sharingOption.url, 
        ["{URL}", "{TITLE}", "{SOURCE}", "{CONTENT}"], 
        [ link, title, source, content ]
      );
      window.open(url, '_blank');
    },
    // 
    // handleserver error 
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
      this.inboundQueueFilter = 'status:' + filterMode;
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
      this.inboundQueueFilter = '+feed:' + toLunrToken(subscription);
    },
    // 
    // convenience method (invoked from above) to add the category to the lunrjs query expression 
    // 
    addCategoryToFeedFilter(category) {
      if (this.inboundQueueFilter) {
        let expr = '+category:' + toLunrToken(category);
        if (this.inboundQueueFilter.indexOf(expr) < 0) {
          this.inboundQueueFilter = this.inboundQueueFilter + ' +category:' + category;
        }
      } else {
        this.inboundQueueFilter = ' +category:' + category;
      }
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
      this.refreshFeedsIsLoading = true;
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
                this.feeds.splice(0);
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
                  this.feeds.push(fd);
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
          this.rebuildLunrIndexes();
          // update queues localStorage 
          localStorage.setItem('inboundQueuesByFeed', JSON.stringify(this.inboundQueuesByFeed));
          // set selected feed Id and inbound queue 
          if (this.feeds.length > 0 && !this.selectedFeedId) {
            // TODO: (enhancement) should be a configurable 'default' feed 
            this.setSelectedFeedId(this.feeds[0].id);
          } else {
            this.inboundQueue = this.inboundQueuesByFeed[this.selectedFeedId];
          }
          this.refreshFeedsIsLoading = false; // end of refreshFeeds 
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.refreshFeedsIsLoading = false;
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
    rebuildLunrIndexes() {
      console.log("rebuilding lunrjs indexes...");
      for (let i = 0; i < this.feeds.length; i++) {
        let iq = this.inboundQueuesByFeed[this.feeds[i].id];
        if (iq) {
          const trueStr = this.$t('trueStr');
          const falseStr = this.$t('falseStr');
          iq.index = lunr(function () {
            this.ref('id')
            // title 
            this.field('title', {
              extractor: function(doc = {}) {
                return doc.postTitle ? doc.postTitle.value : null;
              },
              boost: 10,
            });
            // description 
            this.field('description', {
              extractor: function(doc = {}) {
                return doc.postDesc ? doc.postDesc.value : null;
              }
            });
            // feed 
            this.field('feed', {
              extractor: function(doc = {}) {
                return doc.importerDesc;
              },
            });
            // category 
            this.field('category', {
              extractor: function(doc = {}) {
                return doc.postCategories;
              }
            });
            // author 
            this.field('author', {
              extractor: function (doc = {}) {
                return (doc.authors && doc.authors.length > 0) ? doc.authors[0].name : null;
              }
            });
            // authors
            this.field('authors', {
              extractor: function (doc = {}) {
                return (doc.authors && doc.authors.length > 0) ?
                  doc.authors.map(function (author) { return author.name; }) : null;
              }
            });
            // contributors
            this.field('contributors', {
              extractor: function (doc = {}) {
                return (doc.contributors && doc.contributors.length > 0) ?
                  doc.contributors.map(function (contributor) { return contributor.name; }) : null;
              }
            });
            // published
            this.field('published', {
              extractor: function (doc = {}) {
                return doc.publishTimestamp ? doc.publishTimestamp.toString('YYYY-MM-DD') : null;
              },
            });
            // updated
            this.field('updated', {
              extractor: function (doc = {}) {
                return doc.lastUpdatedTimestamp ? doc.lastUpdatedTimestamp.toString('YYYY-MM-DD') : null;
              }
            });
            // contents
            this.field('contents', {
              extractor: function (doc = {}) {
                return (doc.postContents && doc.postContents.length > 0) ? doc.postContents[0].value : null;
              }
            })
            // url
            this.field('url', {
              extractor: function (doc = {}) {
                return doc.postUrl;
              }
            });
            this.field('status', {
              extractor: function (doc = {}) {
                return doc.postReadStatus ? doc.postReadStatus : 'UNREAD';
              }
            });
            this.field('starred', {
              extractor: function (doc = {}) {
                return doc.isPublished ? trueStr : falseStr;
              }
            })
            iq.values.forEach(function (doc) {
              this.add(doc)
            }, this)
          });
        }
      }            
    },
    // 
    // 
    // 
    updatePostReadStatus(result) {
      console.log("post-feed: updating post status");
      this.isLoading = true;
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
          this.rebuildLunrIndexes();
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.isLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.isLoading = false;
      });
    },
    updatePostPubStatus(result) {
      console.log("post-feed: updating post status");
      this.isLoading = true;
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
                this.feeds[i].lastDeployed = this.formatTimestamp(data.timestamp);
                updateLocalStorage = true;
                break;
              }
          }
          if (updateLocalStorage) {
            // update feeds localStorage 
            localStorage.setItem('feeds', JSON.stringify(this.feeds));
          }
          this.rebuildLunrIndexes();
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.isLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.isLoading = false;
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
    // 
    // create / update queue 
    // 
    newFeed() {
      document.activeElement.blur();
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
      this.uploadIsLoading = true;
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
          this.uploadIsLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.uploadIsLoading = false;
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
    createFeed(feed) {
      let method = 'POST';
      this.isLoading = true;
      console.log("post-feed: pushing new feed to remote..");
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: method,
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify([feed]),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/feeds/", requestOptions)
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
          let created = data[0].feedDefinition;
          this.feeds.push(created);
          // update feeds localStorage 
          localStorage.setItem('feeds', JSON.stringify(this.feeds));
          this.inboundQueuesByFeed[created.id] = { values: [] };
          // update queues localStorage 
          localStorage.setItem('inboundQueuesByFeed', JSON.stringify(this.inboundQueuesByFeed));
          this.$refs.feedConfigPanel.setup(created);
          this.setLastServerMessage(this.$t('queueCreated') + ' (' + created.ident + ")'");
          this.setSelectedFeedId(created.id);
          this.rebuildLunrIndexes();
        }).catch((error) => {
          this.handleServerError(error); 
        }).finally(() => {
          this.isLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error); 
        this.isLoading = false;
      });
    },
    updateFeed(feed) {
      let method = 'PUT';
      this.isLoading = true;
      console.log("post-feed: pushing updated feed to remote..");
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: method,
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(feed),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/feeds/" + feed.id, requestOptions)
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
          let updated = data.feedDefinition;
          let current = this.getFeedById(updated.id);
          current.ident = updated.ident;
          current.title = updated.title;
          current.description = updated.description;
          current.generator = updated.generator;
          current.copyright = updated.copyright;
          current.language = updated.language;
          current.categoryTerm = updated.categoryTerm;
          current.categoryLabel = updated.categoryLabel;
          current.categoryScheme = updated.categoryScheme;
          current.categoryValue = updated.categoryValue;
          current.categoryDomain = updated.categoryDomain;
          this.decorateFeedWithQueryDefinitions(current, data.queryDefinitions, data.queryMetrics);
          this.setLastServerMessage(this.$t('queueUpdated') + ' (' + feed.ident + ')');
          this.refreshFeeds([current.id], false); // TODO: (enhancement) the refresh should be returned from the update call 
        }).catch((error) => {
          this.handleServerError(error); 
        }).finally(() => {
          this.isLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error); 
        this.isLoading = false;
      });
    },
    dismissFeedConfigPanel() {
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
      this.isLoading = true;
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
          this.rebuildLunrIndexes();
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.feedIdToDelete = null;
          this.showFeedDeleteConfirmation = false;
          this.isLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.feedIdToDelete = null;
        this.showFeedDeleteConfirmation = false;
        this.isLoading = false;
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
      this.isLoading = true;
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
          this.rebuildLunrIndexes();
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.feedIdToMarkAsRead = null;
          this.showFeedMarkAsReadConfirmation = false;
          this.isLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.feedIdToMarkAsRead = null;
        this.showFeedMarkAsReadConfirmation = false;
        this.isLoading = false;
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
        // bail if a modal is showing
        if (this.isModalShowing) {
          return;
        }
        // otherwise hide the queue dashboard if it's showing 
        if (this.showQueueDashboard) {
          this.showQueueDashboard = false;
        }
        return;
      }
      // 
      // Feed-related key handling 
      // 
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
    formatTimestamp(timestamp) {
      if (!timestamp) {
        return null;
      }
      try {
        let d = new Date(Date.parse(timestamp));
        return d.toLocaleString();
      } catch (error) {
        console.debug("Unable to format timestamp due to: " + error);
      }
    }
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

.post-feed-container {
  background-color: transparent;
}
</style>
