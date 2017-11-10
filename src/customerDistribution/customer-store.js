/* *
 * @file 客户数据中转站
 * @author hj
 */
// 引入数据请求API
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');

var loadNext = {
  'list': 'init',
  'search': 'search',
  'follow': 'follow',
  'chance': 'chance'
};

export default {
  state: {
    detailData: {},
    tabIndex: 0,
    contactList: [],
    personDeptArr: []
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
    },
    'chance': {
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'follow': {
      originalLi: [],
      dataList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'q': '',
      'pageNo': 1,
      'pageSize': 10
    },
    search: {
      'q': '',
      'pageNo': 1,
      'pageSize': 10
    },
    chance: {
      'pageNo': 1,
      'pageSize': 10
    },
    follow: {
      'pageNo': 0,
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
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.distribution,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.totalSize = result.totalSize;
          self.pullList(result, loadType, obj);
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
  search: function (loadType) {
    var self = this;
    var obj = 'search';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.distribution,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.seaTotalAll = result.totalSize;
          self.pullList(result, loadType, obj);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  follow: function (loadType, cb) {
    var self = this;
    var obj = 'follow';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.customer_follow.replace('{id}', self.state.detailData.id),
      param: self.param.follow,
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          var dataList = [];
          if (loadType === 'loadMore') {
            self.scroll.follow.originalLi = self.scroll.follow.originalLi.concat(lists);
          } else {
            self.scroll.follow.originalLi = lists;
          }
          dataList = self.disposeData(self.scroll.follow.originalLi);
          result.data = dataList;
          self.pullList(result, loadType, obj);
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  chance: function (loadType) {
    var self = this;
    var obj = 'chance';
    nativeApi.initAjax({
      'type': 'get',
      url: APIS.customerDetail + self.state.detailData.id + '/chances',
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            if (self.state.selectId === lists[i].id) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          result.data = lists;
          self.pullList(result, loadType, obj);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  getDetail: function (id, cb) {
    var self = this;
    id = id || self.state.detailData.id;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.customerDetail + id,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.detailData = result.data;
          self.scroll.follow.originalLi = result.data.tracks || [];
          self.scroll.follow.dataList = self.disposeData(result.data.tracks || []);
          self.state.contactList = [];
          /* 设置是否有下一页 */
          setTimeout(function () {
            self.setFollowScroll();
          }, 100);
          if (typeof cb === 'function') {
            cb();
            self.scroll.chance.dataList = [];
            self.state.contactList = [];
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  setFollowScroll: function () {
    var self = this;
    var obj = 'follow';
    var lists = this.scroll[obj].originalLi;
    if (lists.length < 10) {
      self.scroll[obj].scroll.enablePullupToRefresh();
      if (self.param[obj].pageNo === 0) {
        self.scroll[obj].scroll.scrollTo(0, 0, 100);
      }
      self.scroll[obj].hasMore = false;
      self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
    }
  },
  contact: function (cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.customer_contact.replace('{id}', self.state.detailData.id),
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.contactList = result.data || [];
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
  // 获取分配 部门或人员列表
  getDistributeList: function (q, cb) {
    var mainBelongDeptId = parseInt(window.loginInfo.data.mainBelongDeptId);
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.detpStaffs + mainBelongDeptId + '/subordinates',
      param: {'q': q},
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          var personDeptArr = [];
          for (var i = 0; i < lists.length; i++) {
            lists[i].selected = false;
            personDeptArr.push(lists[i]);
          }
          self.state.personDeptArr = personDeptArr;
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示');
        }
      }
    });
  },
  distributionCustomer: function (param, fn) {
    var self = this;
    nativeApi.initAjax({
      type: 'post',
      url: APIS.custormer_distribute + self.state.detailData.id + '/assignto',
      param: param,
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof fn === 'function') {
            fn();
          }
        } else {
          mui.alert(result.msg || '请求失败！', '提示', function () {
          });
        }
      }
    });
  },
  disposeData: function (listData) {
    var ele = [];
    var yearMonth = '';
    var list = [];
    var bl = false;
    var self = this;
    for (var i = 0; i < listData.length; i++) {
      var dataEle = listData[i];
      var str = dataEle.createdOn.split(' ');
      var strData = str[0];
      dataEle.time = str[1];
      if (strData !== yearMonth) {
        if (bl) {
          var dateTi = yearMonth;
          if (yearMonth === self.getToday()) {
            dateTi = '今天';
          }
          ele.push({
            date: dateTi,
            list: list
          });
          bl = false;
        }
        list = [];
        yearMonth = strData;

        list.push(dataEle);
        bl = true;
      } else {
        list.push(listData[i]);
      }
      if (i === (listData.length - 1)) {
        ele.push({
          date: strData,
          list: list
        });
      }
    }
    return ele;
  },
  getToday: function () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    return year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((day < 10) ? ('0' + day) : day);
  }
};
