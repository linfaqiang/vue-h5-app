/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
    </header>
    <div id="detail" class="mui-content">
      <p>执行人
        <span v-text="detailData.detailData.executorName"></span>
      </p>
      <p>执行时间
        <span v-text="detailData.detailData.createdOn"></span>
      </p>
      <p>状态
        <span v-text="detailData.detailData.statusText"></span>
      </p>
      <p class="noBorder">任务执行情况
        <span class="taskDetail" v-text="detailData.detailData.resultDesc"></span>
      </p>
    </div>
  </div>
</template>
<script>
  import store from '../task-store';
  export default {
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '任务执行情况'
        },
        detailData: store.state
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      }
    },
    route: {
      activate: function (transition) {
        var id = this.$route.params.executorId;
        store.mattersDetail(id);
        transition.next();
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
