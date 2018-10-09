<template>
    <div>
        <div class="typePage">
            <div class="content"></div>
            <div class="choose">
                <div class="common" v-on:click="common()"></div>
                <div class="act" v-on:click="act()"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import Config from '../../config.js'
    import Store from '../../store.js'
    import {Toast} from 'mint-ui'
    export default {
        data() {
            return {
                uid: '',
                id: 0,
                whoami: 'user/whoami/',
                barAddUrl: 'bar/add/',
            }
        },
        beforeMount: function() {
            if(Store.getAuthUid()) {
                this.$http.get(this.whoami, {}).then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    if(ret && ret.code === 0) {
                        this.uid = ret.uid
                    }
                })
            } else {
                this.$router.replace('/login')
                return
            }
        },
        methods: {
            common: function () {
                let type = 3
                this.$http.get(this.barAddUrl + type + '/').then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    if(ret && ret.code === 0) {
                        this.id = ret.id
                        this.$router.push('/postcommon/' + this.id)
                    } else {
                        Toast(ret.msg)
                    }
                })
            },
            act: function () {
                let type = 2
                this.$http.get(this.barAddUrl + type + '/').then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    if(ret && ret.code === 0) {
                        this.id = ret.id
                        this.$router.push('/postactivity/' + this.id)
                    } else {
                        Toast(ret.msg)
                    }
                })
            },
        }
    }
</script>
<style scoped>
/* 主页 */
.typePage { position: absolute; width: 100%; height: 100%; background: url("../../assets/images/forum/post/post.jpg") center center no-repeat; background-size: cover; }
/* 文字 */
.content { width: 61%; height: 20%; margin: 0 auto; margin-top: 30%; background: url("../../assets/images/forum/post/content.png") center center no-repeat; background-size: contain; }
/* 帖子类型分类 */
.choose { width: 100%; height: 20%; margin-top: 50%; }
.choose .common { display: inline-block; width: 49%; height: 100%; background: url("../../assets/images/forum/post/common.png") center center no-repeat; background-size: contain; }
.choose .act { display: inline-block; width: 49%; height: 100%; background: url("../../assets/images/forum/post/act.png") center center no-repeat; background-size: contain; }
</style>