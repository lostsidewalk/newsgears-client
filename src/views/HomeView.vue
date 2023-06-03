<template>
  <v-app>
    <!-- pre-auth app bar -->
    <v-app-bar
      v-if="!auth.isAuthenticated"
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
    <v-main v-show="!auth.isAuthenticated">
      <BannerPanel :show-auth="false" />

      <AuthPanel
        v-show="!auth.isAuthenticated"
        :server-message="authServerMessage"
        :is-loading="loginIsLoading"
        @login="login"
      />
      <FooterPanel app />
    </v-main>

    <!-- post-auth main -->
    <v-main v-show="auth.isAuthenticated">
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
            :base-url="baseUrl"
            :show-settings-panel="showSettingsPanel"
            :show-help-panel="showHelpPanel"
            :show-notification-warning="showNotificationWarning"
            :is-authenticated="auth.isAuthenticated"
            @showSettings="openSettings"
            @showHelp="showHelpPanel = !showHelpPanel"
            @logout="logout"
          >
            <template #additional>
              <!-- upload OPML button -->
              <v-btn
                :size="buttonSize"
                accesskey="m"
                :title="t('uploadOPML')"
                append-icon="fa-file"
                :text="t('uploadOPML')"
                @click.stop="uploadOpml"
              />
              <!-- new queue button -->
              <v-btn
                :size="buttonSize"
                accesskey="q"
                :title="t('createNewQueue')"
                append-icon="fa-plus"
                :text="t('createNewQueue')"
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
          :title="t('toggleSortOrder')"
          :aria-label="t('toggleSortOrder')"
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
        :class="xs ? 'w-100' : 'w-50'"
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
            :text="t('thisIsYourQueueDashboard')"
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
              @click.stop="$event => { setSelectedQueueId(queue.id); showQueueDashboard = false; }"
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
          :prompt="t('confirmDeleteQueue')"
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
          :prompt="t('confirmMarkQueueAsRead')"
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
          :auth="auth"
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
          {{ t('noArticlesInThisQueue') }}
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
                :title="t('goToNextPost')"
                @click.stop="selectNextPost"
              />
              <v-btn
                :size="buttonSize"
                accesskey="p"
                icon="fa-arrow-up"
                class="ma-1"
                :title="t('goToPreviousPost')"
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
          {{ t('noArticlesInThisQueue') }}
        </v-alert>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { inject, watch, ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAnnouncer } from '@vue-a11y/announcer';
import { useNativeNotifications } from 'vue3-native-notification';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';

