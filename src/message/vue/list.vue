/* *
* @file 消息列表
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" v-if="!showFlag">
      <div class="message_search search_d" :class="{'search_d_h_m': isBlur}">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
        <input id="searchInputId" type="text" placeholder="{{plh}}" v-model="searchName" @focus="inputBlock"
               @blur="noInputBlock">
        <span></span>
        <a class="mui-btn-link mui-icon mui-pull-right" v-if="isBlur" :style="seaNaCss" @tap="confirm()">确定</a>
        <a class="mui-icon-message-type mui-icon mui-pull-right" v-if="!isBlur" @tap="showType()"></a>
      </div>
    </header>
    <header class="mui-bar mui-bar-nav" v-if="showFlag">
      <a class="mui-icon-message-show mui-icon mui-pull-right" @tap="typeSelect()"></a>
    </header>
    <div class="mui-content">
      <div v-if="message.dataList.length == 0" :class="{'list_is_null': message.dataList.length == 0}"></div>
      <div v-show="message.dataList.length > 0">
        <mui-scroll-refresh bottom="0" top="44px">
          <div class="message_li">
            <p class="no_read">未读消息数<span>({{message.noRead}})</span></p>
            <div class="list" v-for="item in message.dataList">
              <div class="date"><span>{{item.date}}</span><span class="line"></span></div>
              <div class="data" v-for="list in item.list" @tap="detail(list)">
                <div class="img">
                  <div><span class="mui-icon mui-icon-{{getType(list.entityType)}}"></span>
                    <p v-text="list.typeText"></p></div>
                </div>
                <p class="title" :style="{color: list.isRead!=0?'#999':''}">{{list.title}}</p>
                <div class="content">{{list.content}}</div>
                <span class="time">{{list.time}}</span>
              </div>
            </div>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
    <div class="select_search" v-show="showFlag">
      <div class="table">
        <table>
          <tr>
            <td :class="{selected: selectArr[0].selected}"><span @tap="select(0)">全部</span></td>
            <td :class="{selected: selectArr[0].selected||selectArr[1].selected}"><span @tap="select(1)">消息</span></td>
            <td :class="{selected: selectArr[0].selected||selectArr[2].selected}"><span @tap="select(2)">审批</span></td>
            <td :class="{selected: selectArr[0].selected||selectArr[3].selected}"><span @tap="select(3)">任务</span></td>
          </tr>
          <tr>
            <td :class="{selected: selectArr[0].selected||selectArr[4].selected}"><span @tap="select(4)">公告</span></td>
            <td :class="{selected: selectArr[0].selected||selectArr[5].selected}"><span @tap="select(5)">工作报告</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="background_select" @tap="cleanSelect()"></div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../contact/contact.css';
</style>
<script>
  import store from '../message-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        message: store.scroll.list,
        plh: '搜索',
        searchName: '',
        saveSea: '',
        saveType: '',
        isBlur: false,
        showFlag: false,
        selectArr: [
          {
            'code': '',
            'name': '全部',
            'selected': false
          },
          {
            'code': '0',
            'name': '消息',
            'selected': false
          },
          {
            'code': '1',
            'name': '审批',
            'selected': false
          },
          {
            'code': '2',
            'name': '任务',
            'selected': false
          },
          {
            'code': '3',
            'name': '公告',
            'selected': false
          },
          {
            'code': '4',
            'name': '工作报告',
            'selected': false
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
      getType: function (code) {
        if (code === 'QUOTATION_APPROVAL') {
          /* 审批*/
          return 'approve';
        } else if (code === 'SALE_TASK') {
          /* 任务*/
          return 'task';
        } else if (code === 'Notice') {
          /* 公告*/
          return 'notice';
        } else if (code === 'MY_REPORT') {
          /* 工作报告*/
          return 'workReport';
        } else {
          /* 普通消息*/
          return 'business';
        }
      },
      inputBlock: function () {
        this.isBlur = true;
        this.plh = '标题/内容';
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.searchName = result.result;
            if (self.searchName) {
              self.seaNaCss.color = '#fff';
            }
          }
        });
      },
      noInputBlock: function () {
        var self = this;
        self.searchName = self.saveSea;
        if (!self.searchName) {
          self.isBlur = false;
          self.plh = '搜索';
        }
      },
      confirm: function () {
        var self = this;
        var searchName = this.searchName;
        self.saveSea = searchName;
        store.param.list.q = self.saveSea;
        store.listRefresh('list');
      },
      showType: function () {
        this.showFlag = true;
      },
      cleanSelect: function () {
        this.showFlag = false;
      },
      select: function (index) {
        var selectArr = this.selectArr;
        var flag = selectArr[index].selected;
        if (index === 0) {
          for (var i = 0; i < selectArr.length; i++) {
            selectArr[i].selected = !flag;
          }
        } else {
          if (flag) {
            selectArr[0].selected = !flag;
          }
          selectArr[index].selected = !flag;
          var flagA = true;
          for (var m = 0; m < selectArr.length; m++) {
            if (m !== 0 && !selectArr[m].selected) {
              flagA = false;
            }
          }
          if (flagA) {
            selectArr[0].selected = true;
          }
        }
      },
      typeSelect: function () {
        this.cleanSelect();
        var type = [];
        var selectArr = this.selectArr;
        for (var i = 0; i < selectArr.length; i++) {
          if (i !== 0 && selectArr[i].selected) {
            type.push(selectArr[i].code);
          }
        }
        store.param.list.type = type.join(',') || '';
        store.listRefresh('list');
      },
      detail: function (data) {
        /* 未读消息设置成已读*/
        var self = this;
        if (data.isRead === 0) {
          store.setRead(data, function () {
            self.toDetail(data);
          });
        } else {
          self.toDetail(data);
        }
      },
      toDetail: function (data) {
        var type = data.entityType;
        var funcName = '';
        var self = this;
        if (type === 'SALE_TASK') {
          funcName = 'taskManage';
        } else if (type === 'QUOTATION_APPROVAL') {
          funcName = 'priceApproval';
        } else if (type === 'MY_REPORT') {
          funcName = 'workReport';
        }
        if (funcName) {
          localStorage.setItem('message_' + funcName + '_detail', JSON.stringify({
            'id': data.entityId
          }));
          nativeApi.goView({
            'apiJson': {
              'urlPort': funcName + '/index.html#!/detailPage/message_' + funcName + '_detail',
              'function': funcName
            }
          });
        } else {
          store.detail(data, function () {
            self.$router.go('/detailPage/' + data.id);
          });
        }
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.init();
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
