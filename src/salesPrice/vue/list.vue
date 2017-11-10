/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" @tap="addPrice"></a>
      <a class="mui-icon-search mui-icon mui-pull-right" style="right: 18px;" @tap="search()"></a>
    </header>
    <div class="mui-content">
      <div class="select_tab">
        <a v-for="cutObj in cutArr" @tap="showSelect($index)"
           :class="{selected: cutObj.selected}">{{cutObj.itemName}}<span v-if="$index<(cutArr.length-1)"
                                                                         :class="{'crm-solid-up-triangle':cutObj.selected,'crm-solid-lower-triangle':!cutObj.selected}"
                                                                         class="mui-icon"></span><span
          v-if="$index<(cutArr.length-1)" class="right"></span></a>
      </div>
      <div class="show_total">{{dataList.nowTotal}}/{{dataList.totalSize}}</div>
      <mui-scroll-refresh bottom="0" top="106px">
        <div class="list_chance sideline_up sideline_down" v-for="list in conList.conList" @tap="toDetail($index)">
          <div class="content mui-icon mui-push-right">
            <!--<p class="title">{{list.chanceName}}</p>-->
            <!--报价状态：0拟定，1审批中，2已同意，3已拒绝-->
            <p class="title bu">
              <span class="stage">{{list.quotationName}}</span>
              <span v-if="list.status==0" style="color: #ef8607">{{list.statusText}}</span>
              <span v-if="list.status==1" style="color: #009FE8">{{list.statusText}}</span>
              <span v-if="list.status==2" style="color: #49B768">{{list.statusText}}</span>
              <span v-if="list.status==3" style="color: #d61518">{{list.statusText}}</span>
            </p>
            <p>{{list.chanceName}}</p>
          </div>
          <div class="label">
            <span class="mui-icon mui-icon-start">{{disposeDate(list.createdOn)}}</span>
            <span class="mui-icon mui-icon-emp">{{list.createdName}}</span>
            <span class="mui-icon mui-icon-amount"><span class="list-money">&#165{{list.amount}}</span></span>
          </div>
        </div>
        <div style="height: 10px;"></div>
      </mui-scroll-refresh>
    </div>
    <div class="select_search" :style="selectCss" v-show="selectShow">
      <div class="mui-scroll-wrapper" v-show="aseFlag">
        <div class="mui-scroll">
          <a v-for="list in dataList.selectList" @tap="selectFn($index)"
             :class="{'selected': list.selected, 'crm-check': list.selected}" class="mui-icon">{{list.itemName}}</a>
        </div>
      </div>
      <div class="more_screen" v-show="!aseFlag">
        <div class="left_icon">
          <a v-for="list in dataList.screenList" :class="{selected: list.selected}" @tap="chooseTy($index)">{{list.itemName}}</a>
        </div>
        <div class="right_list mui-scroll-wrapper">
          <div class="mui-scroll">
            <a v-for="list in dataList.selectList" @tap="selectTypeFn($index)"
               :class="{'selected': list.selected, 'crm-check': list.selected}" class="mui-icon">{{list.itemName}}</a>
          </div>
        </div>
      </div>
      <div class="background_select" @tap="cleanSelect()"></div>
    </div>
  </div>
</template>
<script>
  import store from '../price-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '销售报价'
        },
        dataList: store.state,
        conList: store.scroll.list,
        selectShow: false,
        listCss: {
          height: (document.body.offsetHeight - 108) + 'px',
          top: '106px',
          background: '#f1f1f1'
        },
        selectCss: {
          height: (document.body.offsetHeight - 84) + 'px'
        },
        aseFlag: true,
        cutArr: [
          {
            'itemCode': '',
            'itemName': '报价状态',
            'selected': false,
            'fn': 'selectType'
          },
          {
            'itemCode': '2',
            'itemName': '更多筛选'
          }
        ],
        selected: {
          'status': '',
          'stage': ''
        },
        count: 0

      };
    },
    methods: {
      backNative: function () {
        nativeApi.goNative({
          'apiJson': {
            'fn': 'salesPrice'
          }
        });
      },
      showSelect: function (index) {
        var self = this;
        var arrObj = self.cutArr[index];
        self.cutArr[self.cutEd || 0].selected = false;
        var selected = '';
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
          self.$router.go('/searchPage');
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
          store.screenFn(self.selected[jsonData.itemCode], function () {
          });
        }
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
        self.selected[type] = selectJson.itemCode;
        self.cleanSelect();
      },
      cleanSelect: function () {
        var self = this;
        try {
          self.selectShow = false;
          self.cutArr[self.cutEd].selected = false;
        } catch (e) {
        }
      },
      selectFn: function (index) {
        var self = this;
        var selectJson = self.dataList.selectList[index];
        self.cutArr[self.cutEd].itemCode = selectJson.itemCode;
        self.cutArr[self.cutEd].itemName = selectJson.itemName;
        if (self.cutEd === 0) {
          store.param.list.status = self.cutArr[self.cutEd].itemCode;
        }
        store.init();
        self.cleanSelect();
      },
      toDetail: function (index) {
        store.state.statusActive.s = true;
        var priceId = this.conList.conList[index].id;
        var self = this;
        store.getCustomerDedail(priceId, function () {
          self.$router.go('/detailPage');
        });
      },
      addPrice: function () {
        // 新建报价
        // 重置之前添加的报价数据
        store.state.addData.quotationName = '';
        store.state.addData.customerId = '';
        store.state.addData.customer = '';
        store.state.addData.chanceId = '';
        store.state.addData.chance = '';

        store.state.addData.overdueDate = store.getAfterDate(30);
        store.state.selectProducts = [];
        this.$router.go('/addPage');
      },
      disposeDate: function (date) {
        return date.substring(0, 10);
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.init();
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
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
