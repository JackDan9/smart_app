<template>
  <div>
    <transition name="fade">
      <div class="loading" ></div>
    </transition>
  </div>
</template>

<script>
export default {
  props: [ 'mesasge' ],
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}

.loading {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 12345;
    top: 0;
    left: 0;
    background: url(../assets/images/popup-loading.gif) center 42% no-repeat;
    background-color: #ffffff;
    background-size: 25px 25px;
}
</style>
