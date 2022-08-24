<template>
  <div class="post-feed">
    <div class="navbar fixed-header">
      <!-- deploy button -->
      <span>
        <button id="deploy" class="deploy-button" @click="deploy">
          Deploy
        </button>
      </span>
      <span class="vl"></span>
      <!-- tags selector -->
      <span>
        <select id="tag" class="tag-selector" v-model="selectedTag">
          <option v-for="tag in this.tags" :value="tag.value" :key="tag.label">{{ tag.label }}</option>
        </select>
      </span>
      <!-- view published on/off -->
      <span>
        <button id="deploy" class="toggle-view-button" @click="toggleViewPublished">
          view published: {{ this.viewPublished }}
        </button>
      </span>
      <!-- view staging on/off -->
      <span>
        <button id="deploy" class="toggle-view-button" @click="toggleViewStaging">
          view staging: {{ this.viewStaging }}
        </button>
      </span>
      <!-- view staged on/off -->
      <span>
        <button id="deploy" class="toggle-view-button" @click="toggleViewStaged">
          view staged: {{ this.viewStaged }}
        </button>
      </span>
    </div>
    <div class="navbar fixed-sub-header" v-if="this.lastServerMessage">
      <!-- server response -->
      <span class="last-server-message">{{ this.lastServerMessage }}</span>
      <span class="clear-last-server-message" @click="clearLastServerMessage">(clear message)</span>
    </div>
    <div v-if="!this.viewPublished && !this.viewStaging && !this.viewStaged" class="zero-posts-shown">Viewing 0 of {{ posts.length }} posts.</div>
    <div v-for="post in posts" :key="post.id" :post="post">
      <post-item
        v-if="shouldDisplay(post)"
        :post="post"
        :timestamp="post.importTimestamp"
        :baseUrl="baseUrl"
        :showTag="!this.selectedTag"
        @deletePost="onDeletePost"
        @deletePostError="onPostError"
        @publishPost="onPublishPost"
        @publishPostError="onPostError"
        @unpublishPost="onUnpublishPost"
        @unpublishPostError="onPostError"
      />
    </div>
  </div>
</template>

<script>
import PostItem from "./PostItem.vue";

export default {
  components: { PostItem },
  name: "PostFeed",
  props: ["baseUrl"],
  data() {
    return {
      posts: [],
      tags: [],
      selectedTag: null,
      lastServerMessage: null,
      viewPublished: false,
      viewStaging: true,
      viewStaged: true,
      publishedCt: null,
      stagingCt: null,
    };
  },
  methods: {
    clearLastServerMessage() {
      this.lastServerMessage = null;
    },
    shouldDisplay(post) {
      let tagCondition = (!this.selectedTag || this.selectedTag == post.tagName);
      let viewPublishedCondition = (this.viewPublished ? post.isPublished : false);
      let viewStagingCondition =  (this.viewStaging ? (!post.isPublished && !post.pubPending) : false);
      let viewStagedCondition = (this.viewStaged ? post.pubPending : false);
      return (this.viewPublished || this.viewStaging || this.viewStaged) && tagCondition && (viewPublishedCondition || viewStagingCondition || viewStagedCondition);
    },
    toggleViewPublished() {
      this.viewPublished = !this.viewPublished;
    },
    toggleViewStaging() {
      this.viewStaging = !this.viewStaging;
    },
    toggleViewStaged() {
      this.viewStaged = !this.viewStaged;
    },
    refreshFeed(hideStatus) {
      let rawPosts = [];
      const headers = { "Content-Type": "applicaiton/json" };
      fetch(this.baseUrl + "/staging", { headers })
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched " + data.length + " staging posts");
          let ct = 0;
          for (let i = 0; i < data.length; i++) {
            data[i].isPublished = false;
            rawPosts.push(data[i]);
            ct++;
          }
          this.stagingCt = ct;
          console.log("PostFeed refresh (staging posts) complete, ct=" + this.stagingCt);
        })
        .then(() => {
          fetch(this.baseUrl + "/published", { headers })
          .then((response) => response.json())
          .then((data) => {
            console.log("Fetched " + data.length + " published posts");
            let ct = 0;
            for (let i = 0; i < data.length; i++) {
              data[i].isPublished = true;
              rawPosts.push(data[i]);
              ct++;
            }
            this.publishedCt = ct;
            console.log("PostFeed refresh (published posts) complete, ct=" + this.publishedCt);
          })
          .finally(() => {
            // sort rawPosts 
            rawPosts.sort((l, r) => {
              return r.id - l.id // sort by Id, desc 
            });
            // empty posts 
            this.posts.splice(0, this.posts.length);
            // populate posts and build uniqueTags 
            let uniqueTags = new Set();
            for (let i = 0; i < rawPosts.length; i++) {
              uniqueTags.add(rawPosts[i].tagName);
              this.posts.push(rawPosts[i]);
            }
            console.log("unique tags len = " + uniqueTags.size);
            // empty tags
            this.tags.splice(0, this.tags.length);
            // populate tags
            // (start with empty option)
            this.tags.push({ "label": "(select a tag)", "value": null });
            // (add unique tags) 
            let t = Array.from(uniqueTags);
            for (let i = 0; i < t.length; i++) {
              this.tags.push({
                "label": t[i],
                "value": t[i]
                });
            }
            if (!hideStatus) {
              this.lastServerMessage = "Feed refresh complete.  Staging ct=" + this.stagingCt + ", published ct=" + this.publishedCt + ", total=" + this.posts.length + ", tag ct=" + this.tags.length;
            }
          });
        })
        .catch((error) => {
          console.log("something horrible happened, server up? error=" + error);
        });
    },
    onDeletePost(result) {
      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i].id === result.id) {
          this.posts.splice(i, 1);
        }
      }
      this.lastServerMessage = result.message;
    },
    onPublishPost(result) {
      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i].id === result.id) {
          this.posts[i].pubPending = true;
          break;
        }
      }
      this.lastServerMessage = result.message;
    },
    onUnpublishPost(result) {
      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i].id === result.id) {
          this.posts[i].pubPending = false;
          break;
        }
      }
      this.lastServerMessage = result.message;
    },
    onPostError(message) {
      this.lastServerMessage = message;
    },
    deploy() {
      console.log("Deploying all pub-pending posts");
      this.lastServerMessage = null;
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      let url = this.baseUrl + "/staging/deploy";
      if (this.selectedTag) {
        url += "?tag=" + this.selectedTag;
      }
      fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw Error("Deploy failed due to: " + response.statusText);
        }
      })
      .then((data) => {
        this.lastServerMessage = data.message;
        this.refreshFeed(true);
      }).catch((error) => {
        console.log(error);
      });
    },
  },
  created() {
    console.log("PostFeed created, baseUrl=" + this.baseUrl);
    this.refreshFeed();
  },
};
</script>

