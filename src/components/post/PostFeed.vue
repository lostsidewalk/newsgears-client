<template>
  <div id="post-feed-container" class="post-feed-container" v-show="this.$auth.$isAuthenticated">
    <!-- feed delete confirmation modal (hidden) -->
    <ConfirmationDialog ref="feedDeleteConfirmation" 
      :inTransit="inTransit"
      :theme="theme"
      @confirm="performFeedDelete" 
      @cancel="cancelFeedDelete"
      prompt="Please confirm that you want to delete this feed. This action is irreversible." />
    <!-- feed configuration panel modal (hidden) -->
    <FeedConfigPanel ref="feedConfigPanel"
      :inTransit="inTransit"
      :theme="theme"
      :baseUrl="baseUrl" 
      :allNewsApiV2Sources="allNewsApiV2Sources"
      :allNewsApiV2Countries="allNewsApiV2Countries"
      :allNewsApiV2Categories="allNewsApiV2Categories"
      :allNewsApiV2Languages="allNewsApiV2Languages"
      :rssAtomFeedCatalog="rssAtomFeedCatalog"
      @saveOrUpdate="createOrUpdateFeed"
      @cancel="cancelCreateOrUpdateFeed"
      @updateInTransit="this.$emit('updateInTransit', $event)" 
      @authError="handleServerError" />
    <!-- OPML upload panel modal (hidden) -->
    <OpmlUploadPanel 
      :inTransit="inTransit" 
      :theme="theme"
      :baseUrl="baseUrl" 
      :showModal="this.showOpmlUploadPanel"
      @finalizeUpload="createOpmlFeeds"
      @cancel="cancelOpmlUpload"
      @authError="handleServerError" />
    <!-- feed selector -->
    <div class="feed-select-view">
      <div class="view-header">
        <span class="collapsible">
          <h3 class="view-header-no-count">
            <i class="fa fa-feed fa-1x"/>
            FEEDS
          </h3>
          <MinMaxButton @toggle="this.showFullFeedSelector = !this.showFullFeedSelector" :show="this.showFullFeedSelector" :theme="theme" /> 
        </span>
        <div v-if="this.showFullFeedSelector && this.filteredFeedIdentOptions.length > 0" class="grid">
          <div v-for="feed in filteredFeedIdentOptions" :key="feed.id" class="feed-select-wrapper">
            <FeedSelectButton 
              :feed="feed" 
              :inboundCount="this.countInboundQueue(feed.id)" 
              :publishedCount="this.countOutboundQueue(feed.id)" 
              :class="this.selectedFeedId === feed.id ? 'selected-feed' : ''"
              :disabled="inTransit" 
              :theme="theme" 
              @click.stop="this.setSelectedFeedId(feed.id)" />
            <div class="feed-select-buttons">
              <button class="feed-select-button" 
                @click.stop="this.configureFeed(feed.id)" 
                :disabled="inTransit" 
                title="Configure this feed">
                <span class="fa fa-wrench"></span>
              </button>
              <button class="feed-select-button" 
                @click.stop="this.deleteFeed(feed.id, feed.value)" 
                :disabled="inTransit" 
                title="Delete this feed">
                <span class="fa fa-trash"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- feed config toolbar -->
      <div class="view-header-toolbar" v-if="this.showFullFeedSelector">
        <!-- new feed button -->
        <button class="header-button" @click.stop="newFeed()" :disabled="inTransit">
          New Feed
        </button>
        <!-- upload OPML button -->
        <button class="header-button" @click.stop="uploadOpml()" :disabled="inTransit">
          Upload OPML
        </button>
      </div>
    </div>
    <!-- inbound queue header -->
    <div id="staging-header-view" class="staging-header-view" v-if="this.selectedFeedId">
      <div class="view-header">
        <span class="collapsible">
          <h3 class="view-header-count">
            <i class="fa fa-gears fa-1x"/>
            INBOUND QUEUE: {{ this.getFeedById(this.selectedFeedId).ident }}
          </h3>
          <MinMaxButton @toggle="this.showFullInboundQueueHeader = !this.showFullInboundQueueHeader" :show="this.showFullInboundQueueHeader" :theme="theme" /> 
        </span>

      </div>
      <!-- filter feed field -->
      <div class="view-header-field" v-if="this.showFullInboundQueueHeader">
        <!-- feed filter label -->
        <label>ARTICLE QUEUE {{ '(' + this.filteredInboundQueue.length + ' ARTICLES MATCH, SHOWING PAGE ' + (this.currentPage + 1) + ' OF ' + this.totalPages + ')' }}</label>
        <div class="feed-filter">
          <!-- feed filter input -->
          <input type="text" v-model="inboundQueueFilter" placeholder="Filter" :disabled="inTransit"/>
          <!-- first page button-->
          <button v-if="needsPagination()" title="first" class="feed-filter-button" @click="firstPage">
            <i class="fa fa-angle-double-left"/>
          </button>
          <!-- previous page button -->
          <button v-if="needsPagination()" title="previous" class="feed-filter-button" @click="previousPage">
            <i class="fa fa-angle-left"/>
          </button>
          <!-- next page button -->
          <button v-if="needsPagination()" title="next" class="feed-filter-button" @click="nextPage">
            <i class="fa fa-angle-right"/>
          </button>
          <!-- last page button-->
          <button v-if="needsPagination()" title="last" class="feed-filter-button" @click="lastPage">
            <i class="fa fa-angle-double-right"/>
          </button>
          <!-- sort direction button -->
          <button class="feed-filter-button" @click="toggleInboundQueueSortOrder()" :disabled="inTransit" aria-label="Toggle sort order">
            <i :class="'fa fa-arrow-' + (inboundQueueSortOrder === 'ASC' ? 'up' : 'down')"></i>
          </button>
          <!-- refresh feed button -->
          <button class="feed-filter-button" 
            @click="refreshFeeds(false, null, false)"
            :disabled="inTransit" 
            aria-label="Refresh feeds">
            <span class="fa fa-refresh"/>
          </button>
          <!-- show feed filter pills button -->
          <button class="feed-filter-button" 
            @click="this.showFeedFilterPills = !this.showFeedFilterPills"
            :disabled="inTransit" 
            aria-label="Show filter options">
            <span class="fa fa-eye"/>
          </button>
        </div>
      </div>
      <div class="feed-filter-pills pill-container" v-if="this.showFeedFilterPills && this.showFullInboundQueueHeader">
        <!-- post status filter pills -->
        <span class="br-pill" :class="{ selectedMode: lcSetContainsStr('UNREAD', this.feedFilterModes) }" 
          @click="toggleFeedFilterMode('UNREAD')">
            UNREAD
        </span>
        <span class="br-pill" :class="{ selectedMode: lcSetContainsStr('READ_LATER', this.feedFilterModes) }" 
          @click="toggleFeedFilterMode('READ_LATER')">
            READ-LATER
        </span>
        <span class="br-pill" :class="{ selectedMode: lcSetContainsStr('READ', this.feedFilterModes) }" 
          @click="toggleFeedFilterMode('READ')">
            READ
        </span>
        <span class="br-pill" :class="{ selectedMode: lcSetContainsStr('PUBLISHED', this.feedFilterModes) }" 
          @click="toggleFeedFilterMode('PUBLISHED')">
            STARRED
        </span>
      </div>
      <div class="feed-filter-pills pill-container" v-if="this.showFeedFilterPills && this.showFullInboundQueueHeader && (this.feedFilterCategories.length > 0 || this.feedFilterSubscriptions.length > 0)">
        <!-- post subscription filter pills -->
        <span v-for="subscription in this.feedFilterSubscriptions" :key="subscription"
          class="br-pill" @click="toggleFeedFilterSubscription(subscription)">
            {{ subscription }}
        </span>
        <!-- post category filter pills -->
        <span v-for="category in this.feedFilterCategories" :key="category"
          class="br-pill" @click="toggleFeedFilterCategory(category)">
            {{ category }}
        </span>
      </div>
    </div>
    <!-- inbound queue -->
    <div class="staging-view" v-if="this.selectedFeedId">
      <div>
        <PostItem v-for="(post,idx) in this.getCurrentPage(filteredInboundQueue)" :key="post.id" :post="post"
          :id="'post_' + post.id"
          :ref="'post_' + post.id"
          :inTransit="inTransit"
          :theme="theme" 
          :baseUrl="baseUrl"
          :isSelected="this.selectedPostId === post.id"
          :tabindex="idx + 1"
          @keypress.prevent="setSelectedPost(post.id)"
          @focus.stop="setSelectedPost(post.id)"
          @setActive="this.selectedPostId = post.id" 
          @deletePost="deletePost"
          @updatePostReadStatus="updatePostReadStatus"
          @updatePostPubStatus="updatePostPubStatus" 
          @updateFilter="updatePostFeedFilter" />
      </div>
    </div>
  </div>
