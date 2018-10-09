<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" v-on:click="goBack()">&#xe609;</i>
      <span class="navCon">{{detail['type']}}</span>
      <i class="iconfont share" v-on:click="shareLink(detail.title,fullUrl(detail.picture))">&#xe60f;</i>
    </div>
    <div class="news-page">
      <div class="top">
        <h1>{{detail['title']}}</h1>
        <div class="source">
          <div class="logo fl"><img  v-if="detail['picture']" :src="fullUrl(detail['picture'])+'!640.398'" class="w100"/></div>
          <div class="info">
            <span>{{detail['username']}}</span>
            <img src="../../assets/images/local.png"/>
            <p>{{detail['addtime']}}</p>
          </div>
        </div>
      </div>
      <div class="art-con" v-html='new_content'></div>
      <div class="comm">
        <div class="red-box-t"><span>热门评论</span></div>
          <div class="list">
            <ul>
              <template v-for="comment_data in comments">
                <li>
                  <div class="img">
                    <img v-bind:src="[comment_data['u_picture']?fullUrl(comment_data['u_picture']):defaultPicUrl()]" class="w100"/>
                  </div>
                  <div class="info">
                    <div class="p1">
                      <div class="fl">
                        <div class="name">{{comment_data['username']}}</div>
                        <div class="time">{{comment_data['commenttime']}}</div>
                      </div>
                      <div v-on:click="addLike(comment_data['id'],comment_data['isLike'])" class="sup">
                        <i v-bind:class="[comment_data['isLike'] ? 'iconfont likedIcon' : 'iconfont noLikedIcon']">&#xe614;</i>
                        <p v-bind:class="[comment_data['isLike'] ? 'likedCon' : 'noLikedCon']">{{comment_data['vote']}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="p2">{{comment_data['comment']}}</div>
                </li>
              </template>
            </ul>
          </div>
          <router-link :to="{path:'/comment/'+detail['id'],query: {tab:'hide'}}"><div class="w-btn">查看全部{{totalNum}}条评论</div></router-link>
        </div>
        <div class="recommend" v-infinite-scroll="loadMore" infinite-scroll-disabled="isLoading" infinite-scroll-distance="10">
          <div class="red-box-t"><span>精彩推荐</span></div>
          <div class="con">
            <div class="ad">
              <a v-on:click="changeClick(ad['id'],ad['url'])" :id="ad['id']">
                <div class="img"><img v-if="ad['picture']" :src="fullUrl(ad['picture'])+'!640.398'" class="w100" alt=""/></div>
                <div class="ins"> <span>{{ad['name']}}</span>{{ad['addtime']}}</div>
              </a>
            </div>
            <ul>
              <template v-for="new_data in news">
                <li v-on:click="addChange(new_data.id)">
                  <div class="img"><img v-if="new_data['picture']" :src="fullUrl(new_data['picture'])+'!640.398'" class="w100"/></div>
                  <div class="text">
                    <div class="h">{{new_data['description']}}…</div>
                    <div class="ref">{{new_data['title']}} <span>{{new_data['addtime']}}</span></div>
                  </div>
                </li>
              </template>
            </ul>
            <div class="load-more" style="display:none;">加载更多精彩推荐…</div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import Error from '../../components/Error.vue'
import Tab from '../../components/Tab.vue'
import Config from '../../config.js'
import Store from '../../store.js'
import {Toast} from 'mint-ui'
import WxShare from '../../wx.js'

export default {
  components: {
    Error
  },
  data () {
    return {
      news: [],
      detail:[],
      comments:[],
      ad:[],
      new_content:'',
      isError: false,
      error: '',
      whoami: 'user/whoami/',
      likeUrl:'like/add/',
      wxShareUrl:'share/',
      username:'',
      totalNum:0,
      id:0,
      page:1,
      total:1,
      adUrl:'ads/hit/',
      viewUrl:'dynamic/view/'
    }
  },
  mounted() {
    this.id = +(this.$route.params.id)
    if( !this.id ) {
      this.isError = true
      this.error = '参数错误'
    } else {
        if(Store.getAuthUid()){
          this.$http.get(this.whoami,{}).
           then((response) => {
             const ret = JSON.parse(response.data);
             if(ret && ret['code'] === 0){
               this.username = ret['nickname']?ret['nickname']:ret['username']
           }
        })
      }
      this.getData()
      this.getWx()
    }
  },
  watch: {
    '$route' (to, from){
       this.getData(()=> window.scrollTo(0,0))
    }
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url
    },

    goBack: function() {
        this.$router.replace('/')
    },

   changeClick:function(id,url){
     this.$http.post(this.adUrl,{id:id} ).then( (response) => {
       window.location.href = url
     });
   },
   getWx:function(){
        this.$http.post(this.wxShareUrl,{url:window.location.href,id:this.id,type:3}).then( (response) => {
           const ret = JSON.parse(response.data);
            if(ret && ret.code == 0){
                 WxShare.wxinit(ret['data'])
            }else{
               this.error = (ret && ret.msg) || ""
               this.isError = true
            }
        })
    },
    addChange: function(id){
       this.id = id
       this.page = this.total = 1
       this.getData(()=> window.scrollTo(0,0))

    },

    defaultPicUrl:function(){
      return Config.defaultPic
    },

    shareLink: function(text,pic){
      var share = {
         action: 'share',
         url: window.location.href,
         title: text,
         img: pic
      }
      if(window.postMessage) window.postMessage(JSON.stringify(share),'*');
      return true
    },

    addLike: function(linkid,isLike){
      if(!this.username){
        this.$router.push('/login')
        return
      }
      var updown = isLike == 1 ? 2 : 1
      for (var i = 0,len = this.comments.length; i < len; i++) {
          if(this.comments[i]['id'] == linkid){
              this.comments[i]['isLike'] = updown === 1 ? 1 : 0;
              this.comments[i]['vote'] = updown === 1 ? this.comments[i]['vote']*1+1:this.comments[i]['vote']*1-1
              break;
            }
     }
     if(i < len){
       this.getLike(linkid,updown,5)
     }

    },

    loadMore(){
     if(this.page <= this.total){
         this.getData()
      }
      if(this.page == this.total){
          this.page = this.page + 1
      }
    },

    getData( callback ) {
     this.$http.post(this.viewUrl,{id: this.id,page:this.page} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
         this.detail = ret['data']['detail']
         this.new_content = ret['data']['detail']['content']
         if(this.page == 1){
            this.news = ret['data']['news'];
         }else{
           var news_new =  ret['data']['news'];
           if(news_new && news_new.length){
             for (var i = 0; i < news_new.length; i++) {
               this.news.push(news_new[i])
             }
           }
         }
         this.total = ret['data']['total'];
         if(this.page <= this.total){
           this.page = this.page + 1
         }
         this.ad = ret['data']['ad']
         this.comments = ret['data']['comments']['d']
         this.totalNum = ret['data']['comments']['t']
       }else{
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }
       if( typeof callback === 'function' ){
          callback.call(this)
       }

     },(response) => {

       this.isError = true
       this.error = ""
       if( typeof callback === 'function' ){
           callback.call(this)
       }
     });
    },

    getLike(linkid,updown,type) {
     this.$http.post(this.likeUrl,{linkid:linkid,updown:updown,type:type} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
       }else{
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }
     },(response) => {
       this.isError = true
       this.error = ""
     });
    }
  }
}
</script>
<style scoped>
/*
// .navtop-yellow { z-index:123456; position:fixed; left:0; top:0; width:100%; text-align:center; height:0.45rem; line-height:0.44rem; font-size:0.18rem; color:#000000; background:#000; box-shadow:#d2cfcf 0 1px 1px; }
// .navtop-yellow i.back { position:absolute; left:0; top:0; width:0.4rem; height:0.4rem; background:url("../../assets/images/charity_back.png") center center no-repeat; background-size:0.1rem 0.18rem; }
// .navtop-yellow .back { overflow: hidden; float: left; margin-left: 0.1rem; color: #fff; }
// .navtop-yellow .navCon { color: #fff; }
// .navtop-yellow a{ position:absolute; right:0.2rem; top:0; color:#f87f19; }
// .navtop-yellow .fr-btn { position:absolute; right:0.1rem; top:0; height:0.45rem; min-width:0.4rem; }
// .navtop-yellow .fr-btn i { display:inline-block; width:0.35rem; height:0.45rem; }
// .navtop-yellow .fr-btn .people { background:url("../../assets/images/people-red.png") center center no-repeat; background-size:0.22rem 0.22rem; }
// .navtop-yellow .share { background:url("../../assets/images/charity_share.png") center center no-repeat; background-size:0.2rem 0.25rem; }
// .navtop-yellow .share { overflow: hidden; float: right; color: #fff; margin-right: 0.1rem }
*/
.news-page{ overflow:hidden; background: #f8f8f8; padding-top:0.45rem ; font-size:0.14rem;}
.news-page .top{ padding:0.2rem; overflow:hidden;}
.news-page .top h1{ font-size:0.2rem; color:#000000; font-weight:normal}
.news-page .top .source{ margin-top:0.1rem; overflow:hidden;}
.news-page .top .source .logo{ width:0.4rem; }
.news-page .top .source .info{ float:left; margin-left:0.1rem;}
.news-page .top .source .info span{ color:#406599; }
.news-page .top .source .info img{ width:0.8rem; margin-left:0.1rem;}
.news-page .top .source .info  p{ color:#999999; font-size:0.12rem; margin-top:0.05rem}
.news-page .art-con{ padding:0.2rem; overflow:hidden; line-height:0.26rem;}
.news-page .art-con p{ padding-bottom:0.1rem; overflow:hidden;}
.news-page .art-con img{ max-width:100%;}
.news-page .comm{ padding:0.2rem; overflow:hidden;}
.red-box-t{ position:relative; width:100%; font-size:0.14rem; height:40px; overflow:hidden; border-bottom:#dddddd 1px solid; }
.red-box-t span{ position:absolute; left:0; top:0; font-size:0.16rem; display:inline-block; height:38px; line-height:38px; border-bottom:#f85959 2px solid;}
.comm .list{ overflow:hidden;}
.comm .list li{ padding:0.2rem ; overflow:hidden; border-bottom:#e0e0e0 1px solid; }
.comm .list li .img{ width:0.5rem; float:left; width:0.5rem; height:0.5rem; overflow:hidden; -webkit-border-radius:0.5rem; -moz-border-radius:0.5rem; border-radius:0.5rem;}
.comm .list li .info{ margin-left:0.6rem; overflow:hidden; font-size:0.14rem; }
.comm .list li .info .p1{ overflow:hidden; height: 0.5rem; margin-top: 0.05rem; }
.comm .list li .info .p1 .name{ font-size:16px;}
.comm .list li .info .p1 .time{ font-size:0.12rem; color:#a5a5a5;}
.comm .list li .info .p1  .sup{ width:0.4rem; height:0.4rem; float:right; border: #efefef 1px solid; border-radius:0.4rem; overflow:hidden; text-align: center; }
/*
.comm .list li .info .p1 .sup i{ width:0.15rem; height:0.15rem; display:block; margin:auto; margin-top:0.05rem;background:url("../../assets/images/hand1.png") center center no-repeat; background-size:0.15rem 0.15rem;}
.comm .list li .info .p1 .sup p{ text-align:center;  color:#787878; font-size:0.12rem}
.comm .list li .info .p1 .love2 i{ background:url("../../assets/images/hand2.png") center center no-repeat; background-size:0.15rem 0.15rem}
.comm .list li .info .p1 .love2 p{ color:#ff6143; }
*/
.likedIcon { color: #ff4b0f; font-size:0.2rem }
.noLikedIcon { color: #C0C0C0; font-size:0.2rem }
.likedCon { color: #ff4b0f; font-size:0.12rem }
.noLikedCon { color:#787878; font-size:0.12rem }
.p2{ overflow:hidden; line-height: 0.22rem; }
.w-btn{ width:95%; height:0.45rem; border-radius:0.05rem; line-height:0.45rem; text-align:center; color:#ffffff; font-size:0.16rem;
    background:#f85959; }
.recommend{ padding:0.2rem; overflow:hidden;}
.recommend .ad{ color:#6a6a6a; font-size:0.12rem; width:100%; margin-top:0.1rem;}
.recommend .ad .ins{ margin-top:0.05rem; color:#c9c9c9;}
.recommend .ad .ins span{ border:#c9c9c9 1px solid; border-radius:2px; padding:0 0.05rem  }
.recommend .con{ margin-top:0.1rem; overflow:hidden;}
.recommend .con ul{ margin-top:0.1rem;}
.recommend .con li{ padding:0.1rem 0; overflow:hidden; border-top:#dddddd 1px solid; }
.recommend .con li .img{ width:1rem; float:right;}
.recommend .con li .text{ margin-right:1.05rem; font-size:0.16rem;}
.recommend .con li .ref{ margin-top:0.05rem; font-size:0.12rem; color:#9b9b9b; }
.recommend .con li .ref span{ padding-left:0.06rem;}
.load-more{ padding:0.1rem; overflow:hidden; text-align:center; color:#9b9b9b;}
</style>
