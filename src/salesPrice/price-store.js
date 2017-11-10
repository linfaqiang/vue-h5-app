/* *
 * @file  数据中转站
 * @author  lism
 */
//  引入数据请求API
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');
/* 翻页函数*/
var loadNext = {
  'list': 'init',
  'search': 'search',
  'chance': 'chance',
  'product': 'productList',
  'customer': 'customer',
  'addProductList': 'addProductList'
};
var selectListArr = [
  {
    'itemCode': '',
    'itemName': '全部'
  },
  {
    'itemCode': '0',
    'itemName': '拟定'
  },
  {
    'itemCode': '1',
    'itemName': '审批中'
  },
  {
    'itemCode': '2',
    'itemName': '已同意'
  },
  {
    'itemCode': '3',
    'itemName': '已拒绝'
  }
];

var selectUrl = {
  'customer': {
    'url': APIS.customer,
    'param': {
      'q': '',
      'pageNo': 1,
      'pageSize': 10,
      'orderType': 1,
      'startCreatedOn': '',
      'endCreatedOn': '',
      'adcode': '',
      'staffIds': [],
      'employee': '',
      'employeeId': [],
      'isSelf': 0
    }
  },
  'status': {
    'url': APIS.customer,
    'param': {
      'q': '',
      'pageNo': 1,
      'pageSize': 10,
      'orderType': 1,
      'startCreatedOn': '',
      'endCreatedOn': '',
      'adcode': '',
      'staffIds': '',
      'employee': '',
      'employeeId': '',
      'isSelf': 0
    }
  },
  'chance': {
    'url': APIS.chance_list,
    'param': {
      'q': '',
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
    }
  },
  'addProductList': {
    'url': APIS.product_list,
    'param': {
      'q': '',
      'pageNo': 1,
      'pageSize': 10
    }
  }
};
//  定义store, store可以被多个组件引用
export default {
  //  每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    list: {
      priceList: [],
      hasmore: true,
      scroll: {}
    },
    searchList: [],
    nowTotal: 0,
    totalSize: 0,
    selectList: [],
    selectLi: {
      data: []
    },
    selectLi2: {
      data: []
    },
    selectTitle: '',
    screenList: [
      {
        'itemCode': 'stage',
        'itemName': '阶段',
        'selected': true
      },
      {
        'itemCode': 'status',
        'itemName': '状态',
        'selected': false
      }
    ],
    searchData: {
      'switch': true,
      'start': '',
      'end': '',
      'customerId': '',
      'customer': '',
      'stageId': '',
      'stage': '',
      'statusId': '',
      'formOther': false, /* 是否从其他功能进入 新建页面用*/
      'status': '',
      'employee': '',
      'employeeId': '',
      'chance': ''
    },
    searchData2: {
      'switch': true,
      'start': '',
      'end': '',
      'customerId': '',
      'customer': '',
      'stageId': '',
      'stage': '',
      'statusId': '',
      'status': '',
      'employee': '',
      'employeeId': '',
      'chance': ''
    },
    selectChanceData: {
      chance: ''
    },
    searchLi: [],
    seaTotal: '',
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
    data: {
      conList: {}
    },
    getContacts: {
      data: {}
    },
    ClueTransfer: {
      data: {}
    },
    addData: {
      'quotationName': '',
      'status': 0, // 报价状态：0拟定，1审批中，2已同意，3已拒绝
      'customer': '',
      'customerId': '', // 客户ID
      'chance': '',
      'chanceId': '', // 商机ID
      'overdueDate': '', // 过期日期
      'productList': [] // 报价产品行数组
    },
    productList: [],
    productListData: [], // 选择操作的产品列表
    editProductList: [], // 编辑页面产品列表数据
    selectProducts: [], // 新建页面选中的产品列表
    fieldListOne: [],
    status: '',
    statusActive: {
      s: true
    },
    selectId: '',
    selectProductId: [],
    editPrice: {
      data: [{
        name: '报价名称',
        key: 'quotationName',
        value: ''
      }, {
        name: '状态',
        key: 'statusText',
        activeColor: '#d61518',
        icon: '-',
        value: '',
        href: 'not'
      }, {
        name: '客户',
        key: 'customerName',
        value: '',
        href: 'not'
      }, {
        name: '商机',
        key: 'chanceName',
        value: '',
        href: 'not'
      }, {
        name: '总金额',
        key: 'amount',
        activeColor: '#d61518',
        icon: '',
        value: '',
        href: 'not'
      }, {
        name: '过期日',
        key: 'overdueDate',
        href: '1',
        inputType: 'date',
        value: ''
      }]
    },
    priceDetail: {
      data: {}
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
    },
    'product': {
      productAddList: [],
      hasMore: true,
      scroll: {}
    },
    'chance': {
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'customer': {
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'addProductList': {
      dataList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'q': '',
      'status': '',
      'startCreatedOn': '',
      'endCreatedOn': '',
      'customerId': '',
      'chanceId': '',
      'pageNo': 1,
      'pageSize': 10
    },
    search: {
      'q': '',
      'status': '',
      'startCreatedOn': '',
      'endCreatedOn': '',
      'customerId': '',
      'chanceId': '',
      'pageNo': 1,
      'pageSize': 10
    },
    'customer': {
      'q': '',
      'isEncrypt': 0,
      'isSelf': 0,
      'pageNo': 1,
      'pageSize': 10
    },
    'chance': {
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
    'addProductList': {
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
    this.param.list.startCreatedOn = '';
    this.param.list.endCreatedOn = '';
    this.param.list.customerId = '';
    this.param.list.chanceId = '';
    /* 刷新*/
    this.param[obj].pageNo = 1;
    this[loadNext[obj]]('refresh');
  },
  listLoadMore: function (obj) {
    /* 加载更多*/
    this.param[obj].pageNo++;
    this[loadNext[obj]]('loadMore');
  },
  //  在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      type: 'post',
      url: APIS.sales_price_lists,
      param: self.param.list,
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
  search: function (loadType) {
    var self = this;
    var obj = 'search';
    nativeApi.initAjax({
      url: APIS.sales_price_lists,
      param: self.param.search,
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
    var selectType = 'stage';
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
    nativeApi.initAjax({
      type: 'get',
      url: APIS['chance_' + urlPath],
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          var arr = [{
            'itemCode': '',
            'itemName': urlPath === 'stage' ? '所有阶段' : '所有状态'
          }];
          if (selected === '' || selected === undefined) {
            arr[0].selected = true;
          } else {
            arr[0].selected = false;
          }
          for (var i = 0; i < lists.length; i++) {
            var obj = lists[i];
            if (selected === obj.itemCode) {
              obj.selected = true;
            } else {
              obj.selected = false;
            }
            arr.push(obj);
          }
          self.state.selectList = arr;
          cb();
        }
      }
    });
  },
  selectFn: function (obj, selectId, title, type) {
    var self = this;
    nativeApi.initAjax({
      type: 'post',
      url: selectUrl[obj].url,
      param: selectUrl[obj].param,
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            var id = lists[i].id || lists[i].itemCode;
            if (id === selectId) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          if (type === 1) {
            self.state.selectLi.data = lists; // 添加报价选择
          } else {
            self.state.selectLi2.data = lists; // 更多筛选选择
          }
          self.state.selectTitle = '选择' + title;
        }
      }
    });
  },
  updateField: function (field, value, type, id) {
    var self = this;
    if (type === 'add') {
      self.state.addData[field] = value;
    } else if (type === 'edit') {
      self.state.actData[field] = value;
    } else if (type === 'search') {
      self.state.searchData[field] = value;
    }
  },
  // 新建报价
  saveAdd: function (cb) {
    var self = this;
    var param = self.state.addData;
    if (!(self.state.selectProducts.length > 0)) {
      mui.alert('请选择报价行！', '提示', function () {
      });
      return;
    }
    nativeApi.initAjax({
      'type': 'post',
      'url': APIS.sales_price_detail,
      'param': {
        'quotationName': param.quotationName,
        'status': param.status,
        'customerId': param.customerId,
        'chanceId': param.chanceId,
        'overdueDate': param.overdueDate,
        'productList': self.state.selectProducts
      },
      callback: function (result) {
        if (result && result.code === 200 || result.code === '406.5') {
          if (result.code === 200) {
            result.msg = '新建报价成功';
          }
          cb(result.msg);
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  //  详情
  getCustomerDedail: function (priceId, cb) {
    // 详情数据 只需报价id
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.sales_price_detail + '/' + priceId,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.priceDetail.data = result.data;
          for (var m = 0; m < This.state.getClueDetail.data.testList.length; m++) {
            This.state.getClueDetail.data.testList[m].value = result.data[This.state.getClueDetail.data.testList[m].key];
          }
          var lists = result.data.productList;
          var temparr = JSON.stringify(lists);
          lists = JSON.parse(temparr);
          for (var i = 0; i < lists.length; i++) {
            lists[i].showIcon = true;
            lists[i].selected = true;
            lists[i].showHide = false;
            lists[i].isEdit = false;
            lists[i].isEditCount = false; // 是否可编辑数量
            lists[i].isRival = true; // 是否显示竞争对手
            lists[i].isOperation = true; // 是否显示 竞争对手,编辑,删除
          }
          This.state.productList = lists; // 报价行列表数据
          This.state.editProductList = lists; // 编辑页面产品列表
          This.state.ClueTransfer.data = result.data.approvalList;
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
  //  编辑页面
  getPriceEdit: function () {
    var This = this;
    var data = This.state.getClueDetail.data.testList;
    for (var i = 0; i < data.length - 1; i++) {
      This.state.editPrice.data[i].value = data[i].value;
    }
    var editProductList = This.state.editProductList;
    for (var j = 0; j < editProductList.length; j++) {
      editProductList[j].showHide = false;
      editProductList[j].isOperation = false; // 是否显示 竞争对手,编辑,删除
      This.state.selectProductId.push(editProductList[j].id);
    }
    This.state.editProductList = editProductList;
  },

  // 审批记录列表
  getClueTransfers: function (param) {
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.sales_price_detail + '/' + param.quotationId + '/approvals',
      param: param,
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.ClueTransfer.data = result.data;
        }
      }
    });
  },
  // 获取产品列表
  product: function (cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.product_list,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            lists[i].showHide = false;
            lists[i].isEdit = false;
            lists[i].isEditCount = false; //  是否可编辑数量
            lists[i].isRival = true; //  是否显示竞争对手
            lists[i].isOperation = true; //  是否显示 竞争对手,编辑,删除
            var status = parseInt(self.state.status || 0);
            if (status === 0 || status === 3) {
              lists[i].isOperation = false;
            }
            lists[i].totalPrice = lists[i].productPrice;
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
  // 获取产品列表2 用于查询新增报价时 选择报价的产品报价列表
  product2: function (cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.product_list,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          var searchList = [];
          for (var i = 0; i < lists.length; i++) {
            lists[i].showIcon = false;
            lists[i].selected = false;
            lists[i].showHide = false;
            lists[i].isEdit = false;
            lists[i].isEditCount = false; // 是否可编辑数量
            lists[i].isRival = true; // 是否显示竞争对手
            lists[i].isOperation = false;  // 是否显示 竞争对手,编辑,删除
            lists[i].totalPrice = parseInt((lists[i].productPrice + '').replace(/,/g, '')) * parseInt(lists[i].quantity); // 总价
            lists[i].quantity = '1'; // 列表数量默认值
            if (lists[i].productName.indexOf(cb) > -1) {
              searchList.push(lists[i]);
            }
          }
          if (cb !== '' && cb !== undefined) {
            self.state.productListData = searchList;
          } else {
            // 新建页面 点击新增报价 显示报价列表
            self.state.productListData = lists;
          }
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
  // 点击添加产品 返回编辑页面
  productAdd: function (isEdit) {
    var self = this;
    var lists = self.scroll.addProductList.dataList;
    self.state.selectProducts = [];
    self.state.selectProductId = [];
    for (var m = 0; m < lists.length; m++) {
      if (lists[m].selected && self.state.selectProductId.indexOf(lists[m].id) === -1) {
        self.state.selectProductId.push(lists[m].id);
        self.state.selectProducts.push(lists[m]);
      }
    }
    var listsL = self.state.selectProducts;
    for (var i = 0; i < listsL.length; i++) {
      listsL[i].showHide = false;
      listsL[i].isEdit = false;
      listsL[i].amount = parseInt(listsL[i].productPrice) * parseInt(listsL[i].quantity);
    }
    if (isEdit) {
      self.state.selectProducts = listsL; // 选择的数据
      var oldArr = self.state.editProductList; // 原始的数据
      var selectPro = self.state.selectProducts;
      if (selectPro.length) {
        selectPro = JSON.stringify(selectPro);
        selectPro = JSON.parse(selectPro);
        // oldArr+新增的
        var oldIdArr = []; // id数组
        for (var k = 0; k < oldArr.length; k++) {
          oldIdArr.push(oldArr[k].id);
        }
        for (var j = 0; j < selectPro.length; j++) {
          var id = selectPro[j].id;
          if (oldIdArr.indexOf(id) < 0) {
            oldArr.push(selectPro[j]);
          }
        }
        self.state.editProductList = oldArr;
      } else {
        self.state.editProductList = oldArr;
      }
    } else {
      // 新增报价
      listsL = JSON.stringify(listsL);
      listsL = JSON.parse(listsL);
      self.state.selectProducts = listsL;
      self.state.addData.productList = listsL;
    }
  },
  /* clean: function (resultData) {
   resultData = resultData || {};
   for (var i = 0; i < fieldListOne.length; i++) {
   fieldListOne[i].value = resultData[fieldListOne[i].field] || '';
   }
   this.state.fieldOne = fieldListOne;
   },*/
  disposeDate: function (date) {
    return date.substring(0, 10);
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
          if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
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
  chance: function (loadType) {
    var self = this;
    var obj = 'chance';
    nativeApi.initAjax({
      url: APIS.chance_list,
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
          if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
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
  addProductList: function (loadType) {
    var self = this;
    var obj = 'addProductList';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.product_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            lists[i].quotationProductId = '';
            lists[i].showIcon = false;
            lists[i].selected = false;
            lists[i].showHide = false;
            lists[i].isEdit = false;
            lists[i].isEditCount = false; // 是否可编辑数量
            lists[i].isRival = true; // 是否显示竞争对手
            lists[i].isOperation = false; // 是否显示 竞争对手,编辑,删除
            lists[i].totalPrice = parseInt((lists[i].productPrice + '').replace(/,/g, '')) * parseInt(lists[i].quantity); // 总价
            lists[i].quantity = '1'; // 列表数量默认值
            if (self.state.selectProductId.indexOf(lists[i].id) >= 0) {
              lists[i].selected = true;
              lists[i].showIcon = true;
            } else {
              lists[i].selected = false;
              lists[i].showIcon = false;
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
            }
          }
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
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
  getAfterDate: function (num) {
    var date = new Date();
    date.setDate(date.getDate() + num);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? ('0' + month) : month;
    day = day < 10 ? ('0' + day) : day;
    return year + '-' + month + '-' + day;
  },
  // 编辑报价保存
  editPrice: function (status, fn) {
    var self = this;
    if (!(self.state.editPrice.data[0].value)) {
      mui.alert('请输入报价名称！', '提示', function () {
      });
      return;
    }
    if (!(self.state.editPrice.data[5].value)) {
      mui.alert('请输入过期日期！', '提示', function () {
      });
      return;
    }
    if (!(self.state.editProductList.length > 0)) {
      mui.alert('请选择报价行！', '提示', function () {
      });
      return;
    }
    var priDetail = self.state.priceDetail.data;
    nativeApi.initAjax({
      type: 'put',
      url: APIS.sales_price_detail + '/' + priDetail.id,
      param: {
        'id': priDetail.id,
        'quotationName': self.state.editPrice.data[0].value,
        'status': status,
        'customerId': priDetail.customerId,
        'chanceId': priDetail.chanceId,
        'productList': self.state.editProductList,
        'overdueDate': self.state.editPrice.data[5].value
      },
      callback: function (result) {
        if (result && result.code === 200) {
          fn(result.msg);
        } else {
          mui.alert(result.msg || '编辑报价失败！', '提示', function () {
          });
        }
      }
    });
  }
};
