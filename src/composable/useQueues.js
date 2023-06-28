import lunr from 'lunr';

import { ref, reactive, inject, computed, nextTick, readonly } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNotifications } from '@/composable/useNotifications';
import { useTimestamp } from '@/composable/useTimestamp';
import { useQueueStore } from '@/composable/useQueueStore';

export function useQueues(props) {
  const auth = inject('auth');
  const { t } = useI18n();
  const {
    handleServerError,
    setLastServerMessage
  } = useNotifications();
  const { formatTimestamp } = useTimestamp();
  const queueStore = useQueueStore();
  const selectedQueueTitle = ref(null); // currently selected queue title 
  const previousQueueId = ref(null); // previously selected queue Id 
  const queueIdToDelete = ref(null);
  const queueIdToMarkAsRead = ref(null);
  const selectedPost = reactive({}); // selected post to show on the post card modal (while in list view) 
  const articleList = reactive({}); // inbound queue for the currently selected queue  
  const refreshQueuesIsLoading = ref(false);
  const articleListFilter = ref(''); // user-supplied filter text (lunrjs query expression) 
  const articleListSortOrder = ref('DSC');
  const showQueueFilterPills = ref(false);
  const showUnreadPosts = ref(true);
  const showReadPosts = ref(true);
  const showReadLaterPosts = ref(false);
  const showStarredPosts = ref(true);
  const showOpmlUploadPanel = ref(false);
  const continueIsLoading = ref(false);
  const atStep2 = ref(false);
  const queueConfigRequests = reactive([]);
  const finalizeIsLoading = ref(false);
  const opmlErrors = reactive([]);
  const latestSubscriptionMetricsByQueue = reactive({});
  const showSubscriptionMetrics = ref(false);
  const subscriptionToShow = reactive({});
  const showQueueConfigPanel = ref(false);
  const queueUnderConfig = reactive({});
  const queueConfigIsLoading = ref(false);

  const { baseUrl } = props;

  const filteredArticleList = computed(() => {
    let results = [];
    if (articleList) {
      // if a lunr query expression is specified .. 
      // then retrieve the preliminary results from lunrjs 
      if (articleListFilter.value) {
        let lunrLambda = () => articleList.index.search(articleListFilter.value);
        try {
          let lunrResults = lunrLambda.apply();
          if (lunrResults) {
            lunrResults = lunrResults.map((item) => parseInt(item.ref));
            results = articleList.values.filter((item) => {
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
      // filter and sort the result 
      // 
      if (results) {
       results = results.filter((r) => {
        if (!showUnreadPosts.value && !r.isRead && !r.isReadLater && !r.isPublished) {
          return false;
        }
        if (!showReadPosts.value && r.isRead && !r.isPublished) {
          return false;
        }
        if (!showReadLaterPosts.value && r.isReadLater && !r.isPublished) {
          return false;
        }
        if (!showStarredPosts.value && r.isPublished) {
          return false;
        }
        return true;
       });
       sortQueue(results, articleListSortOrder.value);
      } else {
        results = [];
      }
    }
    return results;
  });

  const showQueueRefreshIndicator = computed(() => {
    // ensure we have latestSubscriptionMetricsByQueue on hand; 
    // this is periodically refreshed by a background process 
    if (!latestSubscriptionMetricsByQueue) {
      // console.debug("showQueueRefreshIndicator: returning early due to missing latest subscription metrics by queue");
      return false;
    }
    // ensure we have a latest subscription metrics for the selected queue 
    let latestSubscriptionMetric = latestSubscriptionMetricsByQueue[queueStore.selectedQueueId];
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

  const tabModel = computed(() => {
    let arr = [];
    if (queueUnderConfig.id) {
      arr.push({
        name: "ADD_SUBSCRIPTIONS",
        description: t('rssFeedDiscovery'),
        icon: "feed",
      });
      arr.push({
        name: "MANAGE_SUBSCRIPTIONS",
        description: t('manageSubscriptions', { ct: queueUnderConfig.subscriptions.length }),
        icon: "feed",
      })
      arr.push({
        name: "QUEUE_PROPERTIES",
        description: t('queueProperties'),
        icon: "list",
      });
    }
    return arr;
  });

  async function refreshQueues(queueIdsToRetrieve, retrieveQueueDefinitions) {
    console.log("queues: refreshing queues");
    let rawPosts = [];
    refreshQueuesIsLoading.value = true;

    try {
      const token = await auth.getTokenSilently();
      const stagingPostRefreshController = new AbortController();
      const stagingPostRefreshTimeoutId = setTimeout(() => stagingPostRefreshController.abort(), 45000);
      let queueDefinitionRefreshTimeoutId;
      let refreshPromises = [
        fetch(baseUrl + "/staging" + (queueIdsToRetrieve ? ("?queueIds=" + queueIdsToRetrieve) : ''), {
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
              console.log("queues: staging post refresh complete, ct=" + ct);
            }
          })
      ];

      if (retrieveQueueDefinitions) {
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
              queueStore.clearQueues();
              const queueDefinitionData = data.queueDefinitions;
              const subscriptionDefinitions = data.subscriptionDefinitions;
              if (queueDefinitionData) {
                for (let i = 0; i < queueDefinitionData.length; i++) {
                  const qd = queueDefinitionData[i];
                  const sd = subscriptionDefinitions[qd.id];
                  decorateQueueWithSubscriptionDefinitions(qd, sd, data.subscriptionMetrics);
                  qd.exportConfig = qd.exportConfig ? JSON.parse(qd.exportConfig) : qd.exportConfig;
                  queueStore.addQueue(qd);
                }
              }
            })
        );
      }

      await Promise.all(refreshPromises);
      clearTimeout(stagingPostRefreshTimeoutId);
      if (queueDefinitionRefreshTimeoutId) {
        clearTimeout(queueDefinitionRefreshTimeoutId);
      }

      queueStore.rebuildQueues(queueIdsToRetrieve, rawPosts);

      if (queueStore.queues.length > 0) {
        if (!queueStore.selectedQueueId) {
          setSelectedQueueId(queueStore.queues[0].id);
        }
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
        let imgUrl = subscriptionDefinition.imgUrl;
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

  function updatePostReadStatus(result) {
    console.log("queues: updating post status");
    refreshQueuesIsLoading.value = true;
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
          let p = getPostFromQueue(result.id);
          let originator = result.originator;
          if (originator === "togglePostReadStatus") {
            p.isRead = !p.isRead;
            p.postReadStatus = p.isRead ? 'READ' : null;
            if (p.isRead) {
              p.isReadLater = false;
            }
          } else if (originator === "togglePostReadLaterStatus") {
            p.isReadLater = !p.isReadLater;
            p.postReadStatus = p.isReadLater ? 'READ_LATER' : null;
            if (p.isReadLater) {
              p.isRead = false;
            }
          }
        }).catch((error) => {
          handleServerError(error);
        }).finally(() => {
          refreshQueuesIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      refreshQueuesIsLoading.value = false;
    });
  }

  function updatePostPubStatus(result) {
    console.log("queues: updating post status");
    refreshQueuesIsLoading.value = true;
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
          queueStore.updateLastDeployed(result.queueId, formatTimestamp(data.timestamp));
          queueStore.rebuildLunrIndexes([result.queueId]);
        }).catch((error) => {
          handleServerError(error);
        }).finally(() => {
          refreshQueuesIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      refreshQueuesIsLoading.value = false;
    });
  }

  function getPostFromQueue(id) {
    let f = articleList.values;
    for (let j = 0; j < f.length; j++) {
      if (f[j].id === id) {
        return f[j];
      }
    }
  }

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

  function toggleArticleListSortOrder() {
    articleListSortOrder.value = (articleListSortOrder.value === 'DSC' ? 'ASC' : 'DSC');
  }

  function toggleFilterMode(filterMode) {
    if (filterMode === 'UNREAD') {
      showUnreadPosts.value = !showUnreadPosts.value;
    } else if (filterMode === 'READ') {
      showReadPosts.value = !showReadPosts.value;
    } else if (filterMode === 'READ_LATER') {
      showReadLaterPosts.value = !showReadLaterPosts.value;
    } else if (filterMode === 'STARRED') {
      showStarredPosts.value = !showStarredPosts.value;
    }
  }

  function toggleQueueFilterPills() {
    showQueueFilterPills.value = !showQueueFilterPills.value;
  }

  function updateFilter(f) {
    if (f.name === "subscription") {
      if (f.queueId !== queueStore.selectedQueueId) {
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
    } else if (f.name === "mode") {
      setFilterToMode(f.value);
    } else if (f.name === "subAndMode") {
      if (f.queueId !== queueStore.selectedQueueId) {
        setSelectedQueueId(f.queueId);
        nextTick(() => {
          setFilterToSubAndMode(f.subValue, f.modeValue);
        })
      } else {
        setFilterToSubAndMode(f.subValue, f.modeValue);
      }
    }
  }

  function addSubscriptionToFilter(subscription) {
    articleListFilter.value = '+feed:' + toLunrToken(subscription);
  }

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

  function setFilterToSubAndMode(subValue, modeValue) {
    let newSubStatus = "+feed:" + toLunrToken(subValue);
    articleListFilter.value = newSubStatus;
    setFilterToMode(modeValue);
  }

  function setFilterToMode(filterMode) {
    showUnreadPosts.value = false;
    showReadPosts.value = false;
    showReadLaterPosts.value = false;
    showStarredPosts.value = false;
    if (filterMode === 'UNREAD') {
      showUnreadPosts.value = true;
    } else if (filterMode === 'READ') {
      showReadPosts.value = true;
    } else if (filterMode === 'READ_LATER') {
      showReadLaterPosts.value = true;
    } else if (filterMode === 'STARRED') {
      showStarredPosts.value = true;
    }
  }

  function toLunrToken(inputString) {
    let token = '';
    for (let i = 0; i < inputString.length; i++) {
      const currentChar = inputString[i];
      // Break the loop if a symbol or whitespace is encountered
      if (currentChar === ' ' || currentChar === ':') {
        break;
      }
  
      token += currentChar;
    }
  
    return token;
  }

  function deleteSelectedQueue() {
    document.activeElement.blur();
    queueIdToDelete.value = queueStore.selectedQueueId;
  }

  function performQueueDelete() {
    console.log("queues: deleting queue id=" + queueIdToDelete.value);
    refreshQueuesIsLoading.value = true;
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
        console.log("queues: deleted queueId=" + queueIdToDelete.value);
        queueStore.deleteQueueById(queueIdToDelete.value);
        setLastServerMessage(data.message);
        queueStore.rebuildLunrIndexes([queueIdToDelete.value]);
      }).catch((error) => {
        handleServerError(error);
      }).finally(() => {
        queueIdToDelete.value = null;
        refreshQueuesIsLoading.value = false;
        clearTimeout(timeoutId);
      });
    }).catch((error) => {
      handleServerError(error);
      queueIdToDelete.value = null;
      refreshQueuesIsLoading.value = false;
    });
  }

  function cancelQueueDelete() {
    queueIdToDelete.value = null;
  }

  function markSelectedQueueAsRead() {
    document.activeElement.blur();
    queueIdToMarkAsRead.value = queueStore.selectedQueueId;
  }

  function markQueueAsRead(queueId) {
    document.activeElement.blur();
    queueIdToMarkAsRead.value = queueId;
  }

  function performQueueMarkAsRead() {
    console.log("queues: updating queue status, id=" + queueIdToMarkAsRead.value);
    refreshQueuesIsLoading.value = true;
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
          queueStore.markQueueAsRead(queueIdToMarkAsRead.value);
          setLastServerMessage(data.message);
        }).catch((error) => {
          handleServerError(error);
        }).finally(() => {
          queueIdToMarkAsRead.value = null;
          refreshQueuesIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      queueIdToMarkAsRead.value = null;
      refreshQueuesIsLoading.value = false;
    });
  }

  function cancelQueueMarkAsRead() {
    queueIdToMarkAsRead.value = null;
  }

  function updateArticleListFilter(value) {
    articleListFilter.value = value;
  }

  function setSelectedQueueId(queueId) {
    console.log("queues: setting selectedQueueId=" + queueId);
    previousQueueId.value = queueStore.selectedQueueId;
    queueStore.setSelectedQueueId(queueId);
    let selectedQueue = getSelectedQueue();
    if (selectedQueue) {
      selectedQueueTitle.value = selectedQueue.title;
    }
    if (queueId) {
      Object.keys(articleList).forEach((key) => {
        delete articleList[key];
      });
      Object.assign(articleList, queueStore.articleListsByQueue[queueId]);
    }
  }

  function restorePreviousQueueId() {
    setSelectedQueueId(previousQueueId.value);
  }

  function getSelectedQueue() {
    try {
      let s = parseInt(queueStore.selectedQueueId);
      if (s) {
        for (let i = 0; i < queueStore.queues.length; i++) {
          if (queueStore.queues[i].id === s) {
            return queueStore.queues[i];
          }
        }
      }
    } catch (error) {
      console.error("selectedQueueId is not a number");
    }
    return {};
  }

  function getQueueById(queueId) {
    try {
      let q = parseInt(queueId);
      for (let i = 0; i < queueStore.queues.length; i++) {
        if (queueStore.queues[i].id === q) {
          return queueStore.queues[i];
        }
      }
    } catch (error) {
      console.error("queueId is not a number");
    }
  }

  function openPost(postId) {
    Object.keys(selectedPost).forEach((key) => {
      delete selectedPost[key];
    });
    Object.assign(selectedPost, getPostFromQueue(postId));
  }

  function openPostUrl(postId) {
    const post = getPostFromQueue(postId);
    window.open(post.postUrl, '_blank');
  }

  function selectNextPost() {
    if (selectedPost) {
      const id = selectedPost.id;
      const queue = filteredArticleList;
      const nextIdx = queue.value.findIndex((post) => post.id === id) + 1;
      if (nextIdx < queue.value.length) {
        Object.keys(selectedPost).forEach((key) => {
          delete selectedPost[key];
        });
        Object.assign(selectedPost, queue.value[nextIdx]);
      }
    }
  }

  function selectPreviousPost() {
    if (selectedPost) {
      const id = selectedPost.id;
      const queue = filteredArticleList;
      const prevIdx = queue.value.findIndex((post) => post.id === id) - 1;
      if (prevIdx >= 0) {
        Object.keys(selectedPost).forEach((key) => {
          delete selectedPost[key];
        });
        Object.assign(selectedPost, queue.value[prevIdx]);
      }
    }
  }

  function uploadOpml() {
    document.activeElement.blur();
    showOpmlUploadPanel.value = true;
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
            Object.keys(opmlErrors).forEach((key) => {
              delete opmlErrors[key];
            });
            Object.assign(opmlErrors, data.errors);
          } else {
            queueConfigRequests.splice(0);
            Object.assign(queueConfigRequests, data.queueConfigRequests);
            atStep2.value = true;
          }
        }).catch((error) => {
          console.error(error);
          handleServerError(error);
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
    return new Promise((resolve, reject) => {
      let method = 'POST';
      finalizeIsLoading.value = true;
      console.log("queues: pushing queues to remote, ct=" + queueConfigRequests.length);
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
              queueStore.addQueue(queue);
              queueIds.push(queue.id);
            }
            setLastServerMessage(queueConfigRequests.length + " " + t('nQueuesCreated'));
            showOpmlUploadPanel.value = false;
            refreshQueues(queueIds, false);
            if (resolve) {
              resolve();
            }
          })
          .catch((error) => {
            handleServerError(error);
            if (reject) {
              reject(error);
            }
          }).finally(() => {
            finalizeIsLoading.value = false;
            clearTimeout(timeoutId);
          });
      }).catch((error) => {
        handleServerError(error);
        finalizeIsLoading.value = false;
      });
    });
  }

  function returnToStep1() {
    atStep2.value = false
  }

  function cancelOpmlUpload() {
    showOpmlUploadPanel.value = false;
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
          Object.keys(latestSubscriptionMetricsByQueue).forEach((key) => {
            delete latestSubscriptionMetricsByQueue[key];
          });
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

  function openSubscriptionMetrics(subscriptionInfo) {
    Object.keys(subscriptionToShow).forEach((key) => {
      delete subscriptionToShow[key];
    });
    Object.assign(subscriptionToShow, subscriptionInfo);
    showSubscriptionMetrics.value = true;
  }

  function removePropertyValues(data) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = null;
      }
    }
  }

  function newQueue() {
    console.log("queues: creating queue");
    document.activeElement.blur();
    removePropertyValues(queueUnderConfig);
    showQueueConfigPanel.value = true;
  }

  function openQueueConfigPanel(queueId) {
    console.log("queues: configuring queueId=" + queueId);
    document.activeElement.blur();
    const q = getQueueById(queueId);
    removePropertyValues(queueUnderConfig);
    Object.keys(queueUnderConfig).forEach((key) => {
      delete queueUnderConfig[key];
    });
    Object.assign(queueUnderConfig, q);
    showQueueConfigPanel.value = true;
  }

  function createQueue(newQueue) {
    let method = 'POST';
    queueConfigIsLoading.value = true;
    console.log("queues: pushing new queue to remote..");
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify([newQueue]),
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
          queueStore.addQueue(created); 
          queueStore.initializeArticleList(created.id);
          setLastServerMessage(t('queueCreated') + ' (' + created.ident + ")'");
          setSelectedQueueId(created.id);
          queueStore.rebuildLunrIndexes([created.id]);
          openQueueConfigPanel(created);
        }).catch((error) => {
          handleServerError(error);
        }).finally(() => {
          queueConfigIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      queueConfigIsLoading.value = false;
    });
  }

  function updateQueue() {
    let method = 'PUT';
    queueConfigIsLoading.value = true;
    console.log("queues: pushing updated queue to remote..");
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(queueUnderConfig),
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      fetch(baseUrl + "/queues/" + queueUnderConfig.id, requestOptions)
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
          setLastServerMessage(t('queueUpdated') + ' (' + queueUnderConfig.ident + ')');
          refreshQueues([current.id], false);
        }).catch((error) => {
          handleServerError(error);
        }).finally(() => {
          queueConfigIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      queueConfigIsLoading.value = false;
    });
  }

  function dismissQueueConfigPanel() {
    showQueueConfigPanel.value = false;
    if (!queueStore.selectedQueueId) {
      restorePreviousQueueId();
    }
  }

  function addSubscription(newSubscription) {
    queueConfigIsLoading.value = true;
    console.log("queues: pushing new subscription to remote..");
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify([newSubscription]),
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      fetch(baseUrl + "/queues/" + queueUnderConfig.id + '/subscriptions/', requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ?
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : ''), { cause: {} }) }) :
              response.text().then(t => { throw new Error(t, { cause: {} }) });
          }
        }).then((data) => {
          let subscriptionDefinitions = data.subscriptionDefinitions;
          if (subscriptionDefinitions && subscriptionDefinitions.length > 0) {
            let source = subscriptionDefinitions[0];
            let qd = source.subscriptionDefinition;
            let r = {
              id: qd.id,
              url: qd.url,
              queueId: qd.queueId,
              title: qd.title
            }
            // auth 
            let queryConfig = qd.queryConfig ? JSON.parse(qd.queryConfig) : qd.queryConfig;
            if (queryConfig) {
              r.username = queryConfig.username;
              r.password = queryConfig.password;
            }
            // image 
            let sourceImgUrl = source.imgUrl;
            if (sourceImgUrl) {
              r.image = {
                title: null,
                url: sourceImgUrl,
              }
            }
            queueUnderConfig.subscriptions.unshift(r);
            setLastServerMessage(t('subscriptionAdded'));
            refreshQueues([queueUnderConfig.id], false);
          }
        }).catch((error) => {
          handleServerError(error);
        }).finally(() => {
          queueConfigIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      queueConfigIsLoading.value = false;
    });
  }

  function deleteSubscription(id) {
    queueConfigIsLoading.value = true;
    console.log("queues: deleteing subscription..");
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      fetch(baseUrl + "/queues/" + queueUnderConfig.id + '/subscriptions/' + id, requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ?
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : ''), { cause: {} }) }) :
              response.text().then(t => { throw new Error(t, { cause: {} }) });
          }
        }).then(() => {
          let deleteIdx = -1;
          for (let i = 0; i < queueUnderConfig.subscriptions.length; i++) {
            if (queueUnderConfig.subscriptions[i].id === id) {
              deleteIdx = i;
              break;
            }
          }
          if (deleteIdx > -1) {
            queueUnderConfig.subscriptions.splice(deleteIdx, 1);
          }
          setLastServerMessage(t('subscriptionDeleted'));
        }).catch((error) => {
          handleServerError(error);
        }).finally(() => {
          queueConfigIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      queueConfigIsLoading.value = false;
    });
  }

  function updateSubscriptionAuth(source) {
    queueConfigIsLoading.value = true;
    console.log("queues: pushing updated subscription to remote..");
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(source),
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      fetch(baseUrl + "/queues/" + queueUnderConfig.id + '/subscriptions/' + source.id, requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ?
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : ''), { cause: {} }) }) :
              response.text().then(t => { throw new Error(t, { cause: {} }) });
          }
        }).then((data) => {
          let subscriptionDefinitions = data.subscriptionDefinitions;
          if (subscriptionDefinitions && subscriptionDefinitions.length > 0) {
            let qd = subscriptionDefinitions[0];
            let updateIdx = -1;
            for (let i = 0; i < queueUnderConfig.subscriptions.length; i++) {
              if (queueUnderConfig.subscriptions[i].id === qd.id) {
                updateIdx = i;
                break;
              }
            }
            if (updateIdx > -1) {
              let queryConfigStr = qd.queryConfig;
              if (queryConfigStr) {
                let queryConfig = JSON.parse(queryConfigStr);
                queueUnderConfig.subscriptions[updateIdx].username = queryConfig.username;
                queueUnderConfig.subscriptions[updateIdx].password = queryConfig.password;
              } else {
                queueUnderConfig.subscriptions[updateIdx].username = null;
                queueUnderConfig.subscriptions[updateIdx].password = null;
              }
            }
            setLastServerMessage(t('subscriptionUpdated'));
          }
        }).catch((error) => {
          handleServerError(error);
        }).finally(() => {
          queueConfigIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      queueConfigIsLoading.value = false;
    });
  }

  function toggleReadPosts() {
    showReadPosts.value = !showReadPosts.value;
  }

  function toggleUnreadPosts() {
    showUnreadPosts.value = !showUnreadPosts.value;
  }

  function toggleReadLaterPosts() {
    showReadLaterPosts.value = !showReadLaterPosts.value;
  }

  function toggleStarredPosts() {
    showStarredPosts.value = !showStarredPosts.value;
  }

  const roSelectedQueueTitle = readonly(selectedQueueTitle);
  const roPreviousQueueId = readonly(previousQueueId);
  const roQueueIdToDelete = readonly(queueIdToDelete);
  const roQueueIdToMarkAsRead = readonly(queueIdToMarkAsRead);
  const roSelectedPost = readonly(selectedPost);
  const roArticleList = readonly(articleList);
  const roRefreshQueuesIsLoading = readonly(refreshQueuesIsLoading);
  const roArticleListFilter = readonly(articleListFilter);
  const roArticleListSortOrder = readonly(articleListSortOrder);
  const roShowQueueFilterPills = readonly(showQueueFilterPills);
  const roContinueIsLoading = readonly(continueIsLoading);
  const roAtStep2 = readonly(atStep2);
  const roQueueConfigRequests = readonly(queueConfigRequests);
  const roFinalizeIsLoading = readonly(finalizeIsLoading);
  const roOpmlErrors = readonly(opmlErrors);
  const roLatestSubscriptionMetricsByQueue = readonly(latestSubscriptionMetricsByQueue);
  const roSubscriptionToShow = readonly(subscriptionToShow);
  const roQueueUnderConfig = readonly(queueUnderConfig);
  const roQueueConfigIsLoading = readonly(queueConfigIsLoading);
  const roShowUnreadPosts = readonly(showUnreadPosts);
  const roShowReadPosts = readonly(showReadPosts);
  const roShowReadLaterPosts = readonly(showReadLaterPosts);
  const roShowStarredPosts = readonly(showStarredPosts);

  return {
    queueStore: queueStore, 
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
    roLatestSubscriptionMetricsByQueue,
    roSubscriptionToShow,
    roQueueUnderConfig,
    roQueueConfigIsLoading,
    roShowUnreadPosts, 
    roShowReadPosts, 
    roShowReadLaterPosts, 
    roShowStarredPosts, 
    // 
    showOpmlUploadPanel, // rw 
    showSubscriptionMetrics, // rw
    showQueueConfigPanel, // rw
    // 
    filteredArticleList,
    showUnreadPosts,
    showReadPosts,
    showReadLaterPosts,
    showStarredPosts,
    showQueueRefreshIndicator,
    tabModel,
    // 
    // 
    // push item onto queues 
    addQueue: queueStore.addQueue,
    // makes server call to pull new stagingPosts for each queue; 
    // optionally makes server call to pull queue definitions; 
    // rebuilds all dependent entities and updates local storage; 
    refreshQueues,
    // utility method to add subscription data retrieved from server to queue definition 
    decorateQueueWithSubscriptionDefinitions,
    // makes a server call to update the post read status 
    updatePostReadStatus,
    // makes a server call to update the post pub status 
    updatePostPubStatus,
    // returns a post from the current articleList, by Id 
    getPostFromQueue,
    // changes the articleList sort order from ASC <=> DSC 
    toggleArticleListSortOrder,
    // adds a 'status:' field to the articleListFilter 
    toggleFilterMode,
    // show/hide the queue filter pills 
    toggleQueueFilterPills,
    // 
    toggleUnreadPosts,
    // 
    toggleReadPosts,
    // 
    toggleReadLaterPosts,
    // 
    toggleStarredPosts, 
    // adds the given subscription/category to t he articleListFilter 
    updateFilter,
    // initiates the queue delete process (sets queueIdToDelete and asks for confirmation) 
    deleteSelectedQueue,
    // completes the queue delete process by making a server call to delete the queue (given by queueIdToDelete) 
    performQueueDelete,
    // cancels the queue delete prorcess (unsets queueIdToDelete and hides the confirmation modal) 
    cancelQueueDelete,
    // initiates the queue MAR process (sets queueIdToMarkAsRead to the selectedQueueId and asks for confirmation) 
    markSelectedQueueAsRead,
    // initiates the queue MAR process (sets queueIdToMarkAsRead to the given queueId and asks for confirmation) 
    markQueueAsRead,
    // completes the queue MAR process by making a server call to MAR the queue (given by queueIdToMarkAsRead) 
    performQueueMarkAsRead,
    // cancels the queue MAR prorcess (unsets queueIdToMarkAsRead and hides the confirmation modal) 
    cancelQueueMarkAsRead,
    // sets the value of articleListFilter 
    updateArticleListFilter,
    // sets the value of selectedQueueId; 
    // memoizes the value of previousQueueId; 
    // sets up the articleList for the selected queue 
    setSelectedQueueId,
    // invokes setSelectedQueueId to restore the previous queue Id 
    restorePreviousQueueId,
    // return the selected queue 
    getSelectedQueue,
    // 
    openPost,
    // 
    openPostUrl,
    // 
    selectNextPost,
    // 
    selectPreviousPost,
    // 
    uploadOpml,
    // 
    continueOpmlUpload,
    // 
    finalizeOpmlUpload,
    // 
    returnToStep1,
    // 
    cancelOpmlUpload,
    // 
    checkForNewSubscriptionMetrics,
    // 
    openSubscriptionMetrics,
    // 
    // called by HomeView to initiate the queue creation process ('new queue' button); 
    // clears the contents of queueUnderconfig; 
    // shows the queue config panel 
    newQueue,
    // 
    // called by HomeView to initiate the queue update process; 
    // sets the contents of queueUnderConfig to the queue given by queueId; 
    // shows the queue config panel 
    openQueueConfigPanel,
    // 
    // invoked by HomeView to continue the queue save when the hits 'save' on a new queue; 
    // makes a server call to create the queue (from queueUnderConfig); 
    createQueue,
    // 
    // invoked by HomeView to continue the queue save when the user hits 'update' on queue properties; 
    // makes a server call to update the queue basic properties; 
    updateQueue,
    // 
    // invoked by HomeView to add a subscription when the user hits 'subscribe' after discovering a feed; 
    // makes a server call to add the subscription to the queue (then refresh); 
    addSubscription,
    // 
    // invoked by HomeView to delete a subscription when the user hits 'unsubscribe' while managing existing subscriptions; 
    // makes a server call to delete the subscription from the queue (then refresh); 
    deleteSubscription,
    // 
    // invoked by HomeView to update a subscriptoin when the user hits 'save' while changing the auth properties; 
    // makes a server call to update the subscription auth; 
    updateSubscriptionAuth,
    // 
    dismissQueueConfigPanel,
  }
}
