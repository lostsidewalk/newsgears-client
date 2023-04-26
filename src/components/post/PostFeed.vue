<template>
  <div class="post-feed-container" id="post-feed-container" v-show="this.$auth.$isAuthenticated">
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
    <ControlPanel :baseUrl="baseUrl" 
      ref="controlPanel"
      :disabled="disabled || inTransit || isModalShowing" 
      :theme="theme" 
      @updateServerMessage="setLastServerMessage" 
      @toggleDistractions="toggleDistractions" />
    <NavbarFixedHeader :theme="theme" :inTransit="false" />
    <div>
      <div class="post-feed-container-inner" :class="this.selectedFeedId ? 'post-feed-container-inner-selected' : ''">
        <!-- left side, feed selector -- hide when modal is showing -->
        <button class="show-queue-dashboard-button accessible-button" 
          v-if="!this.showQueueDashboard && this.windowWidth >= 1024" 
          :disabled="isModalShowing"
          @click="this.showQueueDashboard = true">
          <span class="fa fa-expand fa-1x" />
        </button>
        <div class="feed-select-view" :class="{ 
          'feed-select-view-selected': this.selectedFeedId, 
          'feed-select-view-collapsed': !this.showQueueDashboard
        }">
          <ViewHeader 
            :sticky="true" 
            :collapsible="true" 
            :show="this.showQueueDashboard" 
            :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel" 
            :inTransit="inTransit" 
            :theme="theme"
            @toggle="{
                this.showQueueDashboard = !this.showQueueDashboard;
              }">
              <template v-slot:count>
                <span class="fa fa-feed fa-1x"/>
                {{ this.$t('queueDashboard') }}
              </template>
              <template v-slot:body>
                <div v-if="this.showQueueDashboard" class="queue-dashboard">
                  <FeedDashboardButtons v-if="this.showQueueDashboard"
                    :selectedFeedId="this.selectedFeedId" 
                    :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel"
                    :theme="theme" 
                    @rssAtomUrlQuickAdd="rssAtomUrlQuickAdd" 
                    @newFeed="newFeed"
                    @uploadOpml="uploadOpml" /> 
                  <div v-if="this.filteredFeedIdentOptions.length > 0" class="feed-selectors">
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
                      <div class="feed-info-labels">
                        <!-- manage subscriptions -->
                        <a class="feed-info-label-small link"
                          @click.stop="this.configureFeed(feed.id)"
                          @keypress.enter.prevent="this.configureFeed(feed.id)"
                          tabindex="0"
                          :class="{ 'link-disabled': disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel }">
                          {{ feed.rssAtomFeedUrls && feed.rssAtomFeedUrls.length > 0 ? this.$t('manageSubscriptions') : this.$t('addSubscriptions')}}
                        </a>
                        <!-- more information -->
                        <a class="feed-info-label-small link" 
                          v-if="feed.rssAtomFeedUrls && feed.rssAtomFeedUrls.length > 0"
                          @click.stop="this.toggleFeedShowMoreInformation(feed.id)" 
                          @keypress.enter.prevent="this.toggleFeedShowMoreInformation(feed.id)" 
                          tabindex="0">
                          {{ this.getFeedById(feed.id).showMoreInformation ? this.$t('hideMoreInfo') : this.$t('showMoreInfo') }}
                        </a>
                      </div>
                      <FeedDetails 
                        v-if="this.getFeedById(feed.id).showMoreInformation"
                        :rssAtomFeedUrls="feed.rssAtomFeedUrls" 
                        :jsonPubUrl="this.feedUrl + '/feed/json/' + feed.transportIdent" 
                        :rssPubUrl="this.feedUrl + '/feed/rss/' + feed.transportIdent" 
                        :atomPubUrl="this.feedUrl + '/feed/atom/' + feed.transportIdent" 
                        :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel" 
                        :theme="theme" 
                        @updatePostFeedFilter="selectFeedAndUpdateFilter" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-slot:toolbar>
              </template>
          </ViewHeader>
        </div>
        <!-- right side -->
        <div :class="{ 'staging-header-view-selected': this.selectedFeedId, 'staging-header-view-collapsed': !this.showQueueDashboard }">
          <!-- inbound queue header -- hide when modal is showing -->
          <div id="staging-header-view" class="staging-header-view" v-if="this.selectedFeedId && !this.showFeedConfigPanel && !this.showOpmlUploadPanel">
            <ViewHeader :collapsible="true" 
              @toggle="this.showFullInboundQueueHeader = !this.showFullInboundQueueHeader" 
              :show="this.showFullInboundQueueHeader" 
              :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel" 
              :inTransit="false" 
              :theme="theme">
              <template v-slot:count>
                {{ this.getFeedById(this.selectedFeedId).title }}
              </template>
              <template v-slot:body>
                <!-- feed filter expression -->
                <div class="filter-expression-container">
                  <!-- TODO: interpolated string -->
                  <div class="filter-expression" v-auto-animate>
                    {{ this.$t('viewingColon')}} <span class="filter-mode-expression">{{ this.filterModeExpression }}</span> articles in 
                    <span class="filter-subscriptions-expression">{{ this.filterSubscriptionsExpression }}</span>
                    <span v-show="this.selectedFeedFilterCategories.length > 0"> with categories in: 
                      <span class="filter-categories-expression">{{ this.selectedFeedFilterCategories.join(', ') }}</span>
                    </span>
                  </div>
                </div>
                <!-- feed filter field -->
                <FeedFilter v-if="this.showFullInboundQueueHeader" 
                  @toggleSortOrder="toggleInboundQueueSortOrder"
                  @toggleAllPostDetails="toggleInboundQueuePostDetails"
                  @refreshFeeds="this.refreshFeeds(null, true)"
                  @markAsRead="this.markFeedAsRead(this.selectedFeedId)"
                  @toggleFeedFilterPills="this.showFeedFilterPills = !this.showFeedFilterPills"
                  @update:modelValue="this.inboundQueueFilter = $event"
                  :inboundQueueFilter="this.inboundQueueFilter"
                  :inboundQueueSortOrder="this.inboundQueueSortOrder"
                  :queueLength="this.filteredInboundQueue.length"
                  :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel" 
                  :theme="theme" />
                <!-- feed filter pills -->
                <FeedFilterPills v-show="this.showFeedFilterPills && this.showFullInboundQueueHeader" 
                  @resetFilterDefaults="resetFilterDefaults"
                  :allFilterPills="allFilterPills"
                  :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel"
                  :theme="theme" />
                <!-- post feed audio controller -->
                <PostFeedAudio ref="postFeedAudio" />
              </template>
            </ViewHeader>
          </div>
          <!-- inbound queue -- hide when modal is showing -->
          <div class="staging-view" v-if="this.selectedFeedId && !this.showFeedConfigPanel && !this.showOpmlUploadPanel">
            <div :class="{ 'post-grid': this.layoutMode === 'GRID', 'post-table': this.layoutMode === 'TABLE' }">
              <PostItem v-for="post in this.getCurrentPage(filteredInboundQueue)" :key="post.id" 
                :post="post"
                :id="'post_' + post.id"
                :ref="'post_' + post.id"
                :disabled="disabled || inTransit || isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel"
                :theme="theme" 
                :baseUrl="baseUrl"
                :isSelected="this.selectedPostId === post.id"
                :enableFilterBySubscription="this.allPostSubscriptions.length > 1" 
                :compact="this.layoutMode === 'TABLE'"
                tabindex="0"
                @keypress.self="isModalShowing ? false : setSelectedPost($event, post.id)"
                @click="isModalShowing ? false : setSelectedPost($event, post.id)"
                @setActive="setSelectedPost($event, post.id, false)" 
                @showPostDetails="post.showPostDetails = true"
                @togglePostDetails="post.showPostDetails = !post.showPostDetails"
                @openPostUrl="openPostUrl(post.id)"
                @updatePostReadStatus="setPostReadStatus"
                @updatePostPubStatus="updatePostPubStatus" 
                @updatePostFeedFilter="updatePostFeedFilter" 
                @playing="onMediaPlaying" 
                @audioPlay="onAudioPlay" 
                @goToNextPost="goToNextPost(post.id)" 
                @goToPreviousPost="goToPreviousPost(post.id)" />
              <div v-if="this.totalPages === 0" class="queue-message">
                {{ this.$t('noArticlesInQueue') }}
              </div>  
              <div v-if="this.currentPage + 1 == this.totalPages" class="queue-message">
                {{ this.$t('endOfQueueReached') }}
              </div>
              <div v-if="this.currentPage + 1 < this.totalPages" class="queue-message">
                <button class="click-for-more-button" @click.stop="this.nextPage(false)">
                  {{ this.$t('clickToLoadMore') }}
                </button>
              </div>
            </div>
          </div>
          <div class="staging-header-view" v-if="this.showFeedConfigPanel || this.showOpmlUploadPanel" v-auto-animate>
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
                  @dismiss="dismissCreateOrUpdateFeed"
                  @authError="handleServerError" 
                  @updateServerMessage="setLastServerMessage" 
                  @refreshFeedDefinition="$event => this.refreshFeeds([$event], true)" />
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
import lunr from 'lunr';
// confirmation modal dialog 
import ConfirmationDialog from '@/components/layout/ConfirmationDialog.vue';
// feed configuration panel 
import FeedConfigPanel from "./feed/FeedConfigPanel.vue";
// OPML upload panel 
import OpmlUploadPanel from "./opml/OpmlUploadPanel.vue";
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
import FeedDetails from './dashboard/FeedDetails.vue';
import FeedDashboardButtons from './dashboard/FeedDashboardButtons.vue';

