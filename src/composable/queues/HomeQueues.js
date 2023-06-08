import lunr from 'lunr';

import { ref, reactive, inject, computed, nextTick, readonly } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNotifications } from '../notifications/HomeNotifications';
import { useTimestamp } from '../timestamp/HomeTimestamp';

export function useQueues(props) {
  const auth = inject('auth');
  const { t } = useI18n();
  const { 
    handleServerError, 
    setLastServerMessage 
  } = useNotifications();
  const { formatTimestamp } = useTimestamp();
  const selectedQueueId = ref(null); // currently selected queue Id 
  const previousQueueId = ref(null); // previously selected queue Id 
  const queueIdToDelete = ref(null);
  const queueIdToMarkAsRead = ref(null);
  const queues = reactive([]); // all queues 
  const selectedPost = reactive({}); // selected post to show on the post card modal (while in list view) 
  const articleListsByQueue = reactive({}); // all queues 
  const articleList = reactive({}); // inbound queue for the currently selected queue  
  const refreshQueuesIsLoading = ref(false);
  const articleListFilter = ref(''); // user-supplied filter text (lunrjs query expression) 
  const articleListSortOrder = ref('DSC');
  const showQueueFilterPills = ref(false);
  const showQueueDeleteConfirmation = ref(false);
  const showQueueMarkAsReadConfirmation = ref(false);
  const showSelectedPost = ref(false);
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
      // then fetch the preliminary results from lunrjs 
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
      // sort the filtered result 
      // 
      if (results) {
        sortQueue(results, articleListSortOrder.value);
      } else {
        results = [];
      }
    }
    return results;
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

  const showQueueRefreshIndicator = computed(() => {
    // ensure we have latestSubscriptionMetricsByQueue on hand; 
    // this is periodically refreshed by a background process 
    if (!latestSubscriptionMetricsByQueue) {
      // console.debug("showQueueRefreshIndicator: returning early due to missing latest subscription metrics by queue");
      return false;
    }
    // ensure we have a latest subscription metrics for the selected queue 
    let latestSubscriptionMetric = latestSubscriptionMetricsByQueue[roSelectedQueueId.value];
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

  function addQueue(queue) {
    queues.push(queue);
  }

  function updateQueueLocalStorage() {
    localStorage.setItem('queues', JSON.stringify(queues));
  }

  function updateArticleListLocalStorage() {
    localStorage.setItem('articleListsByQueue', JSON.stringify(articleListsByQueue));
  }

  function restoreQueuesFromLocalStorage() {
    const storedQueues = getQueuesLocalStorage()
    if (storedQueues) {
      Object.assign(queues, JSON.parse(storedQueues));
    }
    const storedArticleLists = getArticleListsLocalStorage();
    if (storedArticleLists) {
      Object.assign(articleListsByQueue, JSON.parse(storedArticleLists));
    }
    rebuildLunrIndexes();
    if (queues.length > 0 && articleListsByQueue) { // remove 
      if (!selectedQueueId.value) {
        setSelectedQueueId(queues[0].id);
      }
      Object.assign(articleList, articleListsByQueue[selectedQueueId.value]);
    } else {
      refreshQueues(null, true); // need staging posts for all queues and queues definitions 
    }
  }

  function getQueuesLocalStorage() {
    return localStorage.getItem('queues');
  }

  function getArticleListsLocalStorage() {
    return localStorage.getItem('articleListsByQueue');
  }

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
                updateQueueLocalStorage();
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

      console.log("rebuilding lunr indexes due to refresh");
      rebuildLunrIndexes();
      updateArticleListLocalStorage();
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
    console.log("rebuilding lunr indexes");
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
          });
          iq.values.forEach(function (doc) {
            this.add(doc)
          }, this)
        }); 
      }
    }
  }

  function updatePostReadStatus(result) {
    console.log("updating post status");
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
          refreshQueuesIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      refreshQueuesIsLoading.value = false;
    });
  }

  function updatePostPubStatus(result) {
    console.log("updating post status");
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
            updateQueueLocalStorage();
          }
          rebuildLunrIndexes();
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
    if (articleListFilter.value.includes('status:' + filterMode)) {
      articleListFilter.value = articleListFilter.value.replace('status:' + filterMode, '');
    } else {
      articleListFilter.value += 'status:' + filterMode;
    }
  }

  function toggleQueueFilterPills() {
    showQueueFilterPills.value = !showQueueFilterPills.value;
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

  function toLunrToken(str) {
    if (str) {
      let pieces = str.split(' ');
      let token = pieces[0];
      return token + (pieces.length > 1 ? '*' : '');
    }
  }

  function countArticleList(queueId) {
    const iq = articleListsByQueue[queueId];
    if (iq) {
      return iq.values.filter((post) => !post.isRead).length;
    }
    return 0;
  }

  function countPublished(queueId) {
    const iq = articleListsByQueue[queueId];
    return iq ? iq.values.filter((post) => post.isPublished).length : 0;
  }
  
  function deleteSelectedQueue() {
    document.activeElement.blur();
    queueIdToDelete.value = selectedQueueId.value;
    showQueueDeleteConfirmation.value = true;
  }

  // function deleteQueue(queueId) {
  //   document.activeElement.blur();
  //   queueIdToDelete.value = queueId;
  //   showQueueDeleteConfirmation.value = true;
  // }

  function performQueueDelete() {
    console.log("deleting queue id=" + queueIdToDelete.value);
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
        console.log("deleted queueId=" + queueIdToDelete.value);
        delete articleListsByQueue[queueIdToDelete.value];
        // update queues localStorage 
        updateArticleListLocalStorage();
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
          updateQueueLocalStorage();
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
        refreshQueuesIsLoading.value = false;
        clearTimeout(timeoutId);
      });
    }).catch((error) => {
      handleServerError(error);
      queueIdToDelete.value = null;
      showQueueDeleteConfirmation.value = false;
      refreshQueuesIsLoading.value = false;
    });
  }

  function cancelQueueDelete() {
    queueIdToDelete.value = null;
    showQueueDeleteConfirmation.value = false;
  }

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
          articleListsByQueue[queueIdToMarkAsRead.value].values.forEach((p) => {
            p.isRead = true;
            p.postReadStatus = 'READ';
            p.isReadLater = false;
          });
          // update queue localStorage
          updateArticleListLocalStorage();
          setLastServerMessage(data.message);
          rebuildLunrIndexes();
        }).catch((error) => {
          handleServerError(error);
        }).finally(() => {
          queueIdToMarkAsRead.value = null;
          showQueueMarkAsReadConfirmation.value = false;
          refreshQueuesIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      queueIdToMarkAsRead.value = null;
      showQueueMarkAsReadConfirmation.value = false;
      refreshQueuesIsLoading.value = false;
    });
  }

  function cancelQueueMarkAsRead() {
    queueIdToMarkAsRead.value = null;
    showQueueMarkAsReadConfirmation.value = false;
  }

  function updateArticleListFilter(value) {
    articleListFilter.value = value;
  }

  function setSelectedQueueId(queueId) {
    previousQueueId.value = selectedQueueId.value;
    selectedQueueId.value = queueId;
    if (queueId) {
      Object.assign(articleList, articleListsByQueue[queueId]);
    }
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

  function openPost(postId) {
    Object.assign(selectedPost, getPostFromQueue(postId));
    showSelectedPost.value = true;
  }

  function openPostUrl(postId) {
    const post = getPostFromQueue(postId);
    window.open(post.postUrl, '_blank');
  }
  
  function selectNextPost() {
    if (selectedPost) {
      const id = selectedPost.id;
      const queue = filteredArticleList;
      const nextIdx = queue.findIndex((post) => post.id === id) + 1;
      if (nextIdx < queue.length) {
        Object.assign(selectedPost, queue[nextIdx]);
      }
    }
  }

  function selectPreviousPost() {
    if (selectedPost) {
      const id = selectedPost.id;
      const queue = filteredArticleList;
      const prevIdx = queue.findIndex((post) => post.id === id) - 1;
      if (prevIdx >= 0) {
        Object.assign(selectedPost, queue[prevIdx]);
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
            Object.assign(opmlErrors, data.errors);
          } else {
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
            addQueue(queue);
            queueIds.push(queue.id);
          }
          // update queues localStorage 
          updateQueueLocalStorage();
          setLastServerMessage(queueConfigRequests.length + " " + t('nQueuesCreated'));
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

  function returnToStep1() {
    atStep2.value = false
  }

  function cancelOpmlUpload() {
    showOpmlUploadPanel.value = false;
    restorePreviousQueueId();
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

  function openSubscriptionMetrics(subscriptionInfo) {
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
    console.log("creating queue");
    document.activeElement.blur();
    removePropertyValues(queueUnderConfig);
    showQueueConfigPanel.value = true;
  }

  function openQueueConfigPanel(queueId) {
    console.log("configuring queueId=" + queueId);
    document.activeElement.blur();
    const q = getQueueById(queueId);
    removePropertyValues(queueUnderConfig);
    Object.assign(queueUnderConfig, q);
    showQueueConfigPanel.value = true;
  }

  function createQueue(newQueue) {
    let method = 'POST';
    queueConfigIsLoading.value = true;
    console.log("pushing new queue to remote..");
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
          roQueues.push(created);
          // update queues localStorage 
          updateQueueLocalStorage();
          roArticleListsByQueue[created.id] = { values: [] };
          // update queues localStorage 
          updateArticleListLocalStorage();
          setLastServerMessage(t('queueCreated') + ' (' + created.ident + ")'");
          setSelectedQueueId(created.id);
          rebuildLunrIndexes();
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
    refreshQueuesIsLoading.value = true;
    console.log("pushing updated queue to remote..");
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
          refreshQueuesIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      refreshQueuesIsLoading.value = false;
    });
  }

  function dismissQueueConfigPanel() {
    showQueueConfigPanel.value = false;
    if (!roSelectedQueueId.value) {
      restorePreviousQueueId();
    }
  }
  
  function addSubscription(newSubscription) {
    queueConfigIsLoading.value = true;
    console.log("subscription-config: pushing new subscription to remote..");
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
            response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''), { cause: {} })}) : 
            response.text().then(t => {throw new Error(t, { cause: {} })});
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
    console.log("subscription-config: deleteing subscription..");
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
            response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''), { cause: {} })}) : 
            response.text().then(t => {throw new Error(t, { cause: {} })});
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
    console.log("subscription-config: pushing updated subscription to remote..");
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
            response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''), { cause: {} })}) : 
            response.text().then(t => {throw new Error(t, { cause: {} })});
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

  const roSelectedQueueId = readonly(selectedQueueId);
  const roPreviousQueueId = readonly(previousQueueId);
  const roQueueIdToDelete = readonly(queueIdToDelete);
  const roQueueIdToMarkAsRead = readonly(queueIdToMarkAsRead);
  const roQueues = readonly(queues);
  const roSelectedPost = readonly(selectedPost);
  const roArticleListsByQueue = readonly(articleListsByQueue);
  const roArticleList = readonly(articleList);
  const roRefreshQueuesIsLoading = readonly(refreshQueuesIsLoading);
  const roArticleListFilter = readonly(articleListFilter);
  const roArticleListSortOrder = readonly(articleListSortOrder);
  const roShowQueueFilterPills = readonly(showQueueFilterPills);
  const roShowQueueDeleteConfirmation = readonly(showQueueDeleteConfirmation);
  const roShowQueueMarkAsReadConfirmation = readonly(showQueueMarkAsReadConfirmation);
  const roShowSelectedPost = readonly(showSelectedPost);
  const roContinueIsLoading = readonly(continueIsLoading);
  const roAtStep2 = readonly(atStep2);
  const roQueueConfigRequests = readonly(queueConfigRequests);
  const roFinalizeIsLoading = readonly(finalizeIsLoading);
  const roOpmlErrors = readonly(opmlErrors);
  const roLatestSubscriptionMetricsByQueue = readonly(latestSubscriptionMetricsByQueue);
  const roSubscriptionToShow = readonly(subscriptionToShow);
  const roQueueUnderConfig = readonly(queueUnderConfig);
  const roQueueConfigIsLoading = readonly(queueConfigIsLoading);

  return {
    roSelectedQueueId,
    roPreviousQueueId,
    roQueueIdToDelete,
    roQueueIdToMarkAsRead,
    roQueues,
    roSelectedPost,
    roArticleListsByQueue, 
    roArticleList, 
    roRefreshQueuesIsLoading, 
    roArticleListFilter, 
    roArticleListSortOrder, 
    roShowQueueFilterPills, 
    roShowQueueDeleteConfirmation,
    roShowQueueMarkAsReadConfirmation, 
    roShowSelectedPost, 
    roContinueIsLoading, 
    roAtStep2, 
    roQueueConfigRequests, 
    roFinalizeIsLoading, 
    roOpmlErrors, 
    roLatestSubscriptionMetricsByQueue,
    roSubscriptionToShow, 
    roQueueUnderConfig,
    roQueueConfigIsLoading, 
    // 
    showOpmlUploadPanel, // rw 
    showSubscriptionMetrics, // rw
    showQueueConfigPanel, // rw
    // 
    filteredArticleList, 
    filteredQueueIdentOptions,
    allFilterPills, 
    showQueueRefreshIndicator, 
    tabModel,
    // 
    // 
    // push item onto queues 
    addQueue, 
    // serializes queues and writes to local storage 
    updateQueueLocalStorage, 
    // serializes articlieListsByQueue and writes to local storage 
    updateArticleListLocalStorage, 
    // restores queues and articleListsByQueue from local storage; 
    // rebuilds lunr indexes, sets selected queue Id;
    // resfreshses queues from server if necessary 
    restoreQueuesFromLocalStorage, 
    // retrieves queues from local storage 
    getQueuesLocalStorage,
    // retrieves articleListsByQueue from local storage 
    getArticleListsLocalStorage,
    // makes server call to pull new stagingPosts for each queue; 
    // optionally makes server call to pull queue definitions; 
    // rebuilds all dependent entities and updates local storage; 
    refreshQueues, 
    // utility method to add subscription data fetched from server to queue definition 
    decorateQueueWithSubscriptionDefinitions,
    // rebuild all lunr indexes--this needs to be invoked any time any indexed data changes (e.g., post read status) 
    rebuildLunrIndexes,
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
    // adds the given subscription/category to t he articleListFilter 
    updateFilter, 
    // returns the number of items in the articleList for the given queueId 
    countArticleList,
    // returns the number of published items in the articleList for the given queueId 
    countPublished,
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
    // sets queueConfigErrors on error 
    createQueue, 
    // 
    // invoked by HomeView to continue the queue save when the user hits 'update' on queue properties; 
    // makes a server call to update the queue basic properties; 
    // sets queueConfigErrors on error 
    updateQueue, 
    // 
    // invoked by HomeView to add a subscription when the user hits 'subscribe' after discovering a feed; 
    // makes a server call to add the subscription to the queue (then refresh); 
    // sets queueConfigErrors on error 
    addSubscription, 
    // 
    // invoked by HomeView to delete a subscription when the user hits 'unsubscribe' while managing existing subscriptions; 
    // makes a server call to delete the subscription from the queue (then refresh); 
    // sets queueConfigErrors on error 
    deleteSubscription, 
    // 
    // invoked by HomeView to update a subscriptoin when the user hits 'save' while changing the auth properties; 
    // makes a server call to update the subscription auth; 
    // sets queueConfigErrors on error 
    updateSubscriptionAuth, 
    // 
    dismissQueueConfigPanel,
  }
}
