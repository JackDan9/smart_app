<template>
    <div>
        <div class="navTop">
            <i class="iconfont back" v-on:click = "goBack()">&#xe609;</i>
            <span class="navCon">互动问答</span>
            <span class="publish" v-on:click="addAsk()">发表</span>
        </div>
        <div class="ask pt45">
            <div class="text">
                <textarea name="content" id="content" placeholder="请耐心详尽描述您的问题，向全城发出您的声音吧！" ref="content"></textarea>
            </div>
            <div class="tips">
                <p>小贴士： ~</p>
                <p>在个人信息中绑定联系方式可以更顺利解决问题哦~</p>
            </div>
            <div class="upload-box" style="display:none">
                <div class="add-button">
                    <i></i><p>添加图片</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Error from '../../components/Error.vue'
import Tab from '../../components/Tab.vue'
import Config from '../../config.js'
import {Toast} from 'mint-ui'

export default {
  components: {
    Error,
    Tab
  },
  data () {
    return {
      askList: [],
      isError: false,
      error: '',
      govUrl:'ask/add/',
    }
  },
  mounted() {

  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url
    },

    goBack: function () {
        this.$router.replace('/government/')
    },
    addAsk: function(){
      var content = this.$refs.content.value
      var picture = ''
      this.getAsk(content,picture)
    },

    getAsk( content,picture ) {
     this.$http.post(this.govUrl,{content:content,picture:picture} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
         Toast('操作成功!')
         this.$router.push('/asklist')
       }else{
         Toast(ret.msg)
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }
     },(response) => {
       this.isError = true
       this.error = ""
       if(callback) callback.call(this)
     });
    }
  }
}
</script>
<style scoped>
.navTop .publish { height:0.45rem; padding-right:0.15rem; color:#ffffff; font-size:0.15rem; line-height:0.45rem; }
.pt45 { padding-top:0.45rem; overflow:hidden; }
.ask { overflow:hidden; }
.ask .text { overflow:hidden; padding:0.15rem; }
.ask .text textarea { width:90%; padding:5%; overflow: hidden; border: none; outline: none; background: #ffffff; }
.ask .tips { padding: 0 0.15rem; overflow: hidden; color: #a5a5a5; font-size: 0.12rem; line-height: 0.18rem; }
.upload-box { overflow:hidden; padding:0.15rem; }
.upload-box .add-button{ width:0.6rem; height:0.6rem; border:#e5e4e4 1px solid; text-align:center; }
.upload-box .add-button i{ display:inline-block; width:0.2rem; height:0.2rem; margin-top:0.1rem;background:url("../../assets/images/add-ico.png")  center center no-repeat; background-size:contain; }
.upload-box .add-button  p{ font-size:0.1rem; color:#a5a5a5;}
</style>
