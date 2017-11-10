/**
* @file
* @author hj
* @date 2016-11-22
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav myCustomersHeader">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title" @tap="pop">
        {{currentHeader.title}}
        <span class="mui-icon" :class="[isB ? 'crm-solid-lower-triangle' : 'crm-solid-up-triangle']"></span></h1>
      <a class=" mui-icon crm-search " @tap="mySearch"></a>
      <a class="mui-icon crm-plus mui-pull-right" @tap="add"></a>
    </header>
    <ul class="myCustomersHide mui-card" v-if="!isB">
      <li class="mui-icon crm-icon-main" @tap="myClue">我的线索</li>
      <li class="mui-icon crm-icon-staff" @tap="staffClue">查看下属</li>
    </ul>
    <div v-if="!isB" class="cover-background" @tap="closePop"></div>
    <div class="mui-content">
      <div class="todayNewClue">今日新增{{todyNewClues.numbers}}条线索</div>
      <div id="sliderSegmentedControl"
           class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted nav-top">
        <a class="mui-control-item mui-control-item-e mui-active" @tap="tabDistribute(1)">
          待处理
        </a>
        <a class="mui-control-item mui-control-item-e" @tap="tabDistribute(2)">
          处理中
        </a>
        <a class="mui-control-item mui-control-item-e" @tap="tabDistribute(3)">
          已关闭
        </a>
      </div>
      <div class="list-count">10/30</div>
      <div id="slider" class="mui-slider" :style="sliderCss">
        <div class="mui-slider-group" style="height: 100%;">
          <div class="mui-slider-item mui-control-content mui-active">
            <!--下拉刷新容器-->
            <mui-scroll-refresh>
              <!--数据列表-->
              <ul class="mui-table-view mui-table-view-chevron">
                <li @tap="tapLink($index)" v-for="list in conList.conList" data-group="{{list.indexedGroup}}"
                    class="mui-table-view-cell mui-table-view-cell-e">
                  <div class="mui-table">
                    <div class="mui-table-cell mui-col-xs-10">
                      <p class="mui-ellipsis customer-name">客户名：{{list.customerName}}</p>
                      <p class="list-o">联系方式：{{list.linkmanMobile}}</p>
                      <p class="mui-h6 mui-ellipsis list-o">跟进时间：{{list.lastOperatedOn}}</p>
                    </div>
                    <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                      <span v-if="tabStatus==1" class="mui-h5 dept-show">{{isShowDistribute ? list.toDeptName : (list.today == "0" ? "今日新增" : "" )}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </mui-scroll-refresh>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../clue-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: store.state.currentHeader,
        isB: true,
        isShowDistribute: false,
        conList: store.scroll.list,
        sliderCss: {
          height: (document.body.offsetHeight - 44 - 22 - 40) + 'px'
        },
        tabStatus: 1,
        todyNewClues: store.state.todyClues,
        showHide: false,
        duplicationData: {
          'lists': [
            {
              'customerName': 'xxxxx',
              'staffName': 'xx',
              'staffMobile': '15845263652'
            },
            {
              'customerName': 'xxxxx',
              'staffName': 'xx',
              'staffMobile': '15845263652'
            },
            {
              'customerName': 'xxxxx',
              'staffName': 'xx',
              'staffMobile': '15845263652'
            },
            {
              'customerName': 'xxxxx',
              'staffName': 'xx',
              'staffMobile': '15845263652'
            }
          ],
          'showText': '是否确定',
          'isTwo': 1
        }
      };
    },
    methods: {
      pop: function () {
        this.isB = !this.isB;
      },
      back: function () {
        mui.back();
      },
      tapLink: function (index) {
        var clueId = this.conList.conList[index].id;
        var self = this;
        store.getClueDedail(clueId, function () {
          self.$router.go('/detailPage');
        });
      },
      mySearch: function () {
        store.scroll.search.searchLi = [];
        this.$router.go('/my-search');
      },
      tabDistribute: function (type) {
        if (type === 1) {
          this.isShowDistribute = false;
          this.tabStatus = 1;
          store.param.list.type = 1;
          store.param.search.type = 1;
          store.state.showStuas.text = '暂未处理';
        } else if (type === 2) {
          this.isShowDistribute = true;
          this.tabStatus = 2;
          store.param.list.type = 2;
          store.param.search.type = 2;
          store.state.showStuas.text = '处理中';
        } else if (type === 3) {
          this.isShowDistribute = true;
          this.tabStatus = 3;
          store.param.list.type = 3;
          store.param.search.type = 3;
          store.state.showStuas.text = '已关闭';
        }
        store.param.list.pageNo = 1;
        store.listRefresh('list');
      },
      backNative: function () {
        nativeApi.goNative({
          'apiJson': {
            'fn': 'cluesManage'
          }
        });
      },
      add: function () {
        // 新建线索  重置内容
        this.showHide = true;
        store.state.addData.customerName = '';
        store.state.addData.needs = '';
        store.state.addData.remark = '';
        store.state.addData.source = '';
        store.state.addData.address.address = '';
        store.state.addData.address.country = '';
        store.state.addData.address.province = '';
        store.state.addData.address.city = '';
        store.state.addData.address.cityCode = '';
        store.state.addData.address.adname = '';
        store.state.addData.address.adcode = '';
        store.state.addData.address.longitude = '';
        store.state.addData.address.latitude = '';
        store.state.addData.linkman.name = '';
        store.state.addData.linkman.mobile = '';
        this.$router.go('/add-clue');
      },
      myClue: function () {
        var self = this;
        self.isB = !self.isB;
        self.currentHeader.title = '我的线索';
        store.param.list.staffId = '';
        store.listRefresh('list');
      },
      staffClue: function () {
        var self = this;
        self.isB = !self.isB;
        /* 查询下属*/
        window['clueUnEmp'] = function (lists) {
          store.state.currentHeader.title = '下属线索';
          var staffId = '';
          for (var i = 0; i < lists.length; i++) {
            staffId += lists[i].id + ',';
          }
          staffId = staffId.substring(0, staffId.length - 1);
          store.param.list.staffId = staffId;
          store.listRefresh('list');
        };
        this.$router.go('/employee-select/clueUnEmp');
      },
      closePop: function () {
        this.isB = !this.isB;
      },
      disposeDate: function (date) {
        return date.substring(0, 10);
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.listRefresh('list');
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
    ready: function () {
      mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005
      });
      mui.init();
    }
  };
</script>
