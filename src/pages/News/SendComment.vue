<template>
  <div>
    <div class="navTop">
      <router-link :to="{ path: '/Comment/' + this.$route.params.id, query: {tab:'hide'}}">
        <i class="iconfont back">&#xe609;</i>
      </router-link>
      <span class="navCon">评论</span>
      <i class="sendIcon" v-on:click="addComment(id)">发送</i>
    </div>
    <div class="comment">
      <textarea></textarea>
    </div>
  </div>
</template>
<script>
import Error from "@/components/Error";
import Config from "@/config/config";
import Store from "@/store/store";
import { Toast } from "mint-ui";
export default {
  components: {
    Error
  },
  data() {
    return {
      say: [],
      comments: [],
      isError: false,
      error: "",
      comment: "",
      username: "",
      picture: "",
      id: 0,
      whoami: "user/whoami/",
      viewUrl: "dynamic/viewComment/",
      commentUrl: "comment/add/"
    };
  },
  mounted() {
    this.id = +this.$route.params.id;
    if (!(this.id > 0)) {
      this.isError = true;
      this.error = "参数错误";
    } else {
      if (Store.getAuthUid()) {
        this.$http.get(this.whoami, {}).then(response => {
          const ret = JSON.parse(response.data);
          if (ret && ret["code"] === 0) {
            this.username = ret["nickname"] ? ret["nickname"] : ret["username"];
            this.picture = ret["picture"];
          }
        });
      }
      this.getData(this.id);
    }
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    defaultPicUrl: function() {
      return Config.defaultPic;
    },

    addComment: function(linkid) {
      if (!this.username) {
        this.$router.push("/login");
        return;
      }
      var comment = this.$refs.comment.value;
      this.getComment(linkid, comment);
    },

    getData(id) {
      this.$http.post(this.viewUrl, { id: id }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.comments = ret["data"]["comments"];
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
          if (typeof callback === "function") {
            callback.call(this);
          }
        },
        response => {
          this.isError = true;
          this.error = "";
          if (typeof callback === "function") {
            callback.call(this);
          }
        }
      );
    },
    getComment(linkid, comment) {
      this.$http
        .post(this.commentUrl, { linkid: linkid, comment: comment, type: 7 })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              Toast("评论成功!");
              var comment_data = {};
              comment_data["username"] = this.username;
              comment_data["u_picture"] = this.picture;
              comment_data["comment"] = comment;
              comment_data["vote"] = 0;
              comment_data["id"] = ret.newid;
              comment_data["commenttime"] = "刚刚";
              this.comments.unshift(comment_data);
              this.$router.replace("/comment/" + this.$route.params.id);
              document.getElementById("comment").value = "";
            } else {
              Toast(ret.msg);
              this.error = (ret && ret.msg) || "";
              this.isError = true;
            }
          },
          response => {
            this.isError = true;
            this.error = "";
          }
        );
    }
  }
};
</script>
<style scoped>
/* 评论框头部 */
.navTop .navCon {
  width: 67%;
}
.navTop .sendIcon {
  display: inline-block;
  width: 20%;
  font-size: 0.16rem;
  font-style: normal;
  color: #fff;
  text-align: center;
}
/* 评论框 */
.comment {
  width: 100%;
  padding-top: 0.45rem;
}
.comment textarea {
  border: none;
  outline: none;
  width: 90%;
  padding: 5%;
  height: 1rem;
}
</style>