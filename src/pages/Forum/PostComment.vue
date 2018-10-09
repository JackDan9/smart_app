<template>
    <div>
        <div class="navTop">
            <i class="backIcon" v-on:click="goBack()"></i>
            <span class="sendComment">评论</span>
            <i class="sendIcon" v-on:click="sendComment()">发布</i>
        </div>
        <div class="comment">
            <textarea type="text" placeholder="开始你的神评论..." name="text"
                ref="commentCon"
                v-bind:value="commentCon"
                id="commentCon"></textarea>
        </div>
        <div class="text">
            <div id="app">
                <ul class="commonPicList">
                    <li class="index" v-for="(itemComment, indexComment) in commentPics" :key="indexComment">
                        <i class="deleteIcon" v-on:click="deletePic(indexComment)"></i>
                        <img id="picture_sourceimg" v-bind:src="fullUrl(itemComment.picture)" alt="智慧信阳欢迎您!" />
                    </li>
                </ul>
                <input type="hidden" id="commentPics" name="commentPics" value="commentPics" ref="commentPics" />
                <div class="weui_uploader_input_wrp" v-on:click="changeUploadComment()"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import Config from '../../config.js'
    import Store from '../../store.js'
    import {Toast} from 'mint-ui'
    export default {
        data () {
            return {
                uid: '',
                username: '',
                uPicture: '',
                commentCon: '',
                commentPics: [],
                whoami: 'user/whoami/',
                picUrl: 'bar/pic/',
                barViewUrl: 'bar/view/',
                commentUpdateUrl: 'comment/update/',
                barUpdateUrl: 'bar/update/',
            }
        },
        beforeMount: function(){
            if(Store.getAuthUid()) {
                this.$http.get(this.whoami, {}).then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    if(ret && ret.code === 0) {
                        this.uid = ret.uid
                        this.username = ret.nickname ? ret.nickname : ret.username
                        this.uPicture = ret.picture
                        let id = this.$route.params.id
                        this.barView(id)
                    } else {
                        Toast(ret.msg)
                    }
                })
            } else {
                this.$router.replace('/login')
            }
        },
        watch: {
            '$route'(to, from) {
                let id = this.$route.params.id
                this.barView(id)
            }
        },
        methods: {
            fullUrl: function(url) {
                return Config.baseUrl + url
            },
            goBack: function() {
                this.$router.push('/details/' + this.$route.params.id + '/' + this.$route.params.detailsid)
            },
            deletePic: function (indexComment) {
                let pictureId = this.commentPics[indexComment].id;
                this.deletePicData(pictureId)
            },
            deletePicData(pictureId) {
                this.$http.post(this.picUrl, {id: pictureId}).then((response) =>{
                    const ret = JSON.parse(response.data || "[]")
                    if(ret && ret.code === 0) {
                        Toast('图片删除成功!');
                        let id = this.$route.params.id
                        this.barView(id)
                    } else {
                        Toast(ret.msg);
                    }
                })
            },
            changeUploadComment: function() {
                let linkid = this.$route.params.commentid
                let commentCon = this.$refs.commentCon.value
                this.commentData(linkid, commentCon)
                if(this.commentPics.length >= 2) {
                    Toast('最多上传两张图片!')
                } else {
                    let id = this.$route.params.commentid
                    var share = {
                        action: 'uploadImage',
                        Authorization: 'Xyapp ' + Store.getAuthUid(),
                        api: '/bar/upload/' + id + '/2/'
                    }
                    if(window.postMessage) window.postMessage(JSON.stringify(share),'*');
                    return true
                }
            },
            sendComment: function() {
                if(this.$refs.commentCon.value.length == 0) {
                    Toast('请填写内容!')
                } else {
                    let linkid = this.$route.params.commentid
                    let commentCon = this.$refs.commentCon.value
                    this.sendCommentData(linkid, commentCon)
                }
            },
            commentData: function(linkid, commentCon) {
                this.$http.post(this.commentUpdateUrl, {id: linkid, comment: commentCon, type: 11}).then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    if(ret && ret.code === 0) {
                        Toast('评论成功!')
                    } else {
                        Toast(ret.msg)
                    }
                })
            },
            sendCommentData: function(linkid, commentCon) {
                this.$http.post(this.commentUpdateUrl, { id: linkid, uid: this.uid, username: this.username, comment: commentCon, type: 11}).then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    if((ret && ret.code === 0) || (ret && ret.code === 0 && ret.code === 8)) {
                        Toast('评论成功!')
                        this.$router.push('/details/' + this.$route.params.id + '/' + this.$route.params.detailsid)
                    } else {
                        Toast(ret.msg)
                    }
                })
            },
            barView(id) {
                this.$http.post(this.barViewUrl, {id: id}).then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    if(ret && ret.code === 0) {
                        let commentId = this.$route.params.commentid
                        for(var i = 0, len = ret.data.comments.length; i < len; i++) {
                            if(ret.data.comments[i].id == commentId) {
                                this.commentPics = ret.data.comments[i].pics
                                this.commentCon = ret.data.comments[i].comment
                            }
                        }
                    }
                })
            },
        }
    }
