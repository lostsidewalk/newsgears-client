import lunr from 'lunr';

import { defineStore } from 'pinia';

const buildLunrSubscriptionExpr = (subscription) => {
  let expr = '';
  let tokens = subscription.split(/[-[\]{}()*+?.,\\^$|#\s]/)
    .map(e => e.trim())
    .filter(e => e.length > 0);
  for (let i = 0; i < tokens.length; i++) {
    expr += ' feed:' + tokens[i];
  }
  return expr;
}

const buildLunrCategoryExpr = (currentFilter, category) => {
  let expr = '';
  let tokens = category.split(/[-[\]{}()*+?.,\\^$|#\s]/)
    .map(e => e.trim())
    .filter(e => e.length > 0);
  for (let i = 0; i < tokens.length; i++) {
    let newToken = 'category:' + tokens[i];
    if (!currentFilter || currentFilter.indexOf(newToken) < 0) {
      expr += (' ' + newToken);
    }
  }
  return expr;
}

const trim = (str) => {
  if (typeof str === 'string') {
    return str.trim();
  }
  return str;
}

export const useQueueStore = defineStore('queueStore', {
  state: () => ({
    // all queue data 
    queues: [],
    selectedQueueId: null,
    // filter settings 
    articleListsByQueue: {},
    articleListFilter: '',
    showUnreadPosts: true,
    showReadPosts: false,
    showReadLaterPosts: false,
    // article list sorting 
    articleListSortOrder: 'ASC',
    // queue configuration 
    queueUnderConfig: {},
  }),
  getters: {
    allSubscriptions: (state) => {
      let subscriptions = [];
      for (let queue of state.queues) {
        let queueSubscriptions = queue.subscriptions;
        if (queueSubscriptions) {
          subscriptions.push(...queueSubscriptions);
        }
      }
      
      return subscriptions;
    },
    allQueues: (state) => {
      return state.queues;
    },
    // currently selected queue data 
    selectedQueueTitle: (state) => {
      for (let queue of state.queues) {
        if (queue.id === state.selectedQueueId) {
          return queue.title;
        }
      }
      return null;
    },
    selectedQueueDescription: (state) => { 
      for (let queue of state.queues) {
        if (queue.id === state.selectedQueueId) {
          return queue.description;
        }
      }
      return null;
    },
  },
  actions: {
    setSelectedQueueId(queueId) {
      this.selectedQueueId = queueId;
      let iq = this.articleListsByQueue[queueId];
      if (!iq) {
        console.warn("queue-store: unable to set selected queue Id to " + queueId);
        return;
      }
      if (!iq.index) {
        this.rebuildLunrIndexes([queueId]);
      }
    },
    setQueues(queues) {
      this.queues = queues;
    },
    setArticleListsByQueue(articleLists) {
      this.articleListsByQueue = articleLists;
    },
    addQueue(queue) {
      if (!queue.subscriptions) {
        queue.subscriptions = [];
      }
      let existingQueueIndex = this.queues.findIndex(q => q.id === queue.id);
      if (existingQueueIndex !== -1) {
        this.queues[existingQueueIndex] = queue;
      } else {
        this.queues.push(queue);
      }
    },
    addSubscriptionToQueue(subscription) {
      // add the subscription to the queue 
      let queueId = subscription.queueId;
      for (let i = 0; i < this.queues.length; i++) {
        if (this.queues[i].id === queueId) {
          this.queues[i].subscriptions.unshift(subscription);
          break;
        }
      }
    },
    initializeArticleList(queueId) {
      this.articleListsByQueue[queueId] = { values: [] };
    },
    clearQueues() {
      this.queues.splice(0);
    },
    rebuildQueues(queuesToRetrieve, rawPosts) {
      console.log("queue-store: rebuilding queues");
      for (let i = 0; i < this.queues.length; i++) {
        const queueId = this.queues[i].id;
        const iq = this.articleListsByQueue[queueId];
        if (iq) {
          if (!queuesToRetrieve || queuesToRetrieve.indexOf(this.queues[i].id) >= 0) {
            iq.values.splice(0);
            iq.index = null;
          }
        } else {
          this.articleListsByQueue[queueId] = { values: [] };
        }
      }

      for (let i = 0; i < rawPosts.length; i++) {
        const post = rawPosts[i];
        let v = this.articleListsByQueue[post.queueId].values;
        // TODO: we need to (first) sort rawPosts in some way, 
        //  then push the posts beyond #256 to some form of archive with easy retrieval; 
        //  for now, take no more than 256 random posts 
        // if (v.length < 256) {
          v.push(post);
        // }
      }
    },
    rebuildLunrIndexes(queueIdsToIndex) {
      console.debug("queue-store: rebuilding lunr indexes for queueIds=" + queueIdsToIndex);
      for (let i = 0; i < queueIdsToIndex.length; i++) {
        let iq = this.articleListsByQueue[queueIdsToIndex[i]];
        if (iq) {
          iq.index = lunr(function () {
            this.ref('id')
            // title 
            this.field('title', {
              extractor: function (doc = {}) {
                return doc.postTitle ? trim(doc.postTitle.value) : null;
              },
              boost: 10,
            });
            // description 
            this.field('description', {
              extractor: function (doc = {}) {
                return doc.postDesc ? trim(doc.postDesc.value) : null;
              }
            });
            // feed 
            this.field('feed', {
              extractor: function (doc = {}) {
                return trim(doc.importerDesc);
              },
            });
            // category 
            this.field('category', {
              extractor: function (doc = {}) {
                return doc.postCategories ? trim(doc.postCategories.toString()) : null;
              }
            });
            // author 
            this.field('author', {
              extractor: function (doc = {}) {
                return (doc.authors && doc.authors.length > 0) ? trim(doc.authors[0].name) : null;
              }
            });
            // authors
            this.field('authors', {
              extractor: function (doc = {}) {
                return (doc.authors && doc.authors.length > 0) ?
                  doc.authors.map(function (author) { return trim(author.name); }) : null;
              }
            });
            // contributors
            this.field('contributors', {
              extractor: function (doc = {}) {
                return (doc.contributors && doc.contributors.length > 0) ?
                  doc.contributors.map(function (contributor) { return trim(contributor.name); }) : null;
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
                return (doc.postContents && doc.postContents.length > 0) ? trim(doc.postContents[0].value) : null;
              }
            })
            // url
            this.field('url', {
              extractor: function (doc = {}) {
                return trim(doc.postUrl);
              }
            });
            iq.values.forEach(function (doc) {
              this.add(doc)
            }, this)
          });
        }
      }
      console.debug("queue-store: lunr index rebuild complete for queueIds=" + queueIdsToIndex);
    },
    updateLastDeployed(queueId, timestamp) {
      // update the queue last deployed timestamp 
      for (let i = 0; i < this.queues.length; i++) {
        if (this.queues[i].id === queueId) {
          this.queues[i].lastDeployed = timestamp;
          break;
        }
      }
    },
    deleteQueueById(queueId) {
      delete this.articleListsByQueue[queueId];
      let idxToSplice = -1;
      for (let i = 0; i < this.queues.length; i++) {
        if (this.queues[i].id === queueId) {
          idxToSplice = i;
          break;
        }
      }
      if (idxToSplice > -1) {
        this.queues.splice(idxToSplice, 1);
      }
    },
    deleteSubscriptionById(queueId, subscriptionId) {
      let deleteIdx = -1;
      for (let i = 0; i < this.queues.length; i++) {
        if (this.queues[i].id === queueId) {
          let q = this.queues[i];
          for (let i = 0; i < q.subscriptions.length; i++) {
            if (q.subscriptions[i].id === subscriptionId) {
              deleteIdx = i;
              break;
            }
          }
          if (deleteIdx > -1) {
            q.subscriptions.splice(deleteIdx, 1);
          }
          break;
        }
      }
    },
    updateSubscriptionById(queueId, subscription) {
      for (let i = 0; i < this.queues.length; i++) {
        if (this.queues[i].id === queueId) {
          let q = this.queues[i];
          for (let i = 0; i < q.subscriptions.length; i++) {
            if (q.subscriptions[i].id === subscription.id) {
              let currentSubscription = q.subscriptions[i];
              let queryConfigStr = subscription.queryConfig;
              if (queryConfigStr) {
                let queryConfig = JSON.parse(queryConfigStr);
                currentSubscription.username = queryConfig.username;
                currentSubscription.password = queryConfig.password;
              } else {
                currentSubscription.username = null;
                currentSubscription.password = null;
              }
            }
            break;
          }
          break;
        }
      }
    },
    markQueueAsRead(queueId) {
      this.articleListsByQueue[queueId].values.forEach((p) => {
        p.isRead = true;
        p.postReadStatus = 'READ';
        p.isReadLater = false;
      });
    },
    // 
    clearArticleListFilter() {
      this.articleListFilter = '';
    },
    // TODO: rename this method 
    addSubscriptionToFilter(subscription) {
      let expr = buildLunrSubscriptionExpr(subscription);
      if (this.articleListFilter.indexOf(expr) < 0) {
        this.articleListFilter = expr;
      }
    },
    // TODO: rename this method 
    addCategoryToFilter(category) {
      let expr = buildLunrCategoryExpr(this.articleListFilter, category);
      if (this.articleListFilter.indexOf(expr) < 0) {
        this.articleListFilter = expr;
      }
    },
    setArticleListFilter(filter) {
      this.articleListFilter = filter;
    },
    // 
    toggleShowUnreadPosts() {
      this.showUnreadPosts = !this.showUnreadPosts;
    },
    toggleShowReadPosts() {
      this.showReadPosts = !this.showReadPosts;
    },
    toggleShowReadLaterPosts() {
      this.showReadLaterPosts = !this.showReadLaterPosts;
    },
    setShowUnreadPosts(value) {
      this.showUnreadPosts = value;
    },
    setShowReadPosts(value) {
      this.showReadPosts = value;
    },
    setShowReadLaterPosts(value) {
      this.showReadLaterPosts = value;
    },
    // 
    toggleArticleListSortOrder() {
      this.articleListSortOrder = (this.articleListSortOrder === 'DSC' ?
        'ASC' :
        'DSC'
      );
    },
    // 
    initializeQueueConfig(queueId) {
      this.queueUnderConfig = {};
      let q = null;
      for (let i = 0; i < this.queues.length; i++) {
        if (this.queues[i].id === queueId) {
          q = this.queues[i];
          break;
        }
      }
      if (q) {
        Object.assign(this.queueUnderConfig, q);
      }
    },
    updateQueue(updated) {
      let current = null;
      for (let i = 0; i < this.queues.length; i++) {
        if (this.queues[i].id === updated.id) {
          current = this.queues[i];
          break;
        }
      }
      if (current) {
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
      }
    }
  }
});
