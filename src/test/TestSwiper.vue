
<template>
  <div >

    <p class="page-swipe-desc">基础用法</p>
    <mt-swipe :auto="4000" class="swipe">
      <mt-swipe-item class="slide1">1</mt-swipe-item>
      <mt-swipe-item class="slide2">2</mt-swipe-item>
      <mt-swipe-item class="slide3">3</mt-swipe-item>
    </mt-swipe>

    <p class="page-swipe-desc">隐藏 indicators</p>
    <mt-swipe :show-indicators="false" class="swipe">
      <mt-swipe-item class="slide1">1</mt-swipe-item>
      <mt-swipe-item class="slide2">2</mt-swipe-item>
      <mt-swipe-item class="slide3">3</mt-swipe-item>
    </mt-swipe>

    <p class="page-swipe-desc">取消自动播放</p>
    <mt-swipe :auto="0" class="swipe">
      <mt-swipe-item class="slide1">1</mt-swipe-item>
      <mt-swipe-item class="slide2">2</mt-swipe-item>
      <mt-swipe-item class="slide3">3</mt-swipe-item>
    </mt-swipe>

    <p class="page-swipe-desc">单个幻灯片</p>
    <mt-swipe :show-indicators="false" class="swipe">
      <mt-swipe-item class="slide1">SINGLE SLIDE</mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>

import { Swipe, SwipeItem } from 'mint-ui';


export default {
  components: {
    'mt-swipe': Swipe,
    'mt-swipe-item': SwipeItem
  },
  data () {
    return {

    }
  },
  mounted() {

  },
  methods: {

    getData() {

    }
  }
}
</script>
<style scoped>

      .swipe {
        height: 400px;
        color: #fff;
        font-size: 30px;
        text-align: center;
        margin-bottom: 20px;
      }
      .swipe-item {
        line-height: 200px;
      }
      .slide1 {
        background-color: #0089dc;
        color: #fff;
      }
      .slide2 {
        background-color: #ffd705;
        color: #000;
      }
      .slide3 {
        background-color: #ff2d4b;
        color: #fff;
      }

</style>
