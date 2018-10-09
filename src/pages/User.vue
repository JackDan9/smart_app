<template>
  <div>
    <div class="user-index">
      <div class="top">
        <router-link :to="{path:'/myset'}"><div class="opr"></div></router-link>
        <div class="photo">
          <i v-bind:class="[parseInt(this.sex) === 1 ? 'icon-male' : 'icon-female']"></i>
          <div class="img">
            <img :src="picture" class="header-img"/>
          </div>
          <div class="name">{{username}}</div>
        </div>
        <router-link :to="{path:'/userset'}" class="edit">编辑资料</router-link>
      </div>
      <div class="list">
        <ul>
          <li>
            <router-link :to="{path:'/gold'}">
              <div class="p1">{{gold}}</div>
              <div class="p2">鲸豆</div>
            </router-link>
          </li>
          <li>
            <router-link :to="{path:'/orderlist'}">
              <div class="p1"><img src="../assets/images/m2.png"/></div>
              <div class="p2">订单</div>
            </router-link>
          </li>
          <li>
            <router-link :to="{path:'/message'}">
              <div class="p1"><img src="../assets/images/m3.png"/></div>
              <div class="p2">消息</div>
            </router-link>
          </li>
          <li>
            <router-link :to="{path:'/collect'}">
              <div class="p1"><img src="../assets/images/m4.png"/></div>
              <div class="p2">收藏</div>
            </router-link>
          </li>
          <li>
            <router-link :to="{path:'/feedback'}">
              <div class="p1"><img src="../assets/images/m5.png"/></div>
              <div class="p2">客户服务</div>
            </router-link>
          </li>
          <li>
            <router-link :to="{path:'/cooperate'}">
              <div class="p1"><img src="../assets/images/m6.png"/></div>
              <div class="p2">商家入驻</div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <tab :index=0 />
  </div>
</template>
<script>
import {Toast} from 'mint-ui'
import Tab from '../components/Tab.vue'
import Config from '../config.js'
import Store from '../store.js'
export default {
  components: {
    Tab
  },
  data () {
    return {
      whoami: 'user/whoami/',
      username:'',
      gold:0,
      picture:'',
      sex: 0
    }
  },
  beforeMount: function(){
    if(Store.getAuthUid()){
      this.$http.get(this.whoami,{}).
      then((response) => {
        const ret = JSON.parse(response.data);
        if(ret && ret['code'] === 0){
          this.gold = ret['gold']
          this.username = ret['nickname2']
          this.sex = ret['sex']
          if(!ret['picture']){
             if(ret['wx_picture']){
                 this.picture = ret['wx_picture']
             }else{
                 this.picture = Config.defaultPic
             }
          }else{
             this.picture = Config.baseUrl + ret['picture']
          }
        }else{
           this.$router.replace('/login')
           return
        }
      })
    }else{
      this.$router.replace('/login')
      return
    }
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url
    },

    defaultPicUrl:function(){
      return Config.defaultPic
    },
  }
}
</script>
<style scoped>
.pt45 { padding-top:0.45rem; overflow:hidden; }
.user-index{ overflow:hidden; background:#ffffff; }
.user-index .top{ position:relative; height:2.2rem;overflow:hidden; background:#2d2d2d; }
.user-index .top .opr{ width:0.2rem; height:0.2rem; overflow:hidden; position:absolute; right:0.2rem; top:0.3rem;background:url("../assets/images/opr.png") center center no-repeat; background-size:cover;}
.user-index .top .photo{ width:0.8rem; height:1rem; overflow:hidden; margin:auto; margin-top:0.6rem;}
.user-index .top .photo .img{ width:0.7rem; height:0.7rem; overflow:hidden; border-radius:0.7rem;}
.user-index .top .photo .img .header-img {width: 100%; height: 100%;}
.icon-male {display: inline-block;position: absolute; z-index:503; left:37%; top:27%; width: 0.25rem;height: 0.25rem; border-radius: 0.25rem;background: url("../assets/images/user/icon-male.png") center center no-repeat;background-size: 0.15rem, 0.15rem; background-color:#28b4aa;}
.icon-female {display: inline-block;position: absolute; z-index:503; left: 37%; top:27%;width: 0.25rem;height: 0.25rem; border-radius: 0.25rem;background: url("../assets/images/user/icon-female.png") center center no-repeat;background-size: 0.15rem, 0.15rem; background-color:#f0149b;}
.user-index .top .photo .name{ color:#ffffff; text-align:center; margin-top:0.05rem;margin-right:10px;}
.user-index .top .aut{ position:absolute; right:0.2rem; bottom:1rem; display:block; width:0.6rem; padding-left:0.2rem; font-size:0.15rem; color:#ffffff;}
.user-index .top .edit{ position:absolute; right:0.06rem; bottom:0.2rem; display:block; width:0.6rem; padding-left:0.2rem; font-size:0.12rem; color:#ffffff; background:url("../assets/images/edit.png") left center no-repeat; background-size:0.1rem 0.1rem;}
.user-index .list{ overflow:hidden; border-bottom:#f2eeee 1px solid; ;}
.user-index .list li{ position:relative; width:50%; height:1rem; overflow:hidden; float:left; text-align:center;}
.user-index .list li::after{ content:''; position:absolute; right:0; top:0; width:0; height:1rem;border-right:#f2eeee 1px solid;  }
.user-index .list li::before { content:''; position:absolute; right:0; top:0; width:100%; height:0;border-bottom:#f2eeee 1px solid; }
.user-index .list li .p1{ width:100%; height:0.3rem; margin-top:0.2rem; font-size:0.18rem; line-height:0.3rem;}
.user-index .list li .p1 img{ width:0.2rem; }
.user-index .list li .p2{ text-align:center}
</style>
