/* *
 * 商机 数据中转站
 * 2016-11-14
 * hj
 */
// 引入数据请求API
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');

var selectListArr = [
  {
    'itemCode': '0',
    'itemName': '按跟进时间'
  },
  {
    'itemCode': '1',
    'itemName': '按创建时间'
  },
  {
    'itemCode': '2',
    'itemName': '按预测金额'
  },
  {
    'itemCode': '3',
    'itemName': '按预成交日'
  }
];
/* 选择项接口*/
var selectUrl = {
  'customer': APIS.customer,
  'stage': APIS.data_wordbook + 'DictStage',
  'chanceStage': APIS.data_wordbook + 'DictStage' + '?stageTypeId={id}',
  'status': [
    {
      'id': '0',
      'name': '预备'
    },
    {
      'id': '1',
      'name': '进行中'
    },
    {
      'id': '2',
      'name': '暂挂'
    },
    {
      'id': '3',
      'name': '赢单'
    },
    {
      'id': '4',
      'name': '丢单'
    },
    {
      'id': '5',
      'name': '取消'
    }
  ],
  'status_add': [
    {
      'id': '0',
      'name': '预备'
    },
    {
      'id': '1',
      'name': '进行中'
    },
    {
      'id': '2',
      'name': '暂挂'
    }
  ],
  'statusText': [
    {
      'id': '0',
      'name': '未开始'
    },
    {
      'id': '1',
      'name': '进行中'
    },
    {
      'id': '2',
      'name': '已完成'
    }
  ],
  'successRatio': [
    {
      'id': '0',
      'name': '0'
    },
    {
      'id': '10',
      'name': '10'
    },
    {
      'id': '25',
      'name': '25'
    },
    {
      'id': '50',
      'name': '50'
    },
    {
      'id': '90',
      'name': '90'
    },
    {
      'id': '100',
      'name': '100'
    }
  ],
  'productType': APIS.data_wordbook + 'DictProductType',
  'closeReason': [
    {
      'id': '0',
      'name': '我方签单'
    },
    {
      'id': '1',
      'name': '项目丢单'
    },
    {
      'id': '2',
      'name': '项目取消'
    }
  ],
  'chanceType': APIS.data_wordbook + 'DictStageType'
};
/* 翻页函数*/
var loadNext = {
  'list': 'init',
  'search': 'search',
  'rival': 'rivalList',
  'product': 'productList',
  'customer': 'customer',
  'follow': 'follow'
};

