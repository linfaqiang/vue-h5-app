/**
* @file 消息详情
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="detail.detailTitle"></h1>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="message_detail">
            <p class="title">{{detail.detailData.title}}</p>
            <p>发送时间：{{detail.detailData.createdOn}}</p>
            <p v-if="detail.detailData.remark">发送范围：{{detail.detailData.remark}}</p>
            <div class="content">{{detail.detailData.content}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../message-store';
  export default {
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: ''
        },
        detail: store.state
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
