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
        <!-- <div id="offCanvasContentScroll" class="mui-content mui-scroll-wrapper">
          <div class="mui-scroll">
            <workbench></workbench>
          </div>
        </div> -->
        <workbench></workbench>
  	    <!-- 主页面尾部容器 -->
  	    <footbox v-on:show-newpage="showNewPage"></footbox>
        <!-- 新增任务 -->
        <newpage v-on:send-hidenewpage="hideNewpage" v-show="isShowPage" :newpage="isShowPage"></newpage>
	  </div>
	</div>
</template>
<script>
  import footbox from '../../home/vue/footbox2.vue';
  import headbox from '../../home/vue/headbox.vue';
  import asidebar from '../../home/vue/asidebar.vue';
  import workbench from './workbench.vue';
  import newpage from '../../addschedule/vue/newPage.vue';
  export default {
    components: {
      'footbox': footbox,
      'headbox': headbox,
      'asidebar': asidebar,
      'workbench': workbench,
      'newpage': newpage
    },
    data: function () {
      return {
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