/* *
 * @file 线索池数据中转站
 * @author hj
 */
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');
var loadNext = {
  'list': 'init',
  'search': 'search'
};
export default {
  state: {
    list: {
      conList: [],
      hasmore: true,
      scroll: {}
    },
    // 选择客户等级和行业类别
    getChooce: {
      data: [],
      grade: '',
      sectors: '',
      gradeId: '',
      sectorsId: ''
    },
    getClueDetail: {
      data: {
        testList: [{
          name: '来源',
          key: 'sourceTxt',
          ok: true,
          value: ''
        }, {
          name: '客户名',
          key: 'customerName',
          value: ''
        }, {
          name: '联系人',
          key: 'name',
          value: ''
        }, {
          icon: 'crm-phone',
          name: '联系方式',
          key: 'mobile',
          activeColor: '-',
          href: '/choose/source',
          value: ''
        }, {
          icon: 'crm-addr',
          name: '地址',
          key: 'address',
          ok: true,
          isB: true,
          value: ''
        }, {
          name: '需求',
          key: 'needs',
          isB: true,
          value: ''
        }]
      }
    },
    getCustomer: {
      data: {}
    },

    getTab1: {
      data: {
        data: []
      }
    },
    data: {
      conList: {}
    },
    getContacts: {
      data: {}
    },
    ClueTransfer: {
      data: {}
    },
    searchList: [],
    addressData: {
      data: {}
    },
    isCc: false
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
    },
    'product': {
      productAddList: [],
      hasMore: true,
      scroll: {}
    },
    'rival': {
      rivalAddList: [],
      hasMore: true,
      scroll: {}
    },
    'customer': {
      customerLi: [],
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
      url: APIS.clue_pool_lists,
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
            self.scroll[obj].hasMore = true;
            self.scroll[obj].conList = lists;
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
              self.scroll[obj].conList = lists;
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
  // 列表搜索
  search: function (loadType) {
    var self = this;
    var obj = 'search';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.clue_pool_lists,
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

  // 获取线索详情
  getClueDedail: function (clueId) {
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.clue + '/' + clueId,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.addressData.data = result.data.address;
          var tempData = This.state.getClueDetail.data.testList;
          for (var i = 0; i < tempData.length; i++) {
            if (tempData[i].key === 'address') {
              tempData[i].value = result.data[tempData[i].key].address;
            } else if (tempData[i].key === 'name') {
              tempData[i].value = result.data.linkman.name;
            } else if (tempData[i].key === 'mobile') {
              tempData[i].value = result.data.linkman.mobile;
            } else {
              tempData[i].value = result.data[tempData[i].key];
            }
          }
          var recordList = result.data.tracks;
          for (var j = 0; j < recordList.length; j++) {
            recordList[j].trackContent = nativeApi.replaceAllCh(recordList[j].trackContent, 1);
          }
          // 跟进记录列表
          This.state.getTab1.data.data = This.disposeData(recordList);
          setTimeout(function () {
            var ele = document.getElementById('sliderSegmentedControl').getElementsByTagName('a');
            for (var m = 0; m < ele.length; m++) {
              var className = ele[m].getAttribute('class');
              if (m !== 0 && className.indexOf('mui-active') > -1) {
                This.state.isCc = true;
              }
              if (m === 0) {
                ele[m].setAttribute('class', 'mui-control-item mui-control-item-e mui-active');
              } else {
                ele[m].setAttribute('class', 'mui-control-item mui-control-item-e');
              }
            }
            var item1Ele = document.getElementById('item1mobile');
            var item2Ele = document.getElementById('item2mobile');
            var item3Ele = document.getElementById('item3mobile');
            item1Ele.parentNode.setAttribute('style', 'transform: translate3d(0px, 0px, 0px) translateZ(0px);');
            className = item1Ele.getAttribute('class');
            if (!(className && className.indexOf('mui-active') > -1)) {
              className += ' mui-active';
            }
            item1Ele.setAttribute('class', className);
            className = item2Ele.getAttribute('class');
            if (className && className.indexOf('mui-active') > -1) {
              className = className.replace('mui-active', '');
            }
            item2Ele.setAttribute('class', className);
            className = item3Ele.getAttribute('class');
            if (className && className.indexOf('mui-active') > -1) {
              className = className.replace('mui-active', '');
            }
            item3Ele.setAttribute('class', className);
          }, 10);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  // 详情联系人列表
  getContacts: function (clueId) {
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.clue + '/' + clueId + '/linkman?userId=' + 3,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.getContacts.data = result.data;
        }
      }
    });
  },

  // 详情转移记录列表
  getClueTransfers: function (clueId) {
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.clue + '/' + clueId + '/assign_histories?',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.ClueTransfer.data = result.data;
        }
      }
    });
  },

  // 抢单
  pick: function (clueId, fn) {
    nativeApi.initAjax({
      type: 'put',
      url: APIS.clue + '/' + clueId + '/pick?',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          fn();
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  // 详情地图纠偏
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
          for (var i = 0; i < self.state.getClueDetail.data.testList.length; i++) {
            if (self.state.getClueDetail.data.testList[i].key === 'address') {
              self.state.getClueDetail.data.testList[i].value = result.address;
            }
          }
        } else {
          mui.alert(resultData.msg || '位置修改失败！', '提示');
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
      var str = dataEle.trackOn.split(' ');
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
