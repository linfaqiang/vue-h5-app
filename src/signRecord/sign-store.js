/**
 * @file 数据中转站
 * @author lism
 */
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');
var loadNext = {
  'list': 'getRecrds'
};
export default {
  state: {
    getData: {},
    selectLi: [],
    currentHeader: {
      title: '我的记录'
    }
  },
  scroll: {
    'list': {
      conList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'staffIds': '',
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
  // 签到记录列表
  getRecrds: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.get_sign_Record,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          self.state.getData = self.disposeData(lists);
          if (result.totalSize === 0) {
            self.state.nowTotal = 0;
            self.state.totalSize = 0;
            self.scroll[obj].conList = self.disposeData(lists);
            self.scroll[obj].scroll.endPulldownToRefresh();
            self.scroll[obj].scroll.endPullupToRefresh(true);
            return;
          }
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].conList = self.disposeData(lists);
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
            self.scroll[obj].conList = self.scroll[obj].conList.concat(self.disposeData(lists));
            self.state.nowTotal += lists.length;
            self.state.totalSize = result.totalSize;
            /* 判断是否有下一页*/
            if (self.scroll[obj].conList.length === result.totalSize || lists.length < 10) {
              self.scroll[obj].hasMore = false;
            }
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].conList = self.disposeData(lists);
              self.state.nowTotal = 0;
              self.state.totalSize = 0;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].conList = self.disposeData(lists);
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

