import lunr from 'lunr';

import { defineStore } from 'pinia';

export const useQueueStore = defineStore('queueStore', {
  state: () => ({
    selectedQueueId: '',
    queues: [],
    articleListsByQueue: {},
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
  },
  actions: {
    setSelectedQueueId(queueId) {
      this.selectedQueueId = queueId;
      let iq = this.articleListsByQueue[queueId];
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
      this.queues.push(queue);
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
        const queuedId = this.queues[i].id;
        const iq = this.articleListsByQueue[queuedId];
        if (iq) {
          if (!queuesToRetrieve || queuesToRetrieve.indexOf(this.queues[i].id) >= 0) {
            iq.values.splice(0);
            iq.index = null;
          }
        } else {
          this.articleListsByQueue[queuedId] = { values: [] };
        }
      }

      for (let i = 0; i < rawPosts.length; i++) {
        const post = rawPosts[i];
        let v = this.articleListsByQueue[post.queueId].values;
        v.push(post);
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
    markQueueAsRead(queueId) {
      this.articleListsByQueue[queueId].values.forEach((p) => {
        p.isRead = true;
        p.postReadStatus = 'READ';
        p.isReadLater = false;
      });
    }
  },
});