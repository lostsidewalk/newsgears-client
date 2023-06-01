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

      <AuthPanel
        v-show="!$auth.$isAuthenticated"
        ref="authentication"
        :server-message="authServerMessage"
        :is-loading="loginIsLoading"
        @login="login"
      />
      <FooterPanel app />
    </v-main>

    <!-- post-auth main -->
    <v-main
      v-show="$auth.$isAuthenticated"
    >
      <!-- progress bar -->
      <v-progress-linear :indeterminate="isLoading || refreshQueuesIsLoading" />
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
            :is-authenticated="$auth.$isAuthenticated"
            @showSettings="openSettings"
            @showHelp="showHelpPanel = !showHelpPanel"
            @logout="logout"
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
                @click.stop="newQueue"
              />
            </template>
          </ControlPanel>
        </template>
      </v-app-bar>
      <!-- app bar (queue filter) -->
      <v-app-bar
        v-show="selectedQueueId"
        app
      >
        <!-- queue filter  -->
        <QueueFilter
          :filter="articleListFilter"
          :sort-order="articleListSortOrder"
          :queue-length="filteredArticleList.length"
          :queue-name="getSelectedQueue().title"
          :show-queue-refresh-indicator="showQueueRefreshIndicator"
          @toggleSortOrder="toggleArticleListSortOrder"
          @refreshQueues="refreshQueues(null, true)"
          @markAsRead="markQueueAsRead(selectedQueueId)"
          @update:modelValue="articleListFilter = $event"
          @toggleFilterPills="showQueueFilterPills = !showQueueFilterPills"
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
          v-if="selectedQueueId && allFilterPills.length > 0 && showQueueFilterPills"
          app
        >
          <QueueFilterPills :filter-pills="allFilterPills" />
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
            v-for="queue in filteredQueueIdentOptions"
            v-slot="{ isHovering, props }"
            :key="queue.value"
          >
            <QueueSelectButton
              variant="flat"
              :elevation="isHovering ? 12 : 0"
              :queue="queue"
              :feed-url="feedUrl"
              :inbound-count="countArticleList(queue.id)"
              :published-count="countPublished(queue.id)"
              class="ma-4"
              :class="selectedQueueId === queue.id ? 'selected-queue' : ''"
              :is-selected="selectedQueueId === queue.id"
              v-bind="props"
              @click.stop="$event => { setSelectedQueueId(queue.id); }"
              @selectQueue="$event => { setSelectedQueueId(queue.id); showQueueDashboard = false; }"
              @manageSubscriptions="configureQueue(queue.id)"
              @updateFilter="updateFilter"
              @showSubscriptionMetrics="openSubscriptionMetrics"
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
        <QueueFilterHelp @dismiss="showFilterHelp = false" />
      </v-dialog>
      <!-- delete confirmation modal -->
      <v-dialog
        v-model="showQueueDeleteConfirmation"
        scrollable
      >
        <ConfirmationDialog
          class="rounded"
          :prompt="$t('confirmDeleteQueue')"
          @confirm="performQueueDelete"
          @cancel="cancelQueueDelete"
        />
      </v-dialog>
      <!-- mark as read confirmation modal -->
      <v-dialog
        v-model="showQueueMarkAsReadConfirmation"
        scrollable
      >
        <ConfirmationDialog
          class="rounded"
          :prompt="$t('confirmMarkQueueAsRead')"
          @confirm="performQueueMarkAsRead"
          @cancel="cancelQueueMarkAsRead"
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
          :account="account"
          :framework-config="frameworkConfig"
          :subscription="subscription"
          :is-loading="settingsIsLoading"
          @exportOpml="exportOpml"
          @finalizeDeactivation="finalizeDeactivation"
          @initPasswordReset="initPasswordReset"
          @updateAccount="updateAccount"
          @updateNotificationPreferences="updateNotificationPreferences"
          @toggleNotifications="toggleNotifications"
          @cancelSubscription="cancelSubscription"
          @resumeSubscription="resumeSubscription"
          @submitOrder="submitOrder"
          @dismiss="showSettingsPanel = false"
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
        v-model="showQueueConfigPanel"
        fullscreen
        scrollable
      >
        <QueueConfigPanel
          ref="queueConfigPanel"
          :base-url="baseUrl"
          @save="createQueue"
          @update="updateQueue"
          @dismiss="dismissQueueConfigPanel"
          @authError="handleServerError"
          @updateServerMessage="setLastServerMessage"
          @refreshQueueDefinitions="$event => refreshQueues([$event], true)"
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
          :is-loading="finalizeIsLoading || continueIsLoading" 
          :at-step2="atStep2"
          :errors="opmlErrors"
          :queue-config-requests="queueConfigRequests"
          @continueUplkoad="continueOpmlUpload"
          @finalizeUpload="finalizeOpmlUpload"
          @returnToStep1="atStep2 = false"
          @cancel="cancelOpmlUpload"
        />
      </v-dialog>
      <!-- subscription metrics dialog -->
      <v-dialog
        v-model="showSubscriptionMetrics"
        fullscreen
        scrollable
      >
        <SubscriptionMetrics
          :title="subscriptionToShow.title"
          :subscription-metrics="subscriptionToShow.subscriptionMetrics"
          @dismiss="showSubscriptionMetrics = false"
        />
      </v-dialog>
      <!-- queue layout control -->
      <v-container class="queue-container d-flex flex-grow-1 rounded justify-space-between flex-wrap">
        <QueueLayout
          :show-list-layout="showListLayout"
          :show-card-layout="showCardLayout"
          @list="queueLayout = 'LIST'"
          @card="queueLayout = 'CARD'"
        />
        <v-label
          v-if="selectedQueueId"
          class="ma-2 font-weight-bold"
        >
          {{ getSelectedQueue().title }}
        </v-label>
      </v-container>
      <!-- divider -->
      <v-divider />
      <!-- queue container (cards) -->
      <v-container
        v-if="selectedQueueId && showCardLayout"
        class="queue-container d-flex flex-column flex-grow-1 rounded"
      >
        <div v-if="filteredArticleList.length > 0">
          <PostCard
            v-for="post in filteredArticleList"
            :id="'post_' + post.id"
            :key="post.id"
            :post="post"
            :sharing-options="sharingOptions"
            :collapsed="true"
            class="mb-4"
            @openPostUrl="openPostUrl(post.id)"
            @updatePostReadStatus="updatePostReadStatus"
            @updatePostPubStatus="updatePostPubStatus"
            @updateFilter="updateFilter"
            @share="$event => share($event.sharingOption, $event.post)"
          />
        </div>
        <v-alert
          v-else
          info
        >
          {{ $t('noArticlesInThisQueue') }}
        </v-alert>
      </v-container>
      <!-- queue container (list) -->
      <v-container
        v-if="selectedQueueId && showListLayout"
        class="queue-container d-flex flex-column flex-grow-1 rounded"
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
            @updateFilter="updateFilter"
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
          v-if="filteredArticleList.length > 0"
          v-model="selectedItem"
          class="rounded"
        >
          <PostListItem
            v-for="post in filteredArticleList"
            :id="'post_' + post.id"
            :key="post"
            :post="post"
            :sharing-options="sharingOptions"
            class="ma-4 rounded"
            @openPost="openPost(post.id)"
            @updatePostReadStatus="updatePostReadStatus"
            @updatePostPubStatus="updatePostPubStatus"
            @updateFilter="updateFilter"
            @share="$event => share($event.sharingOption, $event.post)"
          />
        </v-list>
        <v-alert
          v-else
          info
        >
          {{ $t('noArticlesInThisQueue') }}
        </v-alert>
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
// queue configuration panel 
import QueueConfigPanel from "@/components/queue-config-panel/QueueConfigPanel.vue";
// OPML upload panel 
import OpmlUploadPanel from "@/components/opml-upload-panel/OpmlUploadPanel.vue";
// subscription metrics panel 
import SubscriptionMetrics from '@/components/subscription-info/SubscriptionMetrics.vue';
// settings 
import ControlPanel from "@/components/control-panel/ControlPanel.vue";
import SettingsPanel from '@/components/settings-panel/SettingsPanel.vue';
import HelpPanel from '@/components/help-panel/HelpPanel.vue';
// queue layout 
import QueueLayout from "@/components/queue/QueueLayout.vue";
// queue filter 
import QueueFilter from "@/components/queue/QueueFilter.vue";
import QueueFilterPills from "@/components/queue/QueueFilterPills.vue";
import QueueFilterHelp from "@/components/queue/QueueFilterHelp.vue";
// post 
import PostCard from "@/components/post/PostCard.vue";
import PostListItem from "@/components/post/PostListItem.vue";
// queue dashboard 
import QueueSelectButton from '@/components/queue/QueueSelectButton.vue';
import FooterPanel from "@/components/footer-panel/FooterPanel.vue";
// import QueueDetails from '@/components/queue/QueueDetails.vue';
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
    QueueConfigPanel,
    OpmlUploadPanel,
    SubscriptionMetrics,
    // settings 
    ControlPanel,
    SettingsPanel,
    HelpPanel,
    // layout 
    QueueLayout,
    // filter 
    QueueFilter,
    QueueFilterPills,
    QueueFilterHelp,
    // item 
    PostCard,
    PostListItem,
    // dashboard 
    QueueSelectButton,
    FooterPanel
  },
  mixins: [buttonSizeMixin],
  props: {
    baseUrl: { type: String, required: true },
    feedUrl: { type: String, required: true },
  },
  data() {
    return {
      refreshIntervalId: null,
      // loading indicators 
      isLoading: false,
      loginIsLoading: false,
      continueIsLoading: false, // opml 
      finalizeIsLoading: false, // opml 
      refreshQueuesIsLoading: false, 
      settingsIsLoading: false, // settings 
      // show auth server message 
      authServerMessage: null,
      // show delete queue confirmation 
      showQueueDeleteConfirmation: false,
      queueIdToDelete: null,
      // show queue mark as read confirmation 
      showQueueMarkAsReadConfirmation: false,
      queueIdToMarkAsRead: null,
      // show subscription metrics 
      subscriptionToShow: null,
      showSubscriptionMetrics: false,
      // show notification warning 
      showNotificationWarning: false,
      // show filter help
      showFilterHelp: false,
      // show filter pills 
      showQueueFilterPills: false,
      // show the queue dashboard 
      showQueueDashboard: false,
      // queue layout (list/card) 
      queueLayout: 'LIST', // 'CARD' 
      // show the queue config modal 
      showQueueConfigPanel: false,
      configuredQueueId: null,
      // show the OPML config modal 
      showOpmlUploadPanel: false,
      atStep2: false, 
      queueConfigRequests: null,
      opmlErrors: [],
      // show the account settings modal 
      showSettingsPanel: false,
      account: null, 
      frameworkConfig: null, 
      subscription: null, 
      // show the help modal 
      showHelpPanel: false,
      // show selected post 
      showSelectedPost: false,
      selectedPost: null, // selected post to show on the post card modal (while in list view) 
      selectedItem: null, // selected post list item (i.e., scrolling through the list in list view) 
      // queue material 
      queues: [], // all queues 
      selectedQueueId: null, // currently selected queue Id 
      previousQueueId: null, // previously selected queue Id 
      articleListsByQueue: {}, // all queues 
      articleList: { values: [] }, // inbound queue for the currently selected queue  
      // filter material 
      articleListFilter: '', // user-supplied filter text (lunrjs query expression) 
      articleListSortOrder: 'DSC',
      // queue refresh material 
      latestSubscriptionMetricsByQueue: {}, 
    };
  },
  computed: {
    isModalShowing: function() {
      return this.showSettingsPanel || this.showHelpPanel || this.showQueueConfigPanel || this.showOpmlUploadPanel || this.showSubscriptionMetrics;
    },
    filteredArticleList: function() {
      if (this.articleList) {
        let results = null;
        // if a lunr query expression is specified .. 
        // then fetch the preliminary results from lunrjs 
        if (this.articleListFilter) {
          let lunrLambda = () => this.articleList.index.search(this.articleListFilter);
          try {
            let lunrResults = lunrLambda.apply();
            if (lunrResults) {
              lunrResults = lunrResults.map(item => parseInt(item.ref));
              results = this.articleList.values.filter(item => {
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
          results = this.articleList.values;
        }
        // 
        // sort the filtered result 
        // 
        if (results) {
          this.sortQueue(results, this.articleListSortOrder);
        }
        // 
        // return the final (sorted) result 
        // 
        return results ? results : [];
      } else {
        return [];
      }
    },
    filteredQueueIdentOptions: function() {
      let queueIdentOptions = [];
      let t = Array.from(this.queues);
      for (let i = 0; i < Math.min(128, t.length); i++) {
        queueIdentOptions.push({
          "label": t[i].title ? t[i].title : t[i].ident,
          "value": t[i].ident,
          "description": t[i].description,
          "title": t[i].title,
          "id": t[i].id,
          "queueStatus": t[i].queueStatus,
          "lastDeployed": t[i].lastDeployed,
          "subscriptions": t[i].subscriptions,
          "transportIdent": t[i].transportIdent,
        });
      }
      queueIdentOptions.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
      return queueIdentOptions;
    },
    allFilterPills: function() {
      let filterPills = [
        {
          isSelected: this.articleListFilter.indexOf('status:READ_LATER') >= 0,
          invoke: () => this.toggleFilterMode('READ_LATER'),
          label: this.$t('readLater'),
          title: 'View items marked as read-later',
        },
        {
          isSelected: this.articleListFilter.indexOf('status:PUBLISHED') >= 0,
          invoke: () => this.toggleFilterMode('PUBLISHED'),
          label: this.$t('starred'),
          title: 'View starred items',
        },
        {
          isSelected: false,
          invoke: () => this.articleListFilter = '',
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
      return this.queueLayout === 'CARD';
    },
    showListLayout: function() {
      return this.queueLayout === 'LIST';
    },
    showQueueRefreshIndicator: function() {
      // ensure we have latestSubscriptionMetricsByQueue on hand; 
      // this is periodically refreshed by a background process 
      if (!this.latestSubscriptionMetricsByQueue) {
        // console.debug("showQueueRefreshIndicator: returning early due to missing latest subscription metrics by queue");
        return false;
      }
      // ensure we have a latest subscription metrics for the selected queue 
      let latestSubscriptionMetric = this.latestSubscriptionMetricsByQueue[this.selectedQueueId];
      if (!latestSubscriptionMetric) {
        // console.debug("showQueueRefreshIndicator: returning early due to missing latest subscription metrics for selected queue");
        return false;
      }
      // ensure that we have subscriptions on hand for the selected queue 
      let subscriptions = this.getSelectedQueue().subscriptions;
      if (!subscriptions) {
        // console.debug("showQueueRefreshIndicator: returning early due to selected queue has 0 subscriptions");
        return false;
      }
      // locate the latest local subscription metric across all subscriptions 
      let latestLocalSubscriptionMetric = null;
      for (let i = 0; i < subscriptions.length; i++) {
        let localSubscriptionMetrics = subscriptions[i].subscriptionMetrics;
        if (localSubscriptionMetrics) {
          for (let i = 0; i < localSubscriptionMetrics.length; i++) {
            let l = localSubscriptionMetrics[i]
            if (!latestLocalSubscriptionMetric) {
              latestLocalSubscriptionMetric = l;
              continue;
            } else {
              let localResult = new Date(latestLocalSubscriptionMetric.importTimestamp) - new Date(l.importTimestamp) < 0;
              if (localResult) {
                latestLocalSubscriptionMetric = l;
              }
            }
          }
        }
      }
      // ensure that we have a latest local subscription metric 
      if (!latestLocalSubscriptionMetric) {
        return true; // (we have a latestSubscriptionMetric, but no latestLocalSubscriptionMetric, therefore refresh is required) 
      }
      // compare the latestLocalSubscriptionMetric with the latestSubscriptionMetric 
      let result = new Date(latestSubscriptionMetric) - new Date(latestLocalSubscriptionMetric.importTimestamp) > 0;
      return result;
    }
  },
  watch: {
    '$auth.$isAuthenticated' (isAuthenticated) {
      if (isAuthenticated) {
        const storedQueues = localStorage.getItem('queues');
        if (storedQueues) {
          this.queues = JSON.parse(storedQueues);
        }
        const storedArticleLists = localStorage.getItem('articleListsByQueue');
        if (storedQueues) {
          this.articleListsByQueue = JSON.parse(storedArticleLists);
        }
        if (this.queues.length > 0 && this.articleListsByQueue) {
          if (!this.selectedQueueId) {
            this.setSelectedQueueId(this.queues[0].id);
          } else {
            this.articleList = this.articleListsByQueue[this.selectedQueueId];
          }
          this.rebuildLunrIndexes();
        } else {
          this.refreshQueues(null, true); // need staging posts for all queues and queues definitions 
        }
        // schedule the subscription-metrics refresh timer 
        this.refreshIntervalId = setInterval(() => {
          this.checkForNewSubscriptionMetrics();
        },  60_000 * 10); // 10 minutes (in ms) 
      } else {
        // unschedule the refresh timer 
        this.refreshIntervalId = null;
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
      this.refreshQueues(null, true); // need staging posts for all queues, and queues definitions 
    }
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.keyHandler);
  },
  methods: {
    logout() {
      this.$auth.logout()
      .catch((error) => {
        console.error("unable to logout due to: " + error);
      }).finally(() => {
        console.log("logout complete");
      });
    },
    login(loginRequest) {
      let username = loginRequest.username;
      let password = loginRequest.password;
      this.authServerMessage = null;
      if (!username && !password) {
        this.authServerMessage = this.$t("usernameAndPasswordAreRequired");
        return;
      }
      if (!username && password) {
        this.authServerMessage = this.$t("usernameIsRequired");
        return;
      }
      if (username && !password) {
        this.authServerMessage = this.$t("passwordIsRequired");
        return;
      }

      this.loginIsLoading = true;
      this.$auth
        .loginWithSupplied(username, password, false)
        .then(() => {
          this.authServerMessage = null;
        })
        .catch((error) => {
          this.authServerMessage = error;
          if (!this.authServerMessage) {
            this.authServerMessage = this.$t("somethingHorribleHappened");
          }
        })
        .finally(() => {
          this.loginIsLoading = false;
        });
    },
    shouldShowAlert(alertName) {
      return !localStorage.getItem(alertName);
    },
    dismissAlert(alertName) {
      localStorage.setItem(alertName, new Date().toISOString());
    },
    async setLastServerMessage(message) {
      const permission = await this.$notification.requestPermission();
      if (permission === "granted") {
        this.showNotificationWarning = false;
        this.$notification.show('FeedGears message', {
          body: message
        }, {
          onerror: () => {
            console.error("unable to show notification, message=" + message);
          }
        });
      } else {
        this.showNotificationWarning = true;
      }
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
        const id = this.selectedPost.id;
        const queue = this.filteredArticleList;
        const nextIdx = queue.findIndex(post => post.id === id) + 1;
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
        const id = this.selectedPost.id;
        const queue = this.filteredArticleList;
        const prevIdx = queue.findIndex(post => post.id === id) - 1;
        if (prevIdx >= 0) {
          this.selectedPost = queue[prevIdx];
        }
      }
    },
    // 
    // open post URL in new window
    // 
    openPostUrl(postId) {
      const post = this.getPostFromQueue(postId);
      window.open(post.postUrl, '_blank');
    },
    // 
    // share a post using the given sharing option 
    // 
    share(sharingOption, post) {
      const { postTitle, postUrl, importerDesc, postDesc } = post;
      const title = encodeURIComponent(postTitle.value);
      const link = encodeURIComponent(postUrl);
      const source = encodeURIComponent(importerDesc);
      const content = encodeURIComponent(postDesc ? postDesc.value : '');
      const url = replaceArray(sharingOption.url,
        ["{URL}", "{TITLE}", "{SOURCE}", "{CONTENT}"],
        [link, title, source, content]
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
      } else {
        this.setLastServerMessage(error.message || error);
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
        const l1 = sortOrder === 'DSC' ? r : l;
        const r1 = sortOrder === 'DSC' ? l : r;

        const leftDate = l1.publishTimestamp ?? l1.lastUpdatedTimestamp;
        const rightDate = r1.publishTimestamp ?? r1.lastUpdatedTimestamp;

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
    toggleArticleListSortOrder() {
      this.articleListSortOrder = (this.articleListSortOrder === 'DSC' ? 'ASC' : 'DSC');
    },
    // 
    // invoked when the user clicks the mode pill in the queue filter; 
    // this method should add the mode to articleListFilter, 
    // or remove it if it already present. 
    // 
    toggleFilterMode(filterMode) {
      if (this.articleListFilter.includes('status:' + filterMode)) {
        this.articleListFilter = this.articleListFilter.replace('status:' + filterMode, '');
      } else {
        this.articleListFilter += 'status:' + filterMode;
      }
    },
    updateFilter(f) {
      if (f.name === "subscription") {
        if (f.queueId !== this.selectedQueueId) {
          this.setSelectedQueueId(f.queueId);
          this.articleListFilter = '';
          this.$nextTick(() => {
            this.addSubscriptionToFilter(f.value);
          });
        } else {
          this.addSubscriptionToFilter(f.value);
        }
      } else if (f.name === "category") {
        this.addCategoryToFilter(f.value);
      }
    },
    // 
    // convenience method (invoked from above) to add the subscriptionId to the lunrjs query expression 
    // 
    addSubscriptionToFilter(subscription) {
      this.articleListFilter = '+feed:' + toLunrToken(subscription);
    },
    // 
    // convenience method (invoked from above) to add the category to the lunrjs query expression 
    // 
    addCategoryToFilter(category) {
      if (this.articleListFilter) {
        let expr = '+category:' + toLunrToken(category);
        if (this.articleListFilter.indexOf(expr) < 0) {
          this.articleListFilter = this.articleListFilter + ' +category:' + category;
        }
      } else {
        this.articleListFilter = ' +category:' + category;
      }
    },
    openSubscriptionMetrics(subscriptionInfo) {
      this.subscriptionToShow = subscriptionInfo;
      this.showSubscriptionMetrics = true;
    },
    // 
    // 
    // 
    countArticleList(queueId) {
      const iq = this.articleListsByQueue[queueId];
      if (iq) {
        return iq.values.filter(post => !post.isRead).length;
      }
      return 0;
    },
    countPublished(queueId) {
      const iq = this.articleListsByQueue[queueId];
      return iq ? iq.values.filter(post => post.isPublished).length : 0;
    },
    checkForNewSubscriptionMetrics() {
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/queues/metrics", requestOptions)
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              let contentType = response.headers.get("content-type");
              let isJson = contentType && contentType.indexOf("application/json") !== -1;
              return isJson ?
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
              response.text().then(t => {throw new Error(t)});
            }
          }).then((data) => {
            this.latestSubscriptionMetricsByQueue = data;
          }).catch((error) => {
            this.handleServerError(error);
          }).finally(() => {
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        this.handleServerError(error);
      });
    },
    // 
    // queue refresh 
    // 
    // queuesToFetch = fetch staging posts for the queue Ids in this array, empty -> all queues  
    // fetchQueueDefinitions = t/f -> include/exclude queue definition updates 
    async refreshQueues(queuesToFetch, fetchQueueDefinitions) {
      console.log("refreshing queues");
      let rawPosts = [];
      this.refreshQueuesIsLoading = true;

      try {
        const token = await this.$auth.getTokenSilently();
        const stagingPostRefreshController = new AbortController();
        const stagingPostRefreshTimeoutId = setTimeout(() => stagingPostRefreshController.abort(), 45000);
        let queueDefinitionRefreshTimeoutId;
        let refreshPromises = [
          fetch(this.baseUrl + "/staging" + (queuesToFetch ? ("?queueIds=" + queuesToFetch) : ''), {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include',
            signal: stagingPostRefreshController.signal
          })
            .then((response) => {
              if (response.status === 200) {
                const contentType = response.headers.get("content-type");
                const isJson = contentType && contentType.indexOf("application/json") !== -1;
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
              const stagingPosts = data.stagingPosts;
              if (stagingPosts) {
                for (let i = 0; i < stagingPosts.length; i++) {
                  const p = stagingPosts[i].post;
                  p.isPublished = p.published || (p.postPubStatus === 'PUB_PENDING') || (p.postPubStatus === 'DEPUB_PENDING');
                  p.isRead = p.postReadStatus === 'READ';
                  p.isReadLater = p.postReadStatus === 'READ_LATER';
                  p.postImgSrc = stagingPosts[i].postImgSrc;
                  rawPosts.push(p);
                  ct++;
                }
                console.log("staging post refresh complete, ct=" + ct);
              }
            })
        ];

        if (fetchQueueDefinitions) {
          const queueDefinitionRefreshController = new AbortController();
          queueDefinitionRefreshTimeoutId = setTimeout(() => queueDefinitionRefreshController.abort(), 5000);
          refreshPromises.push(
            fetch(this.baseUrl + "/queues", {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include',
              signal: queueDefinitionRefreshController.signal,
            })
              .then((response) => {
                if (response.status === 200) {
                  const contentType = response.headers.get("content-type");
                  const isJson = contentType && contentType.indexOf("application/json") !== -1;
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
                this.queues.splice(0);
                const queueDefinitionData = data.queueDefinitions;
                const subscriptionDefinitions = data.subscriptionDefinitions;
                if (queueDefinitionData) {
                  for (let i = 0; i < queueDefinitionData.length; i++) {
                    const qd = queueDefinitionData[i];
                    const sd = subscriptionDefinitions[qd.id];
                    this.decorateQueueWithSubscriptionDefinitions(qd, sd, data.subscriptionMetrics);
                    qd.exportConfig = qd.exportConfig ? JSON.parse(qd.exportConfig) : qd.exportConfig;
                    this.queues.push(qd);
                  }
                  localStorage.setItem('queues', JSON.stringify(this.queues));
                }
              })
          );
        }

        await Promise.all(refreshPromises);
        clearTimeout(stagingPostRefreshTimeoutId);
        if (queueDefinitionRefreshTimeoutId) {
          clearTimeout(queueDefinitionRefreshTimeoutId);
        }

        for (let i = 0; i < this.queues.length; i++) {
          const queuedId = this.queues[i].id;
          const iq = this.articleListsByQueue[queuedId];
          if (iq) {
            if (!queuesToFetch || queuesToFetch.indexOf(this.queues[i].id) >= 0) {
              iq.values.splice(0);
              iq.index = null;
            }
          } else {
            this.articleListsByQueue[queuedId] = { values: [] };
          }
        }

        for (let i = 0; i < rawPosts.length; i++) {
          const post = rawPosts[i];
          this.articleListsByQueue[post.queueId].values.push(post);
        }

        this.rebuildLunrIndexes();
        localStorage.setItem('articleListsByQueue', JSON.stringify(this.articleListsByQueue));

        if (this.queues.length > 0 && !this.selectedQueueId) {
          this.setSelectedQueueId(this.queues[0].id);
        } else {
          this.articleList = this.articleListsByQueue[this.selectedQueueId];
        }

      } catch (error) {
        this.handleServerError(error);
      } finally {
        this.refreshQueuesIsLoading = false;
      }
    },
    decorateQueueWithSubscriptionDefinitions(fd, qd, qm) {
      fd.subscriptions = [];

      if (qd) {
        for (let i = 0; i < qd.length; i++) {
          let wrapper = qd[i];
          let subscriptionDefinition = wrapper.subscriptionDefinition;
          let r = {
            id: subscriptionDefinition.id,
            subscriptionMetrics: qm ? qm[subscriptionDefinition.id] : null,
            url: subscriptionDefinition.url,
            queueId: fd.id,
            title: subscriptionDefinition.title
          };

          // auth
          let queryConfig = subscriptionDefinition.queryConfig ? JSON.parse(subscriptionDefinition.queryConfig) : subscriptionDefinition.queryConfig;
          if (queryConfig) {
            r.username = queryConfig.username;
            r.password = queryConfig.password;
          }

          // image
          let imgUrl = wrapper.imgUrl;
          if (imgUrl) {
            r.image = {
              title: null,
              url: imgUrl,
            };
          }

          // add to FD
          fd.subscriptions.push(r);
        }
      }
    }, 
    rebuildLunrIndexes() {
      console.log("rebuilding lunrjs indexes...");
      for (let i = 0; i < this.queues.length; i++) {
        let iq = this.articleListsByQueue[this.queues[i].id];
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
      console.log("updating post status");
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
      console.log("updating post status");
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
            // update the queue last deployed timestamp 
            let updateLocalStorage = false;
            for (let i = 0; i < this.queues.length; i++) {
              if (this.queues[i].id === result.queueId) {
                this.queues[i].lastDeployed = this.formatTimestamp(data.timestamp);
                updateLocalStorage = true;
                break;
              }
            }
            if (updateLocalStorage) {
              // update queues localStorage 
              localStorage.setItem('queues', JSON.stringify(this.queues));
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
    newQueue() {
      document.activeElement.blur();
      this.showQueueConfigPanel = true;
      this.$nextTick(() => this.$refs.queueConfigPanel.setup({ subscriptions: [] }));
    },
    uploadOpml() {
      document.activeElement.blur();
      this.setSelectedQueueId(this.selectedQueueId);
      this.showOpmlUploadPanel = true;
      this.$nextTick(() => this.$refs.opmlUploadPanel.show());
    },
    continueOpmlUpload(opmlFiles) {
      this.continueIsLoading = true;
      this.opmlErrors.splice(0);
      this.$auth.getTokenSilently().then((token) => {
        // form data 
        let formData = new FormData();
        for (let i = 0; i < opmlFiles.length; i++) {
          let f = this.files[i];
          formData.append('files', f.file, f.file.name);
        }
        // request options 
        const controller = new AbortController();
        const requestOptions = {
          method: 'POST', 
          headers: { 
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          body: formData,
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/queues/opml", requestOptions)
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
          if (data.errors && data.errors.length > 0) {
            this.opmlErrors = data.errors;
          } else {
            this.queueConfigRequests = data.queueConfigRequests;
            this.atStep2 = true;
          }
        }).catch((error) => {
          console.error(error);
          if (error.name === 'TypeError') {
            this.opmlErrors.push(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.opmlErrors.push(this.$t('requestTimedOut'));
          } else {
            this.opmlErrors.push(error.message);
          }
        }).finally(() => {
          this.continueIsLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.continueIsLoading = false;
      });
    },
    finalizeOpmlUpload(queues) {
      let method = 'POST';
      this.finalizeIsLoading = true;
      console.log("pushing queues to remote, ct=" + queues.length);
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(queues),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/queues/", requestOptions)
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
            let queueIds = [];
            for (let i = 0; i < data.length; i++) {
              let queue = data[i].queueDefinition;
              let subscriptionDefinitions = data[i].subscriptionDefinitions;
              let subscriptionMetrics = data[i].subscriptionMetrics;
              this.decorateQueueWithSubscriptionDefinitions(queue, subscriptionDefinitions, subscriptionMetrics);
              this.queues.push(queue);
              queueIds.push(queue.id);
            }
            // update queues localStorage 
            localStorage.setItem('queues', JSON.stringify(this.queues));
            this.setLastServerMessage(this.queues.length + " " + this.$t('nQueuesCreated'));
            this.$refs.opmlUploadPanel.hide();
            this.showOpmlUploadPanel = false;
            this.refreshQueues(queueIds, false);
          })
          .catch((error) => {
            this.handleServerError(error);
          }).finally(() => {
            this.finalizeIsLoading = false;
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        this.handleServerError(error);
        this.finalizeIsLoading = false;
      });
    },
    cancelOpmlUpload() {
      if (this.$refs.opmlUploadPanel) {
        this.$refs.opmlUploadPanel.hide();
        this.showOpmlUploadPanel = false;
        this.restorePreviousQueueId();
      }
    },
    configureQueue(queueId) {
      document.activeElement.blur();
      this.showQueueConfigPanel = true;
      this.configuredQueueId = queueId;
      this.$nextTick(() => this.$refs.queueConfigPanel.setup(this.getQueueById(queueId)));
    },
    createQueue(queue) {
      let method = 'POST';
      this.isLoading = true;
      console.log("pushing new queue to remote..");
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify([queue]),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/queues/", requestOptions)
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
            let created = data[0].queueDefinition;
            this.queues.push(created);
            // update queues localStorage 
            localStorage.setItem('queues', JSON.stringify(this.queues));
            this.articleListsByQueue[created.id] = { values: [] };
            // update queues localStorage 
            localStorage.setItem('articleListsByQueue', JSON.stringify(this.articleListsByQueue));
            this.$refs.queueConfigPanel.setup(created);
            this.setLastServerMessage(this.$t('queueCreated') + ' (' + created.ident + ")'");
            this.setSelectedQueueId(created.id);
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
    updateQueue(queue) {
      let method = 'PUT';
      this.isLoading = true;
      console.log("pushing updated queue to remote..");
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(queue),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(this.baseUrl + "/queues/" + queue.id, requestOptions)
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
            let updated = data.queueDefinition;
            let current = this.getQueueById(updated.id);
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
            this.decorateQueueWithSubscriptionDefinitions(current, data.subscriptionDefinitions, data.subscriptionMetrics);
            // update queues localStorage 
            localStorage.setItem('queues', JSON.stringify(this.queues));
            this.setLastServerMessage(this.$t('queueUpdated') + ' (' + queue.ident + ')');
            this.refreshQueues([current.id], false); // TODO: (enhancement) the refresh should be returned from the update call 
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
    dismissQueueConfigPanel() {
      if (this.$refs.queueConfigPanel) {
        this.$refs.queueConfigPanel.tearDown();
        this.showQueueConfigPanel = false;
        this.configuredQueueId = null;
        if (!this.selectedQueueId) {
          this.restorePreviousQueueId();
        }
      }
    },
    // 
    // delete queue 
    // 
    deleteSelectedQueue() {
      document.activeElement.blur();
      this.queueIdToDelete = this.selectedQueueId;
      this.showQueueDeleteConfirmation = true;
    },
    deleteQueue(queueId) {
      document.activeElement.blur();
      this.queueIdToDelete = queueId;
      this.showQueueDeleteConfirmation = true;
    },
    performQueueDelete() {
      console.log("deleting queue id=" + this.queueIdToDelete);
      this.isLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/queues/" + this.queueIdToDelete, {
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
          console.log("deleted queueId=" + this.queueIdToDelete);
          delete this.articleListsByQueue[this.queueIdToDelete];
          // update queues localStorage 
          localStorage.setItem('articleListsByQueue', JSON.stringify(this.articleListsByQueue));
          let idxToSplice = -1;
          for (let i = 0; i < this.queues.length; i++) {
            if (this.queues[i].id === this.queueIdToDelete) {
              idxToSplice = i;
              break;
            }
          }
          if (idxToSplice > -1) {
            let nextQueueId = this.queues.length > idxToSplice + 1 ? this.queues[idxToSplice + 1].id : null;
            this.queues.splice(idxToSplice, 1);
            // update queues localStorage 
            localStorage.setItem('queues', JSON.stringify(this.queues));
            if (this.selectedQueueId === this.queueIdToDelete) {
              this.setSelectedQueueId(nextQueueId); // TODO: (enhancement) should be a configurable 'default' queue 
            }
          }
          this.setLastServerMessage(data.message);
          this.rebuildLunrIndexes();
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.queueIdToDelete = null;
          this.showQueueDeleteConfirmation = false;
          this.isLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.queueIdToDelete = null;
        this.showQueueDeleteConfirmation = false;
        this.isLoading = false;
      });
    },
    cancelQueueDelete() {
      this.queueIdToDelete = null;
      this.showQueueDeleteConfirmation = false;
    },
    // 
    // mark queue as read 
    // 
    markSelectedQueueAsRead() {
      document.activeElement.blur();
      this.queueIdToMarkAsRead = this.selectedQueueId;
      this.showQueueMarkAsReadConfirmation = true;
    },
    markQueueAsRead(queueId) {
      document.activeElement.blur();
      this.queueIdToMarkAsRead = queueId;
      this.showQueueMarkAsReadConfirmation = true;
    },
    performQueueMarkAsRead() {
      console.log("updating queue status, id=" + this.queueIdToMarkAsRead);
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
        fetch(this.baseUrl + "/staging/read-status/queue/" + this.queueIdToMarkAsRead, requestOptions)
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
            this.articleListsByQueue[this.queueIdToMarkAsRead].values.forEach((p) => {
              p.isRead = true;
              p.postReadStatus = 'READ';
              p.isReadLater = false;
            });
            // update queue localStorage
            localStorage.setItem('articleListsByQueue', JSON.stringify(this.articleListsByQueue));
            this.setLastServerMessage(data.message);
            this.rebuildLunrIndexes();
          }).catch((error) => {
            this.handleServerError(error);
          }).finally(() => {
            this.queueIdToMarkAsRead = null;
            this.showQueueMarkAsReadConfirmation = false;
            this.isLoading = false;
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        this.handleServerError(error);
        this.queueIdToMarkAsRead = null;
        this.showQueueMarkAsReadConfirmation = false;
        this.isLoading = false;
      });
    },
    cancelQueueMarkAsRead() {
      this.queueIdToMarkAsRead = null;
      this.showQueueMarkAsReadConfirmation = false;
    },
    // 
    // data model methods 
    // 
    setSelectedQueueId(queueId) {
      this.previousQueueId = this.selectedQueueId;
      this.selectedQueueId = queueId;
      this.articleList = queueId ? this.articleListsByQueue[queueId] : null;
    },
    restorePreviousQueueId() {
      this.setSelectedQueueId(this.previousQueueId);
    },
    getSelectedQueue() {
      if (this.selectedQueueId) {
        for (let i = 0; i < this.queues.length; i++) {
          if (this.queues[i].id === this.selectedQueueId) {
            return this.queues[i];
          }
        }
      }
      return {};
    },
    getQueueById(queueId) {
      for (let i = 0; i < this.queues.length; i++) {
        if (this.queues[i].id === queueId) {
          return this.queues[i];
        }
      }
    },
    getPostFromQueue(id) {
      let f = this.articleList.values;
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
      // queue-related key handling 
      // 
      if (this.selectedQueueId) {
        let t = event.target.getAttribute("type") || event.target.type;
        if (t === 'text') {
          return;
        }
        // 
        // SHIFT + E KEY (CONFIGURE SELECTED QUEUE)
        // 
        if (event.key === 'E' && event.shiftKey === true) {
          this.configureQueue(this.selectedQueueId);
          event.stopPropagation();
          event.preventDefault();
          // 
          // SLASH KEY (SEARCH SELECTED QUEUE)
          // 
        } else if (event.key === '/') {
          this.$nextTick(() => {
            let filterElem = document.getElementById('queue-filter');
            if (filterElem) {
              filterElem.focus();
            } else {
              this.$nextTick(() => {
                let filterElem = document.getElementById('queue-filter');
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
          this.toggleFilterMode('READ_LATER');
          event.stopPropagation();
          event.preventDefault();
          // 
          // SHIFT + H KEY (TOGGLE QUEUE FILTER MODE)
          // 
        } else if (event.key === 'H' && event.shiftKey) {
          this.toggleFilterMode('READ');
          event.stopPropagation();
          event.preventDefault();
          // 
          // SHIFT + T KEY (TOGGLE QUEUE FILTER MODE)
          // 
        } else if (event.key === 'T' && event.shiftKey) {
          this.toggleFilterMode('PUBLISHED');
          event.stopPropagation();
          event.preventDefault();
          // 
          // SHIFT + A KEY (MARK QUEUE AS READ)
          // 
        } else if (event.key === 'A' && event.shiftKey === true) {
          this.markSelectedQueueAsRead();
          event.stopPropagation();
          event.preventDefault();
          // 
          // SHIFT + D KEY (DELETE QUEUE) 
          // 
        } else if (event.key === 'D' && event.shiftKey === true) {
          this.deleteSelectedQueue();
          event.stopPropagation();
          event.preventDefault();
        }
      }
      // 
      // SHIFT + R KEY (REFRESH QUEUES)
      // 
      if (event.key === 'R' && event.shiftKey === true) {
        this.refreshQueues(null, true);
        event.stopPropagation();
        event.preventDefault();
        // 
        // SHIFT + Q KEY (NEW QUEUE)
        // 
      } else if (event.key === 'Q' && event.shiftKey === true) {
        this.newQueue();
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
    },
    // 
    // SETTINGS 
    // 
    updateNotificationPreferences(updateNotificationRequest) {
      let enableAccountAlerts = updateNotificationRequest.enableAccountAlerts;
      let enableDailyFeedReport = updateNotificationRequest.enableDailyFeedReport;
      let enableProductNotifications = updateNotificationRequest.enableProductNotifications;
      let newSettings = {
        frameworkConfig: {
          notifications: {
            accountAlerts: enableAccountAlerts,
            dailyFeedReport: enableDailyFeedReport,
            productNotifications: enableProductNotifications,
          }
        }
      };
      this.settingsIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'PUT',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newSettings),
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings", requestOptions).then((response) => {
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
          // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
          if (newSettings.username) {
            this.account.username = newSettings.username;
          }
          if (newSettings.emailAddress) {
            this.account.emailAddress = newSettings.emailAddress;
          }
          if (newSettings.frameworkConfig) {
            this.frameworkConfig = newSettings.frameworkConfig;
          }
          this.setLastServerMessage(this.$t('settingsUpdated'));
        }).catch((error) => {
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.settingsIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.settingsIsLoading = false;
      });
    },
    toggleNotifications(toggleNotificationsRequest) {
      let enableAccountAlerts = toggleNotificationsRequest.enableAccountAlerts;
      let enableDailyFeedReport = toggleNotificationsRequest.enableDailyFeedReport;
      let enableProductNotifications = toggleNotificationsRequest.enableProductNotifications;
      let newSettings = {
        frameworkConfig: {
          notifications: {
            disabled: !this.isTrue(this.frameworkConfig.notifications.disabled),
            accountAlerts: enableAccountAlerts,
            dailyFeedReport: enableDailyFeedReport,
            productNotifications: enableProductNotifications,
          }
        }
      };
      this.settingsIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'PUT',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newSettings),
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings", requestOptions).then((response) => {
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
          // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
          if (newSettings.username) {
            this.account.username = newSettings.username;
          }
          if (newSettings.emailAddress) {
            this.account.emailAddress = newSettings.emailAddress;
          }
          if (newSettings.frameworkConfig) {
            this.frameworkConfig = newSettings.frameworkConfig;
          }
          this.setLastServerMessage(this.$t('settingsUpdated'));
        }).catch((error) => {
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.settingsIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.settingsIsLoading = false;
      });
    },
    updateAccount(updateAccountRequest) {
      let emailAddress = updateAccountRequest.emailAddress;
      let newSettings = {
        emailAddress: emailAddress
      };
      this.settingsIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'PUT',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newSettings),
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings", requestOptions).then((response) => {
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
          // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
          if (newSettings.emailAddress) {
            this.account.emailAddress = newSettings.emailAddress;
          }
          this.setLastServerMessage(this.$t('settingsUpdated'));
        }).catch((error) => {
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.settingsIsLoading = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.settingsIsLoading = false;
      });
    },
    openSettings() {
      this.isLoading = true; // top-level
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/settings", requestOptions)
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
          this.account = {
            username: data.username,
            emailAddress: data.emailAddress,
            authProvider: data.authProvider,
            authProviderProfileImgUrl: data.authProviderProfileImgUrl,
            authProviderUsername: data.authProviderUsername
          }
          this.frameworkConfig = data.frameworkConfig;
          this.subscription = data.subscription;
          this.showSettingsPanel = true;
        }).catch((error) => {
          this.handleServerError(error);
          this.isLoading = false; // top-level 
        }).finally(() => {
          this.isLoading = false; // top-level 
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.isLoading = false; // top-level
      });
    },
    exportOpml() {
      this.settingsIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'GET',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/queues/opml", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'feedgears-opml-export.xml';
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          this.setLastServerMessage(this.$t('opmlExportDownloaded'));
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.settingsIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.settingsIsLoading = false;
      });
    },
    finalizeDeactivation() {
      this.settingsIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'DELETE',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/deregister", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.settingsIsLoading = false;
          this.$auth.tearDownLoggedInSession();
          this.$router.push("/app");
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.settingsIsLoading = false;
      });
    },
    initPasswordReset() {
      this.settingsIsLoading = true;
      this.$auth
        .pwResetWithSupplied(this.account.username, this.account.emailAddress)
        .then(() => {
          this.setLastServerMessage(this.$t('checkEmailForFurther'));
        })
        .catch((error) => {
          this.setLastServerMessage(error);
        })
        .finally(() => {
          this.settingsIsLoading = false;
        });
    },
    submitOrder() {
      this.settingsIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: 'POST',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/order", requestOptions)
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
          window.location.href = data.sessionUrl;
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.settingsIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.settingsIsLoading = false;
      });
    },
    cancelSubscription() {
      this.settingsIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          method: 'PUT',
          body: JSON.stringify({
            subscriptionStatus: 'CANCELED'
          }),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/subscriptions", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            this.$auth.unsubscribe();
            this.subscription.cancelAtPeriodEnd = true;
            this.setLastServerMessage(this.$t('yourSubscriptionWasCanceledClickToResume'));
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.settingsIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.settingsIsLoading = false;
      });
    },
    resumeSubscription() {
      this.settingsIsLoading = true;
      this.$auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: 'include',
          method: 'PUT',
          body: JSON.stringify({
            subscriptionStatus: 'ACTIVE'
          }),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(this.baseUrl + "/subscriptions", requestOptions).then((response) => {
          if (response.status === 200) {
            this.$auth.subscribe();
            this.subscription.cancelAtPeriodEnd = false;
            this.setLastServerMessage(this.$t('yourSubscriptionWasResumed'));
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
                response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
                response.text().then(t => {throw new Error(t)});
          }
        }).catch((error) => {
          if (error.name === 'TypeError') {
            this.setLastServerMessage(this.$t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            this.setLastServerMessage(this.$t('requestTimedOut'));
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          this.settingsIsLoading = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.settingsIsLoading = false;
      });
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

.selected-queue {
  border: 1px solid !important;
}

.view-header-no-count {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}

.queue-container {
  background-color: transparent;
}
</style>