</template>

<script>
// confirmation modal 
import ConfirmationDialog from '../layout/ConfirmationDialog.vue';
// feed configuration panel 
import FeedConfigPanel from "./feed/FeedConfigPanel.vue";
import OpmlUploadPanel from "./opml/OpmlUploadPanel.vue";
// post item panel 
import PostItem from "./PostItem.vue";
import FeedSelectButton from './FeedSelectButton.vue';
import MinMaxButton from '../layout/MinMaxButton.vue';

// lcSetIncludesStr
// const lcSetIncludesStr = function(str1, strSet) {
//   if (str1 && strSet) {
//     for (let i = 0; i < strSet.length; i++) {
//       if (lcStrContains(str1, strSet[i])) {
//         return true;
//       }
//     }
//   }
// }
// // lcSetContainsSet is true IFF any item in set is in strSet 
// const lcSetContainsSet = function(set, strSet) {
//   if (set && strSet) {
//     for (let i = 0; i < set.length; i++) {
//       if (lcSetContainsStr(set[i], strSet)) {
//         return true;
//       }
//     }
//   }
//   return false;
// }

export default {
  components: { 
    PostItem, 
    FeedConfigPanel,
    OpmlUploadPanel,
    FeedSelectButton,
    MinMaxButton,
    ConfirmationDialog,
  },
  name: "PostFeed",
  props: [ "baseUrl", "inTransit", "theme" ],
  emits: [ "updateServerMessage", "updateInTransit" ],
  watch: {
    '$auth.$isAuthenticated' (isAuthenticated) {
      if (isAuthenticated) {
        this.refreshFeeds(true, null, true); // need staging posts for all feeds and feed definitions 
      }
    }
  },
  mounted() {
    if (this.$auth.$isAuthenticated) {
      this.refreshFeeds(true, null, true); // need staging posts for all feeds and feed definitions 
    }
  },
  created() {
    let getCurrentPostIidx = () => {
      let currentPostIdx = null;
      for (let i = 0; i < this.filteredInboundQueue.length; i++) {
        if (this.filteredInboundQueue[i].id === this.selectedPostId) {
          currentPostIdx = i;
          break;
        }
      }
      return currentPostIdx;
    }

    window.addEventListener("keydown", (event) => {
      if (this.selectedPostId) {
        if (event.key === 'ArrowDown') {
          let currentPostIdx = getCurrentPostIidx.apply();
          if (currentPostIdx < this.filteredInboundQueue.length) {
            let nextPostId = this.filteredInboundQueue[currentPostIdx + 1].id;
            this.setSelectedPost(nextPostId);
            event.preventDefault();
          }
        } else if (event.key === 'ArrowUp') {
          let currentPostIdx = getCurrentPostIidx.apply();
          if (currentPostIdx > 0) {
            let nextPostId = this.filteredInboundQueue[currentPostIdx - 1].id;
            this.setSelectedPost(nextPostId);
            event.preventDefault();
          }
        // TODO: implement page up 
        // TODO: implement page down
        } else if (event.key === 'Home') {
          this.setSelectedPost(this.getCurrentPage(this.filteredInboundQueue)[0].id);
        } else if (event.key === 'End') {
          let c = this.getCurrentPage(this.filteredInboundQueue);
          this.setSelectedPost(c[c.length - 1].id);
        }
      }
    });
  },
  computed: {
    totalPages: function() {
      let t = Math.ceil(this.filteredInboundQueue.length / this.itemsPerPage);
      return t;
    },
    filteredInboundQueue: function() {
      if (this.inboundQueue) {
        let filtered = this.inboundQueue.filter((post) => {
          // check mode 
          let modeMatches = false;
          if (this.feedFilterModes.length === 0 || this.lcSetContainsStr('ALL', this.feedFilterModes)) {
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
          // TODO: check the subscription (importer desc) against the filter subscriptions 
          
          // TODO: check the categories against the filter categories 

          // check title and desc against filter text, if defined 
          let lcFilter = this.inboundQueueFilter ? this.inboundQueueFilter.toLowerCase() : null;
          return lcFilter ? (
            post.postTitle.value.toLowerCase().includes(lcFilter) || 
            (post.postDesc && post.postDesc.value.toLowerCase().includes(lcFilter)) // TODO: continue from here, add categories and other properties 
          ) : true;
        });
        this.sortQueue(filtered, this.inboundQueueSortOrder);
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
          "label": t[i].ident,
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
    }
  },
  data() {
    return {
      // operating mode 
      feedIdToDelete: null, 
      showOpmlUploadPanel: false,
      showFullFeedSelector: true,
      showFullFeedDetails: true,
      showFullInboundQueueHeader: true,
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
      showFeedFilterPills: false, // show filter pills t/f 
      feedFilterModes: ['UNREAD', 'READ', 'PUB_PENDING', 'PUBLISHED'], // currently selected filter modes 
      feedFilterSubscriptions: [],
      feedFilterCategories: [],
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
    // 
    // this method is invoked by the key-press handler: 
    // 
    // (1) to ensure that the requested post is on the current page 
    // (2) to set selectedPostId (triggering reative side-effects)
    // (3) to show the full post contents 
    // (4) to scroll the post into view 
    // 
    // as compared to when a post is selected by the mouse cursor, which just sets selectedPostId 
    // (thus invoking its reactive side-effects) 
    // 
    // notes: 
    // 
    // to show the full post contents with the mouse, the user clicks the image, title, or header portion of the post 
    // 
    setSelectedPost(postId) {
      let r = this.$refs['post_' + postId];
      if (!r) {
        console.log("requested post is not on this page");
        return;
      }
      this.selectedPostId = postId;
      this.$refs['post_' + postId][0].showFullPost();
      this.$nextTick(() => {
        let elem = document.getElementById('post_' + postId);
          elem.focus();
          window.scrollTo({
            behavior: 'smooth',
            top: elem.getBoundingClientRect().top - document.body.getBoundingClientRect().top - document.getElementById('staging-header-view').getBoundingClientRect().height - 10,
          });
      });
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
    // 
    handleServerError(error) {
      console.log(error);
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
    sortQueue(queue, sortOrder) {
      queue.sort((l, r) => {
        let r1, l1;
        if (sortOrder === 'ASC') {
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
        let result = new Date(r1.publishTimestamp) - new Date(l1.publishTimestamp)
        if (result === 0) {
          result = r1.id - l1.id;
        }
        return result;
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
        if (filterMode !== 'ALL' && this.feedFilterModes.length === 1 && this.feedFilterModes[0] === 'ALL') {
          this.feedFilterModes.splice(0, this.feedFilterModes.length);
        }
        this.feedFilterModes.push(filterMode);
      }
    },
    toggleFeedFilterCategory(category) {
      if (this.lcSetContainsStr(category, this.feedFilterCategories)) {
        let idxToSplice = -1;
        for (let i = 0; i < this.feedFilterCategories.length; i++) {
          if (this.feedFilterCategories[i] === category) {
            idxToSplice = i;
            break;
          }
        }
        if (idxToSplice >= 0) {
          this.feedFilterCategories.splice(idxToSplice, 1);
        }
      } else {
        this.feedFilterModes.push(category);
      }
    },
    toggleFeedFilterSubscription(subscription) {
      if (this.lcSetContainsStr(subscription, this.feedFilterSubscriptions)) {
        let idxToSplice = -1;
        for (let i = 0; i < this.feedFilterSubscriptions.length; i++) {
          if (this.feedFilterSubscriptions[i] === subscription) {
            idxToSplice = i;
            break;
          }
        }
        if (idxToSplice >= 0) {
          this.feedFilterSubscriptions.splice(idxToSplice, 1);
        }
      } else {
        this.feedFilterSubscriptions.push(subscription);
      }
    },
    updatePostFeedFilter(f) {
      if (f.name === "subscription") {
        if (this.feedFilterSubscriptions.indexOf(f.value) < 0) {
          this.feedFilterSubscriptions.push(f.value);
          this.showFeedFilterPills = true;
        } else {
          this.removeFilterFromSet(this.feedFilterSubscriptions, f.value);
        }
      } else if (f.name === "category") {
        if (this.feedFilterCategories.indexOf(f.value) < 0) {
          this.feedFilterCategories.push(f.value);
          this.showFeedFilterPills = true;
        } else {
          this.removeFilterFromSet(this.feedFilterCategories, f.value);
        }
      }
      console.log("feed filter updated, subscriptions=" + JSON.stringify(this.feedFilterSubscriptions), ", categories=" + JSON.stringify(this.feedFilterCategories));
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
    sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    },
    countInboundQueue(feedId) {
      let iq = this.inboundQueuesByFeed[feedId];
      return iq ? iq.length : 0;
    },
    countOutboundQueue(feedId) {
      let iq = this.inboundQueuesByFeed[feedId];
      return iq ? iq.filter(p => p.isPublished).length : 0;
    },
    // hideStatus = t/f -> update/do not update the server message display upon refresh 
    // feedsToFetch = fetch staging posts for the feed Ids in this array, empty -> all feeds 
    // fetchFeedDefinitions = t/f -> include/exclude feed definition updates 
    refreshFeeds(hideStatus, feedsToFetch, fetchFeedDefinitions) {
      console.log("post-feed: refreshing feeds");
      let rawPosts = [];
      this.$emit('updateInTransit', true);
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
                // add this post 
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
                let qd = queryDefinitionData[fd.ident];
                this.decorateFeedWithQueryDefinitions(fd, qd);
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
          this.$emit('updateInTransit', false); // end of refreshFeeds 
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.$emit('updateInTransit', false);
      });
    },
    decorateFeedWithQueryDefinitions(fd, qd) {
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
            fd.newsApiV2Sources = queryConfig ? queryConfig.sources : null;
            fd.newsApiV2Language = queryConfig ? queryConfig.language : null;
            fd.newsApiV2Country = queryConfig ? queryConfig.country : null;
            fd.newsApiV2Category = queryConfig ? queryConfig.category : null;
          } else if (queryType === 'RSS' || queryType === 'ATOM') {
            fd.rssAtomFeedUrls.push({
              "id": qd[i].id,
              "feedTitle": qd[i].queryTitle,
              "feedUrl": qd[i].queryText,
            });
          }
        }
      }
    },
    deletePost(result) {
      console.log("post-feed: deleting postId=" + result.id);
      this.$emit('updateInTransit', true);
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({}),
        };
        let url = this.baseUrl + "/staging/" + result.id;
        fetch(url, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then(() => {
          // this.setLastServerMessage(data.message);
          this.refreshFeeds(true, null, false); // TODO: fix this 
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.$emit('updateInTransit', false);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.$emit('updateInTransit', false);
      });
    },
    updatePostReadStatus(result) {
      console.log("post-feed: updating post status, statusObj=" + JSON.stringify(result));
      this.$emit('updateInTransit', true);
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ newStatus: result.newStatus }),
        };
        fetch(this.baseUrl + "/staging/read-status/" + result.id, requestOptions)
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
          this.$emit('updateInTransit', false);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.$emit('updateInTransit', false);
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
      this.$emit('updateInTransit', true);
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
          this.$emit('updateInTransit', false);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.$emit('updateInTransit', false);
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
    onPostItemError(message) {
      console.error(message);
      this.setLastServerMessage(message);
    },
    // (1) start the new feed lifecycle 
    newFeed() {
      this.$refs.feedConfigPanel.show({ rssAtomFeedUrls: [{ id: 1, }] });
    },
    uploadOpml() {
      this.showOpmlUploadPanel = true;
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
          console.log(error);
          return;
        }
      }
      let method = 'POST';
      this.$emit('updateInTransit', true);
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
            let q = data[i].queryDefinitions;
            this.decorateFeedWithQueryDefinitions(f, q);
            this.feeds.push(f);
            feedIds.push(f.id);
          }
          this.setLastServerMessage("Created " + feeds.length + " feeds");
          this.showOpmlUploadPanel = false;
          this.refreshFeeds(true, feedIds, false);
        })
        .catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.$emit('updateInTransit', false);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.$emit('updateInTransit', false);
      });
    },
    cancelOpmlUpload() {
      this.showOpmlUploadPanel = false;
    },
    // (1) start the feed config update lifecycle 
    configureFeed(feedId) {
      console.log("post-feed: configuring feedId=" + this.selectedFeedId);
      this.$refs.feedConfigPanel.show(this.getFeedById(feedId));
    },
    len(str) {
      return (str !== null && str !== undefined) ? str.length : 0;
    },
    // 
    // (2) ends the new feed/feed config update lifecycle by pushing the feed to remote 
    // 
    createOrUpdateFeed(feed) {
      try {
        this.validateFeed(feed);
      } catch (error) {
        console.log(error);
        return;
      }
      let isUpdate = feed.id ? true : false;
      let method = isUpdate ? 'PUT' : 'POST';
      this.$emit('updateInTransit', true);
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
                this.decorateFeedWithQueryDefinitions(this.feeds[i], data.queryDefinitions);
                this.$refs.feedConfigPanel.hide();
                this.setLastServerMessage("Updated feed '" + feed.ident + "'");
                break;
              }
            }
            this.refreshFeeds(true, [f.id], false);
          } else {
            let f = data[0].feedDefinition;
            this.decorateFeedWithQueryDefinitions(f, data[0].queryDefinitions);
            this.feeds.push(f);
            this.inboundQueuesByFeed[f.ident] = [];
            this.$refs.feedConfigPanel.hide();
            this.setLastServerMessage("Created feed '" + f.ident + "'");
            this.setSelectedFeedId(f.id);
            this.refreshFeeds(true, [f.id], false);
          }
        })
        .catch((error) => {
          // push the error to the modal since this method is only called by an emission from the modal, and we don't close the modal in this path 
          // this.$refs.feedConfigPanel.error(error);
          this.handleServerError(error); 
        }).finally(() => {
          this.$emit('updateInTransit', false);
        });
      }).catch((error) => {
        // push the error to the modal since this method is only called by an emission from the modal, and we don't close the modal in this path 
        // this.$refs.feedConfigPanel.error(error);
        this.handleServerError(error); 
        this.$emit('updateInTransit', false);
      });
    },
    cancelCreateOrUpdateFeed() {
      this.$refs.feedConfigPanel.hide();
    },
    deleteFeed(feedId, feedIdent) {
      this.feedIdToDelete = feedId;
      this.$refs.feedDeleteConfirmation.show(feedId, feedIdent);
    },
    performFeedDelete() {
      this.$refs.feedDeleteConfirmation.hide();
      console.log("post-feed: deleting feed id=" + this.feedIdToDelete);
      this.$emit('updateInTransit', true);
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
          this.$emit('updateInTransit', false);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.feedIdToDelete = null;
        this.$emit('updateInTransit', false);
      });
    },
    cancelFeedDelete() {
      this.feedIdToDelete = null;
    },
    updateFeedStatus(result) {
      console.log("post-feed: updating feed status, statusObj=" + JSON.stringify(result));
      this.$emit('updateInTransit', true);
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ newStatus: result.newStatus }),
        };
        fetch(this.baseUrl + "/feeds/status/" + result.id, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then((data) => {
          this.setLastServerMessage(data.message);
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.$emit('updateInTransit', false);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.$emit('updateInTransit', false);
      });
    },
    performFeedDisable(feedId) {
      this.$refs.feedDeleteConfirmation.hide();
      this.updateFeedStatus({ id: feedId, newStatus: 'DISABLED' });
    },
    // 
    setSelectedFeedId(feedId) {
      this.selectedFeedId = feedId;
      this.inboundQueue = feedId ? this.inboundQueuesByFeed[feedId] : null;
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
    getInboundQueue() {
      let s = this.getSelectedFeed();
      if (s.feedId) {
        return this.inboundQueuesByFeed[s.feedId];
      }
      return [];
    },
  }
};
</script>