// 定义store, store可以被多个组件引用
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    stageCheckedList: [],
    nowTotal: 0,
    totalSize: 0,
    selectId: '',
    selectList: [],
    selectList2: [],
    selectList3: [],
    selectLi: [],
    selectTitle: '',
    screenList: [
      {
        'itemCode': 'chanceType',
        'itemName': '类型',
        'selected': false
      },
      {
        'itemCode': 'status',
        'itemName': '状态',
        'selected': false
      }
    ],
    searchData: {
      'switch': false,
      'start': '',
      'end': '',
      'customerId': '',
      'customer': '',
      'employee': '',
      'employeeId': []
    },
    addData: {
      'chanceName': '',
      'customer': '',
      'customerId': '',
      'description': '',
      'chanceSourceId': '0',
      'chanceStage': '',
      'chanceStageId': '',
      'status': '',
      'statusId': '',
      'successRatio': '',
      'successRatioId': '',
      'forecastAmount': '',
      'extimateDealDate': '',
      'formOther': false,
      'chanceType': '',
      'sourceId': 0,
      'fromEntityType': ''
    },
    searchLi: [],
    seaTotal: 0,
    seaTotalAll: 0,
    detailData: {},
    followList: [],
    taskList: [],
    productList: [],
    salesPriceList: [],
    contactList: [],
    teamList: [],
    mainOwner: {},
    teamAddList: [],
    rivalList: [],
    rivalForm: '',
    goodBadData: {},
    contactAddList: [],
    arrIndexed: [],
    stageList: [],
    stageEdit: {},
    stageTaskList: [],
    editData: {},
    productType: {},
    isLeader: {
      isAjax: false,
      flag: false
    },
    stageTask: {
      taskName: '',
      successRatio: '',
      remark: ''
    }
  },
  scroll: {
    'list': {
      chanceList: [],
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
    },
    'follow': {
      originalLi: [],
      followLi: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'q': '',
      'isEncrypt': 0,
      'orderType': 0,
      'isOwner': 0,
      'stageList': [],
      'statusList': [],
      'startCreatedOn': '',
      'endCreatedOn': '',
      'customerId': '',
      'staffList': [],
      'pageNo': 1,
      'pageSize': 10
    },
    search: {
      'q': '',
      'isEncrypt': 0,
      'orderType': 0,
      'isOwner': 0,
      'stageList': [],
      'statusList': [],
      'startCreatedOn': '',
      'endCreatedOn': '',
      'customerId': '',
      'staffList': [],
      'pageNo': 1,
      'pageSize': 10
    },
    product: {
      'q': '',
      'chanceId': '',
      'productTypeId': '',
      'pageNo': 1,
      'pageSize': 10
    },
    rival: {
      'q': '',
      'chanceId': '',
      'chanceProductId': '',
      'pageNo': 1,
      'pageSize': 10
    },
    customer: {
      'q': '',
      'isEncrypt': 0,
      'isSelf ': 0,
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
  /* 在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据*/
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      url: APIS.chance_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.totalSize = result.totalSize;
          self.pullList(result, loadType, 'chanceList', obj);
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
  pullList: function (result, loadType, field, obj) {
    var lists = result.data;
    var self = this;
    if (loadType === 'refresh') {
      self.scroll[obj].hasMore = true;
      self.scroll[obj][field] = lists;
      if (obj === 'list') {
        self.state.nowTotal = lists.length;
      } else if (obj === 'search') {
        self.state.seaTotal = lists.length;
      }
    } else if (loadType === 'loadMore') {
      if (obj !== 'follow') {
        /* 跟进记录 特殊处理*/
        self.scroll[obj][field] = self.scroll[obj][field].concat(lists);
      }
      if (obj === 'list') {
        self.state.nowTotal += lists.length;
      } else if (obj === 'search') {
        self.state.seaTotal += lists.length;
      }
    } else {
      if (lists.length === 0) {
        self.scroll[obj].scroll.disablePullupToRefresh();
        self.scroll[obj][field] = lists;
        self.state.nowTotal = 0;
      } else {
        self.scroll[obj].scroll.enablePullupToRefresh();
        self.scroll[obj].scroll.refresh(true);
        self.scroll[obj].scroll.scrollTo(0, 0, 100);
        /* 列表数据*/
        self.scroll[obj][field] = lists;
        /* 当前显示数量*/
        if (obj === 'list') {
          self.state.nowTotal = lists.length;
        } else if (obj === 'search') {
          self.state.seaTotal = lists.length;
        }
      }
    }
    /* 判断是否有下一页*/
    var arrList = self.scroll[obj][field];
    if (obj === 'follow') {
      /* 跟进记录 特殊处理*/
      arrList = self.scroll[obj].originalLi;
    }
    if (self.param[obj].pageNo === 1) {
      self.scroll[obj].scroll.scrollTo(0, 0, 100);
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
      url: APIS.chance_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.seaTotalAll = result.totalSize;
          self.pullList(result, loadType, 'searchLi', obj);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  cleanAdd: function () {
    var data = this.state.addData;
    for (var key in data) {
      data[key] = '';
    }
    data.status = '预备';
    data.statusId = '0';
    data.extimateDealDate = this.getNextMonth();
    if (window.initParam && window.initParam.customerId) {
      data.customer = window.initParam.customerName;
      data.customerId = window.initParam.customerId;
      data.formOther = true;
    }
    if (window.initParam && window.initParam.id) {
      data.sourceId = window.initParam.id;
      data.fromEntityType = 'MARKETING_ACTIVITY';
    }
    this.state.addData = data;
  },
  saveAdd: function (cb) {
    var self = this;
    var param = self.state.addData;
    if (!param.chanceName) {
      mui.alert('请输入商机名称！', '提示');
      return;
    }
    if (!param.customerId) {
      mui.alert('请选择客户名称！', '提示');
      return;
    }
    if (!param.chanceType) {
      mui.alert('请选择商机类型！', '提示');
      return;
    }
    if (!param.chanceStageId) {
      mui.alert('请选择商机阶段！', '提示');
      return;
    }
    nativeApi.initAjax({
      'type': 'post',
      'url': APIS.chance_add,
      'param': {
        'chanceName': param.chanceName,
        'customerId': param.customerId,
        'description': nativeApi.replaceAllCh(param.description),
        'chanceSourceId': '0',
        'chanceStageId': param.chanceStageId,
        'status': param.statusId,
        'successRatio': param.successRatio,
        'forecastAmount': param.forecastAmount,
        'extimateDealDate': param.extimateDealDate,
        'stageTypeId': param.chanceTypeId,
        'sourceId': param.sourceId,
        'fromEntityType': param.fromEntityType
      },
      callback: function (result) {
        if (result && result.code === 200) {
          cb();
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  selectType: function (selected, cb) {
    var self = this;
    var selectList = selectListArr;
    for (var i = 0; i < selectList.length; i++) {
      if (selectList[i].itemCode === selected) {
        selectList[i].selected = true;
      } else {
        selectList[i].selected = false;
      }
    }
    self.state.selectList = selectList;
    cb();
  },
  getNowType: function () {
    var selectType = 'chanceType';
    var screenList = this.state.screenList;
    for (var i = 0; i < screenList.length; i++) {
      if (screenList[i].selected) {
        selectType = screenList[i].itemCode;
      }
    }
    return selectType;
  },
  screenFn: function (selected, cb) {
    var self = this;
    var urlPath = self.getNowType();
    if (typeof selectUrl[urlPath] === 'object') {
      self.setScreenFn(selectUrl[urlPath]);
      cb();
      return;
    }
    nativeApi.initAjax({
      type: 'get',
      url: selectUrl[urlPath],
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          if (!self.state.selectList.length) {
            var lists = result.data;
            self.setScreenFn(lists, urlPath);
          }
          cb();
        }
      }
    });
  },
  setScreenFn: function (lists, urlPath) {
    var arr = [{
      'id': '',
      'name': urlPath === 'chanceType' ? '所有类型' : '所有状态',
      'selected': false
    }];
    this.state.stageCheckedList = lists;
    for (var i = 0; i < lists.length; i++) {
      var obj = JSON.parse(JSON.stringify(lists[i]));
      obj.selected = false;
      arr.push(obj);
    }
    this.state.selectList = arr;
  },
  chanceTypeSecond: function (selected) {
    var self = this;
    var urlPath = 'stage';
    var stageTypeId = selected;
    nativeApi.initAjax({
      type: 'get',
      url: selectUrl[urlPath] + '?stageTypeId=' + stageTypeId,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          // 下面逻辑还没处理
          var lists = result.data;
          var arr = [{
            'id': '',
            'name': '所有阶段',
            'selected': false
          }];
          for (var i = 0; i < lists.length; i++) {
            var obj = JSON.parse(JSON.stringify(lists[i]));
            obj.selected = false;
            arr.push(obj);
          }

          self.state.selectList3 = arr;
        }
      }
    });
  },
  getWeekday: function (date, num, type) {
    /* 获取上下周的开始日期与结束日期 num(上下几周) type(start|end)*/
    date = date || new Date();
    var dayMSec = 24 * 3600 * 1000;
    var today;
    var dateTime = 0;
    today = date.getDay();
    if (num > 0) {
      /* 以后*/
      dateTime = date.getTime() + (7 - today) * dayMSec;
      if (type === 'end') {
        dateTime += 6 * dayMSec;
      }
    } else if (num < 0) {
      /* 以前*/
      dateTime = date.getTime() - today * dayMSec - dayMSec;
      if (type === 'start') {
        dateTime -= 6 * dayMSec;
      }
    }
    return this.getFormatTime(date, dateTime);
  },
  getFormatTime: function (date, time) {
    date.setTime(time);
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  },
  selectFn: function (field, selectId, title, cb, elseId) {  // 增加'elseId'参数,用于商机类型-商机阶段
    selectId = selectId + '';
    var self = this;
    if (field === 'status') {
      field += '_add';
    }
    var portUrl = '';
    if (elseId || elseId === 0) {
      portUrl = selectUrl[field].replace('{id}', elseId);
    } else {
      portUrl = selectUrl[field];
    }
    if (typeof portUrl === 'object') {
      self.setSelectFn(portUrl, selectId, title);
      if (typeof cb === 'function') {
        cb();
      }
      return;
    }
    nativeApi.initAjax({
      type: 'get',
      url: portUrl,
      param: self.param[field] || '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.lists || result.data;
          self.setSelectFn(lists, selectId, title);
          if (typeof cb === 'function') {
            cb();
          }
        }
      }
    });
  },
  setSelectFn: function (lists, selectId, title) {
    for (var i = 0; i < lists.length; i++) {
      var id = lists[i].id || lists[i].itemCode;
      if (selectId === id) {
        lists[i].selected = true;
      } else {
        lists[i].selected = false;
      }
    }
    this.state.selectLi = lists;
    this.state.selectTitle = '选择' + title;
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
          for (var i = 0; i < lists.length; i++) {
            if (self.state.selectId === lists[i].id) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          result.data = lists;
          self.pullList(result, loadType, 'customerLi', obj);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  updateField: function (field, val, type) {
    var self = this;
    if (type === 'search') {
      self.state.searchData[field] = val;
    } else if (type === 'stage') {
      self.state.stageEdit[field] = val;
    } else if (type === 'add') {
      self.state.addData[field] = val;
    } else if (type === 'edit') {
      self.state.editData[field] = val;
      if (field === 'closeReasonId') {
        self.state.editData.dealDateStr = '';
        self.state.editData.loseDateStr = '';
        if (val === '0') {
          /* 成交*/
          self.state.editData.dealDateStr = self.getToday();
        } else if (val === '1') {
          /* 输单*/
          self.state.editData.loseDateStr = self.getToday();
        }
      }
    } else if (type === 'productType') {
      self.state.productType[field] = val;
      if (field.indexOf('Id') > -1) {
        self.param.product.productTypeId = val;
        self.param.product.pageNo = 0;
        self.productList();
      }
    }
  },
  getDetail: function (id, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.chance_detail + id + '?pageNo=0&pageSize=10',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.detailData = result.data;
          self.scroll.follow.originalLi = result.data.trackList || [];
          self.scroll.follow.followLi = self.disposeData(result.data.trackList || []);
          /* 设置是否有下一页*/
          if (typeof cb === 'function') {
            cb();
            self.state.taskList = [];
            self.state.productList = [];
            self.state.salesPriceList = [];
            self.state.contactList = [];
            setTimeout(function () {
              var arrA = document.getElementById('tab_item_scroll').getElementsByTagName('a');
              for (var m = 0; m < arrA.length; m++) {
                var className = arrA[m].getAttribute('class') || '';
                if (m === 0) {
                  if (className.indexOf('mui-active') === -1) {
                    className = className + ' mui-active';
                  }
                } else {
                  if (className.indexOf('mui-active') > -1) {
                    className = className.replace('mui-active', '');
                  }
                }
                arrA[m].setAttribute('class', className);
              }
              var arrDiv = document.getElementById('deputyLi').getElementsByTagName('div');
              for (var n = 0; n < arrDiv.length; n++) {
                var classNameN = arrDiv[n].getAttribute('class') || '';
                if (n === 0) {
                  if (classNameN.indexOf('mui-active') === -1) {
                    classNameN = classNameN + ' mui-active';
                  }
                } else {
                  if (classNameN.indexOf('mui-active') > -1) {
                    classNameN = classNameN.replace('mui-active', '');
                  }
                }
                arrDiv[n].setAttribute('class', classNameN);
              }
            }, 100);
          }
          setTimeout(function () {
            self.setFollowScroll();
          }, 100);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  setEdit: function (cb) {
    var detail = this.state.detailData;
    this.state.editData = {
      'id': detail.id,
      'customerId': detail.customerId,
      'customer': detail.customerName,
      'chanceName': detail.chanceName,
      'chanceSourceId': '0',
      // 'description': nativeApi.replaceAllCh(detail.description, 1),
      'chanceStageId': detail.chanceStageId,
      'chanceStage': detail.chanceStageText || '',
      'successRatio': detail.successRatio,
      'successRatioId': detail.successRatio,
      'status': detail.statusText,
      'statusId': detail.status,
      'forecastAmount': detail.forecastAmount,
      'extimateDealDateStr': detail.extimateDealDate.substring(0, 10),
      'isColsed': detail.isColsed,
      'closeReason': '',
      'closeReasonId': '',
      'dealAmount': '',
      'dealDateStr': '',
      'loseAmount': '',
      'loseDateStr': '',
      'chanceType': detail.stageTypeText,
      'chanceTypeId': detail.stageTypeId,
      'stageTypeId': detail.stageTypeId
    };
    cb();
  },
  saveEdit: function (cb) {
    var self = this;
    var param = self.state.editData;
    var id = param.id;
    if (!param.chanceName) {
      mui.alert('请输入商机名称！');
      return;
    }
    if (!param.customerId) {
      mui.alert('请选择客户名称！');
      return;
    }
    if (!param.chanceStageId) {
      mui.alert('请选择商机阶段！');
      return;
    }
    if (param.isColsed === 1 && !param.closeReasonId) {
      mui.alert('商机关闭时，需要选择关闭原因！', '提示');
      return;
    }
    if (param.closeReasonId === '0' && !param.dealAmount) {
      mui.alert('关闭原因为[' + param.closeReason + ']时，商机成交金额不能为空！');
      return;
    }
    if (param.closeReasonId === '1' && !param.loseAmount) {
      mui.alert('关闭原因为[' + param.closeReason + ']时，商机输单金额不能为空！');
      return;
    }
    nativeApi.initAjax({
      type: 'put',
      url: APIS.chance_add + '/' + id,
      param: {
        'customerId': param.customerId,
        'chanceName': param.chanceName,
        'chanceSourceId': '0',
        // 'description': nativeApi.replaceAllCh(param.description),
        'chanceStageId': param.chanceStageId,
        'successRatio': param.successRatio,
        'status': param.statusId,
        'forecastAmount': param.forecastAmount,
        'extimateDealDate': param.extimateDealDateStr,
        'isColsed': param.isColsed,
        'closeReason': param.closeReasonId,
        'dealAmount': param.dealAmount,
        'dealDate': param.dealDateStr,
        'loseAmount': param.loseAmount,
        'loseDate': param.loseDateStr,
        'chanceType': param.chanceType,
        'stageTypeId': param.chanceTypeId || param.stageTypeId
      },
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb(id);
          }
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
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
      url: APIS.chance_follow.replace('{id}', self.state.detailData.id),
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
          self.pullList(result, loadType, 'followLi', obj);
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
  setFollowScroll: function (total) {
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
  task: function (cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.chance_task.replace('{id}', self.state.detailData.id),
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.taskList = result.data;
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
  product: function (cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.chance_product.replace('{id}', self.state.detailData.id),
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data || [];
          for (var i = 0; i < lists.length; i++) {
            lists[i].showHide = false;
            lists[i].isEdit = false;
            lists[i].isEditCount = false;
          }
          self.state.productList = lists;
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
  salesPrice: function (cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.chance_salesPrice.replace('{id}', self.state.detailData.id),
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.salesPriceList = result.data || [];
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
  contact: function (cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.chance_contact.replace('{id}', self.state.detailData.id),
      param: '',
      callback: function (result) {
        if (result && (result.code === 200)) {
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
  setMain: function (index) {
    var self = this;
    var lists = self.state.teamList;
    for (var i = 0; i < lists.length; i++) {
      if (i === index) {
        lists[i].isOwner = 1;
        self.state.mainOwner = lists[i];
      } else {
        lists[i].isOwner = 0;
      }
    }
    self.state.teamList = lists;
  },
  rival: function (cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.chance_rival.replace('{id}', self.state.detailData.id),
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          self.state.rivalForm = '';
          self.state.rivalList = lists;
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
  rivalList: function (loadType) {
    var self = this;
    var obj = 'rival';
    self.param.rival.chanceId = self.state.detailData.id;
    if (self.state.rivalForm) {
      self.param.rival.chanceProductId = self.state.rivalForm.id;
    }
    nativeApi.initAjax({
      type: 'get',
      url: APIS.competitors_list,
      param: self.param.rival,
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            lists[i].selected = false;
          }
          result.data = lists;
          self.pullList(result, loadType, 'rivalAddList', obj);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  rivalAdd: function (cb) {
    var self = this;
    var lists = self.scroll.rival.rivalAddList;
    var selectList = [];
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].selected) {
        selectList.push(lists[i].id);
      }
    }
    if (selectList.length === 0) {
      mui.alert('请选择对手！', '提示', function () {
      });
      return;
    }
    nativeApi.initAjax({
      'url': APIS.chance_rival_save.replace('{id}', self.state.detailData.id),
      'type': 'post',
      'param': {
        competitorIdList: selectList
      },
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
          /* 刷新机会对手*/
          self.rival();
        } else {
          mui.alert(result.msg || '对手新增失败！', '提示', function () {
          });
        }
      }
    });
  },
  deleteRival: function (index) {
    var self = this;
    var url = APIS.chance_rival_good_bad;
    if (self.state.rivalForm) {
      url = APIS.chance_delete_product_rival;
    }
    nativeApi.initAjax({
      'type': 'delete',
      'url': url.replace('{id}', self.state.rivalList[index].id),
      'param': '',
      callback: function (result) {
        if (result && result.code === 200) {
          /* 刷新机会对手*/
          mui.alert('对手删除成功！', '提示', function () {
            if (self.state.rivalForm) {
              self.chance_product_rival(self.state.rivalForm);
            } else {
              self.rival();
            }
          });
        } else {
          mui.alert(result.msg || '对手新增失败！', '提示', function () {
          });
        }
      }
    });
  },
  editGoodBad: function (param) {
    var self = this;
    param = self.analysisParam(param);
    var val = self.state.rivalList[param.index][param.field] || '';
    self.state.goodBadData = {
      field: param.field,
      placeholder: param.field === 'strengths' ? '请输入优势' : '请输入劣势',
      value: nativeApi.replaceAllCh(val, 1)
    };
  },
  saveGoodBad: function (param, cb) {
    var self = this;
    param = self.analysisParam(param);
    var goodBad = self.state.rivalList[param.index];
    var saveParam = {
      'weaknesses': '',
      'strengths': ''
    };
    var id = self.state.rivalForm ? goodBad.chanceCompetitorId : goodBad.id;
    var val = self.state.goodBadData.value;
    if (!val) {
      mui.alert('请输入' + (self.state.goodBadData.field === 'weaknesses' ? '劣势' : '优势'), '提示');
      return;
    }
    val = nativeApi.replaceAllCh(val);
    saveParam[self.state.goodBadData.field] = val;
    nativeApi.initAjax({
      'type': 'put',
      'url': APIS.chance_rival_good_bad.replace('{id}', id),
      'param': saveParam,
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
          if (self.state.rivalForm) {
            self.chance_product_rival(self.state.rivalForm);
          } else {
            self.rival();
          }
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  analysisParam: function (param) {
    param = param.split('&');
    var returnJson = {};
    for (var i = 0; i < param.length; i++) {
      var p = param[i].split('=');
      returnJson[p[0]] = p[1];
    }
    return returnJson;
  },
  productList: function (loadType) {
    var self = this;
    var obj = 'product';
    self.param.product.chanceId = self.state.detailData.id;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.product_list,
      param: self.param.product,
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            lists[i].selected = false;
          }
          result.data = lists;
          self.pullList(result, loadType, 'productAddList', obj);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  productAdd: function (cb) {
    var self = this;
    var lists = self.scroll.product.productAddList;
    var selectList = [];
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].selected) {
        selectList.push(lists[i].id);
      }
    }
    if (selectList.length === 0) {
      mui.alert('请选择产品！', '提示', function () {
      });
      return;
    }
    nativeApi.initAjax({
      'url': APIS.chance_product_save,
      'type': 'post',
      'param': {
        'chanceId': self.state.detailData.id,
        'productIdList': selectList
      },
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
          /* 刷新机会产品*/
          self.product();
        } else {
          mui.alert(result.msg || '产品新增失败！', '提示', function () {
          });
        }
      }
    });
  },
  editSaveProduct: function (param, cb) {
    nativeApi.initAjax({
      'url': APIS.chance_product_save + '/' + param.id,
      'type': 'put',
      'param': {
        'productPrice': param.productPrice,
        'productNumber': param.quantity
      },
      callback: function (result) {
        if (result && result.code === 200) {
          mui.alert('保存成功！', '提示', function () {
          });
        } else {
          mui.alert(result.msg || '产品新增失败！', '提示', function () {
          });
        }
      }
    });
  },
  deleteSaveProduct: function (id) {
    var self = this;
    nativeApi.initAjax({
      'url': APIS.chance_product_save + '/' + id + '?chanceId=' + self.state.detailData.id,
      'type': 'delete',
      'param': '',
      callback: function (result) {
        if (result && result.code === 200) {
          mui.alert('删除成功！', '提示', function () {
            self.product();
          });
        } else {
          mui.alert(result.msg || '产品新增失败！', '提示', function () {
          });
        }
      }
    });
  },
  chance_product_rival: function (data, cb) {
    var self = this;
    nativeApi.initAjax({
      'url': APIS.chance_product_rival.replace('{id}', data.id),
      'type': 'get',
      'param': {
        'chanceId': self.state.detailData.id
      },
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.rivalForm = data;
          self.state.rivalList = result.data || [];
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '获取数据失败！', '提示', function () {
          });
        }
      }
    });
  },
  rivalProductAdd: function (cb) {
    var self = this;
    var lists = self.scroll.rival.rivalAddList;
    var selectList = [];
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].selected) {
        selectList.push(lists[i].id);
      }
    }
    if (selectList.length === 0) {
      mui.alert('请选择对手！', '提示', function () {
      });
      return;
    }
    nativeApi.initAjax({
      'url': APIS.chance_product_rival.replace('{id}', self.state.rivalForm.id),
      'type': 'post',
      'param': {
        'competitorIdList': selectList,
        'chanceId': self.state.detailData.id
      },
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
          /* 刷新机会产品对手*/
          self.chance_product_rival(self.state.rivalForm);
        } else {
          mui.alert(result.msg || '对手新增失败！', '提示', function () {
          });
        }
      }
    });
  },
  contactList: function (searchName, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.customer_contact.replace('{id}', self.state.detailData.customerId),
      param: {
        'q': searchName || '',
        'chanceId': self.state.detailData.id
      },
      callback: function (result) {
        if (result && result.code === 200) {
          self.disposeDataCon(result.data || []);
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '获取数据失败！', '提示', function () {
          });
        }
      }
    });
  },
  disposeDataCon: function (result) {
    var lists = result;
    var conLists = [];
    var self = this;
    for (var i = 0; i < lists.length; i++) {
      lists[i].indexed = lists[i].pinyin.substring(0, 1);
    }
    for (var m = 0; m < lists.length; m++) {
      /* 不显示首字母*/
      lists[m].selected = false;
      conLists.push(lists[m]);
    }
    self.state.contactAddList = conLists;
    self.state.arrIndexed = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
  },
  saveAddContact: function (cb) {
    var self = this;
    var lists = self.state.contactAddList || [];
    var linkmanIdList = [];
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].selected) {
        linkmanIdList.push(lists[i].id);
      }
    }
    if (linkmanIdList.length === 0) {
      mui.alert('请选择联系人！', '提示');
      return;
    }
    nativeApi.initAjax({
      type: 'post',
      url: APIS.chance_contact.replace('{id}', self.state.detailData.id),
      param: {
        'linkmanIdList': linkmanIdList
      },
      callback: function (result) {
        if (result && result.code === 200) {
          self.contact();
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '添加联系人失败！', '提示', function () {
          });
        }
      }
    });
  },
  stage: function (cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.chance_stage.replace('{id}', self.state.detailData.id),
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            lists[i].checked = false;
            lists[i].detail = [];
          }
          self.state.stageList = lists;
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
  stageTask: function (index, cb, isRefresh) {
    var self = this;
    var stageData;
    var ii;
    var listList = self.state.stageList;
    for (var i = 0; i < listList.length; i++) {
      if (listList[i].stageId === index) {
        stageData = listList[i];
        ii = i;
      }
    }

    if (stageData.detail && stageData.detail.length > 0 && isRefresh !== 1) {
      if (typeof cb === 'function') {
        cb();
      }
      return;
    }
    nativeApi.initAjax({
      type: 'get',
      url: APIS.chance_stage_task.replace('{id}', self.state.detailData.id),
      param: {
        'stageId': stageData.stageId
      },
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          self.state.stageList[ii].detail = lists;
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
  changeStatus: function (opt, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'put',
      url: APIS.chance_update_stage_task_status.replace('{id}', opt.id),
      param: {
        'chanceId': opt.chanceId,
        'stageTaskId': opt.stageTaskId,
        'status': opt.status
      },
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
          var index = opt.stageId;
          var stageList = self.state.stageList;
          self.stageTask(index, function () {
            for (var i = 0; i < stageList.length; i++) {
              if (stageList[i].stageId === self.state.stageEdit.stageId) {
                index = i;
                /* 已完成任务*/
                if (self.state.stageEdit.statusTextId === 2) {
                  stageList[i].finishedCount = parseInt(stageList[i].finishedCount) + 1;
                  if (stageList[i].finishedCount >= stageList[i].taskCount) {
                    stageList[i].finishedCount = stageList[i].taskCount;
                    self.getDetail(self.state.detailData.id);
                  }
                }
              }
            }
          }, 1);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  stageEdit: function (stageId, detail) {
    detail.statusTextId = detail.status;
    detail.stageId = stageId;
    this.state.stageEdit = detail;
  },
  cleanStageTask: function () {
    for (var attr in this.state.stageTask) {
      this.state.stageTask[attr] = '';
    }
  },
  saveStageTask: function (opt, cb) {
    var self = this;
    var thisUrl = APIS.chance_update_stage_task;
    nativeApi.initAjax({
      type: opt.edit ? 'put' : 'post',
      url: opt.edit ? thisUrl + '/' + opt.id : thisUrl,
      param: opt.edit ? {
        'taskName': opt.taskName,
        'remark': opt.remark,
        'successRatio': opt.successRatio
      } : opt,
      callback: function (result) {
        if (result && result.code === 200) {
          /* 刷新销售阶段*/
          var index = opt.stageId;
          var stageList = self.state.stageList;
          self.stageTask(index, function () {
            for (var i = 0; i < stageList.length; i++) {
              if (stageList[i].stageId === self.state.stageEdit.stageId) {
                index = i;
                /* 已完成任务*/
                if (self.state.stageEdit.statusTextId === 2) {
                  stageList[i].finishedCount = parseInt(stageList[i].finishedCount) + 1;
                  if (stageList[i].finishedCount >= stageList[i].taskCount) {
                    stageList[i].finishedCount = stageList[i].taskCount;
                    self.getDetail(self.state.detailData.id);
                  }
                }
              }
            }
          }, 1);
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
  deleteStageTask: function (stageId, stageTaskId, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'delete',
      url: APIS.chance_update_stage_task + '/' + stageTaskId,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
          var stageList = self.state.stageList;
          self.stageTask(stageId, function () {
            for (var i = 0; i < stageList.length; i++) {
              if (stageList[i].stageId === self.state.stageEdit.stageId) {
                /* 已完成任务*/
                if (self.state.stageEdit.statusTextId === 2) {
                  stageList[i].finishedCount = parseInt(stageList[i].finishedCount) + 1;
                  if (stageList[i].finishedCount >= stageList[i].taskCount) {
                    stageList[i].finishedCount = stageList[i].taskCount;
                    self.getDetail(self.state.detailData.id);
                  }
                }
              }
            }
          }, 1);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  showEditStage: function () {
    this.state.stageTaskList = [
      {
        'name': '11111'
      },
      {
        'name': '22222'
      },
      {
        'name': '33333'
      },
      {
        'name': '44444'
      },
      {
        'name': '55555'
      },
      {
        'name': '66666'
      }
    ];
  },
  updateLine: function (event, top) {
    var self = this;
    var touch = event.path[1];  // 把元素放在手指所在的位置
    var touchHei = touch.clientHeight;
    var index = touch.getAttribute('index');
    var targetTouches = event.targetTouches[0];
    var hei = targetTouches.pageY - top - 44;
    var moveIndex = parseInt(hei / touchHei);
    if (moveIndex >= 0 && moveIndex < self.state.stageTaskList.length && moveIndex !== index) {
      var moveStage = [];
      var stage = self.state.stageTaskList;
      for (var i = 0; i < stage.length; i++) {
        if (moveIndex < index) {
          if (i !== index) {
            if (i === moveIndex) {
              moveStage.push(stage[index]);
            } else if (i < moveIndex) {
              moveStage.push(stage[i]);
            } else if (i > moveIndex) {
              moveStage.push(stage[i]);
            }
          } else {
            moveStage.push(stage[i - 1]);
          }
        } else {
          if (i !== moveIndex) {
            if (i === index) {
              moveStage.push(stage[moveIndex]);
            } else if (i < index) {
              moveStage.push(stage[i]);
            } else if (i > index) {
              moveStage.push(stage[i]);
            }
          } else {
            moveStage.push(stage[index]);
          }
        }
      }
      self.state.stageTaskList = moveStage;
    }
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
  getIfLeader: function (cb) {
    var self = this;
    if (!self.state.isLeader.isAjax) {
      nativeApi.initAjax({
        'type': 'get',
        'url': APIS.is_leader,
        callback: function (result) {
          if (result && result.code === 200) {
            self.state.isLeader.isAjax = true;
            self.state.isLeader.flag = result.data.isLeader;
            if (typeof cb === 'function') {
              cb();
            }
          } else {
            mui.alert(result.msg || '数据获取失败！', '提示', function () {
            });
          }
        }
      });
    } else {
      if (typeof cb === 'function') {
        cb();
      }
    }
  },
  saveStageList: function (opt, cb) {
    nativeApi.initAjax({
      type: 'put',
      url: APIS.chance_update_stage_task,
      param: {
        'sortIndexList': opt
      },
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
  getToday: function () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    return year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((day < 10) ? ('0' + day) : day);
  },
  getNextMonth: function () {
    var date = new Date();
    return this.getFormatTime(date, date.getTime() + 30 * 24 * 3600 * 1000);
  }
};
