<template>
  <div v-show="this.$auth.$isAuthenticated">
    <audio id="post-feed-audio" />
    <!-- feed delete confirmation modal (hidden) -->
    <ConfirmationDialog ref="feedDeleteConfirmationModal"
      :disabled="disabled || inTransit"
      :theme="theme"
      @confirm="performFeedDelete" 
      @cancel="cancelFeedDelete"
      prompt="Please confirm that you want to delete this feed. This action is irreversible." />
    <!-- feed mark as read confirmation modal (hidden) -->
    <ConfirmationDialog ref="feedMarkAsReadConfirmationModal"
      :disabled="disabled || inTransit"
      :theme="theme"
      @confirm="performFeedMarkAsRead" 
      @cancel="cancelFeedMarkAsRead"
      prompt="Mark all items in this queue as read?" />
    <!-- feed configuration panel modal (hidden) -->
    <FeedConfigPanel ref="feedConfigPanel"
      :disabled="disabled || inTransit"
      :theme="theme"
      :baseUrl="baseUrl" 
      :allNewsApiV2Sources="allNewsApiV2Sources"
      :allNewsApiV2Countries="allNewsApiV2Countries"
      :allNewsApiV2Categories="allNewsApiV2Categories"
      :allNewsApiV2Languages="allNewsApiV2Languages"
      :rssAtomFeedCatalog="rssAtomFeedCatalog"
      @saveOrUpdate="createOrUpdateFeed"
      @cancel="cancelCreateOrUpdateFeed"
      @authError="handleServerError" />
    <!-- OPML upload panel modal (hidden) -->
    <OpmlUploadPanel ref="opmlUploadPanel"
      :disabled="disabled || inTransit" 
      :theme="theme"
      :baseUrl="baseUrl" 
      @finalizeUpload="createOpmlFeeds"
      @cancel="cancelOpmlUpload"
      @authError="handleServerError" />
    <HelpPanel 
      ref="helpPanel"
      :theme="theme"
      @dismiss="dismissHelpPanel" />
    <ControlPanel :baseUrl="baseUrl" 
      ref="controlPanel"
      :disabled="disabled || inTransit || isModalShowing" 
      :theme="theme" 
      @updateServerMessage="setLastServerMessage" />
    <NavbarFixedHeader :theme="theme" :inTransit="this.selectedFeedId ? false : this.inTransit" />
    <div class="post-feed-container">
      <div class="post-feed-container-inner" :class="this.selectedFeedId ? 'post-feed-container-inner-selected' : ''">
        <!-- left side, feed selector -- hide when modal is showing -->
        <div class="feed-select-view" :class="{ 
          invisible: this.isModalShowing, 
          'feed-select-view-selected': this.selectedFeedId, 
          'feed-select-view-collapsed': !this.showFeedSelectView
        }">
          <ViewHeader :sticky="true" :collapsible="true" @toggle="this.showQueueDashboard = !this.showQueueDashboard" :show="this.showQueueDashboard" :disabled="disabled || inTransit" :inTransit="inTransit" :theme="theme">
              <template v-slot:count>
                <span class="fa fa-feed fa-1x"/>
                QUEUE DASHBOARD
              </template>
              <template v-slot:body>
                <div v-if="this.showQueueDashboard" class="grid-container">
                  <div v-if="this.filteredFeedIdentOptions.length > 0" class="grid">
                    <div v-for="feed in filteredFeedIdentOptions" :key="feed.id" class="feed-select-wrapper">
                      <FeedSelectButton 
                        :feed="feed" 
                        :inboundCount="this.countInboundQueue(feed.id)" 
                        :publishedCount="this.countOutboundQueue(feed.id)" 
                        :class="this.selectedFeedId === feed.id ? 'selected-feed' : ''"
                        :disabled="disabled || inTransit" 
                        :theme="theme" 
                        @click.stop="this.setSelectedFeedId(feed.id)" 
                        @rssAtomUrlQuickAdd="rssAtomUrlQuickAdd" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-slot:toolbar>
                <!-- new queue button -->
                <button class="header-button" @click.stop="newFeed()" accesskey="n" :disabled="disabled || inTransit">
                  <i class="underline">N</i>ew Queue
                </button>
                <!-- upload OPML button -->
                <button class="header-button" @click.stop="uploadOpml()" accesskey="m" :disabled="disabled || inTransit">
                  Upload OP<i class="underline">M</i>L
                </button>
              </template>
          </ViewHeader>
        </div>
        <button v-if="this.selectedFeedId" class="toggle-feed-select-view" @click="this.showFeedSelectView = !this.showFeedSelectView" />
        <!-- right side -->
        <div :class="{ 'staging-header-view-selected': this.selectedFeedId, 'staging-header-view-collapsed': !this.showFeedSelectView }">
          <!-- inbound queue header -- hide when modal is showing -->
          <div id="staging-header-view" class="staging-header-view" :class="this.isModalShowing ? 'invisible' : ''" v-if="this.selectedFeedId">
            <ViewHeader :collapsible="true" @toggle="this.showFullInboundQueueHeader = !this.showFullInboundQueueHeader" :show="this.showFullInboundQueueHeader" :disabled="disabled || inTransit" :inTransit="inTransit" :theme="theme">
              <template v-slot:count>
                <span class="fa fa-gears fa-1x"/>
                {{ this.getFeedById(this.selectedFeedId).ident }}
              </template>
              <template v-slot:body>
                <!-- feed filter field -->
                <div class="article-queue" v-if="this.showFullInboundQueueHeader">
                  <!-- feed filter label -->
                  <label>ARTICLE QUEUE {{ '(' + this.filteredInboundQueue.length + ' ARTICLES MATCH, SHOWING PAGE ' + (this.currentPage + 1) + ' OF ' + this.totalPages + ')' }}</label>
                  <div class="feed-filter">
                    <!-- feed filter input -->
                    <input id="feed-filter" type="text" v-model="inboundQueueFilter" placeholder="Filter" :disabled="disabled || inTransit" />
                    <div class="feed-filter-buttons">
                      <!-- first page button-->
                      <button v-if="needsPagination()" title="first" class="feed-filter-button" @click="firstPage" :disabled="disabled || inTransit">
                        <span class="fa fa-angle-double-left"/>
                      </button>
                      <!-- previous page button -->
                      <button v-if="needsPagination()" title="previous" class="feed-filter-button" @click="previousPage" :disabled="disabled || inTransit">
                        <span class="fa fa-angle-left"/>
                      </button>
                      <!-- next page button -->
                      <button v-if="needsPagination()" title="next" class="feed-filter-button" @click="nextPage" :disabled="disabled || inTransit">
                        <span class="fa fa-angle-right"/>
                      </button>
                      <!-- last page button-->
                      <button v-if="needsPagination()" title="last" class="feed-filter-button" @click="lastPage" :disabled="disabled || inTransit">
                        <span class="fa fa-angle-double-right"/>
                      </button>
                      <!-- sort direction button -->
                      <button class="feed-filter-button" @click="toggleInboundQueueSortOrder()" :disabled="disabled || inTransit" aria-label="Toggle sort order">
                        <span :class="'fa fa-arrow-' + (inboundQueueSortOrder === 'ASC' ? 'up' : 'down')" />
                      </button>
                      <!-- refresh feed button -->
                      <button class="feed-filter-button" 
                        @click="refreshFeeds(false, null, false)"
                        :disabled="disabled || inTransit" 
                        aria-label="Refresh feeds">
                        <span class="fa fa-refresh"/>
                      </button>
                      <!-- queue config button -->
                      <button class="feed-filter-button" 
                        @click.stop="this.configureFeed(this.selectedFeedId)" 
                        :disabled="disabled || inTransit" 
                        title="Configure this feed">
                        <span class="fa fa-wrench"></span>
                      </button>
                      <!-- mark as read button -->
                      <button class="feed-filter-button"
                        @click.stop="this.markFeedAsRead(this.selectedFeedId)"
                        :disabled="disabled || inTransit"
                        title="Mark this queue as read">
                        <span class="fa fa-eye"></span>
                      </button>
                      <!-- delete queue button -->
                      <button class="feed-filter-button" 
                        @click.stop="this.deleteFeed(this.selectedFeedId)" 
                        :disabled="disabled || inTransit" 
                        title="Delete this feed">
                        <span class="fa fa-trash"></span>
                      </button>
                      <!-- show feed filter pills button -->
                      <button class="feed-filter-button" 
                        @click="this.showFeedFilterPills = !this.showFeedFilterPills"
                        :disabled="disabled || inTransit" 
                        aria-label="Show filter options">
                        <span class="fa fa-eye"/>
                      </button>
                    </div>
                  </div>
                </div>
                <!-- feed filter pills -->
                <div class="feed-filter-pills pill-container" v-if="this.showFeedFilterPills && this.showFullInboundQueueHeader">
                  <!-- post status filter pills -->
                  <button class="br-pill" :class="{ selectedMode: lcSetContainsStr('UNREAD', this.feedFilterModes) }" 
                    @click="toggleFeedFilterMode('UNREAD')"
                    :disabled="disabled || inTransit">
                      UNREAD
                  </button>
                  <button class="br-pill" :class="{ selectedMode: lcSetContainsStr('READ_LATER', this.feedFilterModes) }" 
                    @click="toggleFeedFilterMode('READ_LATER')"
                    :disabled="disabled || inTransit">
                      READ-LATER
                  </button>
                  <button class="br-pill" :class="{ selectedMode: lcSetContainsStr('READ', this.feedFilterModes) }" 
                    @click="toggleFeedFilterMode('READ')"
                    :disabled="disabled || inTransit">
                      READ
                  </button>
                  <button class="br-pill" :class="{ selectedMode: lcSetContainsStr('PUBLISHED', this.feedFilterModes) }" 
                    @click="toggleFeedFilterMode('PUBLISHED')"
                    :disabled="disabled || inTransit">
                      STARRED
                  </button>
                </div>
                <!-- post subscription filter pills -->
                <div class="feed-filter-pills pill-container" v-if="this.showFeedFilterPills && this.showFullInboundQueueHeader && this.allPostSubscriptions.length > 1">
                  SUBSCRIPTIONS:
                  <button v-for="subscription of this.allPostSubscriptions" :key="subscription"
                    class="br-pill" :class="{ selectedMode: lcSetContainsStr(subscription, this.selectedFeedFilterSubscriptions)}" 
                    @click="toggleFeedFilterSubscription(subscription)"
                    :disabled="disabled || inTransit">
                      {{ subscription }}
                  </button>
                </div>
                <!-- post category filter pills -->
                <div class="feed-filter-pills pill-container" v-if="this.showFeedFilterPills && this.showFullInboundQueueHeader && this.allPostCategories.length > 1">
                  CATEGORIES: 
                  <button v-for="category of this.allPostCategories" :key="category"
                    class="br-pill" :class="{ selectedMode: lcSetContainsStr(category, this.selectedFeedFilterCategories)}"
                    @click="toggleFeedFilterCategory(category)"
                    :disabled="disabled || inTransit">
                      {{ category }}
                  </button>
                </div>
                <!-- post feed audio controller -->
                <PostFeedAudio ref="postFeedAudio" />
              </template>
            </ViewHeader>
          </div>
          <!-- inbound queue -- hide when modal is showing -->
          <div class="staging-view" :class="this.isModalShowing ? 'invisible' : ''" v-if="this.selectedFeedId">
            <div>
              <PostItem v-for="post in this.getCurrentPage(filteredInboundQueue)" :key="post.id" :post="post"
                :id="'post_' + post.id"
                :ref="'post_' + post.id"
                :disabled="disabled || inTransit"
                :theme="theme" 
                :baseUrl="baseUrl"
                :isSelected="this.selectedPostId === post.id"
                tabindex="0"
                @keypress.self="setSelectedPost($event, post.id)"
                @click.prevent="setSelectedPost($event, post.id)"
                @setActive="setSelectedPost($event, post.id, false)" 
                @openPostUrl="openPostUrl(post.id)"
                @updatePostReadStatus="updatePostReadStatus"
                @updatePostPubStatus="updatePostPubStatus" 
                @updateFilter="updatePostFeedFilter" 
                @playing="onMediaPlaying" 
                @audioPlay="onAudioPlay" />
            </div>
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
import ConfirmationDialog from '../layout/ConfirmationDialog.vue';
// feed configuration panel 
import FeedConfigPanel from "./feed/FeedConfigPanel.vue";
// OPML upload panel 
import OpmlUploadPanel from "./opml/OpmlUploadPanel.vue";
// help panel 
import HelpPanel from "./help/HelpPanel.vue";
// navbar 
import NavbarFixedHeader from "@/components/layout/NavbarFixedHeader.vue";
import ControlPanel from "@/components/layout/ControlPanel.vue";
// post item panel 
import ViewHeader from "@/components/layout/ViewHeader.vue";
// pospt feed media player 
import PostFeedAudio from '@/components/post/PostFeedAudio.vue';
// post item 
import PostItem from "./PostItem.vue";
// feed selector 
import FeedSelectButton from './FeedSelectButton.vue';

