/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="backHome()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" @tap="addAct()"></a>
    </header>
    <div class="mui-content">
      <div class="select_tab">
        <a v-for="cutObj in cutArr" @tap="showSelect($index)" :class="{selected: cutObj.selected}">
          <span class="panni">{{cutObj.itemName}}</span>
          <span :class="{'crm-solid-up-triangle':cutObj.selected,'crm-solid-lower-triangle':!cutObj.selected}"
                class="mui-icon"></span>
          <span v-if="$index<(cutArr.length-1)" class="right"></span>
        </a>
      </div>
      <div v-if="dataList.conList.length==0" :class="{'list_is_null': dataList.conList.length==0}"></div>
      <div v-show="dataList.conList.length>0">
        <div class="list-count">{{selectData.nowTotal}}/{{selectData.totalSize}}</div>
        <div class="mui-scroll-wrapper" :style="styleObject">
          <mui-scroll-refresh>
            <div class="noPadding">
              <ul id="OA_task_2" class="mui-table-view">
                <li class="mui-table-view-cell mui-media" v-for="lists in dataList.conList" index="{{$index}}"
                    @tap="tapLink($index)">
                  <div class="mui-slider-right mui-disabled">
                    <a class="mui-btn mui-btn-red mui-icon mui-icon-compose">编辑</a>
                  </div>
                  <div class="mui-slider-handle mui-table">
                    <a class="mui-navigate-right mui-table-cell">
                      <span style="font-size: 20px;" :style="colorSheet[lists.priorityLevel]"
                            class="mui-media-object mui-pull-left mui-icon crm-icon-flag"></span>
                      <div class="mui-media-body">
                        <div v-if="lists.subject==''" @tap="playRecord" pathUrl="{{lists.audioSubjectFileUrl}}">
                          <span class="mui-icon mui-icon-voice" pathUrl="{{lists.audioSubjectFileUrl}}"></span>
                          <span class="ti" v-text="lists.audioSubjectFileLength" pathUrl="{{lists.audioSubjectFileUrl}}"></span>
                        </div>
                        <p v-else>{{lists.subject}}</p>
                        <p class='mui-ellipsis' v-text="lists.createdOn"></p>
                      </div>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </mui-scroll-refresh>
        </div>
      </div>
    </div>
    <div class="select_search" @tap="cleanSelect()" v-show="selectShow" :style="selectObject">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <a v-for="list in selectData.selectList" @tap="selectFn($index)"
             :class="{'selected': list.selected, 'crm-check': list.selected}" class="mui-icon">{{list.itemName}}</a>
        </div>
      </div>
    </div>
    <div id="pop-out" class="pop-out" @tap="closeSelf()" v-show="sliderOper"></div>
    <div id="pop-up" class="pop-up" :style="popObject" v-show="sliderOper">
      <div>
        <span class="mui-icon crm-icon-ongoing"></span>
        <p @tap="cutArr[0].itemCode=='0'?taskResultIng():toEdit()" v-text="cutArr[0].itemCode=='0'?'进行中':'编辑'"></p>
      </div>
      <div>
        <span class="mui-icon crm-icon-finish"></span>
        <p @tap="cutArr[0].itemCode=='0'?taskResultEnd():toDelete()" v-text="cutArr[0].itemCode=='0'?'完成':'删除'"></p>
      </div>
    </div>
  </div>
</template>
<script>
  import {APIS} from 'configPort';
  import store from '../task-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '任务管理'
        },
        dataList: store.scroll.list,
        selectShow: false,
        selectObject: {
          'height': (document.documentElement.clientHeight - 84) + 'px'
        },
        popObject: {
          top: '100px',
          background: '#fff',
          height: '160px'
        },
        selectData: store.state,
        sliderOper: false,
        styleObject: {
          top: '106px',
          background: '#f1f1f1',
          height: (document.documentElement.clientHeight - 44 - 22 - 40) + 'px'
        },
        colorSheet: [
          {color: '#4D9CED'},
          {color: '#F78E26'},
          {color: '#E31FE8'},
          {color: '#F9232E'}
        ],
        cutArr: [
          {
            'itemCode': '0',
            'itemName': '我收到的',
            'selected': false,
            'field': 'type',
            'fn': 'getDateList'
          },
          {
            'itemCode': '',
            'itemName': '所有',
            'selected': false,
            'field': 'status',
            'fn': 'getActivityTypeList'
          },
          {
            'itemCode': '',
            'itemName': '紧急程度',
            'selected': false,
            'field': 'priorityLevel',
            'fn': 'getCritica'
          }
        ]
      };
    },
    methods: {
      tapLink: function (index) {
        var id = this.dataList.conList[index].id;
        var self = this;
        store.getCustomerDedail(id, function () {
          self.$router.go('/detailPage');
        });
      },
      backNative: function () {
        nativeApi.goNative({
          'apiJson': {
            'fn': 'taskManage'
          }
        });
      },
      backHome: function () {
        if (APIS.is_weixin) {
          history.go(-1);
        } else {
          nativeApi.goNative();
        }
      },
      showSelect: function (index) {
        var self = this;
        var arrObj = self.cutArr[index];
        if (self.selectShow && index === self.cutEd) {
          self.cleanSelect();
          return;
        }
        self.cutArr[self.cutEd || 0].selected = false;
        /* 活动类型＋最近活动*/
        store[arrObj.fn](arrObj.itemCode, function () {
          self.selectShow = true;
          self.cutArr[index].selected = true;
          self.cutEd = index;
        });
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
        store.param.list[self.cutArr[self.cutEd].field] = selectJson.itemCode;
        if (self.cutArr[self.cutEd].field === 'type') {
          store.param.list.type = selectJson.itemCode;
        } else if (self.cutArr[self.cutEd].field === 'status') {
          store.param.list.status = selectJson.itemCode;
        } else if (self.cutArr[self.cutEd].field === 'priorityLevel') {
          store.param.list.priorityLevel = selectJson.itemCode;
        }
        store.state.typeNum = store.param.list.type;
        store.listRefresh('list');
      },
      addAct: function () {
        store.cleanAdd();
        this.$router.go('/addPage');
      },
      closeSelf: function () {
        this.popObject.top = (document.documentElement.clientHeight - 160) + 'px';
        this.sliderOper = false;
      },
      taskResultIng: function () {
        var id = this.dataList.conList[this.index].id;
        store.taskResultIng(id);
        this.popObject.top = (document.documentElement.clientHeight - 160) + 'px';
        this.sliderOper = false;
      },
      taskResultEnd: function () {
        var id = this.dataList.conList[this.index].id;
        store.taskResultEnd(id);
        this.popObject.top = (document.documentElement.clientHeight - 160) + 'px';
        this.sliderOper = false;
      },
      toDelete: function () {
        var id = this.dataList.conList[this.index].id;
        store.toDelete(id, function () {
          store.init();
        });
        this.popObject.top = (document.documentElement.clientHeight - 160) + 'px';
        this.sliderOper = false;
      },
      playRecord: function (event) {
        event.stopPropagation();
        var pathUrl = event.target.getAttribute('pathUrl');
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
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.init();
      console.log('###' + document.documentElement.clientHeight);
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
      var self = this;
      mui.init();
      mui('.mui-scroll-wrapper').scroll();
      mui('#OA_task_2').on('slideleft', '.mui-table-view-cell', function (event) {
        self.slidEle = this;
        self.index = self.slidEle.getAttribute('index');
        self.sliderOper = true;
        self.popObject.top = (document.documentElement.clientHeight - 160) + 'px';
        mui.swipeoutClose(self.slidEle);
      });
    }
  };
</script>
