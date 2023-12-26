<template>
  <v-app>
    <!-- app bar -->
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
        <LoginButton />
      </v-toolbar-items>
    </v-app-bar>

    <!-- pre-auth main -->
    <v-main v-show="!isAuthenticated">
      <BannerPanel :is-authenticated="isAuthenticated" />

      <DemoPanel :class="mb4r" /> 

      <v-divider /> 

      <FAQPanel :class="mt4r" />

      <v-divider /> 
      
      <FooterPanel :class="mt4r" />
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
      <!-- console log -->
      <v-bottom-sheet
        v-model="showConsoleLog"
        scrollable
        fullscreen
        inset
      >
        <v-card>
          <v-card-title>
            {{ $t('consoleLog') }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('consoleLogDetails') }}
          </v-card-subtitle>
          <v-list
            class="h-100"
            role="list"
            :aria-label="$t('listOfLinksToRSSSpecs')"
          >
            <v-list-item
              v-for="(message,idx) in notificationStore.messages"
              :key="message"
              role="listitem"
              :aria-posinset="idx + 1"
              :aria-setsize="notificationStore.messages.length"
            >
              {{ message }}
            </v-list-item>
          </v-list>
        </v-card>
      </v-bottom-sheet>
      <!-- queue config dialog -->
      <v-bottom-sheet
        v-model="showQueueConfigPanel"
        scrollable
        fullscreen
        inset
      >
        <QueueConfigPanel
          :base-url="baseUrl"
          @save="createQueue"
          @update="updateQueue"
          @addSubscription="addSubscription"
          @deleteSubscription="deleteSubscription"
          @updateSubscriptionAuth="updateSubscriptionAuth"
          @dismiss="dismissQueueConfigPanel"
        />
      </v-bottom-sheet>
      <!-- opml upload dialog -->
      <v-bottom-sheet
        v-model="showOpmlUploadPanel"
        scrollable
        fullscreen
        inset
      >
        <OpmlUploadPanel
          :is-loading="roFinalizeIsLoading || roContinueIsLoading"
          :at-step2="roAtStep2"
          :errors="roOpmlErrors"
          :queue-config-requests="roQueueConfigRequests"
          @continueUpload="continueOpmlUpload"
          @finalizeUpload="$event => finalizeOpmlUpload().then(() => { showQueueDashboard = true; showOpmlUploadPanel = false; })"
          @returnToStep1="returnToStep1"
          @dismiss="dismissOpmlUpload"
        />
      </v-bottom-sheet>
      <!-- navigation drawer / left side -->
      <v-bottom-sheet
        v-model="showQueueDashboard"
        scrollable
        fullscreen
        inset
      >
        <!-- no currently selected queue -->
        <QueueInitialSetup 
          v-if="!queueStore.queues || queueStore.queues.length === 0" 
          :base-url="baseUrl"
          @uploadOpml="$event => { uploadOpml(); showQueueDashboard = true; showQueueConfigPanel = false; }" 
          @openQueueConfigPanel="$event => openQueueConfigPanel($event.queueId)"
          @dismiss="showQueueDashboard = false"
        />
        <QueueCardSheet
          v-show="!showQueueConfigPanel && !showOpmlUploadPanel" 
          :base-url="baseUrl"
          @selectQueue="$event => { queueStore.innerSetSelectedQueueId($event.queueId); showQueueDashboard = false; }"
          @openQueueConfigPanel="$event => openQueueConfigPanel($event.queueId)"
          @updateFilter="$event => { 
            queueStore.updateFilter($event); 
            queueStore.innerSetSelectedQueueId($event.queueId); 
            showQueueDashboard = false;
          }"
          @openSubscriptionMetrics="openSubscriptionMetrics"
        />
        <!-- <QueueSubscriptionSheet
          v-show="!showQueueCards && !showQueueConfigPanel && !showOpmlUploadPanel"
          :base-url="baseUrl"
          @updateFilter="$event => { queueStore.updateFilter($event); $nextTick(() => showQueueDashboard = false); }"
          @showUnread="($event) => {
            let subscription = $event.subscription;
            queueStore.innerSetSelectedQueueId(subscription.queueId);
            $nextTick(() =>
              queueStore.updateFilter({
                name: 'subAndMode',
                queueId: subscription.queueId,
                subValue: subscription.title,
                modeValue: 'UNREAD',
              })
            );
          }"
          @showRead="($event) => {
            let subscription = $event.subscription;
            queueStore.innerSetSelectedQueueId(subscription.queueId);
            $nextTick(() =>
              queueStore.updateFilter({
                name: 'subAndMode',
                queueId: subscription.queueId,
                subValue: subscription.title,
                modeValue: 'READ',
              })
            );
          }"
          @showAll="($event) => {
            let subscription = $event.subscription;
            queueStore.innerSetSelectedQueueId(subscription.queueId);
            $nextTick(() =>
              queueStore.updateFilter({
                name: 'subscription',
                queueId: subscription.queueId,
                value: subscription.title,
              })
            );
          }"
        /> -->
      </v-bottom-sheet>
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
      <v-bottom-sheet
        v-model="showHelpPanel"
        fullscreen
        scrollable
        inset
      >
        <HelpPanel
          class="overflow-auto rounded"
          @dismiss="showHelpPanel = false"
        />
      </v-bottom-sheet>
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
      <!-- settings -->
      <v-bottom-sheet
        v-model="showSettingsPanel"
        fullscreen
        scrollable
        inset
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
      </v-bottom-sheet>
      <!-- main container -->
      <div
        class="d-flex flex-column rounded"
        :class="ma4r"
      >
        <!-- queue material -->
        <div
          v-if="queueStore.selectedQueueId"
          class="d-flex flex-row"
        >
          <!-- queue layout -->
          <QueueController 
            class="w-100"
            :base-url="baseUrl"
            :collapsed="showCollapsedLayout"
            :show-list-layout="showListLayout"
            :show-card-layout="showCardLayout"
            :show-table-layout="showTableLayout"
            :show-queue-refresh-indicator="showQueueRefreshIndicator"
            @newQueue="$event => { newQueue(); showOpmlUploadPanel = false; }"
            @uploadOpml="$event => { uploadOpml(); showQueueConfigPanel = false; }"
            @switchToListLayout="switchToListLayout" 
            @switchToCardLayout="switchToCardLayout" 
            @switchToTableLayout="switchToTableLayout" 
            @refreshQueues="$event => refreshQueues(null, true)"
            @markAsRead="$event => {
              markQueueAsRead(queueStore.selectedQueueId);
              showQueueMarkAsReadConfirmation = true;
            }"
            @openQueueConfigPanel="$event => openQueueConfigPanel($event.queueId)"
            @collapse="showCollapsedLayout = true"
            @expand="showCollapsedLayout = false"
          />
          <!-- TODO: extract video player component -->
          <v-bottom-sheet
            v-model="showVideoPlayerPanel"
          >
            <vue-plyr
              
              ref="videoPlayer"
            >
              <video
                v-if="currentlyPlayingUrlType === 'video/mp4'"
                controls
                crossorigin
              >
                <source
                  :src="currentlyPlayingUrl"
                  type="video/mp4"
                >
              </video>
              <div
                v-else
                class="plyr__video-embed"
              >
                <iframe
                  :src="currentlyPlayingUrl"
                  allowfullscreen
                  allowtransparency
                  allow="autoplay"
                />
              </div>
            </vue-plyr>
          </v-bottom-sheet>
        </div>
        <!-- post material (card layout) -->
        <CardLayout
          v-if="showCardLayout && queueStore.filteredArticleList.length > 0"
          style="margin-top: 1rem;"
          :base-url="baseUrl"
          :layout-height="showCollapsedLayout ? '85vh' : '70vh'"
          :sharing-options="sharingOptions"
          @openPostUrl="$event => openPostUrl($event.postId)"
          @updatePostReadStatus="updatePostReadStatus"
          @share="$event = share($event.sharingOption, $event.post)"
          @playEnclosure="playEnclosure"
        />
        <!-- post material (list layout) -->
        <ListLayout 
          v-if="showListLayout && queueStore.filteredArticleList.length > 0"
          style="margin-top: 1rem;"
          :base-url="baseUrl"
          :layout-height="showCollapsedLayout ? '85vh' : '70vh'"
          @openPost="$event => { openPost($event.postId); showSelectedPost = true; }"
          @updatePostReadStatus="updatePostReadStatus"
        />
        <!-- post material (table layout) -->
        <TableLayout 
          v-if="showTableLayout && queueStore.filteredArticleList.length > 0"
          style="margin-top: 1rem;"
          :base-url="baseUrl"
          :layout-height="showCollapsedLayout ? '85vh' : '70vh'"
          :sharing-options="sharingOptions"
          @openPost="$event => { openPost($event.postId); showSelectedPost = true; }"
          @openPostUrl="$event => openPostUrl($event.postId)"
          @updatePostReadStatus="updatePostReadStatus"
        />
        <!-- help panel -->
        <GlobalShortcutKeys
          v-if="!queueStore.filteredArticleList || queueStore.filteredArticleList.length === 0"
          :class="my4r"
        />
        <!-- TODO: separate queue shortcut keys from global shortcut keys -->
      </div>
      <!-- post card dialog -->
      <v-bottom-sheet
        v-if="showListLayout || showTableLayout"
        v-model="showSelectedPost"
        scrollable
        fullscreen
        inset
      >
        <PostCard
          :id="'post_' + queueStore.selectedPost.id"
          :base-url="baseUrl"
          :post="queueStore.selectedPost"
          :sharing-options="sharingOptions"
          :collapsible="false"
          @openPostUrl="openPostUrl(queueStore.selectedPost.id);"
          @updatePostReadStatus="updatePostReadStatus"
          @share="$event => share($event.sharingOption, $event.post)"
          @playEnclosure="playEnclosure"
        >
          <template #additional>
            <v-btn
              :size="buttonSize"
              accesskey="n"
              icon="fa-arrow-down"
              class="ma-1"
              :title="t('goToNextPost')"
              @click.stop="queueStore.selectNextPost"
            />
            <v-btn
              :size="buttonSize"
              accesskey="p"
              icon="fa-arrow-up"
              class="ma-1"
              :title="t('goToPreviousPost')"
              @click.stop="queueStore.selectPreviousPost"
            />
          </template>
        </PostCard>
      </v-bottom-sheet>
    </v-main>
  </v-app>
