<template>
  <div>
    <div class="navTop">
      <router-link :to="{ path: '/' }">
        <i class="iconfont back">&#xe609;</i>
      </router-link>
      <span class="navCon">智慧政务</span>
    </div>
    <div class="government pt45">
      <div class="convenient">
        <div class="box">
          <div class="t">
            <img src="~@/assets/images/g1t.png" />
            <span>政府办事</span>
          </div>
          <div class="con">
            <ul>
              <li>
                <a v-on:click="changeClick('http://www.shihe.gov.cn/')">
                  <img src="~@/assets/images/g1a1.png" />
                  <span>浉河政府</span>
                </a>
              </li>
              <li>
                <a
                  v-on:click="changeClick('http://55754180.m.weimob.com/weisite/home?pid=55754180&bid=56719197&wechatid=fromUsername&wxref=mp.weixin.qq.com&channel=share%5E%23%5E_f&from=singlemessage')"
                >
                  <img src="~@/assets/images/g1a2.png" />
                  <span>浉河区电商办</span>
                </a>
              </li>
              <li>
                <a v-on:click="changeClick('http://www.xysgaj.gov.cn/')">
                  <img src="~@/assets/images/g1a3.png" />
                  <span>公安局</span>
                </a>
              </li>
              <li>
                <a v-on:click="changeClick('http://www.haxy.lss.gov.cn/')">
                  <img src="~@/assets/images/g1a4.png" />
                  <span>人社局</span>
                </a>
              </li>
              <li>
                <a v-on:click="changeClick('http://www.xyfg.gov.cn/')">
                  <img src="~@/assets/images/g1a5.png" />
                  <span>房管局</span>
                </a>
              </li>
              <li>
                <a v-on:click="changeClick('http://www.hnxymzj.gov.cn/')">
                  <img src="~@/assets/images/g1a6.png" />
                  <span>民政局</span>
                </a>
              </li>
              <li>
                <a v-on:click="changeClick('http://www.xyhbw.gov.cn/')">
                  <img src="~@/assets/images/g1a7.png" />
                  <span>环保局</span>
                </a>
              </li>
              <li>
                <a v-on:click="changeClick('http://www.xinyangedu.gov.cn/')">
                  <img src="~@/assets/images/g1a8.png" />
                  <span>教育局</span>
                </a>
              </li>
              <li>
                <a v-on:click="changeClick('http://www.xywjj.gov.cn/')">
                  <img src="~@/assets/images/g1a9.png" />
                  <span>物价局</span>
                </a>
              </li>
              <li>
                <a v-on:click="changeClick('http://www.xycsgl.gov.cn/')">
                  <img src="~@/assets/images/g1a10.png" />
                  <span>城管局</span>
                </a>
              </li>
              <li>
                <router-link :to="{ path: '/wjs'}">
                  <img src="~@/assets/images/g1a11.png" />
                  <span>更多</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="question">
        <router-link :to="{path:'/asklist',query:{tab:'hide'}}">
          <div class="t">
            <img src="~@/assets/images/que.png" />
            <span>互助问答</span>
          </div>
        </router-link>
        <div class="QA-list">
          <template v-for="(askData, index) in askList">
            <router-link
              :to="{ path: '/asklist/'+askData.id,query:{tab:'hide'}}"
              :key="index"
              append
            >
              <div class="item">
                <div class="photo">
                  <img
                    v-bind:src="[askData['u_picture']?fullUrl(askData['u_picture']):defaultPicUrl()]"
                    class="w100"
                  />
                </div>
                <div class="info">
                  <div class="top">
                    <div class="fl">
                      <p class="p1">{{askData['username']}}</p>
                      <p class="p2">{{askData['addtime']}}</p>
                    </div>
                    <div class="fr">
                      <div class="box">
                        <i v-bind:class="[askData['comment_num'] ? 'red' : '']"></i>
                        <p>{{askData['comment_num']}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="text">{{askData['content']}}</div>
                </div>
              </div>
            </router-link>
          </template>
        </div>
      </div>
    </div>
    <div class="item comm">
      <button class="send" v-on:click="questionClick()">我要提问</button>
    </div>
  </div>
</template>
<script>
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config";

export default {
  components: {
    Error,
    Tab
  },
  
  data() {
    return {
      askList: [],
      isError: false,
      error: "",
      govUrl: "ask/viewData/"
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    defaultPicUrl: function() {
      return Config.defaultPic;
    },

    addComment: function() {
      this.$router.push("/ask");
      return;
    },

    changeClick: function(url) {
      var share = {
        action: "thirdURL",
        url: url
      };
      if (window.postMessage) window.postMessage(JSON.stringify(share), "*");
      return true;
    },

    getData(callback) {
      this.$http.get(this.govUrl, {}).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.askList = ret["data"];
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
          if (callback) callback.call(this);
        },
        response => {
          this.isError = true;
          this.error = "";
          if (callback) callback.call(this);
        }
      );
    },
    questionClick: function() {
      this.$router.replace("/ask");
    }
  }
}
</script>
<style scoped>
.pt45 {
  padding-top: 0.45rem;
  overflow: hidden;
}
.government {
  overflow: hidden;
}
.government .convenient {
  padding: 0 !important;
}
.government .convenient {
  overflow: hidden;
  background: #f1f1f1;
  padding-top: 0.45rem;
}
.government .convenient .box {
  background: #ffffff;
  margin-bottom: 0.1rem;
  overflow: hidden;
}
.government .convenient .box .t {
  padding: 0.05rem 0.1rem;
  height: 0.3rem;
  line-height: 0.3rem;
}
.government .convenient .box .t img {
  width: 0.18rem;
}
.government .convenient .box .t span {
  padding-left: 0.1rem;
  font-size: 0.16rem;
}
.government .convenient .box .con {
  overflow: hidden;
}
.government .convenient .box .con ul {
  width: 102%;
  border-top: #ecedee 1px solid;
}
.government .convenient .box .con li {
  width: 49%;
  float: left;
  overflow: hidden;
  padding: 0.1rem 0;
  line-height: 0.3rem;
  height: 0.3rem;
  border-bottom: #ecedee 1px solid;
  border-right: #ecedee 1px solid;
}
.government .convenient .box .con li img {
  display: inline-block;
  width: 0.25rem;
  margin-left: 0.1rem;
  padding-right: 0.05rem;
}
.government .convenient .box .con li a {
  font-size: 0.14rem;
}
.question {
  margin-top: 0.05rem;
  overflow: hidden;
}
.question .t {
  height: 0.4rem;
  line-height: 0.4rem;
  padding: 0 0.1rem;
  overflow: hidden;
  border-bottom: #e0e0e0 1px solid;
  background: url("~@/assets/images/arrg.png") 93% center no-repeat #ffffff;
  background-size: 0.07rem;
}
.question .t img {
  width: 0.2rem;
}
.QA-list {
  background: #f2f2f2;
  overflow: hidden;
}
.QA-list .section {
  margin-bottom: 0.1rem;
  overflow: hidden;
}
.QA-list .item {
  padding: 0.15rem;
  overflow: hidden;
  border-bottom: #e0e0e0 1px solid;
  background: #ffffff;
}
.QA-list .item .photo {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.5rem;
  float: left;
  overflow: hidden;
}
.QA-list .item .info {
  padding-left: 0.1rem;
  overflow: hidden;
  font-size: 0.14rem;
}
.QA-list .item .info .top {
  overflow: hidden;
  width: 100%;
}
.QA-list .item .info .top .left {
  width: 60%;
  float: left;
  overflow: hidden;
}
.QA-list .item .info .top .box {
  width: 0.35rem;
  height: 0.35rem;
  overflow: hidden;
  border-radius: 0.35rem;
  border: #e0e0e0 1px solid;
  text-align: center;
}
.QA-list .item .info .top .box i {
  width: 0.15rem;
  height: 0.15rem;
  display: inline-block;
  margin-top: 0.03rem;
  background: url("~@/assets/images/r0.png") center center no-repeat;
  background-size: contain;
}
.QA-list .item .info .top .box .red {
  background: url("~@/assets/images/r1.png") center center no-repeat;
  background-size: contain;
}
.QA-list .item .info .top .box p {
  overflow: hidden;
  padding-bottom: 0.05rem;
  font-size: 0.12rem;
  line-height: 0.12rem;
  color: #a5a5a5;
  margin-top: -0.02rem;
}
.QA-list .item .info .top .p1 {
  font-size: 0.16rem;
}
.QA-list .item .info .top .p2 {
  font-size: 0.12rem;
  color: #a5a5a5;
  margin-top: 0.03rem;
}
.QA-list .item .info .text {
  width: 100%;
  overflow: hidden;
  margin-top: 0.03rem;
  font-size: 0.16rem;
  line-height: 0.25rem;
}
/*
.fixed-bot .comm { padding:0.1rem; }
.fixed-bot .comm input { width:95%; padding-left:5%; height:0.3rem; border:none; background:#f9f9f9; }
.fixed-bot { position:fixed; left:0; bottom:0; width:100%; height:0.5rem; overflow:hidden; border-top:#dddddd 1px solid; background:#ffffff; }
.fixed-bot .comm { padding:0.1rem; }
.fixed-bot .comm input { width:95%; padding-left:5%; height:0.3rem; border:none; background:#f9f9f9; }
*/
.comm {
  position: relative;
  display: flex;
  height: 40px;
  width: 100%;
}
.comm .send {
  width: 100%;
  background-color: blue;
  color: #ffffff;
  font-size: 16px;
}
.comm button {
  width: 100%;
  cursor: pointer;
  border: none;
  box-sizing: border-box;
}
</style>
