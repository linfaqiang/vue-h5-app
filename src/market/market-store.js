/**
 * @file  数据中转站
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
  APIS: APIS,
  state: {
    detail: {
      data: {}
    },
    searchList: [],
    images: [],
    deNum: 0,
    addressData: {
      data: {}
    },
    choose: {
      testList: [{
        name: '活动主题',
        key: 'subject',
        value: ''
      }, {
        name: '活动类型',
        key: 'activityType',
        value: ''
      }, {
        name: '举办单位',
        key: 'organizer',
        value: ''
      }, {
        name: '起始时间',
        key: 'startTime',
        value: ''
      }, {
        name: '结束时间',
        key: 'endTime',
        value: ''
      }, {
        // icon: 'crm-addr',
        name: '地址',
        key: 'address',
        value: ''
      }, {
        name: '规模',
        key: 'activitySize',
        value: ''
      }, {
        name: '目标群体',
        key: 'targetGroups',
        value: ''
      }, {
        name: '活动内容',
        key: 'content',
        value: ''
      }]
    }
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
      'pageNo': '1',
      'pageSize': '10'
    },
    search: {
      'pageNo': '1',
      'pageSize': '10',
      'q': ''
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
      url: APIS.market_list,
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
  search: function (loadType) {
    var self = this;
    var obj = 'search';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.market_list,
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
  updateAddress: function (result) {
    var self = this;
    var addressId = self.state.addressData.data.id;
    var param = {
      'createdBy': '',
      'createdOn': '',
      'updatedOn': '',
      'address': result.address,
      'country': '',
      'province': result.province,
      'city': result.city,
      'longitude': result.longitude,
      'latitude': result.latitude,
      'cityCode': '',
      'adname': result.district,
      'adcode': result.adcode,
      'startCreatedOn': '',
      'endCreatedOn': '',
      'startUpdatedOn': '',
      'endUpdatedOn': ''
    };
    nativeApi.initAjax({
      'type': 'put',
      'url': APIS.customer_update_address + '/' + addressId,
      'param': param,
      callback: function (resultData) {
        if (resultData && resultData.code === 200) {
          mui.alert('位置修改成功！', '提示');
          self.state.addressData.data = param;
          self.state.addressData.data.id = addressId;
          for (var i = 0; i < self.state.choose.testList.length; i++) {
            if (self.state.choose.testList[i].key === 'address') {
              self.state.choose.testList[i].value = result.address;
            }
          }
        } else {
          mui.alert(resultData.msg || '位置修改失败！', '提示');
        }
      }
    });
  },
  choose: function (marketId, cb) {
    console.log(APIS.market_list + '/' + marketId);
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      // isEncode: true,
      url: APIS.market_list + '/' + marketId,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.deNum++;
          self.state.images = result.data.picUrlList || [];
          self.state.addressData.data = result.data.address;
          console.log();
          var tempData = self.state.choose.testList;
          for (var i = 0; i < tempData.length; i++) {
            if (tempData[i].key === 'address') {
              tempData[i].value = result.data[tempData[i].key].address;
            } else {
              tempData[i].value = result.data[tempData[i].key];
            }
          }
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  }
};
