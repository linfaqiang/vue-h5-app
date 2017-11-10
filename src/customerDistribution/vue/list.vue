<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title">{{currentHeader.title}}</h1>
      <a class="mui-icon-search mui-icon mui-pull-right" @click="search()"></a>
    </header>
    <div class="mui-content" style="padding-top: 44px;">
      <div v-if="listData.dataList.length==0" :class="{'list_is_null': listData.dataList.length==0}"></div>
      <div v-show="listData.dataList.length>0">
        <mui-scroll-refresh bottom="0" top="50px">
          <div class="list_customer sideline_up sideline_down" v-for="list in listData.dataList"
               @tap="toDetail(list.id)">
            <div class="content mui-icon mui-push-right">
              <p class="title">{{list.name}}</p>
              <p><span class="mui-icon mui-icon-location"></span>{{list.address}}</p>
              <span class="blue" v-if=" ! list.ownerStaffName ">未分配</span>
              <span class="red" v-else><span v-if="list.ownerStaffStatusText == '在职'">{{(list.overdueDays != '0') ? '逾期'+list.overdueDays+'天' : ''}}</span></span>
            </div>
            <div class="label sideline_up">
              <span :class="{'edt': edition==1}">联系人&nbsp;{{list.linkmanCount}}<span></span></span>
              <span v-if="edition!=1">商机&nbsp;{{list.chanceCount}}<span></span></span>
              <span :class="{'edt': edition==1}">团队&nbsp;{{list.teamCount}}<span></span></span>
              <span :class="{'edt_last': edition==1}" :style="{'color': list.ownerStaffStatusText == '离职'?'#ddd':''}">责任人&nbsp;{{list.ownerStaffName}}</span>
            </div>
          </div>
          <div style="height: 10px;"></div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import '../../activity/activity.css';
</style>
<script>
  var {FastClick} = require('fastclick');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  import store from '../customer-store';
  export default{
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '客户'
        },
        dataList: store.state,
        listData: store.scroll.list,
        selectShow: false,
        selectCss: {
          height: (document.body.offsetHeight - 84) + 'px'
        },
        backCss: {
          height: (document.body.offsetHeight - 84 - 276) + 'px',
          top: '276px'
        },
        aseFlag: true,
        cutArr: [
          {
            'itemCode': '0',
            'itemName': '按跟进时间',
            'selected': false,
            'fn': 'selectType'
          },
          {
            'itemCode': '2',
            'itemName': '筛选',
            'selected': false,
            'fn': 'screenFn'
          },
          {
            'itemCode': '3',
            'itemName': '更多筛选'
          }
        ],
        edition: nativeApi.edition,
        selected: {
          'level': ''
        },
        showHideDown: false
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
      toDate: function (val) {
        return val ? val.substring(0, 10) : '';
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
          /* 查询我的商机*/
          self.currentHeader.title = '我的客户';
        } else if (type === 'un') {
          /* 查询下属*/
          window['chanceUnEmp'] = function (lists) {
            /* 刷新商机列表*/
            self.currentHeader.title = '下属客户';
          };
          self.$router.go('/employee-select/chanceUnEmp');
        }
      },
      add: function () {
        store.cleanAdd();
        this.$router.go('/addPage');
      },
      showSelect: function (index) {
        var self = this;
        var arrObj = self.cutArr[index];
        var selected = '';
        if (self.selectShow && index === self.cutEd) {
          self.cleanSelect();
          return;
        }
        self.cutArr[self.cutEd || 0].selected = false;
        if (typeof store[arrObj.fn] === 'function') {
          /* 排序条件＋阶段＋状态*/
          selected = arrObj.itemCode;
          if (arrObj.fn !== 'selectType') {
            selected = self.selected[store.getNowType()];
          }
          store[arrObj.fn](selected, function () {
            self.selectShow = true;
            self.cutArr[index].selected = true;
            self.cutEd = index;
            self.aseFlag = false;
            if (arrObj.fn === 'selectType') {
              self.aseFlag = true;
            }
          });
        } else {
          /* 更多筛选*/
          store.getIfLeader(function () {
            self.$router.go('/searchPage');
          });
          self.cleanSelect();
        }
      },
      search: function () {
        store.scroll.search.searchLi = [];
        this.$router.go('/searchOtherPage');
      },
      chooseTy: function (index) {
        var self = this;
        var screenList = self.dataList.screenList;
        var jsonData = self.dataList.screenList[index];
        for (var i = 0; i < screenList.length; i++) {
          if (i === index) {
            screenList[i].selected = true;
          } else {
            screenList[i].selected = false;
          }
        }
        store.screenFn(self.selected[jsonData.itemCode], function () {
        });
      },
      selectTypeFn: function (index) {
        var self = this;
        var selectJson = self.dataList.selectList[index];
        var screenList = self.dataList.screenList;
        var type = '';
        for (var i = 0; i < screenList.length; i++) {
          if (screenList[i].selected) {
            type = screenList[i].itemCode;
          }
        }
        self.selected[type] = selectJson.id;
        self.cleanSelect();
        /* 刷新列表*/
        var arr = [];
        if (selectJson.id) {
          arr.push(selectJson.id + '');
        }
        if (type === 'level') {
          store.param.list.customerLevelIds = arr;
        }
        store.listRefresh('list');
      },
      cleanSelect: function () {
        try {
          var self = this;
          self.selectShow = false;
          self.cutArr[self.cutEd].selected = false;
          self.cutEd = '';
        } catch (e) {
        }
      },
      deleteSelect: function () {
        if (this.cutArr[0].selected) {
          this.cleanSelect();
        }
      },
      selectFn: function (index) {
        var self = this;
        var selectJson = self.dataList.selectList[index];
        self.cutArr[self.cutEd].itemCode = selectJson.itemCode;
        self.cutArr[self.cutEd].itemName = selectJson.itemName;
        if (self.cutEd === 0) {
          store.param.list.orderType = self.cutArr[self.cutEd].itemCode;
        }
        store.listRefresh('list');
        self.cleanSelect();
      },
      toDetail: function (id) {
        var self = this;
        store.getDetail(id, function () {
          self.$router.go('detailPage/' + id);
        });
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.listRefresh('list');
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      FastClick.attach(document.body);
    }
  };
</script>
