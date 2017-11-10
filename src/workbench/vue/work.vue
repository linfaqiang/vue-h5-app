<template>
	<!-- 侧滑导航根容器 -->
	<div class="mui-off-canvas-wrap mui-draggable">
	  <!-- 主页面容器 -->
	  <div class="mui-inner-wrap">
  	    <!-- 菜单容器 -->
  	    <asidebar></asidebar>
  	    <!-- 主页面标题 -->
  	    <headbox></headbox>
  	    <!-- 主页面内容容器 -->
        <div id="offCanvasContentScroll" class="mui-content mui-scroll-wrapper">
          <div class="mui-scroll">
            <workbench></workbench>
          </div>
        </div>
  	    <!-- 主页面尾部容器 -->
  	    <footbox></footbox>
	  </div>
	</div>
</template>
<script>
  import footbox from '../../home/vue/footbox.vue';
  import headbox from '../../home/vue/headbox.vue';
  import asidebar from '../../home/vue/asidebar.vue';
  import workbench from './workbench.vue';
  export default {
    components: {
      'footbox': footbox,
      'headbox': headbox,
      'asidebar': asidebar,
      'workbench': workbench
    },
    data: function () {
      return {
      };
    },
    ready: function () {
      mui.init();
      mui('#offCanvasContentScroll').scroll();
    }
  };
</script>