<template>
  <div class="post-wrapper" style="margin-bottom: 20px;">
    <div class="post-item-header">
      <span class="post-id">&nbsp;POST ID: {{ post.id }}</span> 
      <span v-if="this.post.pubPending" class="post-pub-pending">STATUS: STAGED</span>
      <span class="post-imported-at">IMPORTED AT: {{ timestamp }}</span>
      <span v-if="this.post.isPublished" class="post-published">STATUS: PUBLISHED</span>
      <span v-if="!this.post.isPublished && !this.post.pubPending" class="post-review">STATUS: REVIEW</span>    
      <span class="post-feed-ident" v-if="this.showFeed">FEED: {{ post.feedIdent }}</span>
      <span class="post-importer">IMPORTER: {{ post.importerDesc }}</span>
    </div>
    <div class="post-item">
      <div class="post-title" @click.self="togglePostDetails">
        {{ post.postTitle }}
      </div>
      <div class="post-desc" :style="postStyle">{{ post.postDesc }}</div>
      <div class="post-url" :style="postStyle">
        <a :href="post.postUrl" :target="'postItemWindow_' + post.id" class="post-url-anchor">{{
          post.postUrl
        }}</a>
      </div>
      <!-- <div class="post-img-url">Img URL: {{ post.postImgUrl }}</div> -->
    </div>
    <div class="post-item-footer">
      <!-- publish button -->
      <span>
        <button 
          id="publish" 
          class="post-admin-button"
          @click="publishPost"
          :disabled="post.isPublished || post.pubPending"
        >
          <span class="fa fa-plus fa-1x"></span>
        </button>
      </span>
      <!-- unpublish button -->
      <span>
        <button
          id="unpublish"
          class="post-admin-button post-admin-button-warn"
          @click="unpublishPost"
          :disabled="post.isPublished || !post.pubPending"
        >
          <span class="fa fa-minus fa-1x"></span>
        </button>
      </span>
      <!-- delete button -->
      <span
        ><button
          id="delete"
          class="post-admin-button post-admin-button-danger"
          @click="deletePost"
          :disabled="post.isPublished"
        >
          <span class="fa fa-trash fa-1x"></span>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostItem",
  props: ["post", "timestamp", "baseUrl", "showFeed"],
  emits: ["deletePost", "publishPost", "unpublishPost", "deletePostError", "publishPostError", "unpublishPostError"],
  data() {
    return {
      pubPending: this.post.pubPending,
      postStyle: "display: none;",
    };
  },
  methods: {
    togglePostDetails() {
      if (this.postStyle) {
        this.postStyle = null;
      } else {
        this.postStyle = 'display: none;';
      }
    },
    publishPost() {
      console.log("Publishing post id=" + this.post.id);
      this.lastServerResponse = null;
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: true }),
      };
      fetch(this.baseUrl + "/staging/" + this.post.id, requestOptions)
      .then((response) => {
        if (response.status === 400) {
          throw Error("Post Id " + this.post.id + " is already published.");
        }
        return response.json();
      })
      .then((data) => {
        this.$emit("publishPost", { id: this.post.id, message: data.message });
      })
      .catch((error) => {
        console.log(error);
        this.$emit("publishPostError", error);
      });
    },
    unpublishPost() {
      console.log("Unpublishing post id=" + this.post.id);
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: false }),
      };
      fetch(this.baseUrl + "/staging/" + this.post.id, requestOptions)
      .then((response) => {
        if (response.status === 400) {
          throw Error("Post Id " + this.post.id + " is already published.");
        }
        return response.json();
      })
      .then((data) => {
        this.lastServerResponse = data.message;
        this.$emit("unpublishPost", { id: this.post.id, message: data.message });
      })
      .catch((error) => {
        console.log(error);
        this.$emit("unpublishPostError", error);
      });
    },
    deletePost() {
      console.log("Deleting post id=" + this.post.id);
      this.lastServerResponse = null;
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      };
      fetch(this.baseUrl + "/staging/" + this.post.id, requestOptions)
      .then((response) => {
        if (response.status === 400) {
          throw Error("Post Id " + this.post.id + " is already published.");
        }
        return response.json();
      })
      .then((data) => {
        this.lastServerResponse = data.message;
        this.$emit("deletePost", { id: this.post.id, message: data.message });
      })
      .catch((error) => {
        console.log(error);
        this.$emit("deletePostError", error);
      });
    },
  },
};
</script>

<style scoped>
.post-item {
  margin-top: 0px;
  margin-left: 20px;
  margin-right: 20px;
  text-align: initial;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
  box-shadow: 1px 1px 1px rgb(0 0 0 / 50%);
}

.post-id {
  color: gray;
  float: left;
  font-size: x-small;
  font-weight: bold;
}

.post-pub-pending {
  color: yellow;
  float: left;
  font-size: x-small;
  margin-left: 15px;
  font-weight: bold;
}

.post-published {
  color: burlywood;
  float: left;
  font-size: x-small;
  margin-left: 15px;
  font-weight: bold;
}

.post-review {
  color: burlywood;
  float: left;
  font-size: x-small;
  margin-left: 15px;
  font-weight: bold;
}

.post-feed-ident {
  color: burlywood;
  float: left;
  font-size: x-small;
  margin-left: 15px;
  font-weight: bold;
}

.post-importer {
  color: gray;
  float: right;
  font-size: x-small;
  margin-left: 15px;
  font-weight: bold;
}

.post-imported-at {
  color: gray;
  float: right;
  font-size: x-small;
  margin-left: 15px;
  font-weight: bold;
}

.post-title {
  padding: 10px 10px 10px 10px;
  border-bottom: 1px solid black;
  background: rgba(100, 100, 100);
  color: lightgrey;
  font-weight: normal;
  cursor: pointer;
  user-select: none;
}

.post-desc {
  padding: 10px 10px 10px 10px;
  background: rgba(100, 100, 100);
  color: lightgrey;
  font-weight: normal;
  font-size: small;
}

.post-url {
  padding: 10px 10px 10px 10px;
  background: rgba(100, 100, 100);
  color: lightgrey;
  font-weight: normal;
  font-size: smaller;
}

.post-url-anchor {
  color: black;
}

.post-img-url {
  padding: 10px 10px 10px 10px;
}

.post-item-header {
  padding: 5px;
  text-align: right;
  padding-right: 15px;
  border: 1px solid black;
  margin-left: 20px;
  margin-right: 20px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background: rgba(80, 80, 80);
  box-shadow: 1px 1px 1px rgb(0 0 0 / 50%);
  display: flow-root;
}

.post-item-footer {
  background: rgba(100, 100, 100);
  padding: 5px;
  text-align: left;
  padding-right: 15px;
  border: 1px solid black;
  margin-left: 20px;
  margin-right: 20px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 1px 1px 1px rgb(0 0 0 / 50%);
  display: flow-root;
}

.post-admin-button {
  border: 1px solid black;
  cursor: pointer;
  text-align: center;
  border-radius: 3px;
  margin-left: 3px;
  margin-right: 3px;
  background-color: rgb(64, 64, 64);
  color: lightgrey;
  padding-top: 3px;
}

.post-admin-button:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.post-admin-button:hover:enabled {
  background: cornflowerblue;
}

.post-admin-button-danger:hover:enabled {
  background: red;
}
</style>
