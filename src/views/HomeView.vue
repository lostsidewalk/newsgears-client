<template>
  <v-app>
    <!-- pre-auth app bar -->
    <v-app-bar
      v-if="!isAuthenticated"
      app
      location="top"
      :scroll-behavior="'elevate'"
    >
      <template #title>
        <span class="feedgears-rss">
          FeedGears RSS
        </span>
      </template>
      <template #prepend>
        <v-app-bar-nav-icon
          icon="fa-rss"
          :aria-label="$t('feedGearsRssLogo')"
        />
      </template>
      <v-toolbar-items>
        <GoBack />
        <DisplayModeButton />
      </v-toolbar-items>
    </v-app-bar>

    <!-- pre-auth main -->
    <v-main v-show="!isAuthenticated">
      <BannerPanel :show-auth="false" />

      <AuthPanel
        v-show="!isAuthenticated"
        :server-message="roAuthServerMessage"
        :is-loading="roLoginIsLoading"
        @login="login"
      />
      <FooterPanel app />
    </v-main>

    <!-- post-auth main -->
    <v-main v-show="isAuthenticated">
      <!-- progress bar -->
      <v-progress-linear
        :indeterminate="isLoading"
        :aria-label="$t('loadingProgress')"
      />
      <!-- TODO: extract component -->
      <!-- app bar (top-level)-->
      <v-app-bar
        app
        :location="'top'"
      >
        <template #title>
          <span class="feedgears-rss d-none d-sm-flex">
            FeedGears RSS
          </span>
        </template>
        <template #prepend>
          <v-app-bar-nav-icon
            icon="fa-rss"
            :aria-label="$t('toggleDashboard')"
            :title="$t('toggleDashboard')"
            @click.stop="showQueueDashboard = !showQueueDashboard"
          />
        </template>
        <template #append>
          <ControlPanel
            :base-url="baseUrl"
            :show-settings-panel="showSettingsPanel"
            :show-help-panel="showHelpPanel"
            :show-notification-warning="roShowNotificationWarning"
            :is-authenticated="isAuthenticated"
            @showSettings="openSettings"
            @showHelp="showHelpPanel = !showHelpPanel"
            @logout="$event => { logout(); disconnectBroker(); }"
          />
        </template>
      </v-app-bar>
      <!-- TODO: extract component -->
      <!-- navigation drawer / left side -->
      <v-navigation-drawer
        v-model="showQueueDashboard"
        app
        :location="'start'"
        :class="xs ? 'w-100' : 'w-50'"
        elevation="12"
        temporary
      >
        <v-btn-group>
          <!-- new queue button -->
          <v-btn
            :size="buttonSize"
            accesskey="q"
            :title="t('createNewQueue')"
            prepend-icon="fa-plus"
            :text="t('createNewQueue')"
            @click.stop="newQueue"
          />
          <!-- upload OPML button -->
          <v-btn
            :size="buttonSize"
            accesskey="m"
            :title="t('uploadOPML')"
            prepend-icon="fa-file"
            :text="t('uploadOPML')"
            @click.stop="uploadOpml"
          />
          <v-btn 
            :size="buttonSize"
            :title="t('cardLayout')"
            prepend-icon="fa-bars"
            @click.stop="showQueueCards = true"
          />
          <v-btn 
            :size="buttonSize"
            :title="t('listLayout')"
            prepend-icon="fa-table"
            @click.stop="showQueueCards = false"
          />
        </v-btn-group>
        <v-sheet v-if="showQueueCards">
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
            v-for="queue in queueStore.queues"
            v-slot="{ isHovering, props }"
            :key="queue.value"
          >
            <QueueSelectButton
              variant="flat"
              :elevation="isHovering ? 12 : 0"
              :queue="queue"
              :article-list="queueStore.articleListsByQueue[queue.id]"
              :feed-url="feedUrl"
              class="ma-4"
              :class="queueStore.selectedQueueId === queue.id ? 'selected-queue' : ''"
              :is-selected="queueStore.selectedQueueId === queue.id"
              v-bind="props"
              @click.stop="$event => { setSelectedQueueId(queue.id); $nextTick(() => showQueueDashboard = false); }"
              @manageSubscriptions="openQueueConfigPanel(queue.id)"
              @updateFilter="updateFilter"
              @showSubscriptionMetrics="openSubscriptionMetrics"
            />
          </v-hover>
        </v-sheet>
        <v-sheet v-else>
          <v-alert
            v-if="shouldShowAlert('theseAreAllOfYourSubscriptions')"
            closable
            variant="outlined"
            border="top"
            icon="fa-question-circle"
            :text="t('theseAreAllOfYourSubscriptions')"
            class="ma-4"
            @click.close="dismissAlert('theseAreAllOfYourSubscriptions')"
          />
          <v-table
            class="ma-4 overflow-auto flex-grow-1"
            fixed-header
          >
            <thead style="text-align: center;">
              <th
                class="pa-1 h-auto"
                style="max-height: 70px;max-width: 70px;"
              />
              <th class="pa-1">
                &nbsp;
              </th>
              <!-- unread count -->
              <th class="pa-1">
                <v-icon
                  :title="$t('unreadCount', { n: 0 })"
                  size="small"
                  icon="fa-eye"
                />
              </th>
              <!-- read count -->
              <th class="pa-1">
                <v-icon
                  :title="$t('readCount', { n: 0 })"
                  size="small"
                  icon="fa-check-square-o"
                />
              </th>
              <!-- published count -->
              <th class="pa-1">
                <v-icon
                  :title="$t('publishedCount', { n: 0 })"
                  size="small"
                  icon="fa-star"
                />
              </th>
              <!-- total count -->
              <th class="pa-1">
                <v-icon
                  :title="$t('totalCount', { n: 0 })"
                  size="small"
                  icon="fa-newspaper-o"
                />
              </th>
            </thead>
            <tbody style="text-align: left;">
              <tr
                v-for="subscription in queueStore.allSubscriptions"
                :key="subscription"
              >
                <td
                  style="text-align: center;"
                  class="pa-1"
                >
                  <v-img
                    v-if="subscription.icon"
                    class="rounded h-auto"
                    :src="subscription.icon.url"
                    :title="subscription.icon.title"
                    :alt="$t('feedLogoImage')"
                    contain
                    style="max-height: 70px;max-width: 70px;"
                  />
                  <v-img
                    v-if="subscription.image && !subscription.icon"
                    class="rounded h-auto"
                    :src="subscription.image.url"
                    :title="subscription.image.title"
                    :alt="$t('feedLogoImage')"
                    contain
                    style="max-height: 70px;max-width: 70px;"
                  />
                  <v-img
                    v-if="!subscription.image && !subscription.icon"
                    class="rounded h-auto"
                    src="rss_logo.svg"
                    :alt="$t('rssLogo')"
                    contain
                    style="max-height: 70px;max-width: 70px;"
                  />
                </td>
                <td>{{ subscription.title }}</td>
                <!-- unread count-->
                <td
                  style="text-align: center;"
                  class="clickable"
                  @click="$event => {
                    setSelectedQueueId(subscription.queueId);
                    $nextTick(() => updateFilter({ name: 'subAndMode', queueId: subscription.queueId, subValue: subscription.title, modeValue: 'UNREAD' }));
                  }"
                >
                  {{ articleListsBySubscription[subscription.id] ?
                    articleListsBySubscription[subscription.id].filter((post) => !post.isRead).length :
                    0
                  }}
                </td>
                <!-- read count-->
                <td
                  style="text-align: center;"
                  class="clickable"
                  @click="$event => {
                    setSelectedQueueId(subscription.queueId);
                    $nextTick(() => updateFilter({ name: 'subAndMode', queueId: subscription.queueId, subValue: subscription.title, modeValue: 'READ' }));
                  }"
                >
                  {{ articleListsBySubscription[subscription.id] ?
                    articleListsBySubscription[subscription.id].filter((post) => post.isRead).length :
                    0
                  }}
                </td>
                <!-- starred count-->
                <td
                  style="text-align: center;"
                  class="clickable"
                  @click="$event => {
                    setSelectedQueueId(subscription.queueId);
                    $nextTick(() => updateFilter({ name: 'subAndMode', queueId: subscription.queueId, subValue: subscription.title, modeValue: 'PUBLISHED' }));
                  }"
                >
                  {{ articleListsBySubscription[subscription.id] ?
                    articleListsBySubscription[subscription.id].filter((post) => post.isPublished).length :
                    0
                  }}
                </td>
                <!-- total count-->
                <td
                  style="text-align: center;"
                  class="clickable"
                  @click="$event => {
                    setSelectedQueueId(subscription.queueId);
                    $nextTick(() => updateFilter({ name: 'subscription', queueId: subscription.queueId, value: subscription.title }));
                  }"
                >
                  {{ articleListsBySubscription[subscription.id] ? articleListsBySubscription[subscription.id].length :
                    0 }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-sheet>
      </v-navigation-drawer>
      <!-- delete confirmation modal -->
      <v-dialog
        v-model="showQueueDeleteConfirmation"
        scrollable
      >
        <ConfirmationDialog
          class="rounded"
          :prompt="t('confirmDeleteQueue')"
          @confirm="$event => { performQueueDelete(); showQueueDeleteConfirmation = false; }"
          @cancel="$event => { cancelQueueDelete(); showQueueDeleteConfirmation = false; }"
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
          @confirm="$event => { performQueueMarkAsRead(); showQueueMarkAsReadConfirmation = false; }"
          @cancel="$event => { cancelQueueMarkAsRead(); showQueueMarkAsReadConfirmation = false; }"
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
          :account="roAccount"
          :subscription="roSubscription"
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
          :base-url="baseUrl"
          :queue-under-config="roQueueUnderConfig"
          @save="createQueue"
          @update="updateQueue"
          @addSubscription="addSubscription"
          @deleteSubscription="deleteSubscription"
          @updateSubscriptionAuth="updateSubscriptionAuth"
          @dismiss="dismissQueueConfigPanel"
        />
      </v-dialog>
      <!-- opml upload modal -->
      <v-dialog
        v-model="showOpmlUploadPanel"
        fullscreen
        scrollable
      >
        <OpmlUploadPanel
          :is-loading="roFinalizeIsLoading || roContinueIsLoading"
          :at-step2="roAtStep2"
          :errors="roOpmlErrors"
          :queue-config-requests="roQueueConfigRequests"
          @continueUpload="continueOpmlUpload"
          @finalizeUpload="$event => finalizeOpmlUpload().then(() => showQueueDashboard = true)"
          @returnToStep1="returnToStep1"
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
          :title="roSubscriptionToShow.title"
          :subscription-metrics="roSubscriptionToShow.subscriptionMetrics"
          @dismiss="showSubscriptionMetrics = false"
        />
      </v-dialog>
      <!-- TODO: extract component -->
      <!-- queue layout control -->
      <v-container class="queue-container d-flex flex-grow-1 flex-column rounded justify-space-between flex-wrap">
        <v-label
          v-if="queueStore.selectedQueueId"
          class="ma-2 font-weight-bold"
        >
          {{ roSelectedQueueTitle }}
        </v-label>
        <v-divider v-if="queueStore.selectedQueueId" />
        <QueueLayout
          :disable-list-layout="showListLayout"
          :disable-card-layout="showCardLayout"
          :disable-table-layout="showTableLayout"
          :show-queue-refresh-indicator="showQueueRefreshIndicator"
          :sort-order="roArticleListSortOrder"
          @list="switchToListLayout"
          @card="switchToCardLayout"
          @table="switchToTableLayout"
          @toggleQueueFilterPills="toggleQueueFilterPills"
          @refreshQueues="refreshQueues(null, true)"
          @markAsRead="$event => { markQueueAsRead(queueStore.selectedQueueId); showQueueMarkAsReadConfirmation = true; }"
          @toggleSortOrder="toggleArticleListSortOrder"
        />
        <v-divider />
        <!-- queue filter  -->
        <QueueFilter
          :filter="roArticleListFilter"
          :queue-length="filteredArticleList.length"
          :queue-name="roSelectedQueueTitle"
          :queues="queueStore.queues"
          @update:modelValue="updateArticleListFilter"
        />
        <QueueFilterPills
          v-if="queueStore.selectedQueueId && roShowQueueFilterPills"
          :show-unread="roShowUnreadPosts"
          :show-read="roShowReadPosts"
          :show-read-later="roShowReadLaterPosts"
          :show-starred="roShowStarredPosts"
          @toggleUnread="toggleUnreadPosts"
          @toggleRead="toggleReadPosts"
          @toggleReadLater="toggleReadLaterPosts"
          @toggleStarred="toggleStarredPosts"
        />
      </v-container>
      <!-- TODO: extract component -->
      <!-- queue container (cards) -->
      <div v-if="showCardLayout && filteredArticleList.length > 0">
        <PostCard
          v-for="post in filteredArticleList"
          :id="'post_' + post.id"
          :key="post.id"
          :post="post"
          :sharing-options="sharingOptions"
          :collapsed="true"
          class="ma-4"
          @openPostUrl="openPostUrl(post.id)"
          @updatePostReadStatus="updatePostReadStatus"
          @updatePostPubStatus="updatePostPubStatus"
          @updateFilter="updateFilter"
          @share="$event => share($event.sharingOption, $event.post)"
        />
      </div>
      <v-dialog
        v-if="showListLayout || showTableLayout"
        v-model="showSelectedPost"
        scrollable
        fullscreen
      >
        <PostCard
          :id="'post_' + roSelectedPost.id"
          :post="roSelectedPost"
          :sharing-options="sharingOptions"
          @openPostUrl="openPostUrl(roSelectedPost.id);"
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
      <!-- TODO: extract component -->
      <v-list
        v-if="showListLayout && filteredArticleList.length > 0"
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
          @openPost="openPost(post.id); showSelectedPost = true;"
          @updatePostReadStatus="updatePostReadStatus"
          @updatePostPubStatus="updatePostPubStatus"
        />
      </v-list>
      <v-container
        v-if="!filteredArticleList || filteredArticleList.length === 0"
        class="queue-container d-flex flex-column flex-grow-1 rounded"
      >
        <v-alert info>
          {{ t('noArticlesInThisQueue') }}
        </v-alert>
      </v-container>
      <!-- TODO: extract component -->
      <v-table
        v-if="showTableLayout && filteredArticleList.length > 0"
        class="ma-4"
        fixed-header
      >
        <tbody style="text-align: left;">
          <PostTableRow
            v-for="post in filteredArticleList"
            :id="'post_' + post.id"
            :key="post"
            :post="post"
            :sharing-options="sharingOptions"
            class="ma-4 rounded"
            @openPost="openPost(post.id); showSelectedPost = true;"
            @openPostUrl="openPostUrl(post.id)"
            @updatePostReadStatus="updatePostReadStatus"
            @updatePostPubStatus="updatePostPubStatus"
          />
        </tbody>
      </v-table>
    </v-main>
  </v-app>
</template>

<script>
import { inject, ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';

import { useAuth } from '@/composable/useAuth.js';
import { useSettings } from '@/composable/useSettings.js';
import { useNotifications } from '@/composable/useNotifications.js';
import { useQueues } from '@/composable/useQueues.js';
import { useLayout } from '@/composable/useLayout.js';
import { useSharing } from '@/composable/useSharing.js';

// import debounce from 'lodash.debounce';
// components 
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import GoBack from "@/components/layout/GoBack.vue";
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";
import AuthPanel from "@/components/auth-panel/AuthPanel.vue";
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
// post 
import PostCard from "@/components/post/PostCard.vue";
import PostListItem from "@/components/post/PostListItem.vue";
import PostTableRow from "@/components/post/PostTableRow.vue";
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
    // item 
    PostCard,
    PostListItem,
    PostTableRow,
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
    const auth = inject('auth');
    const isAuthenticated = inject('isAuthenticated');
    const { router } = useRouter();
    const { t } = useI18n();
    const display = useDisplay();
    const {
      roAuthServerMessage,
      roLoginIsLoading,
      login,
      logout } = useAuth();
    const {
      showSettingsPanel, // rw 
      roAccount,
      roSubscription,
      roSettingsIsLoading,
      openSettings,
      updateNotificationPreferences,
      exportOpml,
      finalizeDeactivation,
      initPasswordReset,
      submitOrder,
      cancelSubscription,
      resumeSubscription,
      toggleNotifications,
      updateAccount } = useSettings(props);
    const {
      roShowNotificationWarning,
      shouldShowAlert,
      dismissAlert,
    } = useNotifications();
    const {
      queueStore,
      roSelectedQueueTitle,
      roPreviousQueueId,
      roQueueIdToDelete,
      roQueueIdToMarkAsRead,
      roSelectedPost,
      roArticleList,
      roRefreshQueuesIsLoading,
      roArticleListFilter,
      roArticleListSortOrder,
      roShowQueueFilterPills,
      roContinueIsLoading,
      roAtStep2,
      roQueueConfigRequests,
      roFinalizeIsLoading,
      roOpmlErrors,
      roSubscriptionToShow,
      roQueueUnderConfig,
      roQueueConfigIsLoading,
      roShowUnreadPosts,
      roShowReadPosts,
      roShowReadLaterPosts,
      roShowStarredPosts,
      // 
      showOpmlUploadPanel, //rw 
      showSubscriptionMetrics, // rw 
      showQueueConfigPanel, // rw 
      // 
      filteredArticleList, // computed 
      showQueueRefreshIndicator, // computed 
      selectedTab, // computed 
      tabModel, // computed 
      // 
      connectBroker,
      disconnectBroker, 
      refreshQueues,
      updatePostReadStatus,
      updatePostPubStatus,
      getPostFromQueue,
      toggleArticleListSortOrder,
      toggleQueueFilterPills,
      toggleFilterMode,
      updateFilter,
      deleteSelectedQueue,
      performQueueDelete,
      cancelQueueDelete,
      markSelectedQueueAsRead,
      markQueueAsRead,
      performQueueMarkAsRead,
      cancelQueueMarkAsRead,
      updateArticleListFilter,
      setSelectedQueueId,
      restorePreviousQueueId,
      getSelectedQueue,
      openPost,
      openPostUrl,
      selectNextPost,
      selectPreviousPost,
      uploadOpml,
      continueOpmlUpload,
      finalizeOpmlUpload,
      returnToStep1,
      cancelOpmlUpload,
      checkForNewSubscriptionMetrics,
      openSubscriptionMetrics,
      newQueue,
      openQueueConfigPanel,
      createQueue,
      updateQueue,
      dismissQueueConfigPanel,
      addSubscription,
      deleteSubscription,
      updateSubscriptionAuth,
      toggleUnreadPosts,
      toggleReadPosts,
      toggleReadLaterPosts,
      toggleStarredPosts,
    } = useQueues(props);
    const {
      roLayout,
      showCardLayout,
      showListLayout,
      showTableLayout,
      switchToListLayout,
      switchToCardLayout,
      switchToTableLayout,
    } = useLayout();
    const {
      sharingOptions,
      share
    } = useSharing();

    const refreshIntervalId = ref(null);
    const showQueueDashboard = ref(false);
    const showQueueCards = ref(true);
    const showHelpPanel = ref(false);
    const showSelectedPost = ref(false);
    const selectedItem = reactive({}); // selected post list item (i.e., scrolling through the list in list view) 
    const showQueueDeleteConfirmation = ref(false);
    const showQueueMarkAsReadConfirmation = ref(false);
    // 
    const isModalShowing = computed(() => {
      return showSettingsPanel.value || showHelpPanel.value || showQueueConfigPanel.value || showOpmlUploadPanel.value || showSubscriptionMetrics.value;
    });
    const isLoading = computed(() => {
      return roSettingsIsLoading.value || roQueueConfigIsLoading.value || roContinueIsLoading.value || roFinalizeIsLoading.value || roRefreshQueuesIsLoading.value || roSettingsIsLoading.value;
    });
    // 
    const articleListsBySubscription = computed(() => {
      const bySub = {};

      for (let i = 0; i < queueStore.queues.length; i++) {
        const q = queueStore.queues[i];
        const a = queueStore.articleListsByQueue[q.id];

        for (let j = 0; j < a.values.length; j++) {
          const subId = a.values[j].subscriptionId;

          if (bySub[subId.toString()] === undefined) {
            bySub[subId.toString()] = [];
          }

          const l = bySub[subId.toString()];
          l.push(a.values[j]);
        }
      }

      return bySub;
    });
    // required 
    function keyHandler(event) {
      if (!event.key) {
        return;
      }
      // 
      // ESC key handling 
      // 
      if (event.key === 'Escape') {
        // bail if a modal is showing
        if (isModalShowing.value) {
          return;
        }
        // otherwise hide the queue dashboard if it's showing 
        if (showQueueDashboard.value) {
          showQueueDashboard.value = false;
        }
        return;
      }
      // 
      // queue-related key handling 
      // 
      if (queueStore.selectedQueueId) {
        let t = event.target.getAttribute("type") || event.target.type;
        if (t === 'text') {
          return;
        }
        // 
        // SHIFT + E KEY (CONFIGURE SELECTED QUEUE)
        // 
        if (event.key === 'E' && event.shiftKey === true) {
          openQueueConfigPanel(queueStore.selectedQueueId);
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
          showQueueMarkAsReadConfirmation.value = true;
          event.stopPropagation();
          event.preventDefault();
          // 
          // SHIFT + D KEY (DELETE QUEUE) 
          // 
        } else if (event.key === 'D' && event.shiftKey === true) {
          deleteSelectedQueue();
          showQueueDeleteConfirmation.value = true;
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
      }
    }
    // 
    // 
    // 
    watch(isAuthenticated, (newIsAuthenticated) => {
      if (newIsAuthenticated) {
        connectBroker();
        refreshQueues(null, true);
        // schedule the subscription-metrics refresh timer 
        refreshIntervalId.value = setInterval(() => {
          checkForNewSubscriptionMetrics();
        }, 60_000 * 10); // 10 minutes (in ms) 
      } else {
        // unschedule the refresh timer 
        refreshIntervalId.value = null;
        disconnectBroker();
      }
    });
    // 
    // 
    // 
    onMounted(() => {
      auth.getTokenSilently()
        .catch(() => {})
        .finally(() => {
          if (isAuthenticated.value) {
            console.log("home: authenticated on mount");
            connectBroker();
            
          } else {
            console.log("home: not authenticated on mount");
          }
        });
      window.addEventListener("keydown", keyHandler);
    });

    onBeforeUnmount(() => {
      disconnectBroker();
      window.removeEventListener("keydown", keyHandler);
    });
    // 
    // 
    // 
    return {
      // 
      auth,
      isAuthenticated,
      router,
      t,
      xs: display.xs,
      // computed 
      isModalShowing,
      sharingOptions,
      showQueueRefreshIndicator,
      articleListsBySubscription,
      // auth module data 
      roAuthServerMessage,
      roLoginIsLoading,
      // opml module data 
      showOpmlUploadPanel,
      roContinueIsLoading,
      roAtStep2,
      roQueueConfigRequests,
      roFinalizeIsLoading,
      roOpmlErrors,
      // settings module data 
      roAccount,
      roSubscription,
      roSettingsIsLoading,
      showSettingsPanel,
      // queues module data 
      roShowQueueFilterPills,
      roQueueIdToDelete,
      roQueueIdToMarkAsRead,
      roSelectedPost, // selected post to show on the post card modal (while in list view) 
      roSelectedQueueTitle, // currently selected queue title 
      roPreviousQueueId, // previously selected queue Id 
      roArticleList, // inbound queue for the currently selected queue  
      roArticleListFilter, // user-supplied filter text (lunrjs query expression) 
      roArticleListSortOrder,
      roRefreshQueuesIsLoading,
      roShowUnreadPosts,
      roShowReadPosts,
      roShowReadLaterPosts,
      roShowStarredPosts,
      filteredArticleList,
      // queue config module data 
      showQueueConfigPanel,
      roQueueUnderConfig,
      roQueueConfigIsLoading,
      selectedTab,
      tabModel,
      // metrics module data 
      roSubscriptionToShow,
      showSubscriptionMetrics,
      // layout module data 
      roLayout,
      showCardLayout,
      showListLayout,
      showTableLayout,
      // notifications module data 
      roShowNotificationWarning,
      // other data 
      isLoading,
      showQueueDashboard,
      showQueueCards,
      showHelpPanel,
      showQueueDeleteConfirmation,
      showQueueMarkAsReadConfirmation,
      showSelectedPost,
      selectedItem, // selected post list item (i.e., scrolling through the list in list view) 
      // auth module functions 
      logout,
      login,
      // opml module functions 
      continueOpmlUpload,
      // settings module functions 
      updateNotificationPreferences,
      exportOpml,
      finalizeDeactivation,
      initPasswordReset,
      submitOrder,
      cancelSubscription,
      resumeSubscription,
      toggleNotifications,
      updateAccount,
      // queues module functions 
      queueStore,
      connectBroker,
      disconnectBroker,
      refreshQueues,
      openPost,
      selectNextPost,
      selectPreviousPost,
      toggleArticleListSortOrder,
      toggleQueueFilterPills,
      toggleFilterMode,
      updateFilter,
      updatePostReadStatus,
      updatePostPubStatus,
      createQueue,
      updateQueue,
      deleteSelectedQueue,
      performQueueDelete,
      cancelQueueDelete,
      markQueueAsRead,
      performQueueMarkAsRead,
      cancelQueueMarkAsRead,
      updateArticleListFilter,
      setSelectedQueueId,
      restorePreviousQueueId,
      getSelectedQueue,
      getPostFromQueue,
      toggleUnreadPosts,
      toggleReadPosts,
      toggleReadLaterPosts,
      toggleStarredPosts,
      // queue config module functions 
      addSubscription,
      deleteSubscription,
      updateSubscriptionAuth,
      // metrics module functions 
      checkForNewSubscriptionMetrics,
      openSubscriptionMetrics,
      // layout module functions 
      switchToListLayout,
      switchToCardLayout,
      switchToTableLayout,
      // other functions 
      uploadOpml,
      finalizeOpmlUpload,
      returnToStep1,
      cancelOpmlUpload,
      newQueue,
      // deleteQueue,
      // markSelectedQueueAsRead, 
      openQueueConfigPanel,
      dismissQueueConfigPanel,
      shouldShowAlert,
      dismissAlert,
      openPostUrl,
      share,
      keyHandler,
      openSettings,
    }
  },
};
</script>

<style scoped>
.feedgears-rss {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}

/** has references */
.selected-queue {
  border: 1px solid !important;
}

.queue-container {
  background-color: transparent;
}

.clickable:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
