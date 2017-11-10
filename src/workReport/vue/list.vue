/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" @tap="addAct()"></a>
    </header>
    <div class="mui-content" style="padding-top: 44px;">
      <div class="select_tab">
        <a v-for="cutObj in cutArr" @tap="showSelect($index)"
           :class="{selected: cutObj.selected}">{{cutObj.itemName}}<span v-if="$index<(cutArr.length-1)"
                                                                         :class="{'crm-solid-up-triangle':cutObj.selected,'crm-solid-lower-triangle':!cutObj.selected}"
                                                                         class="mui-icon"></span><span
          v-if="$index<(cutArr.length-1)" class="right"></span></a>
      </div>
      <div v-if="work.workList.length==0" :class="{'list_is_null': work.workList.length==0}"></div>
      <div v-show="work.workList.length>0">
        <mui-scroll-refresh bottom="0" top="84px">
          <div class="work_report_li sideline_up sideline_down" v-for="list in work.workList">
            <div class="own">
              {{cutArr[0].itemCode=='0'?'我':list.createdName}}的{{list.reportType=='0'?'日':(list.reportType=='1'?'周':'月')}}报<span
              v-text="list.createdOn"></span></div>
            <div class="content sideline_up" @tap="toDetail(list)">
              <p class="date" v-if="list.reportType=='0'">{{substring(list.startTime)}}</p>
              <p class="date" v-if="list.reportType=='1'">{{substring(list.startTime)}}~{{substring(list.endTime)}}</p>
              <p class="date" v-if="list.reportType=='2'">{{(new Date(list.startTime).getFullYear())+'年'+(new Date(list.startTime).getMonth()+1) + '月'}}</p>
              <p class="two_row">{{decodeH(list.summary)}}</p>
              <span v-if="list.status==0" class="status"
                    :class="{'red':list.status==0}">{{list.status==0?'已保存':'已提交'}}</span>
              <span class="mui-icon mui-push-right"></span>
            </div>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
    <div class="select_search" @tap="cleanSelect()" v-show="selectShow" v-bind:style="selectObject">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <a v-for="list in selectData.selectList" @tap="selectFn($index)"
             :class="{'selected': list.selected, 'crm-check': list.selected}" class="mui-icon">{{list.itemName}}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../work-store';
  import {FastClick} from 'fastclick';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '工作报告'
        },
        work: store.scroll.list,
        selectShow: false,
        selectObject: {
          'height': (document.body.offsetHeight - 84) + 'px'
        },
        selectData: store.state,
        cutArr: [
          {
            'itemCode': '0',
            'itemName': '我发起的',
            'selected': false,
            'fn': 'getData'
          },
          {
            'itemCode': '',
            'itemName': '所有',
            'selected': false,
            'fn': 'getTypeData'
          },
          {
            'itemCode': '',
            'itemName': '更多筛选'
          }
        ]
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('list', scroll);
      },
      pulldown: function () {
        store.listRefresh('list');
      },
      pullup: function () {
        store.listLoadMore('list');
      }
    },
    methods: {
      backNative: function () {
        nativeApi.goNative();
      },
      decodeH: function (val) {
        if (val) {
          val = nativeApi.replaceAllCh(val, 1);
        }
        return val;
      },
      substring: function (val) {
        if (val) {
          val = val.substring(0, 10);
        }
        return val;
      },
      showSelect: function (index) {
        /* type 1显示最近活动选项  2活动类型选项*/
        var self = this;
        var arrObj = self.cutArr[index];
        self.cutArr[self.cutEd || 0].selected = false;
        if (typeof store[arrObj.fn] === 'function') {
          /* 活动类型＋最近活动*/
          store[arrObj.fn](arrObj.itemCode, function () {
            self.selectShow = true;
            self.cutArr[index].selected = true;
            self.cutEd = index;
          });
        } else {
          /* 更多筛选*/
          self.selectShow = false;
          store.getIfLeader(function () {
            self.$router.go('/searchPage');
          });
        }
      },
      cleanSelect: function () {
        var self = this;
        self.selectShow = false;
        self.cutArr[self.cutEd].selected = false;
      },
      selectFn: function (index) {
        var self = this;
        var selectJson = self.selectData.selectList[index];
        self.cutArr[self.cutEd].itemCode = selectJson.itemCode;
        self.cutArr[self.cutEd].itemName = selectJson.itemName;
        if (self.cutArr[self.cutEd].fn === 'getData') {
          store.param.list.isViewMe = parseInt(selectJson.itemCode);
        } else if (self.cutArr[self.cutEd].fn === 'getTypeData') {
          store.param.list.reportType = selectJson.itemCode;
        }
        store.init();
      },
      addAct: function () {
        store.cleanAdd();
        this.$router.go('/addPage');
      },
      toDetail: function (data) {
        var self = this;
        store.detail(data.id, function () {
          self.$router.go('/detailPage');
        });
      }
    },
    //  created 钩子在实例创建后,在reday之前.调用
    created: function () {
      // 运行 数据中转站的函数
      store.init();
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      FastClick.attach(document.body);
    }
  };
</script>
