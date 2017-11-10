<template>
	<!-- 侧滑导航根容器 -->
	<div class="mui-off-canvas-wrap mui-draggable homepage-container">
	  <!-- 主页面容器 -->
	  <div class="mui-inner-wrap">
	    <!-- 菜单容器 -->
	    <asidebar></asidebar>
	    <!-- 主页面标题 -->
	    <headbox></headbox>
	    <!-- 主页面内容容器 -->
	    <mainbox></mainbox>
	    <!-- 主页面尾部容器 -->
	    <footbox v-on:show-newpage="showNewPage"></footbox>
      <!-- 新增任务 -->
      <newpage v-on:send-hidenewpage="hideNewpage" v-show="isShowPage" :newpage="isShowPage"></newpage>
	  </div>
	</div>
</template>
<script>
  import mainbox from './mainbox.vue';
  import footbox from './footbox.vue';
  import headbox from './headbox.vue';
  import asidebar from './asidebar.vue';
  import newpage from '../../addschedule/vue/newPage.vue';
  export default {
    components: {
      'mainbox': mainbox,
      'footbox': footbox,
      'headbox': headbox,
      'asidebar': asidebar,
      'newpage': newpage
    },
    data: function () {
      return {
        opacityShow: false,
        isShowPage: false
      };
    },
    methods: {
      showNewPage: function (bool) {
        this.isShowPage = bool;
      },
      hideNewpage: function (bool) {
        this.isShowPage = bool;
      }
    },
    ready: function () {
      mui.init();
      mui('#offCanvasContentScroll').scroll();
    }
  };
</script>