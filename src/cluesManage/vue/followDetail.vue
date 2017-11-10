/**
* @file
* @author hj
* @date 2016-11-22
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <!--<a class="mui-icon crm-plus mui-pull-right" @tap="showNewpage(2)"></a>-->
    </header>
    <div class="mui-content">
      <div class="out-warpper">
        <div id="" class="rec-content">
          {{contentData.data.trackContent}}
        </div>
        <ul style="padding:0px; background:#fff;">
          <li class="mui-table-view-cell crm-listIcon">
            <div class="rec-content-line"></div>
            <a>
              <span class="mui-icon mui-icon-name"> </span>
              <span class="time-text">跟进人：{{contentData.data.followManName}}</span>
            </a>
          </li>
          <li class="mui-table-view-cell crm-listIcon">
            <a>
              <span class="mui-icon mui-icon-start"> </span>
              <span class="time-text">跟进时间：{{contentData.data.trackOn}}</span>
            </a>
          </li>
          <li class="mui-table-view-cell crm-listIcon">
            <a>
              <span class="mui-icon mui-icon-address crm-address">{{contentData.data.address.address}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../clue-store';
  export default {
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '跟进记录详情'
        },
        contentData: store.state.RecordDedail
      };
    },
    methods: {},
    route: {
      activate: function (transition) {
        var id = this.$route.params.id;
        store.getRecordDedail(id);
        transition.next();
      }
    },
    created: function () {
      // 运行 数据中转站的函数
    },
    ready: function () {
      mui('.mui-slider').slider();
      mui('.mui-scroll-wrapper').scroll({
        indicators: true
      });
    }
  };
</script>