</script>
<style scoped>
/* 评论框头部 */
.navTop { width: 100%; height: 0.5rem; line-height: 0.5rem; background: #000; }
.navTop .backIcon { display: inline-block; float: left; width: 0.2rem; height: 0.2rem; margin-top: 0.14rem; margin-left: 0.1rem;  background: url('../../assets/images/back-white.png') center center no-repeat; background-size: contain; }
.navTop .sendComment { display: inline-block; width: 70%; text-align: center; font-size: 0.18rem; color: #fff; }
.navTop .sendIcon { display: inline-block; float: right; width: 0.45rem; height: 0.25rem; margin-right: 0.09rem; margin-top: 0.13rem; border: 1px solid #C0C0C0; border-radius: 5px; font-style: normal; color: #fff; text-align: center; line-height: 0.26rem ; }
/* 评论框 */
.comment { width: 100%; padding-top: 0.5rem; }
.comment textarea { border: none; outline: none; width: 90%; padding: 5%; height: 1rem; }
/* 发帖图片 */
.text { display: block; overflow: hidden; margin-top: 0.2rem; margin-left: 0.05rem; margin-right: 0.05rem; }
#app { overflow: hidden; }
.weui_uploader_input_wrp { display: inline-block; float: right; position: relative; width: 90px; height: 100px; border: 1px solid #d9d9d9; border-radius: 5px; }
.weui_uploader_input_wrp:before { width: 2px; height: 39.5px; }
.weui_uploader_input_wrp:after { width: 39.5px; height: 2px; }
.weui_uploader_input_wrp:before { content: " "; position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%,-50%); transform: translate(-50%,-50%); background-color: #d9d9d9; }
.weui_uploader_input_wrp:before { content: " "; position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%.-50%); transform: translate(-50%,-50%); background-color: #d9d9d9; }
.weui_uploader_input_wrp:after, .weui_uploader_input_wrp:before {content: " ";position: absolute; top: 50%;left: 50%;-webkit-transform: translate(-50%,-50%);transform: translate(-50%,-50%);background-color: #d9d9d9;}
.weui_uploader_input {position: absolute;z-index: 1;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;-webkit-tap-highlight-color: rgba(0,0,0,0); }
.weui_uploader_file {float: left; margin-right: 9px;margin-bottom: 9px;width: 79px;height: 79px;background: no-repeat 50%;background-size: cover; }
#picture_uploadimg{ float: right; }
/* 发帖图片展示 */
.commonPicList { display:inline-block;}
.commonPicList .index { display: inline-block; position: relative; overflow: hidden; width: 90px; height: 100px; margin-left: 0.05rem; border: 1px solid #C0C0C0; border-radius: 4px; }
.commonPicList .index .deleteIcon { display: inline-block; position: absolute; right: 0; overflow: hidden; width: 0.2rem; height: 0.2rem; background: url("../../assets/images/forum/postcommon/deleteIcon.png") center center no-repeat; background-size: contain; }
.index img { display: inline-block; min-height: 100px; }
</style>