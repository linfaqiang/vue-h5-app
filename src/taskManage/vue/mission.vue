/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="save()">保存</a>
    </header>
    <div class="mui-content">
      <ul id="mission">
        <li>
          <span class="mui-icon mui-icon-name"></span>
          <div v-text="testList.mission.userName"></div>
        </li>
        <li>
          <span class="mui-icon crm-icon-ongoing"></span>
          <a href="#picture"class="mui-icon crm-navigate-right picture" v-text="testList.mission.statuText == '分配任务'?'未开始':testList.mission.statuText"></a>
        </li>
        <li>
          <textarea placeholder="请填写任务执行情况" v-model="testList.mission.resultDesc" @focus="inputFocus()"></textarea>
        </li>
      </ul>
      <div id="picture" class="mui-popover mui-popover-action mui-popover-bottom">
        <ul class="mui-table-view">
          <li class="mui-table-view-cell">
            <a href="#picture" @tap="tapOne(1)">未开始</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#picture" @tap="tapOne(2)">进行中</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#picture" @tap="tapOne(3)">已完成</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../task-store';
  var nativeApi = require('nativeApi');
  export default {
    components: {},
    data: function () {
      return {
        isB: false,
        name: '更多详细信息',
        currentHeader: {
          title: '执行任务'
        },
        testList: store.state
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      tapLink: function () {
        this.$router.go('choosePage');
      },
      tapOne: function (type) {
        type = type + '';
        if (type === '1') {
          store.state.mission.statuText = '未开始';
          store.state.mission.status = '0';
        } else if (type === '2') {
          store.state.mission.statuText = '进行中';
          store.state.mission.status = '1';
        } else if (type === '3') {
          store.state.mission.statuText = '已完成';
          store.state.mission.status = '2';
        }
      },
      save: function () {
        store.state.mission.id = this.$route.params.id;
        store.missionSava();
      },
      inputFocus: function (type) {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.testList.mission.resultDesc = result.result;
          }
        });
      }
    },
    route: {
      activate: function (transition) {
        transition.next();
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-slider').slider();
      mui('.mui-scroll-wrapper').scroll({
        indicators: true
      });
    }
  };
</script>
