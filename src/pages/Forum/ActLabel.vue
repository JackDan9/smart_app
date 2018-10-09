<template>
    <div>
        <div class="nav">
            <div class="labelNav">
                <i class="back" v-on:click="goBack()"></i>
                <span class="title">活动标签</span>
                <i class="finish" v-on:click="finish()">完成</i>
            </div>
        </div>
        <div class="comment">
            <textarea type="text" placeholder="活动标签（不超过4个字）" name="text"
                ref="title"
                value=""
                id="title"></textarea>
        </div>
        <div class="labelColor">
            <span class="colorTitle">标签颜色</span>
            <p class="color">
                <i v-bind:class="[isActivePink ? 'pink' : 'noPink']" v-on:click = "pink()"></i>
                <i v-bind:class="[isActiveBlue ? 'blue' : 'noBlue']" v-on:click = "blue()"></i>
                <i v-bind:class="[isActiveGreen ? 'green' : 'noGreen']" v-on:click = "green()"></i>
                <i v-bind:class="[isActiveYellow ? 'yellow' : 'noYellow']" v-on:click = "yellow()"></i>
            </p>
        </div>
    </div>
</template>
<script>
    import Error from '../../components/Error.vue'
    import Store from '../../store.js'
    import Config from '../../config.js'
    import {Toast} from 'mint-ui'
    export default {
        components: {
            Error
        },
        data () {
            return {
                isActivePink: false,
                isActiveBlue: false,
                isActiveGreen: false,
                isActiveYellow: false,
                username: '',
                uid: '',
                type: '',
                seq: '',
                isError: false,
                error: '',
                whoami: 'user/whoami/',
                addTagUrl: 'tag/',
            }
        },
        beforeMount: function() {
            if(Store.getAuthUid()) {
                this.$http.get(this.whoami, {}).then((response) => {
                    const ret = JSON.parse(response.data || "[]");
                    if(ret && ret.code === 0) {
                        this.username = ret.username
                        this.uid = ret.uid
                    }
                })
            }
        },
        methods: {
            pink: function() {
                this.isActivePink = !this.isActivePink
                this.isActiveBlue = false
                this.isActiveGreen = false
                this.isActiveYellow = false
                this.type = 1
            },
            blue: function() {
                this.isActiveBlue = !this.isActiveBlue
                this.isActivePink = false
                this.isActiveGreen = false
                this.isActiveYellow = false
                this.type = 2
            },
            green: function() {
                this.isActiveGreen = !this.isActiveGreen
                this.isActivePink = false
                this.isActiveBlue = false
                this.isActiveYellow = false
                this.type = 3
            },
            yellow: function() {
                this.isActiveYellow = !this.isActiveYellow
                this.isActivePink = false
                this.isActiveBlue = false
                this.isActiveGreen = false
                this.type = 4
            },
            finish: function() {
                if(!this.username) {
                    this.$router.push('/login')
                    return
                }
                let title = this.$refs.title.value;
                let re = new RegExp("^[\\u4e00-\\u9fa5]{0,}$");
                if(title.length === 0) {
                    Toast('标签内容不能为空!')
                } else if(!re.test(title)) {
                    Toast('标签内容必须为中文!')
                } else {
                    this.addTag(title)
                }
            },
            goBack: function() {
                let id = this.$route.params.id
                this.$router.push('/postactivity/' + id)
            },
            addTag(title) {
                this.$http.post(this.addTagUrl, {uid: this.uid, title: title, type: this.type, seq: 2, barid: this.$route.params.id}).then((response) => {
                    const ret = JSON.parse(response.data || "[]")
                    console.log(ret)
                    if(ret && ret.code === 0) {
                        Toast('标签提交成功!')
                        this.$router.push('/postactivity/' + this.$route.params.id)
                    } else {
                        Toast(ret.msg)
                        this.error = (ret && ret.msg) || ""
                        this.isError = true
                    }
                }, (response) => {
                    this.isError = true
                    this.error = ""
                });
            },
        }
    }
</script>
<style scoped>
/* 头部导航栏 */
.nav { position: relative; z-index: 5030; }
.labelNav { position: fixed; left: 0; right: 0; z-index: 503; height: 0.5rem; line-height: 0.5rem; width: 100%; background: #000000;}
.labelNav .back { display: inline-block; width: 0.2rem; height: 0.2rem; background: url(../../assets/images/forum/community/icon-back.png) center center no-repeat; background-size: contain; margin-top: 0.14rem; margin-left: 0.05rem;}
.labelNav .title { display: inline-block; width: 73%; height: 0.48rem; font-size: 0.2rem; text-align: center; color: #fff; }
.labelNav .finish { display: inline-block; float: right; width: 0.45rem; height: 0.25rem; margin-right: 0.09rem; margin-top: 0.13rem; border: 1px solid #C0C0C0; border-radius: 5px; color: #fff; text-align: center; line-height: 0.26rem; }
/* 回答框 */
.comment { width: 100%; padding-top: 16%; }
.comment textarea { border: none; outline: none; width: 90%; padding: 5%; min-height: 1rem; }
/* 标签颜色 */
.labelColor { display: block; }
.labelColor .colorTitle { display: block; width: 97%; height: 0.5rem;  margin-left: 3%; line-height: 0.5rem; vertical-align: middle; font-size: 0.16rem;  }
.labelColor .color { display: block; margin-left: 3%; }
.noPink { display: inline-block; width: 0.25rem; height: 0.25rem; background: #FF8247; }
.pink { display: inline-block; width: 0.21rem; height: 0.21rem; background: #FF8247; border: 2px solid #000; }
.noBlue { display: inline-block; width: 0.25rem; height: 0.25rem; background: #483D8B; }
.blue { display: inline-block; width: 0.21rem; height: 0.21rem; background: #483D8B; border: 2px solid #000; }
.noGreen { display: inline-block; width: 0.25rem; height: 0.25rem; background: 	#32CD32; }
.green { display: inline-block; width: 0.21rem; height: 0.21rem; background: #32CD32; border: 2px solid #000; }
.noYellow { display: inline-block; width:0.25rem; height: 0.25rem; background: 	#7FFF00; }
.yellow { display: inline-block; width: 0.21rem; height: 0.21rem; background: #7FFF00; border: 2px solid #000;  }
</style>