/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <section class="detail">
      <h4 v-text="testList.data.subject"></h4>
      <p class="time" v-text="testList.data.createdOn"></p>
      <img v-if="testList.data.picUrlList" :src="testList.data.picUrlList" onerror="this.src='../public/images/pic_cpxq_no02.png'">
      <p class="content" v-html="testList.data.content"></p>
    </section>
  </div>
</template>
<script>
  import store from '../market-store';
  export default {
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '市场资讯',
          btns: [{
            pos: 'left',
            icon: 'mui-icon-left-nav',
            text: '',
            show: true
          }]
        },
        testList: store.state.details
      };
    },
    methods: {},
    events: {},
    ready: function () {},
    route: {
      activate: function (transition) {
        var manageId = this.$route.params.manageId;
        store.details(manageId);
        transition.next();
      }
    },
    created: function () {
    }
  };
</script>
