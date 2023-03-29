<template>
  <div v-show="this.$auth.$isAuthenticated">
    <audio id="post-feed-audio" />
    <!-- feed delete confirmation modal (hidden) -->
    <ConfirmationDialog ref="feedDeleteConfirmationModal"
      :disabled="disabled || inTransit"
      :theme="theme"
      @confirm="performFeedDelete" 
      @cancel="cancelFeedDelete"
      :prompt="this.$t('confirmDeleteQueue')" />
    <!-- feed mark as read confirmation modal (hidden) -->
    <ConfirmationDialog ref="feedMarkAsReadConfirmationModal"
      :disabled="disabled || inTransit"
      :theme="theme"
      @confirm="performFeedMarkAsRead" 
      @cancel="cancelFeedMarkAsRead"
      :prompt="this.$t('confirmMarkQueueAsRead')" />
    <HelpPanel 
      ref="helpPanel"
      :theme="theme"
      @dismiss="dismissHelpPanel" />
    <ControlPanel :baseUrl="baseUrl" 
      ref="controlPanel"
      :disabled="disabled || inTransit || isModalShowing" 
      :theme="theme" 
      @updateServerMessage="setLastServerMessage" />
    <NavbarFixedHeader :theme="theme" :inTransit="false" />
    <div class="post-feed-container" id="post-feed-container">
      <div class="post-feed-container-inner" :class="this.selectedFeedId ? 'post-feed-container-inner-selected' : ''">
        <!-- left side, feed selector -- hide when modal is showing -->
        <div class="feed-select-view" :class="{ 
          'feed-select-view-selected': this.selectedFeedId, 
          'feed-select-view-collapsed': !this.showFeedSelectView
        }">
          <ViewHeader 
            :sticky="true" 
            :collapsible="windowWidth < 1024 || this.selectedFeedId === null" 
            :show="this.showQueueDashboard" 
            :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel" 
            :inTransit="inTransit" 
            :theme="theme"
            @toggle="this.showQueueDashboard = !this.showQueueDashboard">
              <template v-slot:count>
                <span class="fa fa-feed fa-1x"/>
                {{ this.$t('queueDashboard') }}
              </template>
              <template v-slot:body>
                <div v-if="this.showQueueDashboard" class="grid-container" v-auto-animate>
                  <div v-if="this.filteredFeedIdentOptions.length > 0" class="grid">
                    <div v-for="feed in filteredFeedIdentOptions" :key="feed.id" class="feed-select-wrapper">
                      <FeedSelectButton 
                        :feed="feed" 
                        :feedUrl="this.feedUrl"
                        :inboundCount="this.countInboundQueue(feed.id)" 
                        :publishedCount="this.countOutboundQueue(feed.id)" 
                        :class="this.selectedFeedId === feed.id ? 'selected-feed' : ''"
                        :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel" 
                        :theme="theme" 
                        @click.stop="this.setSelectedFeedId(feed.id)" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-slot:toolbar>
                <FeedDashboardButtons v-if="this.showQueueDashboard && !this.showFeedConfigPanel && !this.showOpmlUploadPanel"
                  :selectedFeedId="this.selectedFeedId" 
                  :disabled="disabled || inTransit || isModalShowing"
                  :theme="theme" 
                  @rssAtomUrlQuickAdd="rssAtomUrlQuickAdd" 
                  @configureFeed="this.configureFeed(this.selectedFeedId)" 
                  @newFeed="newFeed"
                  @uploadOpml="uploadOpml"
                  @deleteFeed="deleteFeed(this.selectedFeedId)" /> 
              </template>
          </ViewHeader>
        </div>
        <button v-if="this.selectedFeedId" class="toggle-feed-select-view" @click="this.showFeedSelectView = !this.showFeedSelectView" />
        <!-- right side -->
        <div :class="{ 'staging-header-view-selected': this.selectedFeedId, 'staging-header-view-collapsed': !this.showFeedSelectView }">
          <!-- inbound queue header -- hide when modal is showing -->
          <div id="staging-header-view" class="staging-header-view" v-if="this.selectedFeedId && !this.showFeedConfigPanel && !this.showOpmlUploadPanel">
            <ViewHeader :collapsible="true" 
              @toggle="this.showFullInboundQueueHeader = !this.showFullInboundQueueHeader" 
              :show="this.showFullInboundQueueHeader" 
              :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel" 
              :inTransit="false" 
              :theme="theme">
              <template v-slot:count>
                <span class="fa fa-gears fa-1x"/>
                {{ this.getFeedById(this.selectedFeedId).ident }}
              </template>
              <template v-slot:body>
                <!-- feed filter field -->
                <FeedFilter v-if="this.showFullInboundQueueHeader" 
                  @toggleSortOrder="toggleInboundQueueSortOrder"
                  @refreshFeeds="this.refreshFeeds(false, null, true)"
                  @markAsRead="this.markFeedAsRead(this.selectedFeedId)"
                  @toggleFeedFilterPills="this.showFeedFilterPills = !this.showFeedFilterPills"
                  @update:modelValue="this.inboundQueueFilter = $event"
                  :inboundQueueFilter="this.inboundQueueFilter"
                  :queueLength="this.filteredInboundQueue.length"
                  :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel" 
                  :theme="theme" />
                <!-- feed filter pills -->
                <FeedFilterPills v-if="this.showFeedFilterPills && this.showFullInboundQueueHeader" 
                  @unread="toggleFeedFilterMode('UNREAD')"
                  @readLater="toggleFeedFilterMode('READ_LATER')"
                  @read="toggleFeedFilterMode('READ')"
                  @published="toggleFeedFilterMode('PUBLISHED')"
                  @subscription="toggleFeedFilterSubscription"
                  @category="toggleFeedFilterCategory"
                  @resetFilterDefaults="resetFilterDefaults"
                  :feedFilterModes="feedFilterModes"
                  :allPostSubscriptions="allPostSubscriptions"
                  :selectedFeedFilterSubscriptions="selectedFeedFilterSubscriptions"
                  :allPostCategories="allPostCategories"
                  :selectedFeedFilterCategories="selectedFeedFilterCategories"
                  :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel"
                  :theme="theme" />
                <!-- post feed audio controller -->
                <PostFeedAudio ref="postFeedAudio" />
              </template>
            </ViewHeader>
          </div>
          <!-- inbound queue -- hide when modal is showing -->
          <div class="staging-view" v-if="this.selectedFeedId && !this.showFeedConfigPanel && !this.showOpmlUploadPanel">
            <div v-auto-animate>
              <PostItem v-for="post in this.getCurrentPage(filteredInboundQueue)" :key="post.id" :post="post"
                :id="'post_' + post.id"
                :ref="'post_' + post.id"
                :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel"
                :theme="theme" 
                :baseUrl="baseUrl"
                :isSelected="this.selectedPostId === post.id"
                tabindex="0"
                @keypress.self="isModalShowing ? false : setSelectedPost($event, post.id)"
                @click.prevent="isModalShowing ? false : setSelectedPost($event, post.id)"
                @setActive="setSelectedPost($event, post.id, false)" 
                @openPostUrl="openPostUrl(post.id)"
                @updatePostReadStatus="setPostReadStatus"
                @updatePostPubStatus="updatePostPubStatus" 
                @updateFilter="updatePostFeedFilter" 
                @playing="onMediaPlaying" 
                @audioPlay="onAudioPlay" 
                @goToNextPost="selectNextPost" 
                @goToPreviousPost="selectPreviousPost" />
              <div v-if="this.totalPages === 0" class="queue-message">
                {{ this.$t('noArticlesInQueue') }}
              </div>  
              <div v-if="this.currentPage + 1 == this.totalPages" class="queue-message">
                {{ this.$t('endOfQueueReached') }}
              </div>
            </div>
          </div>
          <div class="staging-view" v-if="this.showFeedConfigPanel || this.showOpmlUploadPanel" v-auto-animate>
            <ViewHeader v-if="this.showFeedConfigPanel" 
              :sticky="true" 
              :collapsible="false" 
              :disabled="disabled || inTransit || isModalShowing" 
              :inTransit="inTransit" 
              :theme="theme">
              <template v-slot:count>
                <span class="fa fa-feed fa-1x"/>
                {{ this.$t('queueSettings') }}
              </template>
              <template v-slot:body>
                <FeedConfigPanel ref="feedConfigPanel"
                  :disabled="disabled || inTransit"
                  :theme="theme"
                  :baseUrl="baseUrl" 
                  :rssAtomFeedCatalog="rssAtomFeedCatalog"
                  @saveOrUpdate="createOrUpdateFeed"
                  @cancel="cancelCreateOrUpdateFeed"
                  @authError="handleServerError" />
              </template>
            </ViewHeader>
            <ViewHeader v-if="this.showOpmlUploadPanel" 
              :sticky="true" 
              :collapsible="false" 
              :disabled="disabled || inTransit || isModalShowing" 
              :inTransit="inTransit" 
              :theme="theme">
              <template v-slot:count>
                <span class="fa fa-feed fa-1x"/>
                {{ this.$t('opmlUpload') }}
              </template>
              <template v-slot:body>
                <OpmlUploadPanel ref="opmlUploadPanel"
                  :disabled="disabled || inTransit" 
                  :theme="theme"
                  :baseUrl="baseUrl" 
                  @finalizeUpload="createOpmlFeeds"
                  @cancel="cancelOpmlUpload"
                  @authError="handleServerError" />
              </template>
            </ViewHeader>
          </div>
          <div class="logo">
            <span class="fa fa-rss" style="font-size: 15em;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// confirmation modal dialog 