</template>

<script>
import { inject, ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';

import { useAuth } from '@/composable/useAuth.js';
import { useNotifications } from '@/composable/useNotifications.js';
import { useSettings } from '@/composable/useSettings.js';
import { useQueues } from '@/composable/useQueues.js';
import { useLayout } from '@/composable/useLayout.js';
import { useSharing } from '@/composable/useSharing.js';

// import debounce from 'lodash.debounce';
// components 
import BannerPanel from "@/components/banner-panel/BannerPanel.vue";
import DemoPanel from "@/components/landing/DemoPanel.vue";
import FAQPanel from '@/components/landing/FAQPanel.vue';
import AppBar from '@/components/generic/AppBar.vue';
import GoBack from "@/components/generic/GoBack.vue";
import DisplayModeButton from "@/components/generic/DisplayModeButton.vue";
import LoginButton from '@/components/generic/LoginButton.vue';
// confirmation dialog 
import ConfirmationDialog from '@/components/generic/ConfirmationDialog.vue';
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
// queue card sheet 
import QueueCardSheet from '@/components/layout/QueueCardSheet.vue';
// queue subscription sheet 
// import QueueSubscriptionSheet from '@/components/queue/QueueSubscriptionSheet.vue';
// queue controller (filter and operations)
import QueueController from '@/components/queue-controller/QueueController.vue';
// card layout 
import CardLayout from '@/components/layout/CardLayout.vue';
// list layout 
import ListLayout from '@/components/layout/ListLayout.vue';
// table layout 
import TableLayout from '@/components/layout/TableLayout.vue';
// post card
import PostCard from "@/components/post/PostCard.vue";
// queue initial setup 
import QueueInitialSetup from '@/components/queue/QueueInitialSetup.vue';
// footer panel 
import FooterPanel from "@/components/footer-panel/FooterPanel.vue";
// import QueueDetails from '@/components/queue/QueueDetails.vue';
import buttonSizeMixin from '@/mixins/buttonSizeMixin';
import spacingMixin from '@/mixins/spacingMixin';


export default {
  name: "HomeView",
  components: {
    BannerPanel,
    DemoPanel,
    FAQPanel,
    AppBar,
    GoBack,
    DisplayModeButton,
    LoginButton,
    // dialogs 
    ConfirmationDialog,
    QueueConfigPanel,
    OpmlUploadPanel,
    SubscriptionMetrics,
    // settings 
    SettingsPanel,
    HelpPanel,
    GlobalShortcutKeys,
    // card sheet 
    QueueCardSheet, 
    // queue controller 
    QueueController, 
    // card layout 
    CardLayout,
    // list layout 
    ListLayout, 
    // table layout 
    TableLayout,
    // post card 
    PostCard,
    // queue initial setup
    QueueInitialSetup,
    // footer 
    FooterPanel
  },
  mixins: [buttonSizeMixin, spacingMixin],
  props: {
    baseUrl: { type: String, required: true },
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
      handleServerError,
      notificationStore,
    } = useNotifications();
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
      disconnectBroker, 
      // 
      roRefreshQueuesIsLoading,
      roContinueIsLoading,
      roAtStep2,
      roQueueConfigRequests,
      roFinalizeIsLoading,
      roOpmlErrors,
      roSubscriptionToShow,
      roQueueConfigIsLoading,
      showOpmlUploadPanel, //rw 
      showSubscriptionMetrics, // rw 
      showQueueConfigPanel, // rw 
      showQueueRefreshIndicator, // computed 
      connectBroker,
      refreshQueues,
      updatePostReadStatus,
      getPostFromQueue, // no 
      deleteSelectedQueue,
      performQueueDelete,
      cancelQueueDelete,
      markSelectedQueueAsRead,
      markQueueAsRead,
      performQueueMarkAsRead,
      cancelQueueMarkAsRead,
      openPost,
      openPostUrl,
      uploadOpml,
      continueOpmlUpload,
      finalizeOpmlUpload,
      returnToStep1,
      dismissOpmlUpload,
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
    const showHelpPanel = ref(false);
    const showVideoPlayerPanel = ref(false);
    const showSelectedPost = ref(false);
    const showQueueDeleteConfirmation = ref(false);
    const showQueueMarkAsReadConfirmation = ref(false);
    const showConsoleLog = ref(false);
    const showCollapsedLayout = ref(false);
    // 
    const isModalShowing = computed(() => {
      return showSettingsPanel.value ||
        showHelpPanel.value ||
        showQueueConfigPanel.value ||
        showOpmlUploadPanel.value ||
        showSubscriptionMetrics.value;
    });
    const isLoading = computed(() => {
      return roSettingsIsLoading.value || roQueueConfigIsLoading.value || roContinueIsLoading.value || roFinalizeIsLoading.value || roRefreshQueuesIsLoading.value || roSettingsIsLoading.value;
    });
    const navbarWidth = computed(() => {
      if (display.xs.value) {
        return 'w-100'
      } else if (display.sm.value) {
        return 'w-75'
      }
      return 'w-50';
    });

    const currentlyPlayingUrl = ref(null);
    const currentlyPlayingUrlType = ref(null);
    const videoPlayer = ref(null);

    // required 
    function keyHandler(event) {
      if (!event.key) {
        return;
      }
      // bail if a modal is showing
      if (isModalShowing.value) {
        return;
      }
      // bail if this an event on the queue filter 
      if (event.target.id === 'queue-filter') {
        return;
      }
      // 
      // ESC key handling 
      // 
      if (event.key === 'Escape') {
        // hide the queue dashboard if it's showing 
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
        // SHIFT + M KEY (UPLOAD OPML) 
        //
        } else if (event.key === 'M' && event.shiftKey === true) {
          uploadOpml();
          event.stopPropagation();
          event.preventDefault();
        // 
        // SHIFT + Q KEY (NEW QUEUE) 
        // 
        } else if (event.key === 'Q' && event.shiftKey === true) {
          openQueueConfigPanel();
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
          queueStore.toggleFilterMode('READ_LATER');
          event.stopPropagation();
          event.preventDefault();
          // 
          // SHIFT + H KEY (TOGGLE QUEUE FILTER MODE)
          // 
        } else if (event.key === 'H' && event.shiftKey) {
          queueStore.toggleFilterMode('READ');
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
      // 
      // SHIFT + G KEY (CONSOLE LOG)
      // 
      if (event.key === 'G' && event.shiftKey === true) {
        showConsoleLog.value = !showConsoleLog.value;
      }
    }

    function playEnclosure(enclosure) {
      console.log('playing enclosure: ' + JSON.stringify(enclosure));
      let enclosureUrl = enclosure.url;
      let enclosureType = enclosure.type;
      currentlyPlayingUrl.value = enclosureUrl;
      currentlyPlayingUrlType.value = enclosureType;
      showVideoPlayerPanel.value = true;
      nextTick(() => {
        videoPlayer.value.player.on("ready", () => { 
          let promise = videoPlayer.value.player.play();
          if (promise) {
            promise.catch((error) => {
              handleServerError({
                name: 'Unable to play enclosure',
                message: 'Unable to play this enclosure, probably due to a CORS error.',
              });
              console.log('unable to play enclosure due to: ' + JSON.stringify(error));
            })
          }
        });
        videoPlayer.value.player.source = {
          type: 'video',
          sources: [
            {
              src: enclosureUrl,
              type: 'video/mp4',
            }
          ]
        }
      })
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
          } else {
            console.log("home: not authenticated on mount");
          }
        });
      window.addEventListener("keypress", keyHandler);
    });

    onBeforeUnmount(() => {
      disconnectBroker();
      window.removeEventListener("keypress", keyHandler);
    });
    // 
    // 
    // 
    return {
      // 
      auth,
      isAuthenticated,
      notificationStore,
      router,
      t,
      xs: display.xs,
      sm: display.sm,
      md: display.md,
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
      roRefreshQueuesIsLoading,
      // queue config module data 
      showQueueConfigPanel,
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
      navbarWidth,
      showQueueDashboard,
      showHelpPanel,
      showVideoPlayerPanel,
      showQueueDeleteConfirmation,
      showQueueMarkAsReadConfirmation,
      showSelectedPost,
      showConsoleLog,
      showCollapsedLayout,
      videoPlayer,
      currentlyPlayingUrl,
      currentlyPlayingUrlType,
      // auth module functions 
      logout,
      login,
      // notifications module functions 
      handleServerError,
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
      updatePostReadStatus,
      createQueue,
      updateQueue,
      deleteSelectedQueue,
      performQueueDelete,
      cancelQueueDelete,
      markQueueAsRead,
      performQueueMarkAsRead,
      cancelQueueMarkAsRead,
      getPostFromQueue,
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
      dismissOpmlUpload,
      newQueue,
      // deleteQueue,
      // markSelectedQueueAsRead, 
      openQueueConfigPanel,
      dismissQueueConfigPanel,
      openPostUrl,
      share,
      keyHandler,
      openSettings,
      playEnclosure,
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
</style>

<style>
.clickable {
  user-select: none;
  cursor: pointer;
}

.clickable:hover, .clickable:focus-visible, 
.clickable:hover *, .clickable:focus-visible * {
  cursor: pointer;
}

.clickable:hover span, .clickable:focus-visible span {
  text-decoration: underline;
}

.post-html-frame {
  overflow: auto;
  white-space-collapse: preserve-breaks;
}

.post-text-frame {
  overflow: auto;
  white-space-collapse: preserve-breaks;
}

.gap-1 {
  gap: 1rem;
}
</style>
