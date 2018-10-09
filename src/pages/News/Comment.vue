<template>
    <div>
        <div class="comment">
            <div class="navTop">
                <i class="iconfont back" v-on:click="goBack()">&#xe609;</i>
                <span class="navCon">评论</span>
            </div>
            <div class="mood-page">
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
                                        <div class="sup" v-on:click="addLike(comment_data['id'],comment_data['isLike'])">
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
            </div>
            <div class="item comm" >
                <button class="send" v-on:click="commentClick()">评论</button>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import Config from '../../config.js'
import Store from '../../store.js'
import {Toast} from 'mint-ui'

export default {
    components: {
    },
    data () {
        return {
            comments: [],
            isError: false,
            error: '',
            viewUrl: 'dynamic/viewComment/',
            whoami: 'user/whoami/',
            likeUrl: 'like/add/',
            username: '',
            picture: '',
            id: 0,
            comment: '',
            commentUrl: 'comment/add/'
        }
    },
    mounted() {
        this.id = +(this.$route.params.id)
        if( !(this.id > 0 )) {
            this.isError = true
            this.error = '参数错误'
        } else {
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
            this.getData(this.id)
        }
    },
    methods: {
        fullUrl: function(url) {
            return Config.baseUrl + url
        },

        defaultPicUrl:function(){
            return Config.defaultPic
        },

        goBack: function() {
            this.$router.replace( '/new/' + this.$route.params.id)
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

        addComment: function(linkid){
            if(!this.username){
                this.$router.push('/login')
                return
            }
            var comment = this.$refs.comment.value
            this.getComment(linkid,comment)
        },

        getData( id ) {
            this.$http.post(this.viewUrl,{'id':id} ).then( (response) => {
                const ret = JSON.parse(response.data || "[]")
                if(ret && ret.code === 0){
                    this.comments = ret['data']['comments']
                } else {
                    this.error = (ret && ret.msg) || ""
                    this.isError = true
                }
            });
        },

        getLike(linkid, updown, type) {
            this.$http.post(this.likeUrl,{linkid:linkid,updown:updown,type:type} ).then( (response) => {
                const ret = JSON.parse(response.data || "[]")
                if(ret && ret.code === 0){
                } else {
                this.error = (ret && ret.msg) || ""
                this.isError = true
                }
            },(response) => {
                this.isError = true
                this.error = ""
            });
        },
        getComment(linkid,comment) {
            this.$http.post(this.commentUrl,{linkid:linkid,comment:comment,type:7} ).then( (response) => {
                const ret = JSON.parse(response.data || "[]")
                if(ret && ret.code === 0){
                    Toast('评论成功!')
                    var comment_data = {};
                    comment_data['username'] = this.username
                    comment_data['u_picture'] = this.picture
                    comment_data['comment'] = comment
                    comment_data['vote'] = 0
                    comment_data['id'] = ret.newid
                    comment_data['commenttime'] = '刚刚'
                    this.comments.unshift(comment_data)
                    this.comment = ''
                } else {
                    Toast(ret.msg)
                    this.error = (ret && ret.msg) || ""
                    this.isError = true
                }
            },(response) => {
                this.isError = true
                this.error = ""
            });
        },
        commentClick: function() {
            this.$router.push('/sendcomment/' + this.$route.params.id)
        }
    },
}
</script>
<style scoped>
.comment { display: flex; position: fixed; flex-direction: column; width: 100%; height: 100%; }
.mood-page{ flex: 1;  background: #f9f9f9; overflow-y: auto; padding-top:0.45rem; }
.mood-page .temp{ padding:0.2rem; overflow:hidden;  }
.mood-page .temp .p1{  padding-left:13%; font-size:0.35rem;}
.mood-page .temp .p2 .img{ width:0.3rem; float:left}
.mood-page .temp .p2 .txt{ float:left; font-size:0.16rem; margin-left:0.1rem; margin-top:0.05rem;}
.mood-page .mood-txt{ padding:0.3rem; overflow:hidden; font-size:0.18rem; text-align:center; line-height:0.22rem;}
.mood-page .digg{ overflow:hidden; padding:0.1rem 0.2rem 0 0; line-height:0.34rem; font-size:0.16rem;}
.mood-page .digg .he1{ display:inline-block; width:0.35rem; height:0.35rem; float:right; -webkit-border-radius:0.35rem; -moz-border-radius:0.35rem; border-radius:0.35rem; background:url("../../assets/images/he1.png") center center no-repeat;
background-size:0.15rem 0.15rem;   border:#ededed 1px solid; margin-right:0.1rem;  }
.mood-page .digg .he2{ display:inline-block; width:0.35rem; height:0.35rem; float:right; -webkit-border-radius:0.35rem; -moz-border-radius:0.35rem; border-radius:0.35rem; background:url("../../assets/images/he2.png") center center no-repeat;
background-size:0.15rem 0.15rem;   border:#ededed 1px solid; margin-right:0.1rem;  }
.mood-page .list{ overflow:hidden;}
.mood-page .list li{ padding:0.2rem ; overflow:hidden; border-bottom:#e0e0e0 1px solid; }
.mood-page .list li .img{ width:0.5rem; float:left; width:0.5rem; height:0.5rem; overflow:hidden; -webkit-border-radius:0.5rem; -moz-border-radius:0.5rem; border-radius:0.5rem;}
.mood-page .list li .info{ margin-left:0.6rem; overflow:hidden; font-size:0.14rem; }
.mood-page .list li .info .p1{ overflow:hidden; width: 100%; height: 0.5rem; margin-top: 0.05rem; }
.mood-page .list li .info .p1 .name{ font-size:16px;}
.mood-page .list li .info .p1 .time{ font-size:0.12rem; color:#a5a5a5;}
.mood-page .list li .info .p1  .sup{ width:0.4rem; height:0.4rem; float:right; border:#efefef 1px solid; border-radius:0.4rem; overflow:hidden; text-align: center; }
/*
.mood-page .list li .info .p1 .sup i{ width:0.15rem; height:0.15rem; display:block; margin:auto; margin-top:0.05rem;background:url("../../assets/images/hand1.png") center center no-repeat; background-size:0.15rem 0.15rem;}
.mood-page .list li .info .p1 .sup p{ text-align:center;  color:#787878; font-size:0.12rem}
.mood-page .list li .info .p1 .love2 i{ background:url("../../assets/images/hand2.png") center center no-repeat; background-size:0.15rem 0.15rem}
.mood-page .list li .info .p1 .love2 p{ color:#ff6143}
*/
.likedIcon { color: #ff4b0f; font-size:0.2rem }
.noLikedIcon { color: #C0C0C0; font-size:0.2rem }
.likedCon { color: #ff4b0f; font-size:0.12rem }
.noLikedCon { color:#787878; font-size:0.12rem }
.p2{  overflow:hidden; line-height: 0.22rem; }
.fixed-bot-bottom { bottom:0;}
.fixed-bot-top { top:2.25rem;}
.fixed-bot { position:fixed; left:0;  width:100%; height:0.5rem; overflow:hidden; border-top:#dddddd 1px solid; background:#ffffff; }
.fixed-bot .comm { padding:0.1rem; }
.fixed-bot .comm input { width:95%; padding-left:5%; height:0.3rem; border:none; background:#f9f9f9; }
.comm {position: relative; display: flex; height: 40px; width: 100%;}
.comm .send {width: 100%; background-color: blue;color: #ffffff; font-size: 16px;}
.comm button { width: 100%; cursor: pointer; border: none; box-size: border-box;}
/* 用户名 */
.fl { width: 80%; }

</style>
