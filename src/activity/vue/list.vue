<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title" <!--@tap="underling()"-->{{currentHeader.title}}</h1>
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
      <div v-if="list.dataList.length==0" :class="{'list_is_null': list.dataList.length==0}"></div>
      <div v-show="list.dataList.length>0">
        <mui-scroll-refresh bottom="0px" top="84px">
          <this-list-components :lists="list.dataList"></this-list-components>
        </mui-scroll-refresh>
      </div>
    </div>
    <div class="select_search" @tap="cleanSelect()" v-show="selectShow" v-bind:style="selectObject">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <a v-for="list in selectData.selectList" @tap="selectFn($index)"
             :class="{'selected': list.selected, 'crm-check': list.selected}" class="mui-icon">{{list.name}}</a>
        </div>
      </div>
    </div>
    <div class="underling" v-show="showHideDown" @tap="underling()">
      <div class="un_select_li">
        <li @tap="refreshList('me')"><span class="mui-icon crm-icon-main"></span>我的活动</li>
        <li @tap="refreshList('un')"><span class="mui-icon crm-icon-staff"></span>我的下属</li>
      </div>
    </div>
  </div>
</template>
<script>
  import activityList from '../../public/components/crm-activity/list';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh';
  import store from '../activity-store';
  var {FastClick} = require('fastclick');
  var nativeApi = require('nativeApi');
  export default{
    components: {
      'this-list-components': activityList,
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '活动'
        },
        list: store.scroll.list,
        selectShow: false,
        selectObject: {
          'height': (document.body.offsetHeight - 84) + 'px'
        },
        selectData: store.state,
        cutArr: [
          {
            'itemCode': '1',
            'itemName': '近三天',
            'selected': false,
            'fn': 'getDateList'
          },
          {
            'itemCode': '',
            'itemName': '所有类型',
            'selected': false,
            'fn': 'getActivityTypeList'
          },
          {
            'itemCode': '',
            'itemName': '更多筛选'
          }
        ],
        showHideDown: false
      };
    },
    events: {
      toDetail: function (id) {
        var self = this;
        store.detail(id, function () {
          self.$router.go('/detailPage');
        });
      },
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
        nativeApi.goNative({
          'apiJson': {
            'fn': 'activity'
          }
        });
      },
      openRecord: function (pathUrl) {
        nativeApi.goDownload({
          'apiJson': {
            'endBack': '3',
            'file': {
              'name': pathUrl.substring(pathUrl.lastIndexOf('/') + 1, pathUrl.length),
              'sha': pathUrl.substring(pathUrl.lastIndexOf('/') + 1, pathUrl.lastIndexOf('.')),
              'size': '',
              'status': '1',
              'type': pathUrl.substring(pathUrl.lastIndexOf('.') + 1, pathUrl.length),
              'url': pathUrl
            },
            'type': 'AUDIO'
          },
          callback: function (result) {
          }
        });
      },
      underling: function () {
        var self = this;
        if (self.showHideDown) {
          self.showHideDown = false;
        } else {
          self.showHideDown = true;
        }
      },
      refreshList: function (type) {
        var self = this;
        if (type === 'me') {
          /* 查询我的商机 */
          self.currentHeader.title = '我的活动';
        } else if (type === 'un') {
          /* 查询下属 */
          window['activityUnEmp'] = function (lists) {
            self.currentHeader.title = '下属活动';
          };
          self.$router.go('/employee-select/activityUnEmp');
        }
      },
      showSelect: function (index) {
        /* type 1显示最近活动选项  2活动类型选项 */
        var self = this;
        var arrObj = self.cutArr[index];
        if (self.selectShow && index === self.cutEd) {
          self.cleanSelect();
          return;
        }
        self.cutArr[self.cutEd || 0].selected = false;
        if (typeof store[arrObj.fn] === 'function') {
          /* 活动类型(DictTrackType)＋最近活动 */
          store[arrObj.fn](arrObj.itemCode, function () {
            self.selectShow = true;
            self.cutArr[index].selected = true;
            self.cutEd = index;
          });
        } else {
          /* 更多筛选 */
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
        self.cutEd = '';
      },
      selectFn: function (index) {
        var self = this;
        var selectJson = self.selectData.selectList[index];
        self.cutArr[self.cutEd].itemCode = selectJson.id;
        self.cutArr[self.cutEd].itemName = selectJson.name;
        if (self.cutEd === 0) {
          store.param.list.days = selectJson.id;
        } else if (self.cutEd === 1) {
          store.param.list.activityType = selectJson.id;
        }
        store.listRefresh('list');
      },
      addAct: function () {
        store.cleanAdd();
        this.$router.go('/addPage');
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
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
