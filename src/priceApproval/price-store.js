/* *
 * @file  报价 数据中转站
 * @author  hj
 */
// 引入数据请求API
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');
var loadNext = {
  'list': 'init',
  'search': 'search'
};
// 定义store, store可以被多个组件引用
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    type: 1,
    nowTotal: 0,
    totalSize: 0,
    tabIndex: 0,
    priceList: [],
    searchLi: [],
    getClueDetail: {
      data: {
        testList: [{
          name: '报价名称',
          key: 'quotationName',
          value: ''
        }, {
          name: '状态',
          key: 'statusText',
          activeColor: '#d61518',
          icon: '-',
          value: ''
        }, {
          name: '客户',
          key: 'customerName',
          value: ''
        }, {
          name: '商机',
          key: 'chanceName',
          value: ''
        }, {
          name: '总金额',
          key: 'amount',
          activeColor: '#d61518',
          icon: 'detail-money',
          value: ''
        }, {
          name: '过期日',
          key: 'overdueDate',
          value: ''
        }, {
          name: '销售人员',
          key: 'saler',
          value: ''
        }]
      }
    },
    getTab1: {
      data: {
        data: []
      }
    },
    ClueTransfer: {
      data: {}
    },
    productList: [],
    priceDetail: {}
  },
  scroll: {
    'list': {
      conList: [],
      hasMore: true,
      scroll: {}
    },
    'search': {
      searchLi: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'isApproved': '0',
      'q': '',
      'pageNo': 1,
      'pageSize': 10
    },
    search: {
      'isApproved': '0',
      'q': '',
      'pageNo': 1,
      'pageSize': 10
    }
  },
  /* 翻页相关*/
  setScroll: function (obj, scroll) {
    this.scroll[obj].scroll = scroll;
  },
  listRefresh: function (obj) {
    /* 刷新*/
    this.param[obj].pageNo = 1;
    this[loadNext[obj]]('refresh');
  },
  listLoadMore: function (obj) {
    /* 加载更多*/
    this.param[obj].pageNo++;
    this[loadNext[obj]]('loadMore');
  },
  // 在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.priceApproval_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          if (result.totalSize === 0) {
            self.state.nowTotal = 0;
            self.state.totalSize = 0;
            self.scroll[obj].conList = lists;
            self.scroll[obj].scroll.endPulldownToRefresh();
            self.scroll[obj].scroll.endPullupToRefresh(true);
            return;
          }
          if (loadType === 'refresh') {
            self.state.nowTotal = lists.length;
            self.state.totalSize = result.totalSize;
            self.scroll[obj].hasMore = true;
            self.scroll[obj].conList = lists;
            /* 判断是否有下一页*/
            if (lists.length < 10) {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              self.scroll[obj].hasMore = false;
              self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
            }
          } else if (loadType === 'loadMore') {
            self.scroll[obj].conList = self.scroll[obj].conList.concat(lists);
            self.state.nowTotal += lists.length;
            self.state.totalSize = result.totalSize;
            /* 判断是否有下一页*/
            if (self.scroll[obj].conList.length === result.totalSize || lists.length < 10) {
              self.scroll[obj].hasMore = false;
            }
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].conList = lists;
              self.state.nowTotal = 0;
              self.state.totalSize = 0;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.state.nowTotal = lists.length;
              self.state.totalSize = result.totalSize;
              self.scroll[obj].conList = lists;
              /* 判断是否有下一页*/
              if (lists.length < 10) {
                self.scroll[obj].hasMore = false;
                self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
              }
            }
          }
          if (loadType === 'loadMore') {
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          } else if (loadType === 'refresh') {
            if (lists.length < 10) {
              self.scroll[obj].hasMore = false;
              self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
            } else {
              self.scroll[obj].scroll.endPulldownToRefresh();
              self.scroll[obj].scroll.refresh(true);
            }
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  // 列表搜索
  search: function (loadType) {
    var self = this;
    var obj = 'search';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.priceApproval_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          if (result.totalSize === 0) {
            self.state.nowTotal = 0;
            self.state.totalSize = 0;
            self.scroll[obj].searchLi = lists;
            self.scroll[obj].scroll.endPulldownToRefresh();
            self.scroll[obj].scroll.endPullupToRefresh(true);
            return;
          }
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].searchLi = lists;
            self.state.nowTotal = lists.length;
            self.state.totalSize = result.totalSize;
            /* 判断是否有下一页*/
            if (lists.length < 10) {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              self.scroll[obj].hasMore = false;
              self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
            }
          } else if (loadType === 'loadMore') {
            self.scroll[obj].searchLi = self.scroll[obj].searchLi.concat(lists);
            self.state.nowTotal += lists.length;
            self.state.totalSize = result.totalSize;
            /* 判断是否有下一页*/
            if (self.scroll[obj].searchLi.length === result.totalSize || lists.length < 10) {
              self.scroll[obj].hasMore = false;
            }
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].searchLi = lists;
              self.state.nowTotal = 0;
              self.state.totalSize = 0;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].searchLi = lists;
              /* 当前显示数量*/
              self.state.nowTotal = lists.length;
              self.state.totalSize = result.totalSize;
              /* 判断是否有下一页*/
              if (lists.length < 10) {
                self.scroll[obj].hasMore = false;
                self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
              }
            }
          }
          if (loadType === 'loadMore') {
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          } else if (loadType === 'refresh') {
            if (lists.length < 10) {
              self.scroll[obj].hasMore = false;
              self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
            } else {
              self.scroll[obj].scroll.endPulldownToRefresh();
              self.scroll[obj].scroll.refresh(true);
            }
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },

  // 详情
  getPriceDedail: function (priceId, cb) {
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.sales_price_detail + '/' + priceId,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.priceDetail = result.data;
          for (var i = 0; i < This.state.getClueDetail.data.testList.length; i++) {
            This.state.getClueDetail.data.testList[i].value = result.data[This.state.getClueDetail.data.testList[i].key];
          }
          var lists = result.data.productList;
          var temparr = JSON.stringify(lists);
          lists = JSON.parse(temparr);
          This.state.type = result.data.status;
          for (var j = 0; j < lists.length; j++) {
            lists[j].showHide = false;
            lists[j].isEdit = false;
            // 是否可编辑数量
            lists[j].isEditCount = false;
            // 是否显示竞争对手
            lists[j].isRival = true;
            // 是否显示 竞争对手,编辑,删除
            lists[j].isOperation = true;
          }
          // 报价行数据
          This.state.productList = lists;
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert('数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  // 审批记录列表
  getApprovalsList: function (param) {
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.sales_price_detail + '/' + param.quotationId + '/approvals',
      param: param,
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.ClueTransfer.data = result.data;
        } else {
          mui.alert('数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  // 审批动作
  priceApproval: function (param, fn) {
    var This = this;
    nativeApi.initAjax({
      type: 'post',
      url: APIS.priceApproval,
      param: param,
      callback: function (result) {
        if (result && result.code === 200) {
          fn();
          This.listRefresh('list');
        } else {
          mui.alert('数据获取失败！', '提示', function () {
          });
        }
      }
    });
  }
};
