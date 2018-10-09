<template>
    <div>
        <div class="nav">
            <div class="replyNav">
                <i class="back" v-on:click="goBack()"></i>
                <span class="title">回复</span>
                <i class="publish" v-on:click="publish()">发布</i>
            </div>
        </div>
        <div class="comment">
            <textarea type="text" placeholder="回复盖伦是一种信仰：" name="text"
                ref="commentReply"
                value=""
                id="commentReply"></textarea>
        </div>
    </div>
</template>
<script>
    import Store from '../../store.js'
    import {Toast} from 'mint-ui'
    export default {
        data () {
            return {
                uid: '',
                username: '',
                whoami: 'user/whoami/',
                commentAddUrl: 'comment/add/',
            }
        },
        mounted() {
            if(Store.getAuthUid()) {
                this.$http.get(this.whoami, {}).then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    if(ret && ret.code === 0) {
                        this.uid = ret.uid
                        this.username = ret.nickname ? ret.nickname : ret.username
                    } else {
                        Toast(ret.msg)
                    }
                })
            } else {
                this.$router.replace('/login')
            }
        },
        methods: {
            goBack: function () {
                this.$router.push('/details/' + this.$route.params.id + '/' + this.$route.params.detailid)
            },
            publish: function() {
                let linkid = this.$route.params.commentid
                let replyCon = this.$refs.commentReply.value
                this.replyData(linkid, replyCon)
            },
            replyData: function(linkid, replyCon) {
                this.$http.post(this.commentAddUrl, { linkid: linkid, comment: replyCon, type: 13}).then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    if(ret && ret.code === 0) {
                        Toast('回复成功!')
                        this.$router.push('/details/' + this.$route.params.id + '/' + this.$route.params.detailsid)
                    } else {
                        Toast(ret.msg)
                    }
                })
            },
        }
    }
</script>
<style scoped>
/* 头部导航栏 */
.nav { position: relative; z-index: 5030; }
.replyNav { position: fixed; left: 0; right: 0; z-index: 503; height: 0.5rem; line-height: 0.5rem; width: 100%; background: #000000;}
.replyNav .back { display: inline-block; width: 0.2rem; height: 0.2rem; background: url(../../assets/images/forum/community/icon-back.png) center center no-repeat; background-size: contain; margin-top: 0.14rem; margin-left: 0.05rem;}
.replyNav .title { display: inline-block; width: 73%; height: 0.48rem; font-size: 0.2rem; text-align: center; color: #fff; }
.replyNav .publish { display: inline-block; float: right; width: 0.45rem; height: 0.25rem; margin-right: 0.09rem; margin-top: 0.13rem; border: 1px solid #C0C0C0; border-radius: 5px; color: #fff; text-align: center; line-height: 0.26rem; }
/* 回答框 */
.comment { width: 100%; padding-top: 16%; }
.comment textarea { border: none; outline: none; width: 90%; padding: 5%; min-height: 1rem; }
</style>