export default {
  components: { 
    // modal 
    ConfirmationDialog,
    FeedConfigPanel,
    OpmlUploadPanel,
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
    FeedDetails,
    FeedDashboardButtons,
  },
  name: "PostFeed",
  props: [ "baseUrl", "feedUrl", "disabled", "theme" ],
  emits: [ "updateServerMessage" ],
  watch: {
    '$auth.$isAuthenticated' (isAuthenticated) {
      if (isAuthenticated) {
        this.refreshFeeds(null, true); // need staging posts for all feeds and feed definitions 
      }
    }
  },
  mounted() {
    window.addEventListener("keydown", this.eventHandler);
    if (this.$auth.$isAuthenticated) {
        this.refreshFeeds(null, true); // need staging posts for all feeds and feed definitions 
    }
    // window.onwheel = this.wheelHandler;
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
    // 
    totalPages: function() {
      let t = Math.ceil(this.filteredInboundQueue.length / this.itemsPerPage);
      return t;
    },
    filteredInboundQueue: function() {
      if (this.inboundQueue) {
        let unfilteredResults = null;
        // lunr 
        let lcFilter = this.inboundQueueFilter ? this.inboundQueueFilter.toLowerCase() : null;
        if (lcFilter) {
          let lunrResults = this.inboundQueue.index.search(lcFilter)
            .map(item => parseInt(item.ref));
          if (lunrResults.length > 0) {
            unfilteredResults = this.inboundQueue.values.filter(item => {
              return lunrResults.includes(item.id);
            });
          }
        } else {
          unfilteredResults = this.inboundQueue.values;
        }
        // 
        let filtered = unfilteredResults ? unfilteredResults.filter((post) => {
          // check the mode (i.e., post status) 
          if (!this.modeMatches(post)) {
            return false;
          }
          // check the subscription (query Id) against the filter subscriptions (if any) 
          let subscriptionMatches = false;
          if (this.selectedFeedFilterSubscriptions.length === 0) {
            subscriptionMatches = true;
          } else {
            if (this.selectedFeedFilterSubscriptions) {
              for (let i = 0; i < this.selectedFeedFilterSubscriptions.length; i++) {
                let r = this.selectedFeedFilterSubscriptions[i];
                if (post.queryId === r.id) {
                  subscriptionMatches = true;
                  break;
                }
              }
            } else {
              subscriptionMatches = false;
            }
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

          return true;
        }) : null;
        // 
        // sort the filtered result 
        // 
        if (filtered) {
          this.sortQueue(filtered, this.inboundQueueSortOrder);
        }
        // 
        // return the final result 
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
    allPostCategories: function () {
      let categories = new Set();
      if (this.inboundQueue) {
        let f = this.inboundQueue.values;
        for (let i = 0; i < f.length; i++) {
          if (f[i].postCategories) {
            f[i].postCategories.forEach((c) => categories.add(c));
          }
        }
      }
      return Array.from(categories);
    },
    allPostSubscriptions: function() {
      let subscriptions = new Set();
      let r = this.getSelectedFeed().rssAtomFeedUrls;
      if (r) {
        for (let i = 0; i < r.length; i++) {
          subscriptions.add(r[i]);
        }
      }
      return Array.from(subscriptions);
    },
    // 
    filterModeExpression: function() {
      let selectedMode = null;
      for (let i = 0; i < 4; i++) {
        if (this.allFilterPills[i].isSelected) {
          selectedMode = this.allFilterPills[i].label;
          break;
        }
      }
      return selectedMode;
    },
    filterSubscriptionsExpression() {
      let subscriptionNames = [];
      if (this.allPostSubscriptions.length === 1) {
        let t = this.allPostSubscriptions[0].title;
        if (t) {
          subscriptionNames.push(t.value);
        }
      } else if (this.selectedFeedFilterSubscriptions.length > 0) {
        for (let i = 0; i < this.selectedFeedFilterSubscriptions.length; i++) {
          let t = this.selectedFeedFilterSubscriptions[i].title;
          if (t) {
            subscriptionNames.push(t.value);
          }
        }
      } else {
        subscriptionNames.push(this.$t('allSubscriptions'));
      }
      return (subscriptionNames.length > 0 ? (subscriptionNames.join(', ')) : '');
    },
    allFilterPills: function() {
      let filterPills = [
        {
          isSelected: this.lcSetContainsStr('UNREAD', this.feedFilterModes),
          invoke: () => this.toggleFeedFilterMode('UNREAD'), 
          label: this.$t('unread'),
        },
        {
          isSelected: this.lcSetContainsStr('READ_LATER', this.feedFilterModes),
          invoke: () => this.toggleFeedFilterMode('READ_LATER'), 
          label: this.$t('readLater'),
        },
        {
          isSelected: this.lcSetContainsStr('READ', this.feedFilterModes),
          invoke: () => this.toggleFeedFilterMode('READ'), 
          label: this.$t('read'),
        },
        {
          isSelected: this.lcSetContainsStr('PUBLISHED', this.feedFilterModes),
          invoke: () => this.toggleFeedFilterMode('PUBLISHED'), 
          label: this.$t('starred'),
        },
      ];
      if (this.allPostSubscriptions.length > 1) {
        for (let i = 0; i < this.allPostSubscriptions.length; i++) {
          let subscription = this.allPostSubscriptions[i];
          let subscriptionLabel = null;
          let title = subscription.title;
          if (title) {
            subscriptionLabel = title.value;
          } else {
            subscriptionLabel = subscription.feedUrl;
          }
          filterPills.push({
            isSelected: this.setContains(subscription, this.selectedFeedFilterSubscriptions),
            invoke: () => this.toggleFeedFilterSubscription(subscription),
            label: subscriptionLabel,
            image: subscription.feedImageUrl, 
          });
        }
      }
      if (this.allPostCategories.length > 0) {
        for (let i = 0; i < this.allPostCategories.length; i++) {
          let category = this.allPostCategories[i];
          filterPills.push({
            isSelected: this.lcSetContainsStr(category, this.selectedFeedFilterCategories),
            invoke: () => this.toggleFeedFilterCategory(category),
            label: category 
          });
        }
      }

      return filterPills;
    },
    isModalShowing: function() {
      return (this.feedIdToDelete !== null || this.feedIdToMarkAsRead !== null || this.showHelpPanel);
    },
    postGridTemplate: function() {
      return this.$theme.postGridTemplate;
    },
    layoutMode: function() {
      return this.$theme.layoutMode;
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
      queryDefinitionImagesById: {}, // all query definition images (by Id)
      selectedFeedId: null, // currently selected feed Id 
      previousFeedId: null, // previously selected feed Id 
      selectedPostId: null, // currently selected post Id 
      // queue material 
      inboundQueuesByFeed: {}, // all queues 
      inboundQueue: { values: [] }, // inbound queue for the currently selected feed  
      // queue pagination material 
      itemsPerPage: 100,
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
    toggleFeedShowMoreInformation(feedId) {
      // 
      let f = this.getFeedById(feedId);
      if (f) {
        f.showMoreInformation = !f.showMoreInformation;
      }
    },
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
    getCurrentPostIdx() {
      return this.getPostIdx(this.selectedPostId);
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
    goToNextPost(postId) {
      let currentPostIdx = this.getPostIdx(postId);
      if (currentPostIdx < this.filteredInboundQueue.length - 1) {
        let nextPostId = this.filteredInboundQueue[currentPostIdx + 1].id;
        this.setSelectedPost(null, nextPostId);
      }
    },
    goToPreviousPost(postId) {
      let currentPostIdx = this.getPostIdx(postId);
      if (currentPostIdx > 0) {
        let nextPostId = this.filteredInboundQueue[currentPostIdx - 1].id;
        this.setSelectedPost(null, nextPostId);
      }
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
        this.$emit('updateServerMessage', { message: message });
      }
    },
    // 
    // toggle distractions (if queue dashboard if the full inbound queue are showing, collapse everything; otherwise show everything) 
    // 
    toggleDistractions() {
      if (this.showQueueDashboard || this.showFullInboundQueueHeader) {
        this.showQueueDashboard = false;
        this.showFullInboundQueueHeader = false;
      } else {
        this.showQueueDashboard = true;
        this.showFullInboundQueueHeader = true;
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
    toggleInboundQueueSortOrder() {
      if (this.inboundQueueSortOrder === 'DSC') {
        this.inboundQueueSortOrder = 'ASC';
      } else {
        this.inboundQueueSortOrder = 'DSC';
      }
      if (this.selectedPostId) {
      this.$nextTick(() => {
          let elem = document.getElementById('post_' + this.selectedPostId);
          window.scrollTo({
            behavior: 'smooth',
            top: elem.getBoundingClientRect().top - document.body.getBoundingClientRect().top - document.getElementById('staging-header-view').getBoundingClientRect().height - 10,
          });
        });
      }
    },
    toggleInboundQueuePostDetails() {
      let hasExpanded = false;
      let hasCollapsed = false;
      let doExpand = false;
      let f = this.inboundQueue.values;
      for (let j = 0; j < f.length; j++) {
        if (f[j].showPostDetails === true) {
          hasExpanded = true;
        } else {
          hasCollapsed = true;
        }
        if (hasExpanded && hasCollapsed) {
          doExpand = true;
          break;
        }
      }
      doExpand = doExpand ? doExpand : !hasExpanded;
      for (let j = 0; j < f.length; j++) {
        f[j].showPostDetails = doExpand;
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
      if (this.setContains(subscription, this.selectedFeedFilterSubscriptions)) {
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
    selectFeedAndUpdateFilter(f) {
      // 
      if (f.feed.feedId !== this.selectedFeedId) {
        this.setSelectedFeedId(f.feed.feedId);
        this.$nextTick(() => {
          this.setPostFeedFilterSubscription(f.value);
        })
      } else {
        this.setPostFeedFilterSubscription(f.value);
      }
    },
    setPostFeedFilterSubscription(subscriptionId) {
      let r = null;
      for (let i = 0; i < this.allPostSubscriptions.length; i++) {
        if (this.allPostSubscriptions[i].id === subscriptionId) {
          r = this.allPostSubscriptions[i];
          break;
        }
      }
      if (r) {
        if (this.selectedFeedFilterSubscriptions.indexOf(r) < 0) {
          this.selectedFeedFilterSubscriptions.splice(0);
          this.selectedFeedFilterSubscriptions.push(r);
          this.showFeedFilterPills = true;
        } 
      }
    },
    updatePostFeedFilter(f) {
      if (f.name === "subscriptionId") {
        let subscriptionId = f.value;
        let r = null;
        for (let i = 0; i < this.allPostSubscriptions.length; i++) {
          if (this.allPostSubscriptions[i].id === subscriptionId) {
            r = this.allPostSubscriptions[i];
            break;
          }
        }
        if (r) {
          if (this.selectedFeedFilterSubscriptions.indexOf(r) < 0) {
            this.selectedFeedFilterSubscriptions.push(r);
            this.showFeedFilterPills = true;
          } else {
            this.removeFilterFromSet(this.selectedFeedFilterSubscriptions, r);
          } 
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

      // let refreshPromises = [
      //   this.$web.get(this.baseUrl + "/staging" + (feedsToFetch ? ("?feedIds=" + feedsToFetch) : ''))
      //   .then((data) => {
      //     let ct = 0;
      //     let stagingPosts = data.stagingPosts;
      //     if (stagingPosts) {
      //       for (let i = 0; i < stagingPosts.length; i++) {
      //         let p = stagingPosts[i].post;
      //         p.isPublished = p.published || (p.postPubStatus === 'PUB_PENDING') || (p.postPubStatus === 'DEPUB_PENDING');
      //         p.isRead = p.postReadStatus === 'READ';
      //         p.isReadLater = p.postReadStatus === 'READ_LATER';
      //         p.postImgSrc = stagingPosts[i].postImgSrc;
      //         rawPosts.push(p);
      //         ct++;
      //       }
      //       this.stagingCt = ct;
      //       console.log("post-feed: staging post refresh complete, ct=" + this.stagingCt);
      //     }
      //   })
      // ];
      // if (fetchFeedDefinitions) {
      //   refreshPromises.push(
      //     this.$web.get(this.baseUrl + "/feeds")
      //     .then((data) => {
      //       // clear queryDefinitionImagesById 
      //       this.queryDefinitionImagesById = {};
      //       // populate feeds and queryDefinitionImagesById
      //       let feedDefinitionData = data.feedDefinitions; // all feed definition data objects 
      //       let queryDefinitionData = data.queryDefinitions; // all query definition data objects 
      //       if (feedDefinitionData) {
      //         for (let i = 0; i < feedDefinitionData.length; i++) {
      //           let fd = feedDefinitionData[i]; // feed definition data for this feed 
      //           let qd = queryDefinitionData[fd.id]; // query definitions for this feed 
      //           // merge query definition and metrics data into feed definition 
      //           this.decorateFeedWithQueryDefinitions(fd, qd, data.queryMetrics);
      //           // marshall up all query definitions by Id for later reference 
      //           if (qd) {
      //             for (let j = 0; j < qd.length; j++) {
      //               let wrapper = qd[j];
      //               // console.log("queryDefinition id=" + wrapper.queryDefinition.id + ", queryTitle=" + wrapper.queryDefinition.queryTitle + ", queryDefinitionImageUrl=" + wrapper.queryDefinitionImageUrl);
      //               this.queryDefinitionImagesById[wrapper.queryDefinition.id] = wrapper.queryDefinitionImageUrl;
      //             }
      //           }
      //           // parse feed definition export config (if present) 
      //           fd.exportConfig = fd.exportConfig ? JSON.parse(fd.exportConfig) : fd.exportConfig;
      //           // locate the feed to update by id 
      //           let idxToUpdate = -1;
      //           for (let i = 0; i < this.feeds.length; i++) {
      //             if (this.feeds[i].id === fd.id) {
      //               idxToUpdate = i;
      //             }
      //           }
      //           if (idxToUpdate >= 0) {
      //             this.feeds[idxToUpdate] = fd;
      //           } else {
      //             fd.showMoreInformation = true;
      //             this.feeds.push(fd);
      //           }
      //         }
      //       }
      //       this.rssAtomFeedCatalog = data.rssAtomFeedCatalog;
      //     })
      //   )
      // }

      this.inTransit = true;
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
              this.stagingCt = ct;
              console.log("post-feed: staging post refresh complete, ct=" + this.stagingCt);
            }
          })
        ];
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
              this.queryDefinitionImagesById = {};
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
                      // console.log("queryDefinition id=" + wrapper.queryDefinition.id + ", queryTitle=" + wrapper.queryDefinition.queryTitle + ", queryDefinitionImageUrl=" + wrapper.queryDefinitionImageUrl);
                      this.queryDefinitionImagesById[wrapper.queryDefinition.id] = wrapper.queryDefinitionImageUrl;
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
            post.sourceImgUrl = this.queryDefinitionImagesById[post.queryId];
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
                this.field('postTitle', {
                  extractor: function(doc = {}) {
                    return doc.postTitle ? doc.postTitle.value : null;
                  }
                })
                this.field('postDesc', {
                  extractor: function(doc = {}) {
                    return doc.postDesc ? doc.postDesc.value : null;
                  }
                })
                iq.values.forEach(function (doc) {
                  this.add(doc)
                }, this)
              });
            }            
          }
          // set selected feed Id and inbound queue 
          if (this.feeds.length > 0 && !this.selectedFeedId) {
            // TODO: should be a configurable 'default' feed 
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
            r.title = {
              value: queryDefinition.queryTitle
            }
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
        selectNextPost = this.lcSetContainsStr(newStatus, this.feedFilterModes);
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
          clearTimeout(timeoutId);
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
            this.refreshFeeds([current.id], false); // TODO: this is wrong, the refresh should be returned from the update call 
          } else {
            let created = data[0].feedDefinition;
            this.feeds.push(created);
            this.inboundQueuesByFeed[created.ident] = { values: [] };
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
            if (this.selectedFeedId === this.feedIdToDelete) {
              this.setSelectedFeedId(nextFeedId); // TODO: should be a configurable 'default' feed 
            }
          }
          this.setLastServerMessage(data.message);
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.feedIdToDelete = null;
          this.$refs.feedDeleteConfirmationModal.hide();
          this.inTransit = false;
          clearTimeout(timeoutId);
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
          this.setLastServerMessage(data.message);
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.feedIdToMarkAsRead = null;
          this.$refs.feedMarkAsReadConfirmationModal.hide();
          this.inTransit = false;
          clearTimeout(timeoutId);
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
      this.previousFeedId = this.selectedFeedId;
      this.selectedFeedId = feedId;
      this.inboundQueue = feedId ? this.inboundQueuesByFeed[feedId] : null;
      this.selectedFeedFilterCategories = [];
      this.selectedFeedFilterSubscriptions = [];
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
        // this.nextPage(true); 
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
    // 
    // 
    // 
    eventHandler(event) {
      if (!event.key) {
        return;
      }
      // esc key handling 
      if (event.key === 'Escape') {
        if (!this.isModalShowing && !this.$refs.controlPanel.showSettingsPanel && !this.$refs.controlPanel.showHelpPanel && !this.showFeedConfigPanel && !this.showOpmlUploadPanel) {
          document.activeElement.blur();
        } else {
          // TODO: extract to 'cancelFeedDelete' 
          this.feedIdToDelete = null;
          this.$refs.feedDeleteConfirmationModal.hide();
          // TODO: extract to 'cancelFeedMarkAsRead' 
          this.feedIdToMarkAsRead = null;
          this.$refs.feedMarkAsReadConfirmationModal.hide();
          // 
          this.dismissCreateOrUpdateFeed();
          this.cancelOpmlUpload();
          this.$refs.controlPanel.showSettingsPanel = false;
          this.$refs.controlPanel.showHelpPanel = false;
        }
        return;
      }
      // bail if a modal is showing
      if (this.isModalShowing || this.showFeedConfigPanel || this.showOpmlUploadPanel) {
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
        } else if (event.key === 'H' && event.shiftKey) {
          this.toggleFeedFilterMode('READ');
          event.stopPropagation();
          event.preventDefault();
        } else if (event.key === 'T' && event.shiftKey) {
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
        this.refreshFeeds(null, true);
        event.stopPropagation();
        event.preventDefault();
      } else if (event.key === 'Q') {
        this.newFeed();
        event.stopPropagation();
        event.preventDefault();
      }
    },
    // wheelHandler(wheelEvent) {
    //   if (!this.selectedFeedId) {
    //     return;
    //   }
    //   if (wheelEvent.deltaY <= 0) {
    //     return true;
    //   }
    //   let c = document.getElementById('post-feed-container');
    //   if (c) {
    //     let w = (window.innerHeight + window.scrollY);
    //     if (w >= c.offsetHeight) {
    //       if (this.atBottomOfPage) {
    //         this.atBottomOfPage = false;
    //         this.nextPage(false);
    //         wheelEvent.stopPropagation();
    //       } else {
    //         this.atBottomOfPage = true;
    //       }
    //     } else {
    //       this.atBottomOfPage = false;
    //     }
    //   }
    // }
  }
};
</script>

<style scoped>
.post-feed-container {
}

/** has references */
.post-feed-container-inner-selected {
  display: flex;
  align-items: flex-start;
}

.post-feed-container-inner {
  align-items: stretch;
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
  display: flex;
  flex-direction: column;
  width: 100%;
  background: v-bind('theme.sectionhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.staging-header-view-selected {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  min-width: 70svw;
  max-width: 70svw;
}

.staging-header-view-collapsed {
  max-width: unset !important;
  width: 100%;
}

.staging-header-view {
  color: v-bind('theme.normalmessage');
  background: v-bind('theme.sectionhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  position: sticky;
  top: 0px;
  z-index: 200;
  overflow: auto;
}

.staging-view {
  color: v-bind('theme.normalmessage');
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 4px; /* staging-header-view box-shadow + 1px */ 
}

.post-grid {
  display: grid;
  grid-template-columns: v-bind('postGridTemplate');
  align-items: start;
}

.post-table {
  display: block;
}

.queue-dashboard {
  padding: .56rem;
  overflow: auto;
}

.feed-selectors {
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
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: .44rem;
  background-color: v-bind('theme.appbg');
  border-radius: 4px;
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

.click-for-more-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
}

.click-for-more-button:disabled {
  cursor: auto;
}

.click-for-more-button:hover, .click-for-more-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.click-for-more-button:disabled:hover {
  background-color: unset;
}

.feed-info-labels {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}

.feed-info-label-small {
  max-width: fit-content;
  cursor: pointer;
  color: v-bind('theme.subduedmessage');
  font-family: Arial, Helvetica, sans-serif;
  margin: .44rem;
  margin-bottom: 0px;
}

.link {
  text-decoration: none;
  color: unset;
  cursor: pointer;
  border: 1px solid transparent;
  color: v-bind('theme.normalmessage');
  user-select: none;
}

.link:hover, .link:focus-visible {
  text-decoration: underline;
  color: v-bind('theme.highlightedmessage');
}

.link-disabled {
  pointer-events: none;
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
}

.feed-select-view-selected {
  overflow: auto;
  max-height: 75svh;
}

@media (min-width: 1023px) {
  .feed-select-view-selected {
    top: -1px;
    position: sticky;
    width: 30svw;
    max-height: 100svh;
  }

  .feed-select-view-collapsed {
    display: none;
  }
}

.filter-expression-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  font-family: Arial, Helvetica, sans-serif;
  margin-left: .56rem;
  padding-top: .56rem;
}

.filter-expression {
  word-break: break-word;
}

.filter-mode-expression {
  color: v-bind('theme.highlightedmessage');
}

.filter-subscriptions-expression {
  color: v-bind('theme.highlightedmessage');
}

.filter-categories-expression {
  color: v-bind('theme.highlightedmessage');
}

.show-queue-dashboard-button {
  display: flex;
  font-size: larger;
  border: 1px solid v-bind('theme.sectionsubdued');
  background: v-bind('theme.sectionhighlight');
  color: v-bind('theme.buttonfg');
  padding: .44rem 1.25rem;
  cursor: pointer;
  text-align: center;
  user-select: none;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.show-queue-dashboard-button span {
  margin-top: .56rem;
}

.show-queue-dashboard-button:hover, .show-queue-dashboard-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}
</style>
