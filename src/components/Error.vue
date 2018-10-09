<template>
  <div>
    <h1 class="header"> {{ this.message || "发生了不知名错误" }}</h1>
 </div>
</template>

<script>
export default {
  props: {
    mesasge: String
  }
}
</script>

<style>
</style>
