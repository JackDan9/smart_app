<template>
  <div>
    <div class="cooperateHome">
      <router-link :to="{path:'/cooperate/'}"></router-link>
    </div>
  </div>
</template>

<script>
  import { Toast } from "mint-ui";

  import Config from "@/config/config";
  import Storage from "@/storage/storage";

  import Tab from "@/components/Tab";

  export default {
    components: {
      Tab
    },
    
    data() {
      return {
        whoami: "user/whoami"
      };
    }
  };
</script>

<style scoped>
  .cooperateHome {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url("~@/assets/images/cooperateBg/cooperateHome.jpg") center
      center no-repeat;
    background-size: 100% 100%;
  }
  .cooperateHome a {
    display: inline-block;
    position: absolute;
    bottom: 2px;
    left: 28%;
    z-index: 503;
    width: 44%;
    height: 12%;
  }
</style>