<style scoped>
.header-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  margin-left: 10px;
  margin-right: 0px;
  text-align: center;
  user-select: none;
}

.header-button:hover {
  background-color: v-bind('theme.buttonhighlight');
}

.header-button:disabled {
  cursor: auto;
}

.header-button:disabled:hover {
  background-color: unset;
}

.feed-select-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
  background: v-bind('theme.sectionhighlight');
  display: flex;
  flex-direction: column;
  width: 100%;
}

.staging-header-view {
  color: v-bind('theme.normalmessage');
  border-top: 1px solid v-bind('theme.sectionbordercolor');
  background: v-bind('theme.sectionhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  position: sticky;
  top: 0px;
  z-index: 200;
}

.staging-view {
  color: v-bind('theme.normalmessage');
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 10px;
}

.view-header {
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
  text-align: left;
  border-radius: 4px 4px 0px 0px;
  overflow: hidden;
}

.view-header-field {
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 0px 0px 4px 4px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 0px;

  text-align: left;
  display: flex;
  flex-direction: column;
}

.view-header-field label {
  font-size: small;
}

.view-header-field > div {
  margin-top: 2px;
  resize: none;
}

.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: large;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0px;
  overflow: hidden;
}

.view-header-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: large;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0px;
  overflow: hidden;
}

