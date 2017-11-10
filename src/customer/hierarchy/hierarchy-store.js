/**
 * @file  关联客户数据中转站
 * @author  hj
 */
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');

/* 翻页函数 */
var loadNext = {
  'list': 'init',
  'search': 'search',
  'chance': 'chance',
  'follow': 'follow'
};

export default {
  state: {
    isParent: '',
    current: {
      currentId: 0,
      currentName: ''
    },
    searchType: '',
    lists: {
      parent: {},
      subdirectories: []
    },
    screenList: [
      {
        'itemCode': 'level',
        'itemName': '客户等级',
        'selected': true
      }
    ],
    searchData: {
      'switch': false,
      'start': '',
      'end': '',
      'area': '',
      'adcode': '',
      'employee': '',
      'employeeId': []
    }
  },
  scroll: {
    'list': {
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'search': {
      dataList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'q': '',
      'orderType': 0,
      'isSelf': 0,
      'adcode': '',
      'customerLevelIds': [],
      'startCreatedOn': '',
      'endCreatedOn': '',
      'employeeId': [],
      'staffIds': [],
      'pageNo': 1,
      'pageSize': 10
    },
    search: {
      'q': '',
      'pageNo': 1,
      'pageSize': 10,
      'urls': ''
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
  /* 在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据*/
  init: function (id, cb) {
    var self = this;
    nativeApi.initAjax({
      url: APIS.customerDetail + id + '/getCorrelation',
      param: '',
      type: 'get',
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb.call(self);
          }
          for (var attr in self.state.lists) {
            self.state.lists[attr] = result.data[attr];
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
        setTimeout(function () {
          nativeApi.loading.hide();
        }, 100);
      }
    });
  },
  search: function (loadType) {
    var self = this;
    var obj = 'search';
    nativeApi.initAjax({
      url: APIS.customerDetail + self.param.search.urls,
      param: {
        'q': self.param[obj].q,
        'pageNo': self.param[obj].pageNo,
        'pageSize': self.param[obj].pageSize
      },
      type: 'get',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.seaTotalAll = result.totalSize;
          for (var i = 0; i < result.data.length; i++) {
            if (self.state.searchType === 'parent') {
              result.data[i].checked = false;
            } else {
              result.data[i].checked = false;
              for (var j = 0; j < self.state.lists.subdirectories.length; j++) {
                if (self.state.lists.subdirectories[j].id === result.data[i].id) {
                  result.data[i].checked = true;
                }
              }
            }
          }

          self.pullList(result, loadType, obj);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  pullList: function (result, loadType, obj) {
    var lists = result.data;
    var self = this;
    if (loadType === 'refresh') {
      self.scroll[obj].hasMore = true;
      self.scroll[obj].dataList = lists;
      if (obj === 'list') {
        self.state.nowTotal = lists.length;
      } else if (obj === 'search') {
        self.state.seaTotal = lists.length;
      }
    } else if (loadType === 'loadMore') {
      if (obj !== 'follow') {
        /* 跟进记录 特殊处理*/
        self.scroll[obj].dataList = self.scroll[obj].dataList.concat(lists);
      }
      if (obj === 'list') {
        self.state.nowTotal += lists.length;
      } else if (obj === 'search') {
        self.state.seaTotal += lists.length;
      }
    } else {
      if (lists.length === 0) {
        self.scroll[obj].scroll.disablePullupToRefresh();
        self.scroll[obj].dataList = lists;
        self.state.nowTotal = 0;
      } else {
        self.scroll[obj].scroll.enablePullupToRefresh();
        self.scroll[obj].scroll.refresh(true);
        self.scroll[obj].scroll.scrollTo(0, 0, 100);
        /* 列表数据*/
        self.scroll[obj].dataList = lists;
        /* 当前显示数量*/
        if (obj === 'list') {
          self.state.nowTotal = lists.length;
        } else if (obj === 'search') {
          self.state.seaTotal = lists.length;
        }
      }
    }
    if (self.param[obj].pageNo === 1) {
      self.scroll[obj].scroll.scrollTo(0, 0, 100);
    }
    /* 判断是否有下一页*/
    var arrList = self.scroll[obj].dataList;
    if (obj === 'follow') {
      /* 跟进记录 特殊处理*/
      arrList = self.scroll[obj].originalLi;
    }
    if (lists.length < 10 || arrList.length === result.totalSize) {
      self.scroll[obj].scroll.enablePullupToRefresh();
      self.scroll[obj].hasMore = false;
      self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
    }
    if (loadType === 'loadMore') {
      self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
    } else if (loadType === 'refresh') {
      if (lists.length < 10 || lists.length === result.totalSize) {
        self.scroll[obj].hasMore = false;
        self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
      } else {
        self.scroll[obj].scroll.endPulldownToRefresh();
        self.scroll[obj].scroll.refresh(true);
      }
    }
  },
  setCustomers: function (opt, cb) {
    var self = this;
    nativeApi.initAjax({
      url: APIS.customerDetail + 'updateCustomerCorrelationChart',
      param: opt,
      type: 'put',
      callback: function (result) {
        if (result && result.code === 200) {
          mui.alert('修改成功！', '提示', function () {
            if (typeof cb === 'function') {
              cb.call(self);
            }
          });
        } else {
          mui.alert(result.msg || '修改失败！', '提示', function () {
          });
        }
      }
    });
  },
  removeCustomers: function (id, cb) {
    nativeApi.initAjax({
      url: APIS.customerDetail + id + '/removeCustomerCorrelationChart',
      param: '',
      type: 'put',
      callback: function (result) {
        if (result && result.code === 200) {
          mui.alert('修改成功！', '提示');
          if (typeof cb === 'function') {
            cb.call(self);
          }
        } else {
          mui.alert(result.msg || '修改失败！', '提示', function () {
          });
        }
      }
    });
  }
};
