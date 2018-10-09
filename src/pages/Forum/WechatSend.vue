<template>
    <div>
        <div class="navTop">
            <i class="backIcon" v-on:click="goBack()"></i>
            <span class="sendWeChatNum">微信号</span>
            <i class="sendIcon" v-on:click="sendWeChat()">发送</i>
        </div>
        <div class="comment">
            <textarea type="text" placeholder="请填写您的微信号..." name="text"
                ref="weChat"
                value=""
                id="weChat"></textarea>
        </div>
    </div>
</template>
<script>
    import Config from '../../config.js'
    import Store  from '../../store.js'
    import {Toast} from 'mint-ui'
    export default {
        data() {
            return {
                updateBarUrl: 'bar/update/',
            }
        },
        methods: {
            goBack: function() {
                let id = this.$route.params.id
                this.$router.push('/postactivity/' + id)
            },
            sendWeChat: function() {
                let weChat = this.$refs.weChat.value
                let id = this.$route.params.id
                this.updateWeChat(id, weChat)
            },
            updateWeChat(id, weChat) {
                this.$http.post(this.updateBarUrl, {id: id, weixin: weChat}).then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    if(ret && ret.code === 0) {
                        Toast('微信信息更新成功!')
                        this.$router.push('/postactivity/' + ret.id)
                    } else {
                        Toast(ret.msg)
                        return
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
.navTop .sendWeChatNum { display: inline-block; width: 70%; text-align: center; font-size: 0.18rem; color: #fff; }
.navTop .sendIcon { display: inline-block; float: right; width: 0.45rem; height: 0.25rem; margin-right: 0.09rem; margin-top: 0.13rem; border: 1px solid #C0C0C0; border-radius: 5px; font-style: normal; color: #fff; text-align: center; line-height: 0.26rem ; }
/* 评论框 */
.comment { width: 100%; padding-top: 0.5rem; }
.comment textarea { border: none; outline: none; width: 90%; padding: 5%; height: 1rem; }
</style>