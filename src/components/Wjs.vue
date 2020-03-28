<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">正在装修</span>
    </div>
    <div class="banner">
      <a onclick="javascript:history.go(-1)">
        <img src="~@/assets/images/wjs.jpg" />
      </a>
    </div>
    <tab :index="3" />
  </div>
</template>

<script>
  import Loading from "@/components/Loading";
  import Error from "@/components/Error";
  import Tab from "@/components/Tab";
  import Config from "@/config/config.js";

  export default {
    components: {
      Error,
      Tab
    },
    /**
     * data()为什么必须为一个函数
     * new Vue()实例中, data可以直接是一个对象, 为什么在vue组件中, data必须是一个函数了?
     * 
     * 因为组件时可以复用的, JS里对象是引用关系, 如果组件data是一个对象, 那么子组件中的data属性值会被相互污染, 产生副作用。
     * 
     * 所以一个组件的data选项必须是一个函数, 因此每个实例可以维护一份被返回对象的独立的拷贝。new Vue的实例是不会被复用的, 因此不存在以上问题。
     * 
     */
    data () {
      return {
        isLoading: false,
        isError: false,
        error: ""
      };
    }
  };
</script>

<style scoped>
  .mt45 {
    margin-top: 0.45rem;
  }
  .bgf {
    background: #ffffff;
    overflow: hidden;
    padding: 0.1rem 0;
  }
  .banner {
    position: relative;
    width: 100%;
    height: auto;
    overflow: hidden;
  }
  .banner img {
    width: 100%;
  }
</style>
