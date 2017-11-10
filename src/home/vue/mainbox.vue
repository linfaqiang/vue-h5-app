<template>
	<div class="mui-content mui-scroll-wrapper" v-bind:class="{ activeZindex: isActive}">
    <div>
      <!-- 主界面具体展示内容 -->
      <div class="bg-container"></div>
      <!-- 功能内容列表 -->
      <functions v-on:child-toggle="getToggle"></functions>
      <!-- 活动内容列表 -->
      <div class="date-nav-container">
        <span>今天</span>
        <a class="time-icon" @tap="toLink('/schedule/index.html#!/scheduleAdd')"></a>
      </div>
      <activelist></activelist>
    </div>
  </div>  
</template>
<script>
  import functions from './functions.vue';
  import activelist from './activelist.vue';
  export default {
    components: {
      'functions': functions,
      'activelist': activelist
    },
    data: function () {
      return {
        isActive: false
      };
    },
    methods: {
      getToggle: function (bool) {
        this.isActive = bool;
      },
      toLink: function (path) {
        window.location.href = path;
      }
    }
  };
</script>