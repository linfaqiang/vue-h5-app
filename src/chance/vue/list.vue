/**
* @file 商机列表
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title">{{currentHeader.title}}<!--@tap="underling()"-->
        <!--<span class="mui-icon" :class="{'crm-solid-up-triangle': showHideDown, 'crm-solid-lower-triangle': !showHideDown}"></span>-->
      </h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" @tap="add()"></a>
      <a class="mui-icon-search mui-icon mui-pull-right" style="right: 18px;" @tap="search()"></a>
    </header>
    <div class="mui-content" style="padding-top: 44px;">
      <div class="select_tab">
        <a v-for="cutObj in cutArr" @tap="showSelect($index)"
           :class="{selected: cutObj.selected}">{{cutObj.itemName}}<span v-if="$index<(cutArr.length-1)"
                                                                         :class="{'crm-solid-up-triangle':cutObj.selected,'crm-solid-lower-triangle':!cutObj.selected}"
                                                                         class="mui-icon"></span><span
          v-if="$index<(cutArr.length-1)" class="right"></span></a>
      </div>
      <div v-if="listData.chanceList.length==0" :class="{'list_is_null': listData.chanceList.length==0}"></div>
      <div v-show="listData.chanceList.length>0">
        <div class="show_total">{{dataList.nowTotal}}/{{dataList.totalSize}}</div>
        <mui-scroll-refresh bottom="0" top="108px">
          <div class="list_chance sideline_up sideline_down" v-for="list in listData.chanceList"
               @tap="toDetail(list.id)">
            <div class="content mui-icon mui-push-right">
              <p class="title">{{list.chanceName}}</p>
              <p>{{list.customerName}}</p>
              <p class="bu"><span class="stage">{{list.stageName}}</span><span>¥{{list.forecastAmount}}</span></p>
            </div>
            <div class="label sideline_up">
              <span class="mui-icon mui-icon-start">{{disposeDate(list)}}</span>
              <!--{{(this.cutArr[0].itemCode==0||this.cutArr[0].itemCode==2)?list.trackDate:(this.cutArr[0].itemCode==1?list.createdOn:list.extimateDealDate)}}-->
              <span class="mui-icon mui-icon-emp">{{list.createdName}}</span>
              <span class="mui-icon mui-icon-stage"><span>{{list.statusText}}</span></span>
            </div>
          </div>
          <div style="height: 10px;"></div>
        </mui-scroll-refresh>
      </div>
    </div>
    <div class="select_search" :style="selectCss" v-show="selectShow" @tap="deleteSelect()">
      <div class="mui-scroll-wrapper" v-show="aseFlag">
        <div class="mui-scroll">
          <a v-for="list in dataList.selectList" @tap="selectFn($index)"
             :class="{'selected': list.selected, 'crm-check': list.selected}"
             class="mui-icon">{{list.itemName}}<span></span></a>
        </div>
      </div>
      <div class="more_screen" v-show="!aseFlag">
        <div class="left_icon">
          <a v-for="list in dataList.screenList" :class="{selected: list.selected}" @tap="chooseTy($index)">{{list.itemName}}</a>
        </div>
        <div v-show="!isType" class="right_list mui-scroll-wrapper">
          <div class="mui-scroll">
            <a v-for="list in dataList.selectList" @tap="selectTypeFn($index,'status')"
               :class="{'selected': list.selected, 'crm-check': list.selected}" class="mui-icon">{{list.name}}</a>
          </div>
        </div>
        <div v-show="isType" class="right_list_2 mui-scroll-wrapper">
          <div class="mui-scroll">
            <a v-for="list in dataList.selectList" @tap="chooseChanceType($index)" :class="{'selected': list.selected}"
               class="mui-icon">{{list.name}}</a>
          </div>
        </div>
        <div v-show="isType" class="right_list_3 mui-scroll-wrapper">
          <div class="mui-scroll">
            <a v-for="list in dataList.selectList3" @tap="selectTypeFn($index,'stageType')"
               :class="{'selected': list.selected, 'crm-check': list.selected}" class="mui-icon">{{list.name}}</a>
          </div>
        </div>
      </div>
      <div class="background_select" @tap="cleanSelect()" v-show="!aseFlag" :style="backCss"></div>
    </div>
    <div class="underling" v-show="showHideDown" @tap="underling()">
      <div class="un_select_li">
        <li @tap="refreshList('me')"><span class="mui-icon crm-icon-main"></span>我的商机</li>
        <li @tap="refreshList('un')"><span class="mui-icon crm-icon-staff"></span>我的下属</li>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../chance-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  var {FastClick} = require('fastclick');
  export default{
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '商机'
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
            'selectedSecond': false,
            'fn': 'screenFn'
          },
          {
            'itemCode': '3',
            'itemName': '更多筛选'
          }
        ],
        selected: {
          'status': '',
          'stage': ''
        },
        selectedSecond: {
          'status': '',
          'stage': ''
        },
        showHideDown: false,
        isType: true
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
        nativeApi.goNative({
          'apiJson': {
            'fn': 'chance'
          }
        });
      },
      disposeDate: function (item) {
        var date = '';
        var itemCode = this.cutArr[0].itemCode + '';
        if (itemCode === '0' || itemCode === '2') {
          date = item.trackDate || '';
        } else if (itemCode === '1') {
          date = item.createdOn || '';
        } else {
          date = item.extimateDealDate || '';
        }
        return date.substring(0, 10);
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
          self.currentHeader.title = '我的商机';
        } else if (type === 'un') {
          /* 查询下属*/
          window['chanceUnEmp'] = function (lists) {
            /* 刷新商机列表*/
            self.currentHeader.title = '下属商机';
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
      chooseChanceType: function (index) {
        var self = this;
        var screenType = self.dataList.selectList[index];
        var selectL = self.dataList.selectList;
        for (var i = 0; i < selectL.length; i++) {
          if (i === index) {
            selectL[i].selected = true;
          } else {
            selectL[i].selected = false;
          }
        }
        store.chanceTypeSecond(screenType.id);
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
        self.dataList.selectList = [];
        store.screenFn(self.selected[jsonData.itemCode], function () {
        });
        self.isType = false;
        if (index === 0) {
          self.isType = true;
        }
      },
      selectTypeFn: function (index, type) {
        var self = this;
        var selectJson;
        var arr = [];
        if (type === 'stageType') {
          selectJson = self.dataList.selectList3[index];
          if (selectJson.id) {
            arr.push(selectJson.id + '');
          }
          store.param.list.stageList = arr;
        } else if (type === 'status') {
          selectJson = self.dataList.selectList[index];
          if (selectJson.id) {
            arr.push(selectJson.id + '');
          }
          store.param.list.statusList = arr;

          var selectL = self.dataList.selectList;
          for (var i = 0; i < selectL.length; i++) {
            if (i === index) {
              selectL[i].selected = true;
            } else {
              selectL[i].selected = false;
            }
          }
        }
        self.selectedSecond[type] = selectJson.id;
        self.cleanSelect();
        var selectL3 = self.dataList.selectList3;
        for (var m = 0; m < selectL3.length; m++) {
          if (m === index) {
            selectL3[m].selected = true;
          } else {
            selectL3[m].selected = false;
          }
        }

        /* 刷新列表*/
        store.listRefresh('list');
      },
      cleanSelect: function () {
        var self = this;
        try {
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
          self.$router.go('/detailPage');
        });
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