.view-header-toolbar {
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 0px 0px 4px 4px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 0px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  resize: none;
  min-width: 104px;
  max-width: 100%; 
  gap: 10px;
  padding-top: 10px;
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

.feed-select-buttons {
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  border-radius: 3px;
  margin-top: 2px;
}

.feed-select-button {
  border: 1px solid v-bind('theme.buttonborder');
  text-align: center;
  border-radius: 3px;
  background-color: transparent;
  color: v-bind('theme.buttonfg');
  padding-top: 3px;
  font-size: smaller;
  margin: 3px;
}

.feed-select-button:hover:enabled {
  background-color: v-bind('theme.buttonhighlight') !important;
  cursor: pointer;
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
}

.feed-filter input {
  padding: 5px;
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.normalmessage');
  border-radius: 3px 0px 0px 3px;
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  width: 100%;
}

.feed-filter input:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-filter > input:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
}

.feed-filter > input:disabled {
  cursor: auto;
}

.feed-filter-button {
  border: 1px solid v-bind('theme.fieldborder');
  background-color: v-bind('theme.fieldbackground');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: 7px 20px;
  cursor: pointer;
  float: right;
  text-align: center;
}

.feed-filter-button:hover {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.feed-filter-button:focus {
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background: v-bind('theme.fieldbackgroundhighlight');
  color: v-bind('theme.fieldcolorhighlight');
  outline: none;
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
  font-size: small;
  margin-left: 15px;
  padding-bottom: 10px;
}

.pill-container {
  border: 1px solid transparent;
  display: flex;
  flex-flow: wrap;
  gap: 5px;
  overflow-x: auto;
}

.br-pill {
  border: 1px solid v-bind('theme.sectionbordercolor');
  cursor: pointer;
  border-radius: 3px;
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  padding: 5px;
  user-select: none;
}

.br-pill:hover {
  border: 1px solid v-bind('theme.buttonborder');
}

.selectedMode {
  color: v-bind('theme.normalmessage');
  border: 1px solid v-bind('theme.fieldborderhighlight');
  background-color: v-bind('theme.buttonhighlight') !important;
}
</style>
