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
        <span class="newsgears-rss">
          Newsgears RSS
        </span>
      </template>
      <template #prepend>
        <v-app-bar-nav-icon
          icon="fa-rss"
          :aria-label="$t('newsgearsRssLogo')"
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
      <!-- app bar (top-level)-->
      <AppBar
        :base-url="baseUrl"
        :show-help-panel="showHelpPanel"
        @showHelpPanel="showHelpPanel = !showHelpPanel"
        @openSettings="openSettings"
        @showQueueDashboard="showQueueDashboard = !showQueueDashboard"
      />
      <!-- navigation drawer / left side -->
      <v-navigation-drawer
        v-model="showQueueDashboard"
        app
        :location="'start'"
        :class="xs ? 'w-100' : 'w-50'"
        elevation="12"
        temporary
      >
        <QueueOperations 
          :base-url="baseUrl"
          @showQueueCards="showQueueCards = true" 
          @showListLayout="showQueueCards = false"
          @newQueue="$event => { newQueue(); showOpmlUploadPanel = false; }"
          @uploadOpml="$event => { uploadOpml(); showQueueConfigPanel = false; }"
        />
        <!-- queue config dialog -->
        <QueueConfigPanel
          v-if="showQueueConfigPanel"
          :base-url="baseUrl"
          :queue-under-config="roQueueUnderConfig"
          @save="createQueue"
          @update="updateQueue"
          @addSubscription="addSubscription"
          @deleteSubscription="deleteSubscription"
          @updateSubscriptionAuth="updateSubscriptionAuth"
          @dismiss="dismissQueueConfigPanel"
        />
        <!-- opml upload dialog -->
        <OpmlUploadPanel
          v-show="showOpmlUploadPanel"
          class="my-4"
          :is-loading="roFinalizeIsLoading || roContinueIsLoading"
          :at-step2="roAtStep2"
          :errors="roOpmlErrors"
          :queue-config-requests="roQueueConfigRequests"
          @continueUpload="continueOpmlUpload"
          @finalizeUpload="$event => finalizeOpmlUpload().then(() => showQueueDashboard = true)"
          @returnToStep1="returnToStep1"
          @cancel="cancelOpmlUpload"
        />
        <QueueCardSheet
          v-if="showQueueCards" 
          :base-url="baseUrl"
          :feed-url="feedUrl"
          @selectQueue="$event => { setSelectedQueueId($event.queueId); $nextTick(() => showQueueDashboard = false); }"
          @openQueueConfigPanel="$event => openQueueConfigPanel($event.queueId)"
          @updateFilter="updateFilter"
          @openSubscriptionMetrics="openSubscriptionMetrics"
        />
        <QueueSubscriptionSheet
          v-else 
          :base-url="baseUrl"
          @showUnread="($event) => {
            let subscription = $event.subscription;
            setSelectedQueueId(subscription.queueId);
            $nextTick(() =>
              updateFilter({
                name: 'subAndMode',
                queueId: subscription.queueId,
                subValue: subscription.title,
                modeValue: 'UNREAD',
              })
            );
          }"
          @showRead="($event) => {
            let subscription = $event.subscription;
            setSelectedQueueId(subscription.queueId);
            $nextTick(() =>
              updateFilter({
                name: 'subAndMode',
                queueId: subscription.queueId,
                subValue: subscription.title,
                modeValue: 'READ',
              })
            );
          }"
          @showAll="($event) => {
            let subscription = $event.subscription;
            setSelectedQueueId(subscription.queueId);
            $nextTick(() =>
              updateFilter({
                name: 'subscription',
                queueId: subscription.queueId,
                value: subscription.title,
              })
            );
          }"
        />
      </v-navigation-drawer>
      <!-- delete confirmation dialog -->
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
      <!-- mark as read confirmation dialog -->
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
      <!-- help dialog -->
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
      <!-- main container -->
      <v-container>
        <!-- settings -->
        <SettingsPanel
          v-show="showSettingsPanel"
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
        <!-- queue layout -->
        <QueueLayout 
          :show-list-layout="showListLayout"
          :show-card-layout="showCardLayout"
          :show-table-layout="showTableLayout"
          :show-queue-refresh-indicator="showQueueRefreshIndicator"
          :filtered-article-list="filteredArticleList" 
          @switchToListLayout="switchToListLayout" 
          @switchToCardLayout="switchToCardLayout" 
          @switchToTableLayout="switchToTableLayout" 
          @refreshQueues="$event => refreshQueues(null, true)"
          @markAsRead="$event => {
            markQueueAsRead(queueStore.selectedQueueId);
            showQueueMarkAsReadConfirmation = true;
          }"
          @toggleArticleListSortOrder="toggleArticleListSortOrder"
          @updateArticleListFilter="updateArticleListFilter"
          @toggleUnreadPosts="toggleUnreadPosts" 
          @toggleReadPosts="toggleReadPosts"
          @toggleReadLaterPosts="toggleReadLaterPosts"
        />
        <!-- card layout -->
        <CardLayout
          v-if="showCardLayout && filteredArticleList.length > 0" 
          :sharing-options="sharingOptions"
          :filtered-article-list="filteredArticleList"
          @openPostUrl="$event => openPostUrl($event.postId)"
          @updatePostReadStatus="updatePostReadStatus"
          @updateFilter="updateFilter"
          @share="$event = share($event.sharingOption, $event.post)"
        />
        <!-- list layout -->
        <ListLayout 
          v-if="showListLayout && filteredArticleList.length > 0"
          :filtered-article-list="filteredArticleList"
          @openPost="$event => { openPost($event.postId); showSelectedPost = true; }"
          @updatePostReadStatus="updatePostReadStatus"
        />
        <!-- table layout -->
        <TableLayout 
          v-if="showTableLayout && filteredArticleList.length > 0"
          :filtered-article-list="filteredArticleList"
          :sharing-options="sharingOptions"
          @openPost="$event => { openPost($event.postId); showSelectedPost = true; }"
          @openPostUrl="$event => openPostUrl($event.postId)"
          @updatePostReadStatus="updatePostReadStatus"
        />
        <!-- no articles in queue -->
        <QueueSetup 
          v-if="!filteredArticleList || filteredArticleList.length === 0" 
          :base-url="baseUrl"
          @uploadOpml="$event => { uploadOpml(); showQueueDashboard = true; showQueueConfigPanel = false; }" 
          @openQueueConfigPanel="$event => { openQueueConfigPanel($event.queueId); showQueueDashboard = true; showOpmlUploadPanel = false; }"
        />
        <!-- help panel -->
        <GlobalShortcutKeys
          v-if="!filteredArticleList || filteredArticleList.length === 0"
          class="my-4"
        />
      </v-container>
      <!-- post card dialog -->
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
    </v-main>
  </v-app>