<style scoped>
.vl {
  border-left: 1px solid black;
  height: 32px;
  margin-left: 4px;
  margin-right: 1px;
  margin-top: 9px;
  float: left;
}

.navbar.fixed-header {
  position: fixed;
  left: 0;
  top: 0;
  height: 50px;
  width: 100vw;
  z-index: 200;
  background: rgba(100, 100, 100, 0.95);
  box-shadow: 1px 1px 1px rgb(0 0 0 / 75%);
}

.navbar.fixed-sub-header {
  position: fixed;
  left: 0;
  top: 50px;
  height: 50px;
  width: 100vw;
  z-index: 200;
  border-top: 1px solid black;
  background: rgba(128, 128, 128, 0.95);
  box-shadow: 1px 1px 1px rgb(0 0 0 / 75%);
}

.tag-selector {
  margin: 9px;
  float: left;
  padding: 7px 20px;
  text-align: left;
  border: 1px solid black;
  background-color: rgb(64, 64, 64);
  color: lightgrey;
  box-shadow: 1px 1px 1px rgb(0 0 0 / 50%);
  cursor: pointer;
  text-align: center;
  border-radius: 3px;
}

.tag-selector:hover {
  background: cornflowerblue;
}

.tag-selector-label {
  margin-top: 15px;
  margin-right: 10px;
  color: lightgrey;
  font-weight: bold;
  float: left;
}

.last-server-message {
  float: left;
  color: ghostwhite;
  padding-left: 9px;
  padding-top: 9px;
  font-weight: normal;
  font-size: smaller;
}

.clear-last-server-message {
  float: left;
  color: darkgrey;
  font-weight: normal;
  font-size: smaller;
  padding-left: 10px;
  padding-top: 9px;
  cursor: pointer;
}

.post-no-admin {
  margin-bottom: 20px;
}

.deploy-button {
  border: 1px solid black;
  background-color: rgb(64, 64, 64);
  color: lightgrey;
  box-shadow: 1px 1px 1px rgb(0 0 0 / 50%);
  padding: 7px 20px;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  margin: 9px;
  text-align: center;
}

.deploy-button:hover {
  background-color: cornflowerblue;
}

.deploy-button-danger:hover {
  background-color: red;
}

.toggle-view-button {
  border: 1px solid black;
  background-color: rgb(64, 64, 64);
  color: lightgrey;
  box-shadow: 1px 1px 1px rgb(0 0 0 / 50%);
  padding: 7px 20px;
  cursor: pointer;
  float: left;
  border-radius: 3px;
  margin: 9px;
  text-align: center;
}

.toggle-view-button:hover {
  background-color: cornflowerblue;
}

.toggle-view-button-danger:hover {
  background-color: red;
}

.zero-posts-shown {
  font-weight: normal;
  font-size: smaller;
  color: paleturquoise;
  margin-bottom: 20px;
}
</style>