import ConfirmationDialog from '@/components/layout/ConfirmationDialog.vue';
// feed configuration panel 
import FeedConfigPanel from "./feed/FeedConfigPanel.vue";
// OPML upload panel 
import OpmlUploadPanel from "./opml/OpmlUploadPanel.vue";
// help panel 
import HelpPanel from "./help/HelpPanel.vue";
// navbar 
import NavbarFixedHeader from "@/components/layout/NavbarFixedHeader.vue";
import ViewHeader from "@/components/layout/ViewHeader.vue";
// settings 
import ControlPanel from "@/components/layout/ControlPanel.vue";
// post item filter 
import FeedFilter from "./filter/FeedFilter.vue";
import FeedFilterPills from "./filter/FeedFilterPills.vue";
import PostFeedAudio from '@/components/post/PostFeedAudio.vue';
// post item 
import PostItem from "./PostItem.vue";
// feed dashboard 
import FeedSelectButton from './dashboard/FeedSelectButton.vue';
import FeedDashboardButtons from './dashboard/FeedDashboardButtons.vue';

export default {
  components: { 
    // modal 
    ConfirmationDialog,
    FeedConfigPanel,
    OpmlUploadPanel,
    HelpPanel,
    // layout 
    ViewHeader,
    NavbarFixedHeader,
    // settings 
    ControlPanel, 
    // filter 
    FeedFilter,
    FeedFilterPills,
    PostFeedAudio,
    // item 
    PostItem, 
    // dashboard 
    FeedSelectButton,
    FeedDashboardButtons,
  },
  name: "PostFeed",
  props: [ "baseUrl", "feedUrl", "disabled", "theme" ],
  emits: [ "updateServerMessage" ],
  watch: {
    '$auth.$isAuthenticated' (isAuthenticated) {
      if (isAuthenticated) {
        this.refreshFeeds(true, null, true); // need staging posts for all feeds and feed definitions 
      }
    }
  },
  mounted() {
    window.addEventListener("keydown", this.eventHandler);
    if (this.$auth.$isAuthenticated) {
        this.refreshFeeds(true, null, true); // need staging posts for all feeds and feed definitions 
    }
    window.onwheel = this.wheelHandler;
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.eventHandler);
  },
  created() {
  },
  computed: {
    totalPages: function() {
      let t = Math.ceil(this.filteredInboundQueue.length / this.itemsPerPage);
      return t;
    },
    filteredInboundQueue: function() {
      if (this.inboundQueue) {
        // 
        // filter inbondQueue according to the filter modes, &c 
        // 
        let filtered = this.inboundQueue.filter((post) => {
          if (!this.modeMatches(post)) {
            return false;
          }
          // check the subscription (importer desc) against the filter subscriptions (if any) 
          let subscriptionMatches = false;
          if (this.selectedFeedFilterSubscriptions.length === 0) {
            subscriptionMatches = true;
          } else {
            subscriptionMatches = this.lcSetContainsStr(post.importerDesc, this.selectedFeedFilterSubscriptions);
          }
          if (!subscriptionMatches) {
            return false;
          }
          // check the categories against the filter categories (if any) 
          let categoriesMatch = false;
          if (this.selectedFeedFilterCategories.length === 0) {
            categoriesMatch = true;
          } else if (post.postCategories) {
            for (let i = 0; i < post.postCategories.length; i++) {
              categoriesMatch = this.lcSetContainsStr(post.postCategories[i], this.selectedFeedFilterCategories);
              if (categoriesMatch) {
                break;
              }
            }
          }
          if (!categoriesMatch) {
            return false;
          }
          // check title and desc against filter text, if defined 
          let lcFilter = this.inboundQueueFilter ? this.inboundQueueFilter.toLowerCase() : null;
          return lcFilter ? (
            post.postTitle.value.toLowerCase().includes(lcFilter) || 
            (post.postDesc && post.postDesc.value.toLowerCase().includes(lcFilter)) // TODO: add post contents and consider cases where title, description, contents are HTML 
          ) : true;
        });
        // 
        // sort the filtered result 
        // 
        this.sortQueue(filtered, this.inboundQueueSortOrder);
        // 
        // return the final result 
        // 
        return filtered;
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
    allPostCategories: function () {
      let categories = new Set();
      let f = this.inboundQueue;
      for (let i = 0; i < f.length; i++) {
        if (f[i].postCategories) {
          f[i].postCategories.forEach((c) => categories.add(c));
        }
      }
      return Array.from(categories);
    },
    allPostSubscriptions: function() {
      return this.getSelectedFeed().rssAtomFeedUrls;
    },
    isModalShowing: function() {
      return (this.feedIdToDelete !== null || this.feedIdToMarkAsRead !== null || this.showHelpPanel);
    }
  },
  data() {
    return {
      // reactive window (inner) width 
      windowWidth: window.innerWidth,
      // operating mode 
      feedIdToDelete: null, 
      feedIdToMarkAsRead: null,
      // show the feed config modal (t/f) 
      showFeedConfigPanel: false, 
      // show the OPML config modal (t/f) 
      showOpmlUploadPanel: false,
      // show the help modal (t/f) 
      showHelpPanel: false,
      // feed select view is expanded (t/f) 
      showFeedSelectView: true, 
      // queue dashboard is expanded (t/f) 
      showQueueDashboard: true, 
      // inbound queue header is expanded, i.e., showing filter (t/f) 
      showFullInboundQueueHeader: false,
      // show the feed filter pills in the inbound queue header (t/f)
      showFeedFilterPills: false, // show filter pills t/f 
      // 
      atBottomOfPage: false,
      // 
      inTransit: false,

      // feed material 
      feeds: [], // all feeds 
      selectedFeedId: null, // currently selected feed 
      selectedPostId: null, // currently selected post 
      // queue material 
      inboundQueuesByFeed: {}, // all queues 
      inboundQueue: [], // inbound queue for the currently selected feed  
      // queue pagination material 
      itemsPerPage: 15,
      currentPage: 0,
      itemCount: 0,
      // queue filter material 
      inboundQueueFilter: null, // user-supplied filter text 
      feedFilterModes: ['UNREAD'], // currently selected filter modes 
      selectedFeedFilterSubscriptions: [],
      selectedFeedFilterCategories: [],
      // queue sorting material 
      inboundQueueSortOrder: 'DSC',
      // RSS/ATOM feed catalog 
      rssAtomFeedCatalog: null,
    };
  },
  methods: {
    modeMatches(post) {
      // check mode (extract to function) 
      let modeMatches = false;
      if (this.feedFilterModes.length === 0) {
        modeMatches = false;
      } else {
        modeMatches = this.lcSetContainsStr('PUBLISHED', this.feedFilterModes) && post.isPublished;
        modeMatches = modeMatches || (this.lcSetContainsStr('UNREAD', this.feedFilterModes) && (!post.isRead && !post.isReadLater));
        modeMatches = modeMatches || this.lcSetContainsStr(post.postReadStatus, this.feedFilterModes);
        modeMatches = modeMatches || this.lcSetContainsStr(post.postPubStatus, this.feedFilterModes);
      }
      return modeMatches;
    },
    onAudioPlay(bundle) {
      for (let j = 0; j < this.inboundQueue.length; j++) {
        let id = this.inboundQueue[j].id;
        let r = this.$refs['post_' + id];
        if (r && r.length > 0) {
          r[0].pauseMedia();
        }
      }
      this.$refs.postFeedAudio.play(bundle);
    },
    onMediaPlaying(postId) {
      for (let j = 0; j < this.inboundQueue.length; j++) {
        let id = this.inboundQueue[j].id;
        if (id !== postId) {
          let r = this.$refs['post_' + id];
          if (r && r.length > 0) {
            r[0].pauseMedia();
          }
        }
      }
      this.$refs.postFeedAudio.pausePlaying();
    },
    showHelp() {
      document.activeElement.blur();
      this.showHelpPanel = true;
      this.$refs.helpPanel.show();
    },
    dismissHelpPanel() {
      this.showHelpPanel = false;
      this.$refs.helpPanel.hide();
    },
    getCurrentPostIdx() {
      let currentPostIdx = null;
      for (let i = 0; i < this.filteredInboundQueue.length; i++) {
        if (this.filteredInboundQueue[i].id === this.selectedPostId) {
          currentPostIdx = i;
          break;
        }
      }
      return currentPostIdx;
    },
    // 
    // open post URL in new URL 
    // 
    openPostUrl(postId) {
      window.open(this.getPostFromQueue(postId).postUrl, '_blank');
    },
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
      let endIdx = (this.currentPage * this.itemsPerPage) + this.itemsPerPage;
      return items.slice(0, endIdx);
    },
    nextPage(selectFirstItem) {
      let n = this.currentPage + 1;
      if (n === this.totalPages) {
        return;
      }
      this.currentPage = n;
      if (selectFirstItem === true) {
        this.$nextTick(() => {
          this.selectNextPost();
        });
      }
    },
    // 
    // server error 
    // 
    handleServerError(error) {
      console.error(error);
      if (error.name === 'TypeError') {
        this.setLastServerMessage(this.$t('somethingHorribleHappened'));
      } else if (error.message) {
        this.setLastServerMessage(error.message); 
      } else {
        this.setLastServerMessage(error); // $auth plugin errors 
      }
    },
    setLastServerMessage(message) {
      if (message) {
        this.$emit('updateServerMessage', { message: message });
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

        if (l1.publishTimestamp && !r1.publishTimestamp) {
          return 1;
        }
        if (!l1.publishTimestamp && r1.publishTimestamp) {
          return -1;
        }
        if (l1.publishTimestamp && r1.publishTimestamp) {
          return l1.publishTimestamp > r1.publishTimestamp ? 1 : -1;
        } else {
          return l1.id > r1.id ? 1 : -1;
        }
      });
    },
    toggleInboundQueueSortOrder() {
      if (this.inboundQueueSortOrder === 'DSC') {
        this.inboundQueueSortOrder = 'ASC';
      } else {
        this.inboundQueueSortOrder = 'DSC';
      }
    },
    toggleFeedFilterMode(filterMode) {
      this.feedFilterModes.splice(0);
      if (!this.lcSetContainsStr(filterMode, this.feedFilterModes)) {
        this.feedFilterModes.push(filterMode);
      }
      this.$nextTick(() => {
        let idx = this.getCurrentPostIdx.apply();
        if (idx === null) {
          let newFirstItem = this.getCurrentPage(this.filteredInboundQueue)[0];
          if (newFirstItem) {
            this.$nextTick(() => {
              this.setSelectedPost(null, newFirstItem.id);
            });
          }
        }
      });
    },
    resetFilterDefaults() {
      this.feedFilterModes = ['UNREAD'];
      this.selectedFeedFilterCategories.splice(0);
      this.selectedFeedFilterSubscriptions.splice(0);
    },
    toggleFeedFilterCategory(category) {
      if (this.lcSetContainsStr(category, this.selectedFeedFilterCategories)) {
        let idxToSplice = -1;
        for (let i = 0; i < this.selectedFeedFilterCategories.length; i++) {
          if (this.selectedFeedFilterCategories[i] === category) {
            idxToSplice = i;
            break;
          }
        }
        if (idxToSplice >= 0) {
          this.selectedFeedFilterCategories.splice(idxToSplice, 1);
        }
      } else {
        this.selectedFeedFilterCategories.push(category);
      }
    },
    toggleFeedFilterSubscription(subscription) {
      if (this.lcSetContainsStr(subscription, this.selectedFeedFilterSubscriptions)) {
        let idxToSplice = -1;
        for (let i = 0; i < this.selectedFeedFilterSubscriptions.length; i++) {
          if (this.selectedFeedFilterSubscriptions[i] === subscription) {
            idxToSplice = i;
            break;
          }
        }
        if (idxToSplice >= 0) {
          this.selectedFeedFilterSubscriptions.splice(idxToSplice, 1);
        }
      } else {
        this.selectedFeedFilterSubscriptions.push(subscription);
      }
    },
    updatePostFeedFilter(f) {
      if (f.name === "subscription") {
        if (this.selectedFeedFilterSubscriptions.indexOf(f.value) < 0) {
          this.selectedFeedFilterSubscriptions.push(f.value);
          this.showFeedFilterPills = true;
        } else {
          this.removeFilterFromSet(this.selectedFeedFilterSubscriptions, f.value);
        }
      } else if (f.name === "category") {
        if (this.selectedFeedFilterCategories.indexOf(f.value) < 0) {
          this.selectedFeedFilterCategories.push(f.value);
          this.showFeedFilterPills = true;
        } else {
          this.removeFilterFromSet(this.selectedFeedFilterCategories, f.value);
        }
      }
    },
    removeFilterFromSet(filterSet, filterValue) {
      let idxToSplice = -1;
      for (let i = 0; i < filterSet.length; i++) {
        if (filterSet[i] === filterValue) {
          idxToSplice = i;
          break;
        }
      }
      if (idxToSplice >= 0) {
        filterSet = filterSet.splice(idxToSplice, 1);
      }
    },
    countInboundQueue(feedId) {
      let iq = this.inboundQueuesByFeed[feedId];
      if (iq) {
        let unreadCt = 0;
        for (let i = 0; i < iq.length; i++) {
          if (iq[i].isRead !== true) {
            unreadCt++;
          }
        }
        return unreadCt;
      }
      return 0;
    },
    countOutboundQueue(feedId) {
      let iq = this.inboundQueuesByFeed[feedId];
      return iq ? iq.filter(p => p.isPublished).length : 0;
    },
    // 
    // feed refresh 
    // 
    // hideStatus = t/f -> update/do not update the server message display upon refresh 
    // feedsToFetch = fetch staging posts for the feed Ids in this array, empty -> all feeds 
    // fetchFeedDefinitions = t/f -> include/exclude feed definition updates 
    refreshFeeds(hideStatus, feedsToFetch, fetchFeedDefinitions) {
      console.log("post-feed: refreshing feeds");
      let rawPosts = [];
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        let refreshPromises = [
          fetch(this.baseUrl + "/staging" + (feedsToFetch ? ("?feedIds=" + feedsToFetch) : ''), { 
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include' 
          })
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              throw Error(this.$t('refreshFailedDueTo') + 
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
              this.stagingCt = ct;
              console.log("post-feed: staging post refresh complete, ct=" + this.stagingCt);
            }
          })];
        if (fetchFeedDefinitions) {
          refreshPromises.push(
            fetch(this.baseUrl + "/feeds", {
              headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include' 
            })
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                throw Error(this.$t('refreshFailedDueTo') + 
                  " HTTP " + response.status + ": " + 
                    (response.statusText ? 
                      response.statusText : ("(" + this.$t('noMessage') + ")")
                    )
                  );
              }
            })
            .then((data) => {
              // empty feeds
              this.feeds.splice(0, this.feeds.length);
              // populate feeds
              let feedDefinitionData = data.feedDefinitions;
              let queryDefinitionData = data.queryDefinitions;
              for (let i = 0; i < feedDefinitionData.length; i++) {
                let fd = feedDefinitionData[i];
                // 
                let qd = queryDefinitionData[fd.id];
                this.decorateFeedWithQueryDefinitions(fd, qd, data.queryMetrics);
                // parse feed definition export config (if present) 
                fd.exportConfig = fd.exportConfig ? JSON.parse(fd.exportConfig) : fd.exportConfig;
                // add this feed definition to feeds
                console.log("post-feed: adding fd=" + fd.ident);
                this.feeds.push(fd);
              }
              this.rssAtomFeedCatalog = data.rssAtomFeedCatalog;
            })
          );
        }

        Promise.all(refreshPromises)
        .catch((error) => {
          this.handleServerError(error);
        })
        .finally(() => {
          for (let i = 0; i < this.feeds.length; i++) {
            let feedId = this.feeds[i].id;
            let iq = this.inboundQueuesByFeed[feedId];
            if (iq) {
              if (!feedsToFetch || feedsToFetch.indexOf(this.feeds[i].id) >= 0) {
                iq.splice(0);
              }
            } else {
              this.inboundQueuesByFeed[feedId] = [];
            }
          }
          for (let i = 0; i < rawPosts.length; i++) {
            let post = rawPosts[i];
            this.inboundQueuesByFeed[post.feedId].push(post);
          }
          if (this.feeds.length === 1 && !this.selectedFeedId) {
            this.setSelectedFeedId(this.feeds[0].id);
          } else {
            this.inboundQueue = this.inboundQueuesByFeed[this.selectedFeedId];
          }
          this.inTransit = false; // end of refreshFeeds 
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.inTransit = false;
      });
    },
    decorateFeedWithQueryDefinitions(fd, qd, qm) {
      fd.rssAtomFeedUrls = [];
      // 
      if (qd) {
        for (let i = 0; i < qd.length; i++) {
          let queryDefinition = qd[i].queryDefinition;
          let queryDefinitionImageUrl = qd[i].queryDefinitionImageUrl;
          let queryConfig = queryDefinition.queryConfig ? JSON.parse(queryDefinition.queryConfig) : queryDefinition.queryConfig;
          fd.rssAtomFeedUrls.push({
            "id": queryDefinition.id,
            "feedMetrics": qm ? qm[queryDefinition.id] : null,
            "feedTitle": queryDefinition.queryTitle,
            "feedImageUrl": queryDefinitionImageUrl,
            "feedUrl": queryDefinition.queryText,
            "username": queryConfig ? queryConfig.username : null,
            "password": queryConfig ? queryConfig.password : null,
          });
        }
      }
    },
    // 
    // toggles the selected post pub status, invoked via key listener 
    //
    toggleSelectedPostPubStatus() {
      let p = this.getPostFromQueue(this.selectedPostId);
      let newStatus;
      let originator;
      if (p.isPublished) {
        newStatus = 'DEPUB_PENDING';
        originator = "unstagePost";
      } else {
        originator = "stagePost";
        newStatus = 'PUB_PENDING';
      }
      this.updatePostPubStatus({ 
            id: p.id, 
            newStatus: newStatus, 
            originator: originator
          });
    },
    // 
    // toggles the selected post read status, invoked via key listener 
    // 
    toggleSelectedPostReadStatus() {
      let p = this.getPostFromQueue(this.selectedPostId);
      let newStatus;
      let selectNextPost = false;
      if (!p.isRead) {
        console.log("post-item: marking post id=" + p.id + " as read and selecting next unread");
        newStatus = 'READ';
        selectNextPost = true;
      } else {
        console.log("post-item: unmarking post id=" + p.id + " as read");
        newStatus = 'UNREAD';
      }
      this.updatePostReadStatus({ 
            id: p.id, 
            newStatus: newStatus, 
            originator: "togglePostReadStatus"
          });
      if (selectNextPost) {
        this.selectNextPost();
      }
    },
    // 
    // 
    // 
    setPostReadStatus(statusObj) {
      this.updatePostReadStatus(statusObj); 
      // select the next post IFF: 
      //   (1) we're updating the status to something other than un-read 
      //   (2) we're working with the currently selected post only 
      //   (3) the filter mode includes the new status of the current post 
      let correctStatus = statusObj.newStatus !== 'UNREAD';
      let correctPostId = statusObj.id === this.selectedPostId;
      let correctFilterMode = this.lcSetContainsStr(statusObj.newStatus, this.feedFilterModes);
      if (correctStatus && correctPostId && correctFilterMode ) {
        this.selectNextPost();
      }
    },
    // 
    // 
    // 
    updatePostReadStatus(result) {
      console.log("post-feed: updating post status");
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ newStatus: result.newStatus }),
        };
        fetch(this.baseUrl + "/staging/read-status/post/" + result.id, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then(() => {
          let originator = result.originator;
          if (originator === "togglePostDetails") { // NOTE: this happens when the post is opened 
            this.onTogglePostDetails(result);
          } else if (originator === "togglePostReadStatus") { // NOTE: this happens when the user toggles the 'mark as read' button 
            this.onTogglePostReadStatus(result);
          } else if (originator === "togglePostReadLaterStatus") { // NOTE: this happens when the user toggles the 'mark as read-later' button 
            this.onTogglePostReadLaterStatus(result);
          }
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
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
        const requestOptions = {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ newStatus: result.newStatus }),
        };
        fetch(this.baseUrl + "/staging/pub-status/" + result.id, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then((data) => {
          // update the post 
          let originator = result.originator;
          let idx = this.getPostIndex(this.inboundQueue, result.id);
          let p = this.inboundQueue[idx];
          if (originator === "stagePost") {
            p.isPublished = true;
          } else if (originator === "unstagePost") {
            p.isPublished = false;
          }
          p.postPubStatus = null;
          // update the feed last deployed timestamp 
          for (let i = 0; i < this.feeds.length; i++) {
              if (this.feeds[i].id === result.feedId) {
                this.feeds[i].lastDeployed = data.timestamp;
                break;
              }
          }
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.inTransit = false;
      });
    },
    onTogglePostDetails(result) {
      let p = this.getPostFromQueue(result.id);
      p.isRead = true;
      p.postReadStatus = 'READ';
      p.isReadLater = false;
    },
    onTogglePostReadStatus(result) {
      let p = this.getPostFromQueue(result.id);
      p.isRead = !p.isRead;
      p.postReadStatus = p.isRead ? 'READ' : null;
      if (p.isRead) {
        p.isReadLater = false;
      }
      this.setLastServerMessage(result.message);
    },
    onTogglePostReadLaterStatus(result) {
      let p = this.getPostFromQueue(result.id);
      p.isReadLater = !p.isReadLater;
      p.postReadStatus = p.isReadLater ? 'READ_LATER' : null;
      if (p.isReadLater) {
        p.isRead = false;
      }
      this.setLastServerMessage(result.message);
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
      this.showFeedConfigPanel = true;
      this.$nextTick(() => this.$refs.feedConfigPanel.setup({ rssAtomFeedUrls: [{ id: 1, }] }));
      
    },
    uploadOpml() {
      document.activeElement.blur();
      this.showOpmlUploadPanel = true;
      this.$nextTick(() => this.$refs.opmlUploadPanel.show());
    },
    validateFeed(feed) {
      if (this.len(feed.ident) > 2048) {
        throw Error(this.$t('queueIdentifierTooLong'));
      }
      if (this.len(feed.title) > 2048) {
        throw Error(this.$t('queueTitleTooLong'));
      }
      if (this.len(feed.generator) > 2048) {
        throw Error(this.$t('feedGeneratorTooLong'));
      }
      if (feed.rssAtomFeedUrls) {
        for (let i = 0; i < feed.rssAtomFeedUrls.length; i++) {
          if (this.len(feed.rssAtomFeedUrls[i].feedUrl) > 2048) {
            throw Error(this.$t('feedURLTooLong'));
          }
        }
      }
    },
    createOpmlFeeds(feeds) {
      for (let i = 0; i < feeds.length; i++) {
        let feed = feeds[i];
        try {
          this.validateFeed(feed);
        } catch (error) {
          console.error(error);
          return;
        }
      }
      let method = 'POST';
      this.inTransit = true;
      console.log("post-feed: pushing feeds to remote, ct=" + feeds.length);
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
          method: method,
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(feeds)
        };
        let url = this.baseUrl + "/feeds/";
        fetch(url, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
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
          this.setLastServerMessage(feeds.length + " " + this.$t('nQueuesCreated'));
          this.$refs.opmlUploadPanel.hide();
          this.showOpmlUploadPanel = false;
          this.refreshFeeds(true, feedIds, false);
        })
        .catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
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
      }
    },
    configureFeed(feedId) {
      document.activeElement.blur();
      this.showFeedConfigPanel = true;
      this.$nextTick(() => this.$refs.feedConfigPanel.setup(this.getFeedById(feedId)));
    },
    createOrUpdateFeed(feed) {
      try {
        this.validateFeed(feed);
      } catch (error) {
        console.error(error);
        return;
      }
      let isUpdate = feed.id ? true : false;
      let method = isUpdate ? 'PUT' : 'POST';
      this.inTransit = true;
      console.log("post-feed: pushing updated feed to remote..");
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
          method: method,
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(isUpdate ? feed : [feed])
        };
        let url = this.baseUrl + "/feeds/" + (isUpdate ? feed.id : '');
        fetch(url, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        })
        .then((data) => {
          if (isUpdate) {
            let f = data.feedDefinition;
            for (let i = 0; i < this.feeds.length; i++) {
              if (this.feeds[i].id === f.id) {
                this.feeds[i].ident = f.ident;
                this.feeds[i].title = f.title;
                this.feeds[i].description = f.description;
                this.feeds[i].generator = f.generator;
                this.feeds[i].copyright = f.copyright;
                this.feeds[i].language = f.language;
                this.feeds[i].feedImgSrc = f.feedImgSrc; // NOTE: limited on the backend to 16384 chars 
                this.feeds[i].categoryTerm = f.categoryTerm;
                this.feeds[i].categoryLabel = f.categoryLabel;
                this.feeds[i].categoryScheme = f.categoryScheme;
                this.feeds[i].categoryValue = f.categoryValue;
                this.feeds[i].categoryDomain = f.categoryDomain;
                this.decorateFeedWithQueryDefinitions(this.feeds[i], data.queryDefinitions, data.queryMetrics);
                this.$refs.feedConfigPanel.tearDown();
                this.showFeedConfigPanel = false;
                this.setLastServerMessage(this.$t('queueUpdated') + ' (' + feed.ident + ')');
                break;
              }
            }
            this.refreshFeeds(true, [f.id], false); // TODO: this is wrong, the refresh should be returned from the update call 
          } else {
            let f = data[0].feedDefinition;
            this.decorateFeedWithQueryDefinitions(f, data[0].queryDefinitions, data[0].queryMetrics);
            this.feeds.push(f);
            this.inboundQueuesByFeed[f.ident] = [];
            this.$refs.feedConfigPanel.tearDown();
            this.showFeedConfigPanel = false;
            this.setLastServerMessage(this.$t('queueCreated') + ' (' + f.ident + ")'");
            this.setSelectedFeedId(f.id);
            this.refreshFeeds(true, [f.id], false); // TODO: this is wrong, the refresh should be returned from the create call 
          }
        })
        .catch((error) => {
          this.handleServerError(error); 
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error); 
        this.inTransit = false;
      });
    },
    cancelCreateOrUpdateFeed() {
      if (this.$refs.feedConfigPanel) {
        this.$refs.feedConfigPanel.tearDown();
        this.showFeedConfigPanel = false;
      }
    },
    // 
    // RSS/ATOM URL quick add (to currently selected queue) 
    // 
    rssAtomUrlQuickAdd() {
      if (this.selectedFeedId) {
        document.activeElement.blur();
        this.showFeedConfigPanel = true;
        this.$nextTick(() => this.$refs.feedConfigPanel.setupQuickAdd(this.getFeedById(this.selectedFeedId)));
      }
    },
    // 
    // delete queue 
    // 
    deleteFeed(feedId) {
      document.activeElement.blur();
      this.feedIdToDelete = feedId;
      this.$refs.feedDeleteConfirmationModal.show();
    },
    performFeedDelete() {
      console.log("post-feed: deleting feed id=" + this.feedIdToDelete);
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        fetch(this.baseUrl + "/feeds/" + this.feedIdToDelete, {
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
          },
          method: 'DELETE',
          credentials: 'include'
        }).then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then((data) => {
          console.log("post-feed: deleted feedId=" + this.feedIdToDelete);
          delete this.inboundQueuesByFeed[this.feedIdToDelete];
          let idxToSplice = -1;
          for (let i = 0; i < this.feeds.length; i++) {
            if (this.feeds[i].id === this.feedIdToDelete) {
              idxToSplice = i;
              break;
            }
          }
          if (idxToSplice > -1) {
            this.feeds.splice(idxToSplice, 1);
          }
          if (this.selectedFeedId === this.feedIdToDelete) {
            this.setSelectedFeedId(null);
          }
          this.setLastServerMessage(data.message);
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.feedIdToDelete = null;
          this.$refs.feedDeleteConfirmationModal.hide();
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.feedIdToDelete = null;
        this.$refs.feedDeleteConfirmationModal.hide();
        this.inTransit = false;
      });
    },
    cancelFeedDelete() {
      this.feedIdToDelete = null;
      this.$refs.feedDeleteConfirmationModal.hide();
    },
    // 
    // mark queue as read 
    // 
    markSelectedFeedAsRead() {
      document.activeElement.blur();
      this.feedIdToMarkAsRead = this.selectedFeedId;
      this.$refs.feedMarkAsReadConfirmationModal.show();
    },
    markFeedAsRead(feedId) {
      document.activeElement.blur();
      this.feedIdToMarkAsRead = feedId;
      this.$refs.feedMarkAsReadConfirmationModal.show();
    },
    performFeedMarkAsRead() {
      console.log("post-feed: updating feed status, id=" + this.feedIdToMarkAsRead);
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ newStatus: 'READ' }),
        };
        fetch(this.baseUrl + "/staging/read-status/feed/" + this.feedIdToMarkAsRead, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then((data) => {
          this.inboundQueuesByFeed[this.feedIdToMarkAsRead].forEach((p) => { 
            p.isRead = true;
            p.postReadStatus = 'READ';
            p.isReadLater = false;
          });
          this.setLastServerMessage(data.message);
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.feedIdToMarkAsRead = null;
          this.$refs.feedMarkAsReadConfirmationModal.hide();
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.feedIdToMarkAsRead = null;
        this.$refs.feedMarkAsReadConfirmationModal.hide();
        this.inTransit = false;
      });
    },
    cancelFeedMarkAsRead() {
      this.feedIdToMarkAsRead = null;
      this.$refs.feedMarkAsReadConfirmationModal.hide();
    },
    // 
    // data model methods 
    // 
    setSelectedFeedId(feedId) {
      this.selectedFeedId = feedId;
      this.inboundQueue = feedId ? this.inboundQueuesByFeed[feedId] : null;
      this.selectedFeedFilterCategories = [];
      this.selectedFeedFilterSubscriptions = [];
      this.currentPage = 0;
      this.itemCount = 0;
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
    selectNextPost() {
      let currentPostIdx = this.getCurrentPostIdx();
      if (currentPostIdx < this.filteredInboundQueue.length - 1) {
        let nextPostId = this.filteredInboundQueue[currentPostIdx + 1].id;
        this.setSelectedPost(null, nextPostId);
      }
    },
    selectPreviousPost() {
      let currentPostIdx = this.getCurrentPostIdx();
      if (currentPostIdx > 0) {
        let nextPostId = this.filteredInboundQueue[currentPostIdx - 1].id;
        this.setSelectedPost(null, nextPostId);
      }
    },
    setSelectedPost($event, postId, doFocus) {
      if ($event && ($event.target.classList.contains('plyr__control') || $event.target.classList.contains('audio-player-control')))  {
        return;
      }
      if (this.selectedPostId && this.selectedPostId === postId) {
        return;
      }
      doFocus = doFocus === undefined ? true : doFocus;
      let r = this.$refs['post_' + postId];
      if (!r || r.length === 0) {
        // request article is not on this page, load the next page and select the next article 
        this.nextPage(true); 
        return;
      }
      this.$refs['post_' + postId][0].showFullPost();
      this.selectedPostId = postId;
      this.$nextTick(() => {
        let elem = document.getElementById('post_' + postId);
        if (doFocus) {
          elem.focus();
        }
        window.scrollTo({
          behavior: 'smooth',
          top: elem.getBoundingClientRect().top - document.body.getBoundingClientRect().top - document.getElementById('staging-header-view').getBoundingClientRect().height - 10,
        });
      });
    },
    getPostFromQueue(id) {
      for (let j = 0; j < this.inboundQueue.length; j++) {
        if (this.inboundQueue[j].id === id) {
          return this.inboundQueue[j];
        }
      }
    },
    getPostIndex(queue, id) {
      for (let i = 0; i < queue.length; i++) {
        if (queue[i].id === id) {
          return i;
        }
      }
    },
    // 
    // utility methods 
    // 
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
    // 
    // 
    // 
    eventHandler(event) {
      if (!event.key) {
        return;
      }
      // esc key handling 
      if (event.key === 'Escape') {
        if (!this.isModalShowing && !this.$refs.controlPanel.showSettingsPanel && !this.showFeedConfigPanel && !this.showOpmlUploadPanel) {
          document.activeElement.blur();
        } else {
          // TODO: extract to cancelFeedDelete' 
          this.feedIdToDelete = null;
          this.$refs.feedDeleteConfirmationModal.hide();
          // TODO: extract to 'cancelFeedMarkAsRead' 
          this.feedIdToMarkAsRead = null;
          this.$refs.feedMarkAsReadConfirmationModal.hide();
          // 
          this.dismissHelpPanel();
          this.cancelCreateOrUpdateFeed();
          this.cancelOpmlUpload();
          this.$refs.controlPanel.showSettingsPanel = false;
        }
        return;
      }
      // bail if a modal is showing
      if (this.isModalShowing || this.$refs.controlPanel.showSettingsPanel || this.showFeedConfigPanel || this.showOpmlUploadPanel) {
        return;
      }
      // handle post-related key events 
      if (this.selectedPostId) {
        let t = event.target.getAttribute("type") || event.target.type;
        if (t === 'text') {
          return;
        }
        if (event.key === 'ArrowDown') {
          this.selectNextPost();
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'ArrowUp') {
          this.selectPreviousPost();
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'Home') {
          this.setSelectedPost(null, this.getCurrentPage(this.filteredInboundQueue)[0].id, false);
          event.stopPropagation();
          event.preventDefault();
          return false;
        } else if (event.key === 'End') {
          let c = this.getCurrentPage(this.filteredInboundQueue);
          this.setSelectedPost(null, c[c.length - 1].id);
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 's') {
          this.toggleSelectedPostPubStatus();
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'm') {
          this.toggleSelectedPostReadStatus();
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'v') {
          this.openPostUrl(this.selectedPostId);
          event.stopPropagation();
          event.preventDefault();
        }
      }
      // handle feed-related key events 
      if (this.selectedFeedId) {
        let t = event.target.getAttribute("type") || event.target.type;
        if (t === 'text') {
          return;
        }
        if (event.key === 'E' && event.shiftKey === true) {
          this.configureFeed(this.selectedFeedId);
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'S' && event.shiftKey === true) {
          this.rssAtomUrlQuickAdd();
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === '/') {
          this.$nextTick(() => {
            let filterElem = document.getElementById('feed-filter');
            if (filterElem) {
              filterElem.focus();
            } else {
              this.showFullInboundQueueHeader = true;
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
        } else if (event.key === 'U' && event.shiftKey) {
          this.toggleFeedFilterMode('UNREAD');
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'L' && event.shiftKey) {
          this.toggleFeedFilterMode('READ_LATER');
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'D' && event.shiftKey) {
          this.toggleFeedFilterMode('READ');
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'S' && event.shiftKey) {
          this.toggleFeedFilterMode('PUBLISHED');
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'A' && event.shiftKey === true) {
          this.markSelectedFeedAsRead();
          event.stopPropagation();
          event.preventDefault();
        }
      }
      // handle others (global feed refresh, help, etc.)
      if (event.key === 'R' && event.shiftKey === true) {
        this.refreshFeeds(false, null, true);
        event.stopPropagation();
        event.preventDefault();
      } else if (event.key === 'Q') {
        this.newFeed();
        event.stopPropagation();
        event.preventDefault();
      } else if (event.key === '?') {
        this.showHelp();
        event.stopPropagation();
        event.preventDefault();
      }
    },
    wheelHandler(wheelEvent) {
      if (!this.selectedFeedId) {
        return;
      }
      if (wheelEvent.deltaY <= 0) {
        return true;
      }
      let c = document.getElementById('post-feed-container');
      if (c) {
        let w = (window.innerHeight + window.scrollY);
        if (w >= c.offsetHeight) {
          if (this.atBottomOfPage) {
            this.atBottomOfPage = false;
            this.nextPage(false);
            wheelEvent.stopPropagation();
          } else {
            this.atBottomOfPage = true;
          }
        } else {
          this.atBottomOfPage = false;
        }
      }
    }
  }
};
</script>

<style scoped>
.post-feed-container {
}

/** has references */
.post-feed-container-inner-selected {
  display: inline-flex;
}

.post-feed-container-inner {
  width: stretch;
}

.toggle-feed-select-view {
  background: transparent;
  width: min-content;
  border-left: 1px dashed black;
  border-top: 0px;
  border-bottom: 0px;
  border-right: 1px solid black;
  cursor: pointer;
}

.toggle-feed-select-view:hover, .toggle-feed-select-view:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.feed-select-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: v-bind('theme.sectionhighlight');
}

.staging-header-view-selected {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  border-radius: 4px;
  min-width: 70svw;
  max-width: 70svw;
}

.staging-header-view-collapsed {
  max-width: unset !important;
  width: inherit;
}

.staging-header-view {
  color: v-bind('theme.normalmessage');
  /* border-top: 1px solid v-bind('theme.sectionbordercolor'); */
  background: v-bind('theme.sectionhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  position: sticky;
  top: -1px;
  z-index: 200;
  overflow: auto;
}

.staging-view {
  color: v-bind('theme.normalmessage');
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: .75rem;
}

.grid-container {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  overflow: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  resize: none;
  min-width: 104px;
  max-width: 100%; 
  gap: .75rem;
  padding-top: .75rem;
  margin: 1px;
}

footer {
  grid-column: 1 / -1;
}

.grid > * {
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid > div:nth-of-type(3n+1) {
}

.grid > div:nth-of-type(3n+2) {
}

.grid > div:nth-of-type(3n+3) {
}

.grid > footer {
}

.feed-select-wrapper {
  display: block;
}

/** has references */
.selected-feed {
  color: v-bind('theme.fieldcolorhighlight');
  border-color: v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.fieldbackgroundhighlight');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
}

.logo {
  color: rgb(16,16,16);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: larger;
  z-index: -99999;
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  margin: 0rem;
  text-shadow: 2px 2px 2px v-bind('theme.logoshadowcolor');
}

.logo > div {
  padding-bottom: 3%;
}

.queue-message {
  font-size: larger;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  margin: .56rem;
  font-family: Arial, Helvetica, sans-serif;
}

@media (max-width: 1023px) {
  .staging-header-view-selected, .staging-header-view-collapsed {
    border-top: unset;
    min-width: unset;
    max-width: unset;
  }

  /** has references */
  .post-feed-container-inner-selected {
    display: unset;
  }

  .toggle-feed-select-view {
    display: none;
  }
}

@media (min-width: 1023px) {
  .feed-select-view-selected {
    width: 30svw;
  }

  .feed-select-view-collapsed {
    display: none;
  }
}
</style>
