import { Client } from "@stomp/stompjs";
import * as SockJS from 'sockjs-client';

import { ref, reactive, inject, computed, readonly } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNotifications } from '@/composable/useNotifications';
import { useQueueStore } from '@/composable/useQueueStore';

export function useQueues(props) {
  const auth = inject('auth');
  const { t } = useI18n();
  const {
    handleServerError,
    setLastServerMessage,
    consoleLog,
    consoleError,
  } = useNotifications();
  const queueStore = useQueueStore();
  // 
  const client = ref(null);
  const sessionId = ref(null);
  // 
  const queueIdToDelete = ref(null);
  const queueIdToMarkAsRead = ref(null);
  const refreshQueuesIsLoading = ref(false);
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
  const queueConfigIsLoading = ref(false);

  const { baseUrl } = props;

  // append '/broker' to the base URL if the reverse proxy is enabled 
  const brokerUrl = (process.env.VUE_APP_NEWSGEARS_REVERSE_PROXY === "true")
    ? process.env.VUE_APP_NEWSGEARS_BROKER_URL + '/broker/secured/room'
    : process.env.VUE_APP_NEWSGEARS_BROKER_URL + '/secured/room';

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
    let subscriptions = queueStore.selectedQueue.subscriptions;
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

  async function connectBroker() {
    consoleLog("queues: connecting to broker...");
    const token = await auth.getTokenSilently();
    client.value = new Client({
      // debug: consoleLog,
      brokerURL: brokerUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        "Authorization": [`${token}`]
      },
      disconnectHeaders: {
        "Authorization": [`${token}`]
      },
      splitLargeFrames: true, 
      webSocketFactory: () => new SockJS(brokerUrl),
      onUnhandledMessage: message => consoleLog("queues: broker unhandled message: " + JSON.stringify(message)),
      onUnhandledReceipt: receipt => consoleLog("queues: broker unhandled receipt: " + JSON.stringify(receipt)),
      onUnhandledFrame: frame => consoleLog("queues: broker unhandled frame: " + JSON.stringify(frame)),
      onDisconnect: () => consoleLog("queues: broker disconnected"),
      onWebSocketError: (e) => consoleError("queues: broker socket error due to: " + JSON.stringify(e)),
      onStompError: (e) => consoleError("queues: broker STOMP error due to: " + JSON.stringify(e)),
    });

    client.value.onStompError = function (frame) {
        consoleError("queues: broker reported error: " + frame.headers["message"]);
        consoleError("queues: broker error additional details: " + frame.body);
    };

    client.value.onConnect = function () {
      consoleLog("queues: broker connected");
      // store the STOMP sessionId 
      let url = client.value.webSocket._transport.url;
      let urlPieces = url.split('/');
      if (urlPieces.length > 5) {
        sessionId.value = urlPieces[urlPieces.length - 2];
      }
      // subscribe to this user's message feed 
      let finalUrl = "/secured/user/queue/specific-user" + "-user" + sessionId.value;
      consoleLog("queues: subscribing to: " + finalUrl);
      try {
        client.value.subscribe(finalUrl, function (message) {

          let apiResponse = JSON.parse(message.body);
          /**
           * apiResponse must have a responseType property of: 
           *   CREATED_QUEUE_DEFINITIONS 
           *   CREATED_SUBSCRIPTION_DEFINITIONS 
           *   MESSAGE 
           */
          let responseType = apiResponse.responseType;
          if (responseType === 'CREATED_QUEUE_DEFINITIONS') {
            let createdQueues = apiResponse.message;
            for (let i = 0; i < createdQueues.length; i++) {
              let wrapper = createdQueues[i];
              let qd = wrapper.queueDefinition;
              queueStore.addQueue(qd);
              queueStore.initializeArticleList(qd.id);
              let sd = wrapper.subscriptionDefinitions;
              decorateQueueWithSubscriptionDefinitions(qd, sd, []); // empty subscription metrics 
            }
            let createdQueueIds = createdQueues.map(q => q.queueDefinition.id);
            queueStore.rebuildLunrIndexes(createdQueueIds);
            refreshQueues(createdQueueIds, false); // this will do no work if there are no SDs in the response 
            setLastServerMessage(t('nQueuesCreated', { n: createdQueues.length }));
          } else if (responseType === 'CREATED_SUBSCRIPTION_DEFINITIONS') {
            let subscriptionDefinitions = apiResponse.message; 
            if (subscriptionDefinitions && subscriptionDefinitions.length > 0) {
              let sd = subscriptionDefinitions[0];
              let r = {
                id: sd.id,
                url: sd.url,
                queueId: sd.queueId,
                title: sd.title
              }
              // auth 
              let queryConfig = sd.queryConfig ? JSON.parse(sd.queryConfig) : sd.queryConfig;
              if (queryConfig) {
                r.username = queryConfig.username;
                r.password = queryConfig.password;
              }
              // image 
              // let sourceImgUrl = source.imgUrl;
              // if (sourceImgUrl) {
              //   r.image = {
              //     title: null,
              //     url: sourceImgUrl,
              //   }
              // }
              queueStore.addSubscriptionToQueue(r);
              refreshQueues([r.queueId], false); // TODO: only refresh this subscription 
            }
            } else if (responseType === 'MESSAGE') {
            consoleLog("queues: message received in secured channel: " + apiResponse.message);
          } else {
            // unsupported response type 
            consoleError('queues: ignoring unsupported response type: ' + responseType);
          }
        });
        // publish HELLO_WORLD to the broker 
        client.value.publish({
          from: 'me',
          to: 'me',
          destination: '/secured/room',
          body: JSON.stringify({
            requestType: 'HELLO_WORLD',
            payload: 'Hello Newsgears maintenance broker!'
          }),
        });
      } catch (error) {
        console.debug("queues: broker client bugged out; the connection probably disappeared.");
      }
    };
    //
    // activate the client
    //
    try {
      client.value.activate();
    } catch (error) {
      consoleError("queues: WebSocket failed to activate, please re-authenticate");
      console.debug("queues: WebSocket client error=" + JSON.stringify(error));
    }
  }

  function disconnectBroker() {
    consoleLog("queues: disconnect from broker");
    if (client.value) {
      client.value.deactivate();
    }
  }

  async function refreshQueues(queueIdsToRetrieve, retrieveQueueDefinitions) {
    consoleLog("queues: refreshing queues, "
      + " queueIds=" + (queueIdsToRetrieve ? queueIdsToRetrieve : "all")
      + ", retrieveQueueDefinitions=" + retrieveQueueDefinitions);
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
                p.isRead = p.postReadStatus === 'READ';
                p.isReadLater = p.postReadStatus === 'READ_LATER';
                p.postImgSrc = stagingPosts[i].postImgSrc;
                rawPosts.push(p);
                ct++;
              }
              consoleLog("queues: staging post refresh complete, ct=" + ct);
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
                  // TODO: see if this is still necessary 
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

      // TODO: move to a queueStore action 
      if (queueStore.queues.length > 0) {
        if (!queueStore.selectedQueueId) {
          queueStore.restoreSelectedQueueId();
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
    consoleLog("queues: updating post status");
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
          queueStore.updateSelectedPost(p);
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
    let f = queueStore.articleList.values;
    for (let j = 0; j < f.length; j++) {
      if (f[j].id === id) {
        return f[j];
      }
    }
  }

  function deleteSelectedQueue() {
    document.activeElement.blur();
    queueIdToDelete.value = queueStore.selectedQueueId;
  }

  function performQueueDelete() {
    consoleLog("queues: deleting queue id=" + queueIdToDelete.value);
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
        consoleLog("queues: deleted queueId=" + queueIdToDelete.value);
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
    consoleLog("queues: updating queue status, id=" + queueIdToMarkAsRead.value);
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

  function openPost(postId) {
    let p = getPostFromQueue(postId);
    queueStore.clearSelectedPost();
    queueStore.updateSelectedPost(p);
  }

  function openPostUrl(postId) {
    const post = getPostFromQueue(postId);
    window.open(post.postUrl, '_blank');
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
          consoleError(error);
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
      finalizeIsLoading.value = true;
      consoleLog("queues: pushing queues to remote, ct=" + queueConfigRequests.length);
      try {
        for (let i = 0; i < queueConfigRequests.length; i++) {
          consoleLog("queues: pushing queue " + (i + 1) + "/" + queueConfigRequests.length + " to remote...");
          let payload = queueConfigRequests[i];
          client.value.publish({
            from: 'me',
            to: 'api',
            destination: '/secured/room',
            body: JSON.stringify({
              requestType: 'OPML_UPLOAD',
              payload: [payload]
            }),
          });
        }
        finalizeIsLoading.value = false;
        queueConfigRequests.splice(0);
        returnToStep1();
        if (resolve) {
          resolve();
        }
      } catch (error) {
        handleServerError(error);
        finalizeIsLoading.value = false;
        if (reject) {
          reject(error);
        }
      }
    });
  }

  function returnToStep1() {
    atStep2.value = false
  }

  function dismissOpmlUpload() {
    queueConfigRequests.splice(0);
    returnToStep1();
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

  function newQueue() {
    consoleLog("queues: creating queue");
    document.activeElement.blur();
    queueStore.initializeQueueConfig(); 
    showQueueConfigPanel.value = true;
  }

  function openQueueConfigPanel(queueId) {
    consoleLog("queues: configuring queueId=" + queueId);
    document.activeElement.blur();
    queueStore.initializeQueueConfig(queueId); 
    showQueueConfigPanel.value = true;
  }

  function createQueue(newQueue) {
    let method = 'POST';
    queueConfigIsLoading.value = true;
    consoleLog("queues: pushing new queue to remote..");
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newQueue),
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
          queueStore.innerSetSelectedQueueId(created.id);
          queueStore.rebuildLunrIndexes([created.id]);
          showQueueConfigPanel.value = false;
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

  function updateQueue(queueToUpdate) {
    let method = 'PUT';
    queueConfigIsLoading.value = true;
    consoleLog("queues: pushing updated queue to remote..");
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(queueToUpdate),
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      fetch(baseUrl + "/queues/" + queueToUpdate.id, requestOptions)
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
          queueStore.updateQueue(updated);
          setLastServerMessage(t('queueUpdated') + ' (' + queueToUpdate.ident + ')');
          refreshQueues([updated.id], false);
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
  }

  function addSubscription(newSubscription) {
    queueConfigIsLoading.value = true;
    consoleLog("queues: pushing new subscription to remote..");
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
      fetch(baseUrl + "/queues/" + queueStore.queueUnderConfig.id + '/subscriptions/', requestOptions)
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
            let sd = source.subscriptionDefinition;
            let r = {
              id: sd.id,
              url: sd.url,
              queueId: sd.queueId,
              title: sd.title
            }
            // auth 
            let queryConfig = sd.queryConfig ? JSON.parse(sd.queryConfig) : sd.queryConfig;
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
            queueStore.addSubscriptionToQueue(r); 
            setLastServerMessage(t('subscriptionAdded'));
            refreshQueues([r.queueId], false);
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
    consoleLog("queues: deleteing subscription..");
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
      fetch(baseUrl + "/queues/" + queueStore.queueUnderConfig.id + '/subscriptions/' + id, requestOptions)
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
          queueStore.deleteSubscriptionById(queueStore.queueUnderConfig.id, id);
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
    consoleLog("queues: pushing updated subscription to remote..");
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
      fetch(baseUrl + "/queues/" + queueStore.queueUnderConfig.id + '/subscriptions/' + source.id, requestOptions)
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
            let sd = subscriptionDefinitions[0];
            queueStore.updateSubscriptionById(queueStore.queueUnderConfig.id, sd);
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

  const roQueueIdToDelete = readonly(queueIdToDelete);
  const roQueueIdToMarkAsRead = readonly(queueIdToMarkAsRead);
  const roRefreshQueuesIsLoading = readonly(refreshQueuesIsLoading);
  const roContinueIsLoading = readonly(continueIsLoading);
  const roAtStep2 = readonly(atStep2);
  const roQueueConfigRequests = readonly(queueConfigRequests);
  const roFinalizeIsLoading = readonly(finalizeIsLoading);
  const roOpmlErrors = readonly(opmlErrors);
  const roLatestSubscriptionMetricsByQueue = readonly(latestSubscriptionMetricsByQueue);
  const roSubscriptionToShow = readonly(subscriptionToShow);
  const roQueueConfigIsLoading = readonly(queueConfigIsLoading);

  return {
    queueStore,
    roQueueIdToDelete,
    roQueueIdToMarkAsRead,
    roRefreshQueuesIsLoading,
    roContinueIsLoading,
    roAtStep2,
    roQueueConfigRequests,
    roFinalizeIsLoading,
    roOpmlErrors,
    roLatestSubscriptionMetricsByQueue,
    roSubscriptionToShow,
    roQueueConfigIsLoading,
    // 
    showOpmlUploadPanel, // rw 
    showSubscriptionMetrics, // rw
    showQueueConfigPanel, // rw
    // 
    showQueueRefreshIndicator,
    // 
    connectBroker,
    disconnectBroker,
    // 
    // makes server call to pull new stagingPosts for each queue; 
    // optionally makes server call to pull queue definitions; 
    // rebuilds all dependent entities and updates local storage; 
    refreshQueues,
    // utility method to add subscription data retrieved from server to queue definition 
    decorateQueueWithSubscriptionDefinitions,
    // makes a server call to update the post read status 
    updatePostReadStatus,
    // returns a post from the current articleList, by Id 
    getPostFromQueue,
    // initiates the queue delete process (sets queueIdToDelete and asks for confirmation) 
    deleteSelectedQueue,
    // completes the queue delete process by making a server call to delete the queue (given by queueIdToDelete) 
    performQueueDelete,
    // cancels the queue delete prorcess (unsets queueIdToDelete and hides the confirmation dialog) 
    cancelQueueDelete,
    // initiates the queue MAR process (sets queueIdToMarkAsRead to the selectedQueueId and asks for confirmation) 
    markSelectedQueueAsRead,
    // initiates the queue MAR process (sets queueIdToMarkAsRead to the given queueId and asks for confirmation) 
    markQueueAsRead,
    // completes the queue MAR process by making a server call to MAR the queue (given by queueIdToMarkAsRead) 
    performQueueMarkAsRead,
    // cancels the queue MAR prorcess (unsets queueIdToMarkAsRead and hides the confirmation dialog) 
    cancelQueueMarkAsRead,
    // 
    openPost,
    // 
    openPostUrl,
    // 
    uploadOpml,
    // 
    continueOpmlUpload,
    // 
    finalizeOpmlUpload,
    // 
    returnToStep1,
    // 
    dismissOpmlUpload,
    // 
    checkForNewSubscriptionMetrics,
    // 
    openSubscriptionMetrics,
    // 
    // called by HomeView to initiate the queue creation process ('new queue' button); 
    // shows the queue config panel 
    newQueue,
    // 
    // called by HomeView to initiate the queue update process; 
    // shows the queue config panel 
    openQueueConfigPanel,
    // 
    // invoked by HomeView to continue the queue save when the hits 'save' on a new queue; 
    // makes a server call to create the queue; 
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
