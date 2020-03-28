<template>
  <div>
    <div class="h55px"></div>
    <div class="page-bot-nav">
      <ul>
          <!-- 首页 -->
          <li>
            <router-link :to="{path:'/'}">
              <i v-bind:class="[ index == 1  ? 'iconfont icon-nav1-curr' : 'iconfont icon-nav1']" >&#xe647;</i>
              <p v-bind:class="[ index == 1  ? 'curr' : '']" >首页</p>
            </router-link>
          </li>
          <!-- 附近 -->
          <li>
            <router-link :to="{path:'/nearby/0/'}">
              <i v-bind:class="[ index == 2  ? 'iconfont icon-nav2-curr' : 'iconfont icon-nav2']" >&#xe619;</i>
              <p v-bind:class="[ index == 2  ? 'curr' : '']" >附近</p>
            </router-link>
          </li>
          <!-- 嘿咻社区 -->
          <li class="dn">
            <router-link :to="{path: '/wjs/'}">
                <i v-bind:class="[ index == 3 ? 'iconfont icon-nav3-curr' : 'iconfont icon-nav3']">&#xe602;</i>
                <p v-bind:class="[ index == 3 ? 'curr' : '']">嘿咻社区</p>
            </router-link>
          </li>
          <!-- 好玩好物 -->
          <li>
            <router-link :to="{path:'/funlist'}">
                <i v-bind:class="[ index == 4  ? 'iconfont icon-nav4-curr' : 'iconfont icon-nav4']" >&#xe604;</i>
                <p v-bind:class="[ index == 4  ? 'curr' : '']" >好玩好物</p>
            </router-link>
          </li>
          <!-- 商家入驻 -->
          <li>
            <a v-on:click="addChange()" style="cursor:pointer;">
              <i v-bind:class="[ index == 5 ? 'iconfont icon-nav5-curr' : 'iconfont icon-nav5']" >&#xe706;</i>
              <p v-bind:class="[ index == 5  ? 'curr' : '']" >商家入驻</p>
            </a>
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Storage from '@/storage/storage'
  export default {
    props: {
      index: Number,
    },
    data () {
      return {
        viewListUrl: 'company/viewlist/',
      }
    },
    methods: {
      addChange: function(){
      const point = Storage.getPOINT()
      var lat = 0
      var lng = 0
      if(point){
        lat = point['lat']
        lng = point['lng']
      }
      // this.getData(lat,lng)
      this.$router.push('/cooperateHome/')
    },
    getData(lat, lng) {
      this.$http.post(this.viewListUrl,{page:1,categoryid:0,lat:lat,lng:lng} ).then( (response) => {
        const ret = JSON.parse(response.data || "[]")
        if(ret && ret.code === 0){
            this.$router.push('/company/'+ret['data']['near_companyid'])
        }else{
          this.error = (ret && ret.msg) || ""
          this.isError = true
        }
      });
      }
    }
  }
</script>

<style>
.h55px { width:100%; height:0.55rem; overflow:hidden; }
/*底部悬浮导航*/
.page-bot-nav { z-index:12345; position:fixed; width:100%; height:0.5rem; left:0; bottom:0; background:#ffffff; }
.page-bot-nav li { width:25%; float:left; text-align:center; overflow:hidden; line-height:0.14rem; }
.page-bot-nav li i { display:inline-block; width:0.23rem; height: 0.22rem; margin-top:0.1rem; }
.page-bot-nav li p { font-size:0.1rem; margin-top:0;}
.page-bot-nav li p.curr { color:#ff4b0f; }
.page-bot-nav li .icon-nav1 { color: #000; font-size: 0.2rem; }
.page-bot-nav li .icon-nav1-curr  { color: #ff4b0f; font-size: 0.2rem; }
.page-bot-nav li .icon-nav2 { color: #000; font-size: 0.2rem; margin-top: 0.075rem; margin-bottom: 0.025rem; }
.page-bot-nav li .icon-nav2-curr  { color: #ff4b0f; font-size: 0.2rem; margin-top: 0.075rem; margin-bottom: 0.025rem; }
.page-bot-nav li .icon-nav3 { color: #000; font-size: 0.2rem; }
.page-bot-nav li .icon-nav3-curr  { color: #ff4b0f; font-size: 0.2rem; }
.page-bot-nav li .icon-nav4 { color: #000; font-size: 0.2rem; }
.page-bot-nav li .icon-nav4-curr  { color: #ff4b0f; font-size: 0.2rem; }
.page-bot-nav li .icon-nav5 { color: #000; font-size: 0.2rem; }
.page-bot-nav li .icon-nav5-curr  { color: #ff4b0f; font-size: 0.2rem; }
</style>