import { useAuth } from '@/composable/auth/HomeAuth.js';

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
  setup(props) {
    // 
    // refs 
    // 
    const queueConfigPanel = ref(null);
    const opmlUploadPanel = ref(null);
    // 
    // injected 
    // 
    const auth = inject('auth');
    const { router } = useRouter();
    const { t } = useI18n();
    const { polite } = useAnnouncer();
    const { nativeNotifications } = useNativeNotifications();
    const display = useDisplay();
    const { login, logout, authServerMessage, loginIsLoading } = useAuth();
    // 
    // props 
    // 
    const { baseUrl } = props;
    // 
    // data 
    // 
    const refreshIntervalId = ref(null);
    const isLoading = ref(false);
    const continueIsLoading = ref(false); // opml 
    const finalizeIsLoading = ref(false); // opml 
    const refreshQueuesIsLoading = ref(false);
    const settingsIsLoading = ref(false); // settings 
    const showQueueDeleteConfirmation = ref(false);
    const queueIdToDelete = ref(null);
    const showQueueMarkAsReadConfirmation = ref(false);
    const queueIdToMarkAsRead = ref(null);
    const subscriptionToShow = reactive({});
    const showSubscriptionMetrics = ref(false);
    const showNotificationWarning = ref(false);
    const showFilterHelp = ref(false);
    const showQueueFilterPills = ref(false);
    const showQueueDashboard = ref(false);
    const queueLayout = ref('LIST'); // 'CARD' 
    const showQueueConfigPanel = ref(false);
    const configuredQueueId = ref(null);
    const showOpmlUploadPanel = ref(false);
    const atStep2 = ref(false);
    const queueConfigRequests = reactive([]);
    const opmlErrors = reactive([]);
    const showSettingsPanel = ref(false,);
    const account = reactive({});
    const frameworkConfig = reactive({});
    const subscription = reactive({});
    const showHelpPanel = ref(false);
    const showSelectedPost = ref(false);
    const selectedPost = reactive({}); // selected post to show on the post card modal (while in list view) 
    const selectedItem = reactive({}); // selected post list item (i.e., scrolling through the list in list view) 
    const queues = reactive([]); // all queues 
    const selectedQueueId = ref(null); // currently selected queue Id 
    const previousQueueId = ref(null); // previously selected queue Id 
    const articleListsByQueue = reactive({}); // all queues 
    const articleList = reactive({ values: [] }); // inbound queue for the currently selected queue  
    const articleListFilter = ref(''); // user-supplied filter text (lunrjs query expression) 
    const articleListSortOrder = ref('DSC');
    const latestSubscriptionMetricsByQueue = reactive({});
    // 
    // computed properties 
    // 
    const isModalShowing = computed(() => {
      return showSettingsPanel.value || showHelpPanel.value || showQueueConfigPanel.value || showOpmlUploadPanel.value || showSubscriptionMetrics.value;
    });

    const filteredArticleList = computed(() => {
      if (articleList) {
        let results = null;
        // if a lunr query expression is specified .. 
        // then fetch the preliminary results from lunrjs 
        if (articleListFilter.value) {
          let lunrLambda = () => articleList.index.search(articleListFilter.value);
          try {
            let lunrResults = lunrLambda.apply();
            if (lunrResults) {
              lunrResults = lunrResults.map(item => parseInt(item.ref));
              results = articleList.values.filter(item => {
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
          results = articleList.values;
        }
        // 
        // sort the filtered result 
        // 
        if (results) {
          sortQueue(results, articleListSortOrder.value);
        }
        // 
        // return the final (sorted) result 
        // 
        return results ? results : [];
      } else {
        return [];
      }
    });

    const filteredQueueIdentOptions = computed(() => {
      let queueIdentOptions = [];
      let t = Array.from(queues);
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
    });

    const allFilterPills = computed(() => {
      let filterPills = [
        {
          isSelected: articleListFilter.value.indexOf('status:READ_LATER') >= 0,
          invoke: () => toggleFilterMode('READ_LATER'),
          label: t('readLater'),
          title: 'View items marked as read-later',
        },
        {
          isSelected: articleListFilter.value.indexOf('status:PUBLISHED') >= 0,
          invoke: () => toggleFilterMode('PUBLISHED'),
          label: t('starred'),
          title: 'View starred items',
        },
        {
          isSelected: false,
          invoke: () => articleListFilter.value = '',
          label: t('clear'),
          title: 'Clear filter',
        }
      ];

      return filterPills;
    });

    const sharingOptions = computed(() => {
      return [
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
    });

    const showCardLayout = computed(() => {
      return queueLayout.value === 'CARD';
    });

    const showListLayout = computed(() => {
      return queueLayout.value === 'LIST';
    });

    const showQueueRefreshIndicator = computed(() => {
      // ensure we have latestSubscriptionMetricsByQueue on hand; 
      // this is periodically refreshed by a background process 
      if (!latestSubscriptionMetricsByQueue) {
        // console.debug("showQueueRefreshIndicator: returning early due to missing latest subscription metrics by queue");
        return false;
      }
      // ensure we have a latest subscription metrics for the selected queue 
      let latestSubscriptionMetric = latestSubscriptionMetricsByQueue[selectedQueueId.value];
      if (!latestSubscriptionMetric) {
        // console.debug("showQueueRefreshIndicator: returning early due to missing latest subscription metrics for selected queue");
        return false;
      }
      // ensure that we have subscriptions on hand for the selected queue 
      let subscriptions = getSelectedQueue().subscriptions;
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
    });
    // 
    // functions 
    // 

    function shouldShowAlert(alertName) {
      return !localStorage.getItem(alertName);
    }

    function dismissAlert(alertName) {
      localStorage.setItem(alertName, new Date().toISOString());
    }

    async function setLastServerMessage(message) {
      const permission = await nativeNotifications.requestPermission();
      if (permission === "granted") {
        showNotificationWarning.value = false;
        nativeNotifications.show('FeedGears message', {
          body: message
        }, {
          onerror: () => {
            console.error("unable to show notification, message=" + message);
          }
        });
      } else {
        showNotificationWarning.value = true;
      }
      polite(message);
    }
    // 
    // open post card in a modal dialog
    // 
    function openPost(postId) {
      Object.assign(selectedPost, getPostFromQueue(postId));
      showSelectedPost.value = true;
    }
    // 
    //
    // 
    function selectNextPost() {
      if (selectedPost) {
        const id = selectedPost.id;
        const queue = filteredArticleList;
        const nextIdx = queue.findIndex(post => post.id === id) + 1;
        if (nextIdx < queue.length) {
          Object.assign(selectedPost, queue[nextIdx]);
        }
      }
    }
    // 
    //
    // 
    function selectPreviousPost() {
      if (selectedPost) {
        const id = selectedPost.id;
        const queue = filteredArticleList;
        const prevIdx = queue.findIndex(post => post.id === id) - 1;
        if (prevIdx >= 0) {
          Object.assign(selectedPost, queue[prevIdx]);
        }
      }
    }
    // 
    // open post URL in new window
    // 
    function openPostUrl(postId) {
      const post = getPostFromQueue(postId);
      window.open(post.postUrl, '_blank');
    }
    // 
    // share a post using the given sharing option 
    // 
    function share(sharingOption, post) {
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
    }

    function replaceArray(str, find, replace) {
      let replaceString = str;
      let regex;
      for (let i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g");
        replaceString = replaceString.replace(regex, replace[i]);
      }
      return replaceString;
    }
    // 
    // handleserver error 
    // 
    function handleServerError(error) {
      console.error(error);
      if (error.name === 'TypeError') {
        setLastServerMessage(t('somethingHorribleHappened'));
      } else if (error.name === 'AbortError') {
        setLastServerMessage(t('requestTimedOut'));
      } else {
        setLastServerMessage(error.message || error);
      }
    }
    // 
    // sorting / filtering 
    // 
    function sortQueue(queue, sortOrder) {
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
    }
    // 
    // 
    //
    function toggleArticleListSortOrder() {
      articleListSortOrder.value = (articleListSortOrder.value === 'DSC' ? 'ASC' : 'DSC');
    }
    // 
    // invoked when the user clicks the mode pill in the queue filter; 
    // this method should add the mode to articleListFilter, 
    // or remove it if it already present. 
    // 
    function toggleFilterMode(filterMode) {
      if (articleListFilter.value.includes('status:' + filterMode)) {
        articleListFilter.value = articleListFilter.value.replace('status:' + filterMode, '');
      } else {
        articleListFilter.value += 'status:' + filterMode;
      }
    }

    function updateFilter(f) {
      if (f.name === "subscription") {
        if (f.queueId !== selectedQueueId.value) {
          setSelectedQueueId(f.queueId);
          articleListFilter.value = '';
          nextTick(() => {
            addSubscriptionToFilter(f.value);
          });
        } else {
          addSubscriptionToFilter(f.value);
        }
      } else if (f.name === "category") {
        addCategoryToFilter(f.value);
      }
    }
    // 
    // convenience method (invoked from above) to add the subscriptionId to the lunrjs query expression 
    // 
    function addSubscriptionToFilter(subscription) {
      articleListFilter.value = '+feed:' + toLunrToken(subscription);
    }
    // 
    // convenience method (invoked from above) to add the category to the lunrjs query expression 
    // 
    function addCategoryToFilter(category) {
      if (articleListFilter.value) {
        let expr = '+category:' + toLunrToken(category);
        if (articleListFilter.value.indexOf(expr) < 0) {
          articleListFilter.value = articleListFilter.value + ' +category:' + category;
        }
      } else {
        articleListFilter.value = ' +category:' + category;
      }
    }

    function toLunrToken(str) {
      if (str) {
        let pieces = str.split(' ');
        let token = pieces[0];
        return token + (pieces.length > 1 ? '*' : '');
      }
    }

    function openSubscriptionMetrics(subscriptionInfo) {
      Object.assign(subscriptionToShow, subscriptionInfo);
      showSubscriptionMetrics.value = true;
    }
    // 
    // 
    // 
    function countArticleList(queueId) {
      const iq = articleListsByQueue[queueId];
      if (iq) {
        return iq.values.filter(post => !post.isRead).length;
      }
      return 0;
    }

    function countPublished(queueId) {
      const iq = articleListsByQueue[queueId];
      return iq ? iq.values.filter(post => post.isPublished).length : 0;
    }

    function checkForNewSubscriptionMetrics() {
      auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(baseUrl + "/queues/metrics", requestOptions)
          .then((response) => {
            if (response.status === 200) {
              return response.json();
            } else {
              let contentType = response.headers.get("content-type");
              let isJson = contentType && contentType.indexOf("application/json") !== -1;
              return isJson ?
                response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
                response.text().then(t => { throw new Error(t) });
            }
          }).then((data) => {
            Object.assign(latestSubscriptionMetricsByQueue, data);
          }).catch((error) => {
            handleServerError(error);
          }).finally(() => {
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        handleServerError(error);
      });
    }
    // 
    // queue refresh 
    // 
    // queuesToFetch = fetch staging posts for the queue Ids in this array, empty -> all queues  
    // fetchQueueDefinitions = t/f -> include/exclude queue definition updates 
    async function refreshQueues(queuesToFetch, fetchQueueDefinitions) {
      console.log("refreshing queues");
      let rawPosts = [];
      refreshQueuesIsLoading.value = true;

      try {
        const token = await auth.getTokenSilently();
        const stagingPostRefreshController = new AbortController();
        const stagingPostRefreshTimeoutId = setTimeout(() => stagingPostRefreshController.abort(), 45000);
        let queueDefinitionRefreshTimeoutId;
        let refreshPromises = [
          fetch(baseUrl + "/staging" + (queuesToFetch ? ("?queueIds=" + queuesToFetch) : ''), {
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
                throw new Error(t('refreshFailedDueTo') +
                  " HTTP " + response.status + ": " +
                  (response.statusText ?
                    response.statusText : ("(" + t('noMessage') + ")")
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
            fetch(baseUrl + "/queues", {
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
                  throw new Error(t('refreshFailedDueTo') +
                    " HTTP " + response.status + ": " +
                    (response.statusText ?
                      response.statusText : ("(" + t('noMessage') + ")")
                    )
                  );
                }
              })
              .then((data) => {
                queues.splice(0);
                const queueDefinitionData = data.queueDefinitions;
                const subscriptionDefinitions = data.subscriptionDefinitions;
                if (queueDefinitionData) {
                  for (let i = 0; i < queueDefinitionData.length; i++) {
                    const qd = queueDefinitionData[i];
                    const sd = subscriptionDefinitions[qd.id];
                    decorateQueueWithSubscriptionDefinitions(qd, sd, data.subscriptionMetrics);
                    qd.exportConfig = qd.exportConfig ? JSON.parse(qd.exportConfig) : qd.exportConfig;
                    queues.push(qd);
                  }
                  localStorage.setItem('queues', JSON.stringify(queues));
                }
              })
          );
        }

        await Promise.all(refreshPromises);
        clearTimeout(stagingPostRefreshTimeoutId);
        if (queueDefinitionRefreshTimeoutId) {
          clearTimeout(queueDefinitionRefreshTimeoutId);
        }

        for (let i = 0; i < queues.length; i++) {
          const queuedId = queues[i].id;
          const iq = articleListsByQueue[queuedId];
          if (iq) {
            if (!queuesToFetch || queuesToFetch.indexOf(queues[i].id) >= 0) {
              iq.values.splice(0);
              iq.index = null;
            }
          } else {
            articleListsByQueue[queuedId] = { values: [] };
          }
        }

        for (let i = 0; i < rawPosts.length; i++) {
          const post = rawPosts[i];
          articleListsByQueue[post.queueId].values.push(post);
        }

        rebuildLunrIndexes();
        localStorage.setItem('articleListsByQueue', JSON.stringify(articleListsByQueue));

        if (queues.length > 0 && !selectedQueueId.value) {
          setSelectedQueueId(queues[0].id);
        } else {
          Object.assign(articleList, articleListsByQueue[selectedQueueId.value]);
        }

      } catch (error) {
        handleServerError(error);
      } finally {
        refreshQueuesIsLoading.value = false;
      }
    }

    function decorateQueueWithSubscriptionDefinitions(fd, qd, qm) {
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
    }

    function rebuildLunrIndexes() {
      console.log("rebuilding lunrjs indexes...");
      for (let i = 0; i < queues.length; i++) {
        let iq = articleListsByQueue[queues[i].id];
        if (iq) {
          const trueStr = t('trueStr');
          const falseStr = t('falseStr');
          iq.index = lunr(function () {
            this.ref('id')
            // title 
            this.field('title', {
              extractor: function (doc = {}) {
                return doc.postTitle ? doc.postTitle.value : null;
              },
              boost: 10,
            });
            // description 
            this.field('description', {
              extractor: function (doc = {}) {
                return doc.postDesc ? doc.postDesc.value : null;
              }
            });
            // feed 
            this.field('feed', {
              extractor: function (doc = {}) {
                return doc.importerDesc;
              },
            });
            // category 
            this.field('category', {
              extractor: function (doc = {}) {
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
    }
    // 
    // 
    // 
    function updatePostReadStatus(result) {
      console.log("updating post status");
      isLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/staging/read-status/post/" + result.id, requestOptions)
          .then((response) => {
            if (response.status === 200) {
              return;
            } else {
              let contentType = response.headers.get("content-type");
              let isJson = contentType && contentType.indexOf("application/json") !== -1;
              return isJson ?
                response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
                response.text().then(t => { throw new Error(t) });
            }
          }).then(() => {
            let originator = result.originator;
            if (originator === "togglePostReadStatus") { // NOTE: this happens when the user toggles the 'mark as read' button 
              onTogglePostReadStatus(result);
            } else if (originator === "togglePostReadLaterStatus") { // NOTE: this happens when the user toggles the 'mark as read-later' button 
              onTogglePostReadLaterStatus(result);
            }
            rebuildLunrIndexes();
          }).catch((error) => {
            handleServerError(error);
          }).finally(() => {
            isLoading.value = false;
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        handleServerError(error);
        isLoading.value = false;
      });
    }

    function updatePostPubStatus(result) {
      console.log("updating post status");
      isLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/staging/pub-status/" + result.id, requestOptions)
          .then((response) => {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            if (response.status === 200) {
              return isJson ? response.json() : {};
            } else {
              return isJson ?
                response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
                response.text().then(t => { throw new Error(t) });
            }
          }).then((data) => {
            // update the post 
            let originator = result.originator;
            let p = getPostFromQueue(result.id);
            if (originator === "stagePost") {
              p.isPublished = true;
            } else if (originator === "unstagePost") {
              p.isPublished = false;
            }
            p.postPubStatus = null;
            // update the queue last deployed timestamp 
            let updateLocalStorage = false;
            for (let i = 0; i < queues.length; i++) {
              if (queues[i].id === result.queueId) {
                queues[i].lastDeployed = formatTimestamp(data.timestamp);
                updateLocalStorage = true;
                break;
              }
            }
            if (updateLocalStorage) {
              // update queues localStorage 
              localStorage.setItem('queues', JSON.stringify(queues));
            }
            rebuildLunrIndexes();
          }).catch((error) => {
            handleServerError(error);
          }).finally(() => {
            isLoading.value = false;
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        handleServerError(error);
        isLoading.value = false;
      });
    }

    function onTogglePostReadStatus(result) {
      let p = getPostFromQueue(result.id);
      p.isRead = !p.isRead;
      p.postReadStatus = p.isRead ? 'READ' : null;
      if (p.isRead) {
        p.isReadLater = false;
      }
    }

    function onTogglePostReadLaterStatus(result) {
      let p = getPostFromQueue(result.id);
      p.isReadLater = !p.isReadLater;
      p.postReadStatus = p.isReadLater ? 'READ_LATER' : null;
      if (p.isReadLater) {
        p.isRead = false;
      }
    }
    // 
    // create / update queue 
    // 
    function newQueue() {
      document.activeElement.blur();
      showQueueConfigPanel.value = true;
      nextTick(() => queueConfigPanel.value.setup({ subscriptions: [] }));
    }

    function uploadOpml() {
      document.activeElement.blur();
      setSelectedQueueId(selectedQueueId.value);
      showOpmlUploadPanel.value = true;
      nextTick(() => opmlUploadPanel.value.show());
    }

    function continueOpmlUpload(opmlFiles) {
      continueIsLoading.value = true;
      opmlErrors.splice(0);
      auth.getTokenSilently().then((token) => {
        // form data 
        let formData = new FormData();
        for (let i = 0; i < opmlFiles.length; i++) {
          let f = opmlFiles[i];
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
        fetch(baseUrl + "/queues/opml", requestOptions)
          .then((response) => {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            if (response.status === 200) {
              return isJson ? response.json() : {};
            } else {
              return isJson ?
                response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
                response.text().then(t => { throw new Error(t) });
            }
          }).then((data) => {
            if (data.errors && data.errors.length > 0) {
              Object.assign(opmlErrors, data.errors);
            } else {
              Object.assign(queueConfigRequests, data.queueConfigRequests);
              atStep2.value = true;
            }
          }).catch((error) => {
            console.error(error);
            if (error.name === 'TypeError') {
              opmlErrors.push(t('somethingHorribleHappened'));
            } else if (error.name === 'AbortError') {
              opmlErrors.push(t('requestTimedOut'));
            } else {
              opmlErrors.push(error.message);
            }
          }).finally(() => {
            continueIsLoading.value = false;
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        handleServerError(error);
        continueIsLoading.value = false;
      });
    }

    function finalizeOpmlUpload() {
      let method = 'POST';
      finalizeIsLoading.value = true;
      console.log("pushing queues to remote, ct=" + queueConfigRequests.length);
      auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const requestOptions = {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(queueConfigRequests),
          signal: controller.signal
        };
        const timeoutId = setTimeout(() => controller.abort(), 45000);
        fetch(baseUrl + "/queues/", requestOptions)
          .then((response) => {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            if (response.status === 200) {
              return isJson ? response.json() : [];
            } else {
              return isJson ?
                response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
                response.text().then(t => { throw new Error(t) });
            }
          })
          .then((data) => {
            let queueIds = [];
            for (let i = 0; i < data.length; i++) {
              let queue = data[i].queueDefinition;
              let subscriptionDefinitions = data[i].subscriptionDefinitions;
              let subscriptionMetrics = data[i].subscriptionMetrics;
              decorateQueueWithSubscriptionDefinitions(queue, subscriptionDefinitions, subscriptionMetrics);
              queues.push(queue);
              queueIds.push(queue.id);
            }
            // update queues localStorage 
            localStorage.setItem('queues', JSON.stringify(queues));
            setLastServerMessage(queueConfigRequests.length + " " + t('nQueuesCreated'));
            opmlUploadPanel.value.hide();
            showOpmlUploadPanel.value = false;
            refreshQueues(queueIds, false);
          })
          .catch((error) => {
            handleServerError(error);
          }).finally(() => {
            finalizeIsLoading.value = false;
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        handleServerError(error);
        finalizeIsLoading.value = false;
      });
    }

    function cancelOpmlUpload() {
      if (opmlUploadPanel.value) {
        opmlUploadPanel.value.hide();
        showOpmlUploadPanel.value = false;
        restorePreviousQueueId();
      }
    }

    function configureQueue(queueId) {
      document.activeElement.blur();
      showQueueConfigPanel.value = true;
      configuredQueueId.value = queueId;
      nextTick(() => queueConfigPanel.value.setup(getQueueById(queueId)));
    }

    function createQueue(queue) {
      let method = 'POST';
      isLoading.value = true;
      console.log("pushing new queue to remote..");
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/queues/", requestOptions)
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
            queues.push(created);
            // update queues localStorage 
            localStorage.setItem('queues', JSON.stringify(queues));
            articleListsByQueue[created.id] = { values: [] };
            // update queues localStorage 
            localStorage.setItem('articleListsByQueue', JSON.stringify(articleListsByQueue));
            queueConfigPanel.value.setup(created);
            setLastServerMessage(t('queueCreated') + ' (' + created.ident + ")'");
            setSelectedQueueId(created.id);
            rebuildLunrIndexes();
          }).catch((error) => {
            handleServerError(error);
          }).finally(() => {
            isLoading.value = false;
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        handleServerError(error);
        isLoading.value = false;
      });
    }

    function updateQueue(queue) {
      let method = 'PUT';
      isLoading.value = true;
      console.log("pushing updated queue to remote..");
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/queues/" + queue.id, requestOptions)
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
            let current = getQueueById(updated.id);
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
            decorateQueueWithSubscriptionDefinitions(current, data.subscriptionDefinitions, data.subscriptionMetrics);
            // update queues localStorage 
            localStorage.setItem('queues', JSON.stringify(queues));
            setLastServerMessage(t('queueUpdated') + ' (' + queue.ident + ')');
            refreshQueues([current.id], false); // TODO: (enhancement) the refresh should be returned from the update call 
          }).catch((error) => {
            handleServerError(error);
          }).finally(() => {
            isLoading.value = false;
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        handleServerError(error);
        isLoading.value = false;
      });
    }

    function dismissQueueConfigPanel() {
      if (queueConfigPanel.value) {
        queueConfigPanel.value.tearDown();
        showQueueConfigPanel.value = false;
        configuredQueueId.value = null;
        if (!selectedQueueId.value) {
          restorePreviousQueueId();
        }
      }
    }

    // 
    // delete queue 
    // 
    function deleteSelectedQueue() {
      document.activeElement.blur();
      queueIdToDelete.value = selectedQueueId.value;
      showQueueDeleteConfirmation.value = true;
    }

    function deleteQueue(queueId) {
      document.activeElement.blur();
      queueIdToDelete.value = queueId;
      showQueueDeleteConfirmation.value = true;
    }

    function performQueueDelete() {
      console.log("deleting queue id=" + queueIdToDelete.value);
      isLoading.value = true;
      auth.getTokenSilently().then((token) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch(baseUrl.value + "/queues/" + queueIdToDelete.value, {
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
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
              response.text().then(t => { throw new Error(t) });
          }
        }).then((data) => {
          console.log("deleted queueId=" + queueIdToDelete.value);
          delete articleListsByQueue[queueIdToDelete.value];
          // update queues localStorage 
          localStorage.setItem('articleListsByQueue', JSON.stringify(articleListsByQueue));
          let idxToSplice = -1;
          for (let i = 0; i < queues.length; i++) {
            if (queues[i].id === queueIdToDelete.value) {
              idxToSplice = i;
              break;
            }
          }
          if (idxToSplice > -1) {
            let nextQueueId = queues.length > idxToSplice + 1 ? queues[idxToSplice + 1].id : null;
            queues.splice(idxToSplice, 1);
            // update queues localStorage 
            localStorage.setItem('queues', JSON.stringify(queues));
            if (selectedQueueId.value === queueIdToDelete.value) {
              setSelectedQueueId(nextQueueId); // TODO: (enhancement) should be a configurable 'default' queue 
            }
          }
          setLastServerMessage(data.message);
          rebuildLunrIndexes();
        }).catch((error) => {
          handleServerError(error);
        }).finally(() => {
          queueIdToDelete.value = null;
          showQueueDeleteConfirmation.value = false;
          isLoading.value = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        handleServerError(error);
        queueIdToDelete.value = null;
        showQueueDeleteConfirmation.value = false;
        isLoading.value = false;
      });
    }

    function cancelQueueDelete() {
      queueIdToDelete.value = null;
      showQueueDeleteConfirmation.value = false;
    }
    // 
    // mark queue as read 
    // 
    function markSelectedQueueAsRead() {
      document.activeElement.blur();
      queueIdToMarkAsRead.value = selectedQueueId.value;
      showQueueMarkAsReadConfirmation.value = true;
    }

    function markQueueAsRead(queueId) {
      document.activeElement.blur();
      queueIdToMarkAsRead.value = queueId;
      showQueueMarkAsReadConfirmation.value = true;
    }

    function performQueueMarkAsRead() {
      console.log("updating queue status, id=" + queueIdToMarkAsRead.value);
      isLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/staging/read-status/queue/" + queueIdToMarkAsRead.value, requestOptions)
          .then((response) => {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            if (response.status === 200) {
              return isJson ? response.json() : {};
            } else {
              return isJson ?
                response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
                response.text().then(t => { throw new Error(t) });
            }
          }).then((data) => {
            articleListsByQueue[queueIdToMarkAsRead.value].values.forEach((p) => {
              p.isRead = true;
              p.postReadStatus = 'READ';
              p.isReadLater = false;
            });
            // update queue localStorage
            localStorage.setItem('articleListsByQueue', JSON.stringify(articleListsByQueue));
            setLastServerMessage(data.message);
            rebuildLunrIndexes();
          }).catch((error) => {
            handleServerError(error);
          }).finally(() => {
            queueIdToMarkAsRead.value = null;
            showQueueMarkAsReadConfirmation.value = false;
            isLoading.value = false;
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        handleServerError(error);
        queueIdToMarkAsRead.value = null;
        showQueueMarkAsReadConfirmation.value = false;
        isLoading.value = false;
      });
    }

    function cancelQueueMarkAsRead() {
      queueIdToMarkAsRead.value = null;
      showQueueMarkAsReadConfirmation.value = false;
    }
    // 
    // data model methods 
    // 
    function setSelectedQueueId(queueId) {
      previousQueueId.value = selectedQueueId.value;
      selectedQueueId.value = queueId;
      Object.assign(articleList, queueId ? articleListsByQueue[queueId] : null);
    }

    function restorePreviousQueueId() {
      setSelectedQueueId(previousQueueId.value);
    }

    function getSelectedQueue() {
      if (selectedQueueId.value) {
        for (let i = 0; i < queues.length; i++) {
          if (queues[i].id === selectedQueueId.value) {
            return queues[i];
          }
        }
      }
      return {};
    }

    function getQueueById(queueId) {
      for (let i = 0; i < queues.length; i++) {
        if (queues[i].id === queueId) {
          return queues[i];
        }
      }
    }

    function getPostFromQueue(id) {
      let f = articleList.values;
      for (let j = 0; j < f.length; j++) {
        if (f[j].id === id) {
          return f[j];
        }
      }
    }
    // 
    // 
    // 
    function keyHandler(event) {
      if (!event.key) {
        return;
      }
      // 
      // ESC key handling 
      // 
      if (event.key === 'Escape') {
        // bail if a modal is showing
        if (isModalShowing) {
          return;
        }
        // otherwise hide the queue dashboard if it's showing 
        if (showQueueDashboard) {
          showQueueDashboard.value = false;
        }
        return;
      }
      // 
      // queue-related key handling 
      // 
      if (selectedQueueId.value) {
        let t = event.target.getAttribute("type") || event.target.type;
        if (t === 'text') {
          return;
        }
        // 
        // SHIFT + E KEY (CONFIGURE SELECTED QUEUE)
        // 
        if (event.key === 'E' && event.shiftKey === true) {
          configureQueue(selectedQueueId.value);
          event.stopPropagation();
          event.preventDefault();
          // 
          // SLASH KEY (SEARCH SELECTED QUEUE)
          // 
        } else if (event.key === '/') {
          nextTick(() => {
            let filterElem = document.getElementById('queue-filter');
            if (filterElem) {
              filterElem.focus();
            } else {
              nextTick(() => {
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
          toggleFilterMode('READ_LATER');
          event.stopPropagation();
          event.preventDefault();
          // 
          // SHIFT + H KEY (TOGGLE QUEUE FILTER MODE)
          // 
        } else if (event.key === 'H' && event.shiftKey) {
          toggleFilterMode('READ');
          event.stopPropagation();
          event.preventDefault();
          // 
          // SHIFT + T KEY (TOGGLE QUEUE FILTER MODE)
          // 
        } else if (event.key === 'T' && event.shiftKey) {
          toggleFilterMode('PUBLISHED');
          event.stopPropagation();
          event.preventDefault();
          // 
          // SHIFT + A KEY (MARK QUEUE AS READ)
          // 
        } else if (event.key === 'A' && event.shiftKey === true) {
          markSelectedQueueAsRead();
          event.stopPropagation();
          event.preventDefault();
          // 
          // SHIFT + D KEY (DELETE QUEUE) 
          // 
        } else if (event.key === 'D' && event.shiftKey === true) {
          deleteSelectedQueue();
          event.stopPropagation();
          event.preventDefault();
        }
      }
      // 
      // SHIFT + R KEY (REFRESH QUEUES)
      // 
      if (event.key === 'R' && event.shiftKey === true) {
        refreshQueues(null, true);
        event.stopPropagation();
        event.preventDefault();
        // 
        // SHIFT + Q KEY (NEW QUEUE)
        // 
      } else if (event.key === 'Q' && event.shiftKey === true) {
        newQueue();
        event.stopPropagation();
        event.preventDefault();
      }
    }

    function formatTimestamp(timestamp) {
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
    // 
    // SETTINGS 
    // 
    function updateNotificationPreferences(updateNotificationRequest) {
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
      settingsIsLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/settings", requestOptions).then((response) => {
          if (response.status === 200) {
            return;
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ?
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
              response.text().then(t => { throw new Error(t) });
          }
        }).then(() => {
          // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
          if (newSettings.username) {
            account.username = newSettings.username;
          }
          if (newSettings.emailAddress) {
            account.emailAddress = newSettings.emailAddress;
          }
          if (newSettings.frameworkConfig) {
            Object.assign(frameworkConfig, newSettings.frameworkConfig);
          }
          setLastServerMessage(t('settingsUpdated'));
        }).catch((error) => {
          if (error.name === 'TypeError') {
            setLastServerMessage(t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            setLastServerMessage(t('requestTimedOut'));
          } else {
            setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          settingsIsLoading.value = false;
        });
      }).catch((error) => {
        handleServerError(error);
        settingsIsLoading.value = false;
      });
    }

    function isTrue(obj) {
      return obj instanceof String ? obj === 'true' : obj === true;
    }

    function toggleNotifications(toggleNotificationsRequest) {
      let enableAccountAlerts = toggleNotificationsRequest.enableAccountAlerts;
      let enableDailyFeedReport = toggleNotificationsRequest.enableDailyFeedReport;
      let enableProductNotifications = toggleNotificationsRequest.enableProductNotifications;
      let newSettings = {
        frameworkConfig: {
          notifications: {
            disabled: !isTrue(frameworkConfig.notifications.disabled),
            accountAlerts: enableAccountAlerts,
            dailyFeedReport: enableDailyFeedReport,
            productNotifications: enableProductNotifications,
          }
        }
      };
      settingsIsLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/settings", requestOptions).then((response) => {
          if (response.status === 200) {
            return;
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ?
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
              response.text().then(t => { throw new Error(t) });
          }
        }).then(() => {
          // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
          if (newSettings.username) {
            account.username = newSettings.username;
          }
          if (newSettings.emailAddress) {
            account.emailAddress = newSettings.emailAddress;
          }
          if (newSettings.frameworkConfig) {
            Object.assign(frameworkConfig, newSettings.frameworkConfig);
          }
          setLastServerMessage(t('settingsUpdated'));
        }).catch((error) => {
          if (error.name === 'TypeError') {
            setLastServerMessage(t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            setLastServerMessage(t('requestTimedOut'));
          } else {
            setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          settingsIsLoading.value = false;
        });
      }).catch((error) => {
        handleServerError(error);
        settingsIsLoading.value = false;
      });
    }

    function updateAccount(updateAccountRequest) {
      let emailAddress = updateAccountRequest.emailAddress;
      let newSettings = {
        emailAddress: emailAddress
      };
      settingsIsLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/settings", requestOptions).then((response) => {
          if (response.status === 200) {
            return;
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ?
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
              response.text().then(t => { throw new Error(t) });
          }
        }).then(() => {
          // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
          if (newSettings.emailAddress) {
            account.emailAddress = newSettings.emailAddress;
          }
          setLastServerMessage(t('settingsUpdated'));
        }).catch((error) => {
          if (error.name === 'TypeError') {
            setLastServerMessage(t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            setLastServerMessage(t('requestTimedOut'));
          } else {
            setLastServerMessage(error.message);
          }
        }).finally(() => {
          settingsIsLoading.value = false;
          clearTimeout(timeoutId);
        });
      }).catch((error) => {
        handleServerError(error);
        settingsIsLoading.value = false;
      });
    }

    function openSettings() {
      isLoading.value = true; // top-level
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/settings", requestOptions)
          .then((response) => {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            if (response.status === 200) {
              return isJson ? response.json() : {};
            } else {
              return isJson ?
                response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
                response.text().then(t => { throw new Error(t) });
            }
          }).then((data) => {
            Object.assign(account, {
              username: data.username,
              emailAddress: data.emailAddress,
              authProvider: data.authProvider,
              authProviderProfileImgUrl: data.authProviderProfileImgUrl,
              authProviderUsername: data.authProviderUsername
            })
            Object.assign(frameworkConfig, data.frameworkConfig);
            Object.assign(subscription, data.subscription);
            showSettingsPanel.value = true;
          }).catch((error) => {
            handleServerError(error);
            isLoading.value = false; // top-level 
          }).finally(() => {
            isLoading.value = false; // top-level 
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        handleServerError(error);
        isLoading.value = false; // top-level
      });
    }

    function exportOpml() {
      settingsIsLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/queues/opml", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ?
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
              response.text().then(t => { throw new Error(t) });
          }
        }).then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'feedgears-opml-export.xml';
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          setLastServerMessage(t('opmlExportDownloaded'));
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            setLastServerMessage(t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            setLastServerMessage(t('requestTimedOut'));
          } else {
            setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          settingsIsLoading.value = false;
        });
      }).catch((error) => {
        handleServerError(error);
        settingsIsLoading.value = false;
      });
    }

    function finalizeDeactivation() {
      settingsIsLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/deregister", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ?
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
              response.text().then(t => { throw new Error(t) });
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            setLastServerMessage(t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            setLastServerMessage(t('requestTimedOut'));
          } else {
            setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          settingsIsLoading.value = false;
          auth.tearDownLoggedInSession();
          router.value.push("/app");
        });
      }).catch((error) => {
        handleServerError(error);
        settingsIsLoading.value = false;
      });
    }

    function initPasswordReset() {
      settingsIsLoading.value = true;
      auth.pwResetWithSupplied(account.username, account.emailAddress)
        .then(() => {
          setLastServerMessage(t('checkEmailForFurther'));
        })
        .catch((error) => {
          setLastServerMessage(error);
        })
        .finally(() => {
          settingsIsLoading.value = false;
        });
    }

    function submitOrder() {
      settingsIsLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/order", requestOptions)
          .then((response) => {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            if (response.status === 200) {
              return isJson ? response.json() : {};
            } else {
              return isJson ?
                response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
                response.text().then(t => { throw new Error(t) });
            }
          }).then((data) => {
            window.location.href = data.sessionUrl;
          }).catch((error) => {
            console.log(error);
            if (error.name === 'TypeError') {
              setLastServerMessage(t('somethingHorribleHappened'));
            } else if (error.name === 'AbortError') {
              setLastServerMessage(t('requestTimedOut'));
            } else {
              setLastServerMessage(error.message);
            }
          }).finally(() => {
            clearTimeout(timeoutId);
            settingsIsLoading.value = false;
          });
      }).catch((error) => {
        handleServerError(error);
        settingsIsLoading.value = false;
      });
    }

    function cancelSubscription() {
      settingsIsLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/subscriptions", requestOptions)
          .then((response) => {
            if (response.status === 200) {
              auth.unsubscribe();
              subscription.cancelAtPeriodEnd = true;
              setLastServerMessage(t('yourSubscriptionWasCanceledClickToResume'));
            } else {
              let contentType = response.headers.get("content-type");
              let isJson = contentType && contentType.indexOf("application/json") !== -1;
              return isJson ?
                response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
                response.text().then(t => { throw new Error(t) });
            }
          }).catch((error) => {
            console.log(error);
            if (error.name === 'TypeError') {
              setLastServerMessage(t('somethingHorribleHappened'));
            } else if (error.name === 'AbortError') {
              setLastServerMessage(t('requestTimedOut'));
            } else {
              setLastServerMessage(error.message);
            }
          }).finally(() => {
            clearTimeout(timeoutId);
            settingsIsLoading.value = false;
          });
      }).catch((error) => {
        handleServerError(error);
        settingsIsLoading.value = false;
      });
    }

    function resumeSubscription() {
      settingsIsLoading.value = true;
      auth.getTokenSilently().then((token) => {
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
        fetch(baseUrl + "/subscriptions", requestOptions).then((response) => {
          if (response.status === 200) {
            auth.subscribe();
            subscription.cancelAtPeriodEnd = false;
            setLastServerMessage(t('yourSubscriptionWasResumed'));
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ?
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
              response.text().then(t => { throw new Error(t) });
          }
        }).catch((error) => {
          if (error.name === 'TypeError') {
            setLastServerMessage(t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            setLastServerMessage(t('requestTimedOut'));
          } else {
            setLastServerMessage(error.message);
          }
        }).finally(() => {
          clearTimeout(timeoutId);
          settingsIsLoading.value = false;
        });
      }).catch((error) => {
        handleServerError(error);
        settingsIsLoading.value = false;
      });
    }
    // 
    // 
    // 
    watch(auth, (newAuth) => {
      if (newAuth.isAuthenticated) {
        const storedQueues = localStorage.getItem('queues');
        if (storedQueues) {
          Object.assign(queues, JSON.parse(storedQueues));
        }
        const storedArticleLists = localStorage.getItem('articleListsByQueue');
        if (storedArticleLists) {
          Object.assign(articleListsByQueue, JSON.parse(storedArticleLists));
        }
        if (queues.length > 0 && articleListsByQueue) {
          if (!selectedQueueId.value) {
            setSelectedQueueId(queues[0].id);
          } else {
            Object.assign(articleList, articleListsByQueue[selectedQueueId.value]);
          }
          rebuildLunrIndexes();
        } else {
          refreshQueues(null, true); // need staging posts for all queues and queues definitions 
        }
        // schedule the subscription-metrics refresh timer 
        refreshIntervalId.value = setInterval(() => {
          checkForNewSubscriptionMetrics();
        }, 60_000 * 10); // 10 minutes (in ms) 
      } else {
        // unschedule the refresh timer 
        refreshIntervalId.value = null;
      }
    });
    // 
    // 
    // 
    onMounted(() => {
      auth.getTokenSilently()
        .catch(() => { })
        .finally(() => {
          if (auth.isAuthenticated) {
            console.log("home: authenticated on mount");
          } else {
            console.log("home: not authenticated on mount");
          }
        });
      window.addEventListener("keydown", keyHandler);
      if (auth.isAuthenticated) {
        refreshQueues(null, true); // need staging posts for all queues, and queues definitions 
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener("keydown", keyHandler);
    });
    // 
    // 
    // 
    return {
      // 
      auth,
      router,
      t, 
      nativeNotifications, 
      xs: display.xs, 
      // computed 
      isModalShowing,
      filteredArticleList,
      filteredQueueIdentOptions,
      allFilterPills,
      sharingOptions,
      showCardLayout,
      showListLayout,
      showQueueRefreshIndicator,
      // data  
      loginIsLoading, // imported 
      authServerMessage, // imported 
      refreshIntervalId,
      isLoading,
      continueIsLoading,
      finalizeIsLoading,
      refreshQueuesIsLoading,
      settingsIsLoading,
      showQueueDeleteConfirmation,
      queueIdToDelete,
      showQueueMarkAsReadConfirmation,
      queueIdToMarkAsRead,
      subscriptionToShow,
      showSubscriptionMetrics,
      showNotificationWarning,
      showFilterHelp,
      showQueueFilterPills,
      showQueueDashboard,
      queueLayout,
      showQueueConfigPanel,
      configuredQueueId,
      showOpmlUploadPanel,
      atStep2,
      queueConfigRequests,
      opmlErrors,
      showSettingsPanel,
      account,
      frameworkConfig,
      subscription,
      showHelpPanel,
      showSelectedPost,
      selectedPost, // selected post to show on the post card modal (while in list view) 
      selectedItem, // selected post list item (i.e., scrolling through the list in list view) 
      queues, // all queues 
      selectedQueueId, // currently selected queue Id 
      previousQueueId, // previously selected queue Id 
      articleListsByQueue, // all queues 
      articleList, // inbound queue for the currently selected queue  
      articleListFilter, // user-supplied filter text (lunrjs query expression) 
      articleListSortOrder,
      latestSubscriptionMetricsByQueue,
      // functions 
      logout, // imported 
      login, // imported 
      shouldShowAlert,
      dismissAlert,
      openPost,
      selectNextPost,
      selectPreviousPost,
      openPostUrl,
      share,
      toggleArticleListSortOrder,
      updateFilter,
      openSubscriptionMetrics,
      countArticleList,
      countPublished,
      checkForNewSubscriptionMetrics,
      updatePostReadStatus,
      updatePostPubStatus,
      newQueue,
      uploadOpml,
      continueOpmlUpload,
      finalizeOpmlUpload,
      cancelOpmlUpload,
      createQueue,
      updateQueue,
      dismissQueueConfigPanel,
      deleteQueue,
      performQueueDelete,
      cancelQueueDelete,
      markQueueAsRead,
      performQueueMarkAsRead,
      cancelQueueMarkAsRead,
      keyHandler,
      updateNotificationPreferences,
      toggleNotifications,
      updateAccount,
      openSettings,
      exportOpml,
      finalizeDeactivation,
      initPasswordReset,
      submitOrder,
      cancelSubscription,
      resumeSubscription,
      getSelectedQueue,
    }
  },
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