</template>

<script>
import { inject, ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';

import { useAuth } from '@/composable/useAuth.js';
import { useSettings } from '@/composable/useSettings.js';
import { useQueues } from '@/composable/useQueues.js';
import { useLayout } from '@/composable/useLayout.js';
import { useSharing } from '@/composable/useSharing.js';

// import debounce from 'lodash.debounce';
// components 
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import AppBar from '@/components/app-bar/AppBar.vue';
import GoBack from "@/components/layout/GoBack.vue";
import DisplayModeButton from "@/components/layout/DisplayModeButton.vue";
import AuthPanel from "@/components/auth-panel/AuthPanel.vue";
// confirmation dialog 
import ConfirmationDialog from '@/components/layout/ConfirmationDialog.vue';
// queue configuration panel 
import QueueConfigPanel from "@/components/queue-config-panel/QueueConfigPanel.vue";
// OPML upload panel 
import OpmlUploadPanel from "@/components/opml-upload-panel/OpmlUploadPanel.vue";
// subscription metrics panel 
import SubscriptionMetrics from '@/components/queue-config-panel/SubscriptionMetrics.vue';
// settings 
import SettingsPanel from '@/components/settings-panel/SettingsPanel.vue';
import HelpPanel from '@/components/help-panel/HelpPanel.vue';
import GlobalShortcutKeys from '@/components/help-panel/GlobalShortcutKeys.vue';
// queue operations 
import QueueOperations from '@/components/queue/QueueOperations.vue';
// queue card sheet 
import QueueCardSheet from '@/components/queue/QueueCardSheet.vue';
// queue subscription sheet 
import QueueSubscriptionSheet from '@/components/queue/QueueSubscriptionSheet.vue';
// queue layout 
import QueueLayout from '@/components/queue/QueueLayout.vue';
// card layout 
import CardLayout from '@/components/post/CardLayout.vue';
// list layout 
import ListLayout from '@/components/post/ListLayout.vue';
// table layout 
import TableLayout from '@/components/post/TableLayout.vue';
// post card
import PostCard from "@/components/post/PostCard.vue";
// queue setup 
import QueueSetup from '@/components/queue/QueueSetup.vue';
// footer panel 
import FooterPanel from "@/components/footer-panel/FooterPanel.vue";
// import QueueDetails from '@/components/queue/QueueDetails.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';


export default {
  name: "HomeView",
  components: {
    BannerPanel,
    AppBar,
    GoBack,
    DisplayModeButton,
    AuthPanel,
    // dialogs 
    ConfirmationDialog,
    QueueConfigPanel,
    OpmlUploadPanel,
    SubscriptionMetrics,
    // settings 
    SettingsPanel,
    HelpPanel,
    GlobalShortcutKeys,
    // operations 
    QueueOperations,
    // card sheet 
    QueueCardSheet, 
    // subscription sheet 
    QueueSubscriptionSheet,
    // layout 
    QueueLayout, 
    // card layout 
    CardLayout,
    // list layout 
    ListLayout, 
    // table layout 
    TableLayout,
    // post card 
    PostCard,
    // queue setup
    QueueSetup,
    // footer 
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
      queueStore,
      roSelectedPost,
      roRefreshQueuesIsLoading,
      roContinueIsLoading,
      roAtStep2,
      roQueueConfigRequests,
      roFinalizeIsLoading,
      roOpmlErrors,
      roSubscriptionToShow,
      roQueueUnderConfig,
      roQueueConfigIsLoading,
      // 
      showOpmlUploadPanel, //rw 
      showSubscriptionMetrics, // rw 
      showQueueConfigPanel, // rw 
      // 
      filteredArticleList, // computed 
      showQueueRefreshIndicator, // computed 
      // 
      connectBroker,
      disconnectBroker, 
      refreshQueues,
      updatePostReadStatus,
      getPostFromQueue, // no 
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
    const showQueueDeleteConfirmation = ref(false);
    const showQueueMarkAsReadConfirmation = ref(false);
    // 
    const isModalShowing = computed(() => {
      return showSettingsPanel.value || showHelpPanel.value || showQueueConfigPanel.value || showOpmlUploadPanel.value || showSubscriptionMetrics.value;
    });
    const isLoading = computed(() => {
      return roSettingsIsLoading.value || roQueueConfigIsLoading.value || roContinueIsLoading.value || roFinalizeIsLoading.value || roRefreshQueuesIsLoading.value || roSettingsIsLoading.value;
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
          showQueueDashboard.value = true;
          event.stopPropagation();
          event.preventDefault();
        // 
        // SHIFT + M KEY (UPLOAD OPML) 
        //
        } else if (event.key === 'M' && event.shiftKey === true) {
          uploadOpml();
          showQueueDashboard.value = true;
          showQueueConfigPanel.value = false;
          event.stopPropagation();
          event.preventDefault();
        // 
        // SHIFT + Q KEY (NEW QUEUE) 
        // 
        } else if (event.key === 'Q' && event.shiftKey === true) {
          openQueueConfigPanel();
          showQueueDashboard.value = true;
          showOpmlUploadPanel.value = false;
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
      roSelectedPost, // selected post to show on the post card modal (while in list or table view) 
      roRefreshQueuesIsLoading,
      filteredArticleList,
      // queue config module data 
      showQueueConfigPanel,
      roQueueUnderConfig,
      roQueueConfigIsLoading,
      // metrics module data 
      roSubscriptionToShow,
      showSubscriptionMetrics,
      // layout module data 
      roLayout,
      showCardLayout,
      showListLayout,
      showTableLayout,
      // other data 
      isLoading,
      showQueueDashboard,
      showQueueCards,
      showHelpPanel,
      showQueueDeleteConfirmation,
      showQueueMarkAsReadConfirmation,
      showSelectedPost,
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
      openPostUrl,
      share,
      keyHandler,
      openSettings,
    }
  },
};
</script>

<style scoped>
.newsgears-rss {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
}

/** has references */
.selected-queue {
  border: 1px solid !important;
}
</style>
