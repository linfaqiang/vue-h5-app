/* *
 * @file 线索数据中转站
 * @author lism
 */
var nativeApi = require('nativeApi');
import {APIS} from 'configPort';
var selectUrl = {
  'source': APIS.data_wordbook + 'DictClueSource',
  'sourceTxt': APIS.data_wordbook + 'DictClueSource',
  'chanceType': APIS.data_wordbook + 'DictStageType',
  'chanceStage': APIS.data_wordbook + 'DictStage' + '?stageTypeId='
};
var loadNext = {
  'list': 'init',
  'search': 'search',
  'customer': 'customer',
  'person': 'person'
};
export default {
  APIS: APIS,
  state: {
    showStuas: {
      text: '暂未处理'
    },
    //  选择客户等级和行业类别
    getChooce: {
      data: [],
      grade: '',
      sectors: '',
      gradeId: '',
      sectorsId: ''
    },
    currentHeader: {
      title: '我的线索',
      btns: '保存'
    },
    clueData: {
      data: {}
    },
    clusId: '',
    chanceData: {
      'chanceType': '',
      'chanceTypeId': 0,
      'chanceStage': '',
      'chanceStageId': 0,
      'address': {},
      'customer': {
        'id': '',
        'name': '',
        'email': '',
        'postCode': '',
        'url': '',
        'customerLevelId': '',
        'industryId': '',
        'ceoName': '',
        'telephone': '',
        'employeesTotal': '',
        'shortname': '',
        'annualIncome': '',
        'remark': '',
        'sourceId': 0,
        'fromEntityType': ''
      },
      'chance': {
        'hasRepeat': '',
        'chanceName': '',
        'chanceSourceId': 1,
        'description': '',
        'chanceStageId': 1,
        'successRatio': 0,
        'status': 0,
        'forecastAmount': '',
        'extimateDealDate': '',
        'isColsed': 0,
        'closeReason': '',
        'dealAmount': '',
        'dealDate': '',
        'sourceId': 0,
        'fromEntityType': ''
      },
      'custLinkman': {
        'customerId': '',
        'name': '',
        'title': '',
        'mobile': ''
      }
    },
    getClueDetail: {
      data: {
        testList: [{
          name: '客户名',
          key: 'customerName',
          value: ''
        }, {
          name: '需求',
          key: 'needs',
          isB: true,
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
          name: '来源',
          key: 'sourceTxt',
          ok: true,
          value: ''
        }, {
          name: '责任人',
          key: 'ownerStaffName',
          value: ''
        }]
      }
    },
    getCustomer: {
      data: {}
    },
    getSource: {
      data: {}
    },
    getTab1: {
      data: []
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
    selectLi: [],
    selectTitle: '',
    actData: {},
    addData: {
      'customerId': '',
      'customerName': '',
      'addType': '',
      'needs': '',
      'remark': '',
      'status': 1,
      'sourceId': 0,
      'source': '',
      'fromEntityType': '',
      'inputSource': 0,
      'address': {
        'address': '',
        'country': '',
        'province': '',
        'city': '',
        'cityCode': '',
        'adname': '',
        'adcode': '',
        'longitude': '',
        'latitude': ''
      },
      'linkman': {
        'name': '',
        'mobile': '',
        'telephone': ''
      }
    },
    searchList: [],
    detailData: {},
    editData: {},
    addressData: {
      data: {}
    },
    todyClues: {
      numbers: 0
    },
    RecordDedail: {
      data: {
        address: {}
      }
    },
    clueId: '',
    isCc: false,
    recordDetail: {
      data: {
        'trackContent': '',
        'clueId': '',
        'address': {
          'address': '',
          'country': '',
          'province': '',
          'city': '',
          'cityCode': '',
          'adname': '',
          'adcode': '',
          'longitude': '',
          'latitude': ''
        }
      }
    },
    personDeptArr: []
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
    'customer': {
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'person': {
      dataList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'q': '',
      'isEncrypt': 0,
      'type': 1,
      'staffId': '',
      'pageNo': 1,
      'pageSize': 10
    },
    search: {
      'q': '',
      'isEncrypt': 0,
      'type': 1,
      'isSelf': 0,
      'staffId': '',
      'pageNo': 1,
      'pageSize': 10
    },
    customer: {
      'q': '',
      'isEncrypt': 0,
      'isSelf': 0,
      'pageNo': 1,
      'pageSize': 10
    },
    person: {
      'q': '',
      'pageNo': 1,
      'pageSize': 20
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
      url: APIS.myClue,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          if (result.totalSize === 0) {
            self.scroll[obj].conList = lists;
            self.scroll[obj].scroll.endPulldownToRefresh();
            self.scroll[obj].scroll.endPullupToRefresh(true);
            return;
          }
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].conList = lists;
            /* 判断是否有下一页*/
            if (lists.length < 10 || self.scroll[obj].conList.length === result.totalSize) {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              self.scroll[obj].hasMore = false;
              self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
            }
          } else if (loadType === 'loadMore') {
            self.scroll[obj].conList = self.scroll[obj].conList.concat(lists);
            /* 判断是否有下一页*/
            if (self.scroll[obj].conList.length === result.totalSize || lists.length < 10) {
              self.scroll[obj].hasMore = false;
            }
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].conList = lists;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].conList = lists;
              /* 判断是否有下一页*/
              if (lists.length < 10 || self.scroll[obj].conList.length === result.totalSize) {
                self.scroll[obj].hasMore = false;
                self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
              }
            }
          }
          if (loadType === 'loadMore') {
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          } else if (loadType === 'refresh') {
            if (lists.length < 10 || self.scroll[obj].conList.length === result.totalSize) {
              self.scroll[obj].hasMore = false;
              self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
            } else {
              self.scroll[obj].scroll.endPulldownToRefresh();
              self.scroll[obj].scroll.refresh(true);
            }
          }
          self.getTodyClue();
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
      url: APIS.myClue,
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
            if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
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
            if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
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
              if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
                self.scroll[obj].hasMore = false;
                self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
              }
            }
          }
          if (loadType === 'loadMore') {
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          } else if (loadType === 'refresh') {
            if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
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
  customer: function (loadType) {
    var self = this;
    var obj = 'customer';
    nativeApi.initAjax({
      url: APIS.customer,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          if (lists.length === 0) {
            lists.push({
              'id': '',
              'name': self.param[obj].q
            });
          } else {
            for (var i = 0; i < lists.length; i++) {
              if (self.state.selectId === lists[i].id) {
                lists[i].selected = true;
              } else {
                lists[i].selected = false;
              }
            }
          }
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].dataList = lists;
          } else if (loadType === 'loadMore') {
            self.scroll[obj].dataList = self.scroll[obj].dataList.concat(lists);
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].dataList = lists;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].dataList = lists;
              /* 当前显示数量*/
              self.state.seaTotal = lists.length;
              self.state.seaTotalAll = result.totalSize;
            }
          }
          if (self.param[obj].pageNo === 1) {
            self.scroll[obj].scroll.scrollTo(0, 0, 100);
          }
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
            self.scroll[obj].scroll.enablePullupToRefresh();
            self.scroll[obj].hasMore = false;
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
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
      }
    });
  },
  tabSearch: function (type) {
    // type 请求类型
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: './clue-list.json',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.data.conList = result.data;
          var lists = result.data;
          var conLists = [];
          for (var i = 0; i < lists.length; i++) {
            if (type === 3) {
              conLists.push(lists[i]);
              conLists = conLists.reverse();
            } else {
              conLists.push(lists[i]);
            }
          }
          self.state.data.conList = conLists;
        }
      }
    });
  },
  staffClues: function (type) {
    // type 请求类型
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: './clue-list.json',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.data.conList = result.data;
          var lists = result.data;
          var conLists = [];
          for (var i = 0; i < lists.length; i++) {
            conLists.push(lists[i]);
          }
          self.state.data.conList = conLists;
        }
      }
    });
  },
  // 获取今日新增数
  getTodyClue: function () {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.clue + '/staff/new',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.todyClues.numbers = result.data;
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  //  线索详情
  getClueDedail: function (clueId, cb) {
    this.state.clueId = clueId;
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.clue + '/' + clueId,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.detailData = result.data;
          This.state.addressData.data = result.data.address;
          var tempData = This.state.getClueDetail.data.testList;
          for (var i = 0; i < tempData.length; i++) {
            if (tempData[i].key === 'address') {
              tempData[i].value = result.data[tempData[i].key].address;
            } else if (tempData[i].key === 'name') {
              tempData[i].value = result.data.linkman.name;
            } else if (tempData[i].key === 'mobile') {
              tempData[i].value = result.data.linkman.mobile || result.data.linkman.telephone;
            } else {
              tempData[i].value = result.data[tempData[i].key];
            }
          }
          This.getDedailTab1();
          if (typeof cb === 'function') {
            cb();
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
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  // 跟进记录列表  在详情返回  可能不用
  getDedailTab1: function (id) {
    var This = this;
    id = id || this.state.detailData.id;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.clue + '/' + id + '/tracks',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var recordList = result.data;
          This.state.getTab1.data = This.disposeData(recordList);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  // 跟进记录详情
  getRecordDedail: function (id) {
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.clueTracks + '/' + id,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          result.data.trackContent = nativeApi.replaceAllCh(result.data.trackContent, 1);
          This.state.RecordDedail.data = result.data;
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  // 详情联系人列表
  getContactList: function (clueId) {
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.clue + '/' + clueId + '/linkman?',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.getContacts.data = result.data;
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
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
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },

  //  保存新建线索排重
  save_clue_add: function (fn1, fn2) {
    var self = this;
    var param = self.state.addData;
    param.hasRepeat = '';
    param.remark = nativeApi.replaceAllCh(param.remark);
    nativeApi.initAjax({
      'type': 'post',
      'url': APIS.clue,
      'param': param,
      callback: function (result) {
        if (result && result.code === 200 && result.data[0].hasRepeat === 'none') {
          setTimeout(function () {
            fn1(result);
            if (!window.initPage) {
              self.listRefresh('list');
            }
          }, 50);
        } else if (result && result.code === 200) {
          setTimeout(function () {
            fn2(result.data);
          }, 50);
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  //  保存新建线索提交
  save_clue_add_commit: function (fn1, fn2) {
    var self = this;
    var param = self.state.addData;
    param.hasRepeat = '1';
    nativeApi.initAjax({
      'type': 'post',
      'url': APIS.clue,
      'param': param,
      callback: function (result) {
        if (result && result.code === 200) {
          setTimeout(function () {
            fn1(result);
            self.listRefresh('list');
          }, 50);
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  selectFn: function (obj, selectId, title, cb) {
    var self = this;
    var chanceId = self.state.chanceData.chanceTypeId || 0;
    nativeApi.initAjax({
      type: 'get',
      url: obj === 'chanceStage' ? selectUrl[obj] + chanceId : selectUrl[obj],
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = self.state.selectLi = result.data;
          for (var i = 0; i < lists.length; i++) {
            var id = lists[i].id || lists[i].itemCode;
            if (id === selectId) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          self.state.selectLi = lists;
          self.state.selectTitle = '选择' + title;
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
  updateField: function (field, value, type) {
    var self = this;
    if (type === 'add') {
      if (field === 'chanceType' || field === 'chanceTypeId') {  // 区别'商机类型',因为'商机类型'不在addData里面
        self.state.chanceData[field] = value;
        self.state.chanceData.chanceStage = '';
        self.state.chanceData.chanceStageId = '';
      } else if (field === 'chanceStage' || field === 'chanceStageId') {
        self.state.chanceData[field] = value;
      } else {
        self.state.addData[field] = value;
      }
    } else if (type === 'edit') {
      self.state.editData[field] = value;
    } else if (type === 'chance') {
      /* 转商机 */
      self.state.chanceData.customer.id = value.id;
      self.state.chanceData.customer.name = value.name;
    }
  },
  // 线索编辑
  setEdit: function (cb) {
    var detail = this.state.detailData;
    this.state.editData = {
      'id': detail.id,
      'customerId': detail.customerId,
      'customerName': detail.customerName,
      'needs': detail.needs,
      'sourceId': detail.sourceId,
      'source': detail.sourceTxt,
      'address': {
        'id': detail.address.id,
        'address': detail.address.address,
        'country': detail.address.country,
        'province': detail.address.province,
        'city': detail.address.city,
        'cityCode': detail.address.cityCode,
        'adname': detail.address.adname,
        'adcode': detail.address.adcode,
        'longitude': detail.address.longitude,
        'latitude': detail.address.latitude
      },
      'linkman': {
        'id': detail.linkman.id,
        'name': detail.linkman.name,
        'mobile': detail.linkman.mobile,
        'telephone': detail.linkman.telephone,
        'title': detail.linkman.title
      }
    };
    cb();
  },
  // 保存编辑
  saveEdit: function (cb) {
    var self = this;
    var param = self.state.editData;
    var id = param.id;
    nativeApi.initAjax({
      type: 'put',
      url: APIS.clue + '/' + id,
      param: {
        'customerId': param.customerId,
        'customerName': param.customerName,
        'needs': param.needs,
        'remark': nativeApi.replaceAllCh(param.remark),
        'sourceId': param.sourceId,
        'address': param.address,
        'linkman': param.linkman
      },
      callback: function (result) {
        if (result && result.code === 200) {
          self.getClueDedail(id);
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  detail: function () {
    var clueDetail = this.state.detailData;
    this.state.chanceData = {
      'chanceType': '',
      'chanceTypeId': 0,
      'chanceStage': '',
      'chanceStageId': 0,
      'address': clueDetail.address,
      'customer': {
        'id': clueDetail.customerId,
        'name': clueDetail.customerName,
        'email': '',
        'postCode': '',
        'url': '',
        'customerLevelId': '',
        'industryId': '',
        'ceoName': '',
        'telephone': clueDetail.linkman.mobile,
        'employeesTotal': '',
        'shortname': '',
        'annualIncome': '',
        'remark': clueDetail.needs,
        'sourceId': 0,
        'fromEntityType': 'CLUS'
      },
      'chance': {
        'chanceName': '',
        'chanceSourceId': 1,
        'description': '',
        'chanceStageId': 1,
        'successRatio': 0,
        'status': 0,
        'forecastAmount': '',
        'extimateDealDate': '',
        'isColsed': 0,
        'closeReason': '',
        'dealAmount': '',
        'dealDate': '',
        'sourceId': 0,
        'fromEntityType': 'CLUS'
      },
      'custLinkman': {
        'customerId': clueDetail.linkman.id,
        'name': clueDetail.linkman.name,
        'title': clueDetail.linkman.title,
        'mobile': clueDetail.linkman.mobile
      }
    };
  },
  // 申请转商机 - 新建商机
  saveAddChance: function (clueId, cb) {
    var self = this;
    var chance = this.state.chanceData;
    if (!chance.chance.chanceName) {
      mui.alert('请输入机会名称！', '提示');
      return;
    }
    if (!chance.customer.name) {
      mui.alert('请输入客户名称！', '提示');
      return;
    }
    if (!chance.custLinkman.name) {
      mui.alert('请输入联系人！', '提示');
      return;
    }
    if (!chance.chanceType) {
      mui.alert('请选择商机类型！', '提示');
      return;
    }
    if (!chance.chanceStage) {
      mui.alert('请选择商机阶段！', '提示');
      return;
    }
    self.state.chanceData.customer.sourceId = self.state.clusId;
    self.state.chanceData.chance.sourceId = self.state.clusId;
    var params = {
      'address': self.state.chanceData.address,
      'customer': self.state.chanceData.customer,
      'chance': self.state.chanceData.chance,
      'custLinkman': self.state.chanceData.custLinkman
    };
    params.chance.stageTypeId = self.state.chanceData.chanceTypeId;
    params.chance.chanceStageId = self.state.chanceData.chanceStageId;
    nativeApi.initAjax({
      'type': 'post',
      'url': APIS.clue + '/' + clueId + '/to_chance',
      'param': params,
      callback: function (result) {
        if (result && result.code === 200) {
          var linkman = result.data;
          if (typeof cb === 'function') {
            cb(result.data[0].hasRepeat, linkman);
          }
        } else {
          mui.alert(result.msg || '保存失败！', '提示');
        }
      }
    });
  },
  saveAdd: function (clueId, flag) {
    this.state.chanceData.customer.sourceId = this.state.clusId;
    this.state.chanceData.chance.sourceId = this.state.clusId;
    this.state.chanceData.chance.hasRepeat = 1;
    var params = {};
    if (flag) {
      params = {
        'address': this.state.chanceData.address,
        'chance': this.state.chanceData.chance,
        'chanceType': this.state.chanceData.chanceType,
        'chanceTypeId': this.state.chanceData.chanceTypeId,
        'custLinkman': this.state.chanceData.custLinkman,
        'customer': this.state.chanceData.customer,
        'hasRepeat': 1
      };
    } else {
      params = this.state.chanceData;
    }
    nativeApi.initAjax({
      'type': 'post',
      'url': APIS.clue + '/' + clueId + '/to_chance',
      'param': params,
      callback: function (result) {
        if (result && result.code === 200) {
          mui.alert('商机新建成功', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative();
            } else {
              history.go(-2);
            }
          });
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  // 获取分配 部门或人员列表
  getDistributeList: function (cb) {
    var q = '';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.detpOrStaffList + 'subordinates',
      param: {'q': q},
      callback: function (result) {
        if (result && result.code === 200) {
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
  checkTel: function (tel) {
    var mobile = /^1[3|4|5|6|7|8|9]\d{9}$/;
    var phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(tel) || phone.test(tel);
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
  cleanAdd: function (result) {
    var self = this;
    self.state.addData.customerName = result.company;
    self.state.addData.linkman.name = result.name;
    self.state.addData.linkman.mobile = result.telephone || result.mobile;
  },
  select: function () {
    nativeApi.initAjax({
      type: 'get',
      url: APIS.data_wordbook,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {

        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
// 保存跟进记录
  saveRecord: function (fn) {
    var self = this;
    var param = self.state.recordDetail.data;
    param.clueId = self.state.detailData.id;
    param.trackContent = nativeApi.replaceAllCh(param.trackContent);
    nativeApi.initAjax({
      url: APIS.clueTracks,
      method: 'POST',
      param: param,
      callback: function (result) {
        if (result && result.code === 200) {
          fn();
        } else {
          mui.alert(result.msg || '请求失败！', '提示');
        }
      }
    });
  },
  person: function (loadType) {
    var self = this;
    var obj = 'person';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.person_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data || [];
          var personList = [
            {
              'id': '',
              'name': '公共资源池',
              'selected': true
            }
          ];
          for (var i = 0; i < lists.length; i++) {
            lists[i].selected = false;
            personList.push(lists[i]);
          }
          if (!loadType || loadType === 'refresh') {
            lists = personList;
          }
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].dataList = lists;
          } else if (loadType === 'loadMore') {
            self.scroll[obj].dataList = self.scroll[obj].dataList.concat(lists);
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].dataList = lists;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].dataList = lists;
              /* 当前显示数量*/
              self.state.seaTotal = lists.length;
              self.state.seaTotalAll = result.totalSize;
            }
          }
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].dataList === result.totalSize) {
            self.scroll[obj].scroll.enablePullupToRefresh();
            if (self.param[obj].pageNo === 0) {
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
            }
            self.scroll[obj].hasMore = false;
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
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
      }
    });
  },
  transferFn: function (param, cb) {
    /* 线索转移 */
    var self = this;
    nativeApi.initAjax({
      url: APIS.clue + '/' + self.state.detailData.id + '/assignto',
      method: 'POST',
      param: param,
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '线索转移失败！', '提示');
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