export default {
  components: { 
    ConfirmationDialog,
    FeedConfigPanel,
    OpmlUploadPanel,
    HelpPanel,
    NavbarFixedHeader,
    ControlPanel, 
    PostFeedAudio,
    ViewHeader,
    PostItem, 
    FeedSelectButton,
  },
  name: "PostFeed",
  props: [ "baseUrl", "disabled", "theme" ],
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
          // check mode 
          let modeMatches = false;
          if (this.feedFilterModes.length === 0) {
            modeMatches = true;
          } else {
            if (this.lcSetContainsStr('PUBLISHED', this.feedFilterModes)) {
              modeMatches = post.isPublished;
            }
            if (!modeMatches && this.lcSetContainsStr('UNREAD', this.feedFilterModes)) {
              modeMatches = !post.isRead;
            }
            if (!modeMatches) {
              modeMatches = this.lcSetContainsStr(post.postReadStatus, this.feedFilterModes) || 
                this.lcSetContainsStr(post.postPubStatus, this.feedFilterModes);
            }
          }
          if (!modeMatches) {
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
          } else {
            categoriesMatch = true;
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
          "label": t[i].title,
          "value": t[i].ident,
          "description": t[i].description,
          "title": t[i].title,
          "id": t[i].id,
          "imgSrc": t[i].feedImgSrc,
          "feedStatus": t[i].feedStatus,
          "lastDeployed": t[i].lastDeployed,
          "newsApiV2QueryText": t[i].newsApiV2QueryText,
          "rssAtomFeedUrls": t[i].rssAtomFeedUrls,
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
      let subscriptions = new Set();
      let f = this.inboundQueue;
      for (let i = 0; i < f.length; i++) {
        subscriptions.add(f[i].importerDesc);
      }
      return Array.from(subscriptions);
    },
    isModalShowing: function() {
      return (this.feedIdToDelete || this.feedIdToMarkAsRead || this.showFeedConfigPanel || this.showOpmlUploadPanel || this.showHelpPanel);
    }
  },
  data() {
    return {
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
      feedFilterModes: ['UNREAD', 'READ', 'PUBLISHED'], // currently selected filter modes 
      selectedFeedFilterSubscriptions: [],
      selectedFeedFilterCategories: [],
      // queue sorting material 
      inboundQueueSortOrder: 'DSC',
      // NewsApiV2 material 
      allNewsApiV2Sources: null,
      allNewsApiV2Countries: null,
      allNewsApiV2Categories: null,
      allNewsApiV2Languages: null,
      // RSS/ATOM feed catalog 
      rssAtomFeedCatalog: null,
    };
  },
  methods: {
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
      let startIdx = this.currentPage * this.itemsPerPage;
      let endIdx = startIdx + this.itemsPerPage;
      return items.slice(startIdx, endIdx);
    },
    firstPage() {
      this.currentPage = 0; 
      let newFirstItem = this.getCurrentPage(this.filteredInboundQueue)[0];
      this.$nextTick(() => {
        this.setSelectedPost(null, newFirstItem.id);
      });
    },
    nextPage() {
      let n = this.currentPage + 1;
      if (n === this.totalPages) {
        n -= 1;
      }
      this.currentPage = n;
      let newFirstItem = this.getCurrentPage(this.filteredInboundQueue)[0];
      this.$nextTick(() => {
        this.setSelectedPost(null, newFirstItem.id);
      });
    },
    previousPage() {
      let p = this.currentPage - 1;
      if (p < 0) {
        p = 0;
      }
      this.currentPage = p;
      let newFirstItem = this.getCurrentPage(this.filteredInboundQueue)[0];
      this.$nextTick(() => {
        this.setSelectedPost(null, newFirstItem.id);
      });
    },
    lastPage() {
      this.currentPage = this.totalPages - 1;
      let newFirstItem = this.getCurrentPage(this.filteredInboundQueue)[0];
      this.$nextTick(() => {
        this.setSelectedPost(null, newFirstItem.id);
      });
    },
    // 
    // server error 
    // 
    handleServerError(error) {
      console.error(error);
      if (error.name === 'TypeError') {
        this.setLastServerMessage('Something went wrong.  Please try again later.');
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
      // article w/more recent publsihed timestamp goes before article w/older timestamp 
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
              throw Error("Refresh failed due to: HTTP " + response.status + ": " + (response.statusText ? response.statusText : "(no message)"));
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
                throw Error("Fetch failed due to: HTTP " + response.status + ": " + (response.statusText ? response.statusText : "(no message)"));
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
                let qd = queryDefinitionData[fd.id];
                this.decorateFeedWithQueryDefinitions(fd, qd, data.queryMetrics);
                // parse feed definition export config (if present) 
                fd.exportConfig = fd.exportConfig ? JSON.parse(fd.exportConfig) : fd.exportConfig;
                // add this feed definition to feeds
                console.log("post-feed: adding fd=" + fd.ident);
                this.feeds.push(fd);
              }
              // 
              this.allNewsApiV2Sources = data.allNewsApiV2Sources;
              this.allNewsApiV2Countries = data.allNewsApiV2Countries;
              this.allNewsApiV2Categories = data.allNewsApiV2Categories;
              this.allNewsApiV2Languages = data.allNewsApiV2Languages;
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
          this.inboundQueue = this.inboundQueuesByFeed[this.selectedFeedId];
          if (!hideStatus) {
            // this.setLastServerMessage("Refreshed " + this.feeds.length + " feeds.");
          }
          this.inTransit = false; // end of refreshFeeds 
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.inTransit = false;
      });
    },
    decorateFeedWithQueryDefinitions(fd, qd, qm) {
      // 
      fd.newsApiV2QueryText = '';
      fd.newsApiV2Sources = '';
      fd.newsApiV2Language = '';
      fd.newsApiV2Country = '';
      fd.newsApiV2Category = '';
      fd.rssAtomFeedUrls = [];
      // 
      if (qd) {
        for (let i = 0; i < qd.length; i++) {
          let queryType = qd[i].queryType;
          if (queryType === 'NEWSAPIV2_HEADLINES') {
            let queryConfig = qd[i].queryConfig ? JSON.parse(qd[i].queryConfig) : null;
            fd.newsApiV2QueryText = qd[i].queryText;
            fd.newsApiV2QueryMetrics = qm[qd[i].id];
            fd.newsApiV2Sources = queryConfig ? queryConfig.sources : null;
            fd.newsApiV2Language = queryConfig ? queryConfig.language : null;
            fd.newsApiV2Country = queryConfig ? queryConfig.country : null;
            fd.newsApiV2Category = queryConfig ? queryConfig.category : null;
          } else if (queryType === 'RSS' || queryType === 'ATOM') {
            fd.rssAtomFeedUrls.push({
              "id": qd[i].id,
              "feedMetrics": qm[qd[i].id],
              "feedTitle": qd[i].queryTitle,
              "feedUrl": qd[i].queryText,
            });
          }
        }
      }
    },
    // 
    // post status 
    //
    starSelectedPost() {
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
    markSelectedPostAsRead() {
      let p = this.getPostFromQueue(this.selectedPostId);
      let newStatus;
      if (p.postStatus !== 'READ') {
        console.log("post-item: marking post id=" + p.id + " as read");
        newStatus = 'READ';
      } else {
        console.log("post-item: unmarking post id=" + p.id + " as read");
        newStatus = 'UNREAD';
      }
      this.updatePostReadStatus({ 
            id: p.id, 
            newStatus: newStatus, 
            originator: "togglePostReadStatus"
          });
    },
    updatePostReadStatus(result) {
      console.log("post-feed: updating post status, statusObj=" + JSON.stringify(result));
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
    updatePostPubStatus(result) {
      console.log("post-feed: updating post status, statusObj=" + JSON.stringify(result));
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
      this.$refs.feedConfigPanel.setup({ rssAtomFeedUrls: [{ id: 1, }] });
    },
    uploadOpml() {
      document.activeElement.blur();
      this.showOpmlUploadPanel = true;
      this.$refs.opmlUploadPanel.show();
    },
    validateFeed(feed) {
      if (this.len(feed.ident) > 2048) {
        throw Error("Feed identifier is too long (max 2048 characters).");
      }
      if (this.len(feed.title) > 2048) {
        throw Error("Feed title is too long (max 2048 characters).");
      }
      if (this.len(feed.generator) > 2048) {
        throw Error("Feed generator is too long (max 2048 characters).");
      }
      if (this.len(feed.newsApiV2QueryText) > 2048) {
        throw Error("NewsAPIV2 query text is too long (max 2048 characters).");
      }
      if (feed.rssAtomFeedUrls) {
        for (let i = 0; i < feed.rssAtomFeedUrls.length; i++) {
          if (this.len(feed.rssAtomFeedUrls[i].url) > 2048) {
            throw Error("RSS/ATOM feed URL is too long (max 2048 characters).");
          }
        }
      }
      if (feed.exportConfig) {
        if (this.len(feed.exportConfig.mdTemplate) > 2048) {
          throw Error('');
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
          this.setLastServerMessage("Created " + feeds.length + " feeds");
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
      this.$refs.opmlUploadPanel.hide();
      this.showOpmlUploadPanel = false;
    },
    configureFeed(feedId) {
      document.activeElement.blur();
      this.$refs.feedConfigPanel.setup(this.getFeedById(feedId));
      this.showFeedConfigPanel = true;
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
      console.log("post-feed: pushing updated feed to remote, feed=" + JSON.stringify(feed));
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
                this.setLastServerMessage("Updated feed '" + feed.ident + "'");
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
            this.setLastServerMessage("Created feed '" + f.ident + "'");
            this.setSelectedFeedId(f.id);
            this.refreshFeeds(true, [f.id], false); // TODO: this is wrong, the refresh should be returned from the create call 
          }
        })
        .catch((error) => {
          // push the error to the modal since this method is only called by an emission from the modal, and we don't close the modal in this path 
          // this.$refs.feedConfigPanel.error(error);
          this.handleServerError(error); 
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        // push the error to the modal since this method is only called by an emission from the modal, and we don't close the modal in this path 
        // this.$refs.feedConfigPanel.error(error);
        this.handleServerError(error); 
        this.inTransit = false;
      });
    },
    cancelCreateOrUpdateFeed() {
      this.$refs.feedConfigPanel.tearDown();
      this.showFeedConfigPanel = false;
    },
    // 
    // RSS/ATOM URL quick add 
    // 
    rssAtomUrlQuickAdd(feedId) {
      document.activeElement.blur();
      this.$refs.feedConfigPanel.setupQuickAdd(this.getFeedById(feedId));
      this.showFeedConfigPanel = true;
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
    setSelectedPost($event, postId, doFocus) {
      if ($event && ($event.target.classList.contains('plyr__control') || $event.target.classList.contains('audio-player-control')))  {
        return;
      }
      doFocus = doFocus === undefined ? true : doFocus;
      let r = this.$refs['post_' + postId];
      if (!r || r.length === 0) {
        console.debug("requested post is not on this page");
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
        if (!this.isModalShowing && !this.$refs.controlPanel.showSettingsPanel) {
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
      if (this.isModalShowing || this.$refs.controlPanel.showSettingsPanel) {
        return;
      }
      // handle post-related key events 
      if (this.selectedPostId) {
        let t = event.target.getAttribute("type") || event.target.type;
        if (t === 'text' || t === 'submit') {
          return;
        }
        if (event.key === 'ArrowDown') {
          let currentPostIdx = this.getCurrentPostIdx();
          if (currentPostIdx < this.filteredInboundQueue.length - 1) {
            let nextPostId = this.filteredInboundQueue[currentPostIdx + 1].id;
            this.setSelectedPost(null, nextPostId);
            event.stopPropagation();
            event.preventDefault();
          }
        } else if (event.key === 'ArrowUp') {
          let currentPostIdx = this.getCurrentPostIdx();
          if (currentPostIdx > 0) {
            let nextPostId = this.filteredInboundQueue[currentPostIdx - 1].id;
            this.setSelectedPost(null, nextPostId);
            event.stopPropagation();
            event.preventDefault();
          }
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
        } else if (event.key === 'PageUp') {
          this.previousPage();
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'PageDown') {
          this.nextPage();
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 's') {
          this.starSelectedPost();
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'm') {
          this.markSelectedPostAsRead();
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
        if (t === 'text' || t === 'submit') {
          return;
        }
        if (event.key === 'E' && event.shiftKey === true) {
          this.configureFeed(this.selectedFeedId);
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'S' && event.shiftKey === true) {
          this.rssAtomUrlQuickAdd(this.selectedFeedId);
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
        this.refreshFeeds(false, null, false);
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
    }
  }
};
</script>

<style scoped>
.post-feed-container {
}

.post-feed-container-inner-selected {
  display: inline-flex;
}

.post-feed-container-inner {
  width: stretch;
}

.header-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  margin-top: .75rem;
  margin-right: .75rem;
  text-align: center;
  user-select: none;
  min-width: 3rem;
  min-height: 3rem;
}

.header-button:hover, .header-button:focus {
  background-color: v-bind('theme.buttonhighlight');
}

.header-button:disabled {
  cursor: auto;
}

.header-button:disabled:hover {
  background-color: unset;
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

.toggle-feed-select-view:hover, .toggle-feed-select-view:focus {
  background-color: v-bind('theme.buttonhighlight');
}

.feed-select-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  display: flex;
  flex-direction: column;
  width: 100%;
}

.staging-header-view-selected {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  min-width: 70vw;
  max-width: 70vw;
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

.article-queue {
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 0px 0px 4px 4px;
  padding-top: .75rem;
  padding-bottom: .75rem;
  border-top: 0px;

  text-align: left;
  display: flex;
  flex-direction: column;
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

.collapsible {
  display: inline-flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
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

.feed-filter {
  text-align: left;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: flex-end;
  margin-top: .125rem;
  resize: none;
}

.feed-filter input {
  padding: .31rem;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px 0px 0px 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  width: 100%;
}

.feed-filter input:hover, .feed-filter > input:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-filter > input:disabled {
  cursor: auto;
}

.feed-filter-buttons {
  padding-top: .75rem;
  display: flex;
  flex-wrap: wrap;
  row-gap: .5rem;
}

.feed-filter-button {
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.feed-filter-button:hover, .feed-filter-button:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-filter-button:disabled {
  cursor: auto;
}

.feed-filter-button:hover:disabled {
  background-color: unset;
}

.feed-filter-button:last-child {
  border-radius: 0px 3px 3px 0px;
}

.feed-filter-pills {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-bottom: .75rem;
  justify-content: flex-start;
  align-items: center;
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-wrap: wrap;
  gap: .31rem;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: .31rem;
  user-select: none;
  min-width: 3rem;
  min-height: 3rem;
}

.br-pill:hover, .br-pill:focus {
  border: 1px solid v-bind('theme.buttonborder');
}

.selectedMode {
  color: v-bind('theme.buttonfg');
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.buttonhighlight') !important;
}

.invisible {
  visibility: hidden;
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

@media (max-width: 1023px) {
  .staging-header-view-selected, .staging-header-view-collapsed {
    border-top: unset;
    min-width: unset;
    max-width: unset;
  }

  .post-feed-container-inner-selected {
    display: unset;
  }
}

@media (min-width: 1023px) {
  .feed-select-view-selected {
    width: 30vw;
  }

  .feed-select-view-collapsed {
    display: none;
  }

  .invisible {
    display: unset;
  }
}
</style>
