<template>
    <div>
        <div class="navTop">
            <router-link :to="{ path: '/government/' }">
                <i class="iconfont back">&#xe609;</i>
            </router-link>
            <span class="navCon">互动问答-详情</span>
        </div>
        <div class="QA-list pt45">
            <!--提问人-->
            <div class="qtip"><img src="../../assets/images/qt.png" ></div>
            <div class="section qt">
                <div class="item">
                    <div class="photo">
                        <img v-bind:src="[ask['u_picture']?fullUrl(ask['u_picture']):defaultPicUrl()]"  class="w100"/>
                    </div>
                    <div class="info" v-if="ask">
                        <div class="top">
                            <div class="fl">
                                <p class="p1 org">{{ask['username']}}</p>
                                <p class="p2">{{ask['addtime']}}</p>
                            </div>
                            <div class="fr dn">
                                <div class="box">
                                    <i class="ico" v-bind:class="[ask['comment_num'] ? 'red' : '']"></i>
                                    <p>{{ask['comment_num']}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="text">{{ask['content']}}</div>
                    </div>
                </div>
            </div>
            <!--提问人-->
            <div class="qtip qa2" v-on:click="answer()"><img src="../../assets/images/qa.png"></div>
            <!--回答人-->
            <template v-for="comment_data in comment_list">
                <div class="section qa">
                    <div class="item">
                        <div class="photo">
                            <img v-bind:src="[comment_data['u_picture']?fullUrl(comment_data['u_picture']):defaultPicUrl()]"  class="w100"/>
                        </div>
                        <div class="info">
                            <div class="top">
                                <div class="fl">
                                    <p class="p1 gre">{{comment_data['username']}}</p>
                                    <p class="p2">{{comment_data['commenttime']}}</p>
                                </div>
                                <div class="fr">
                                    <div class="box">
                                        <i v-bind:class="[comment_data['isLike'] ? 'iconfont likedIcon' : 'iconfont noLikedIcon']" v-on:click="addLike(comment_data['id'],comment_data['isLike'])">&#xe614;</i>
                                        <p>{{comment_data['vote']}}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="text"><div class="text">{{comment_data['comment']}}</div></div>
                        </div>
                    </div>
                </div>
            </template>
            <!--回答人-->
        </div>
        <div style="overflow: hidden;height: 0.5rem;"></div>
    </div>
</template>
<script>

import Loading from '../../components/Loading.vue'
import Error from '../../components/Error.vue'
import Tab from '../../components/Tab.vue'
import Config from '../../config.js'
import Store from '../../store.js'
import {Toast} from 'mint-ui'

export default {
  components: {
    Error
  },
  data () {
    return {
      ask: [],
      comment_list:[],
      isLoading: false,
      isError: false,
      error: '',
      whoami: 'user/whoami/',
      viewUrl:'ask/view/',
      likeUrl:'like/add/',
      username:'',
      picture:'',
      commentUrl:'comment/add/'
    }
  },

  mounted() {
   if(Store.getAuthUid()){
      this.$http.get(this.whoami,{}).
      then((response) => {
        const ret = JSON.parse(response.data);
        if(ret && ret['code'] === 0){
          this.username = ret['nickname']?ret['nickname']:ret['username']
          this.picture = ret['picture']
        }
      })
    }
    const id = +(this.$route.params.id)
    if( !id ) {
      this.isError = true
      this.error = '参数错误'
    } else {
      this.isLoading = true
      this.getData(()=> window.scrollTo(0,0))
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

   defaultPicUrl:function(){
      return Config.defaultPic
   },

    addLike: function(linkid,isLike){
      if(!this.username){
        this.$router.push('/login')
        return
      }
      var updown = isLike == 1 ? 2 : 1
       for (var i = 0,len = this.comment_list.length; i < len; i++) {
          if(this.comment_list[i]['id'] == linkid){
              this.comment_list[i]['isLike'] = updown === 1 ? 1 : 0;
              this.comment_list[i]['vote'] = updown === 1 ? this.comment_list[i]['vote']*1+1:this.comment_list[i]['vote']*1-1
              break;
            }
        }
        if(i < len){
          this.getLike(linkid,updown)
        }
    },

    addComment: function(linkid){
     if(!this.username){
        this.$router.push('/login')
        return
      }
     var comment = this.$refs.comment.value
     this.getComment(linkid,comment)
    },

    getData( callback ) {
     this.$http.post(this.viewUrl,{id: this.$route.params.id} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
         this.ask = ret['data']
         this.comment_list = ret['data']['comment_list']
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
    getLike(linkid,updown) {
     this.$http.post(this.likeUrl,{linkid:linkid,updown:updown,type:5} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
         if(updown == 1){
           Toast('投票成功!')
         }else{
           Toast('投票取消!')
         }
       }else{
         Toast(ret.msg)
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }
     },(response) => {
       this.isError = true
       this.error = ""
     });
    },
    getComment(linkid,comment) {
     this.$http.post(this.commentUrl,{linkid:linkid,comment:comment,type:6} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
         Toast('评论成功!')
         var comment_data = {};
         comment_data['username'] = this.username
         comment_data['comment'] = comment
         comment_data['vote'] = 0
         comment_data['id'] = ret.newid
         comment_data['commenttime'] = '刚刚'
         comment_data['u_picture'] = this.picture
         this.comment_list.unshift(comment_data)
         this.ask['comment_num'] = this.ask['comment_num'] + 1
         this.hasFocus = false
         document.getElementById('comment').value = ''
       }else{
         Toast(ret.msg)
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }
     },(response) => {
       this.isError = true
       this.error = ""
     });
    },
    answer: function () {
        this.$router.replace("/answer/" + this.$route.params.id)
    }
  },
}
</script>
<style scoped>
.pt45{ padding-top:0.45rem; overflow:hidden;}
.QA-list{ background:#f2f2f2; overflow:hidden; padding-bottom:0.5rem;min-height: 100vh;}
.QA-list .section{ margin-bottom:0.1rem;  overflow:hidden;}
.QA-list .item{ padding:0.15rem; overflow:hidden; border-bottom:#e0e0e0 1px solid; background:#ffffff;}
.QA-list .item .photo{ width:0.4rem; height:0.4rem; border-radius:0.4rem; float:left; overflow:hidden;}
.QA-list .item .info { padding-left:0.1rem; overflow:hidden; font-size:0.14rem;}
.QA-list .item .info .top{ overflow:hidden; width:100%;}
.QA-list .item .info .top .left{ width:60%; float:left; overflow:hidden;}
.QA-list .item .info .top .box{ width:0.35rem; height:0.35rem; overflow:hidden; border-radius:0.35rem;border:#e0e0e0 1px solid; text-align:center; }
.QA-list .item .info .top .box .red { background:url("../../assets/images/r1.png") center center no-repeat; background-size:contain; }
.QA-list .item .info .top .box p{ overflow:hidden; padding-bottom:0.05rem; font-size:0.12rem; line-height:0.12rem; color:#a5a5a5; margin-top:-0.02rem; }
.QA-list .item .info .top .p1{ font-size:0.14rem;}
.QA-list .item .info .top .p2{ font-size:0.12rem; color:#a5a5a5; margin-top:0.03rem;}
.QA-list .item .info .text{ width:100%;overflow:hidden; margin-top:0.07rem; font-size:0.16rem; }
.QA-list .item .red{color:red}
.QA-list .item .info .top .box .likedIcon { color: #ff4b0f; font-size:0.2rem }
.QA-list .item .info .top .box .noLikedIcon { color: #C0C0C0; font-size:0.2rem }
.qtip{ overflow:hidden; padding:0.2rem;  text-align:center; background:#ffffff; padding-bottom:0.01rem}
.qtip img{ width:0.6rem;}
.qt .org { color:#ff550f; }
.qa .gre { color:#49b579; }
.qa .text{ font-size:0.14rem !important;}
.qa2 img { width:0.5rem; }
</style>
