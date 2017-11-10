/**
 * @file  客户数据中转站
 * @author  hj
 */
import {APIS} from '../public/js/config';
var nativeApi = require('nativeApi');

var selectListArr = [
  {
    'itemCode': '0',
    'itemName': '按跟进时间'
  },
  {
    'itemCode': '3',
    'itemName': '按创建时间'
  },
  {
    'itemCode': '2',
    'itemName': '按预测金额'
  }
];
/* 选择项接口*/
var selectUrl = {
  'level': APIS.data_wordbook + 'DictCustomerLevel',
  'customerLevel': APIS.data_wordbook + 'DictCustomerLevel',
  'industry': APIS.data_wordbook + 'DictIndustry',
  'parentCustomer': APIS.customerDetail + 'getAll'
};
/* 翻页函数*/
var loadNext = {
  'list': 'init',
  'search': 'search',
  'chance': 'chance',
  'follow': 'follow',
  'parentCustomer': 'getParent'
};

var fieldList = {
  'customer': [
    {
      isB: true,
      icon: 'mui-icon-customer',
      name: '客户名称',
      field: 'name',
      inputType: 'text',
      value: '',
      show: false
    },
    {
      isB: true,
      icon: '',
      name: '简称（输入客户名称自动识别，必填）',
      field: 'shortname',
      inputType: 'text',
      value: '',
      show: false
    },
    {
      isB: true,
      icon: 'mui-icon-address',
      name: '地址',
      href: '2',
      field: 'address',
      value: '',
      valueData: {
        'address': '',
        'province': '',
        'city': '',
        'district': '',
        'adcode': '',
        'cityCode': '',
        'longitude': '',
        'latitude': ''
      }
    },
    {
      isB: true,
      icon: 'mui-icon-collect',
      name: '重要程度',
      href: '1',
      inputType: 'select',
      field: 'customerLevel',
      value: '',
      valueCode: ''
    },
    {
      isB: false,
      icon: 'mui-icon-category',
      name: '行业类别',
      field: 'industry',
      inputType: 'select',
      href: '1',
      value: '',
      valueCode: ''
    },
    {
      isB: false,
      icon: 'mui-icon-parent',
      name: '父客户',
      field: 'parent',
      inputType: 'select',
      href: '1',
      value: '',
      valueCode: ''
    },
    {
      isB: false,
      icon: 'mui-icon-phone',
      name: '公司电话',
      field: 'telephone',
      valid: 'phone',
      inputType: 'tel',
      value: '',
      show: false,
      isHide: true
    },
    {
      isB: false,
      icon: 'mui-icon-mail',
      name: '电子邮箱',
      field: 'email',
      inputType: 'email',
      value: '',
      show: false,
      isHide: true
    },
    {
      isB: false,
      icon: 'mui-icon-domain',
      name: '网址',
      field: 'url',
      valid: 'url',
      inputType: 'text',
      value: '',
      show: false,
      isHide: true
    },
    {
      isB: false,
      icon: 'mui-icon-duty',
      name: '员工总数',
      field: 'employeesTotal',
      inputType: 'tel',
      value: '',
      show: false,
      isHide: true
    },
    {
      isB: false,
      icon: 'mui-icon-income',
      name: '年度收入',
      field: 'annualIncome',
      inputType: 'tel',
      value: '',
      show: false,
      isHide: true
    },
    {
      isB: false,
      icon: 'mui-icon-ceo',
      name: 'CEO',
      field: 'ceoName',
      inputType: 'text',
      value: '',
      show: false,
      isHide: true
    }
  ],
  'contact': [
    {
      isB: true,
      icon: 'mui-icon-name',
      name: '姓名',
      field: 'linkmanName',
      inputType: 'text',
      value: '',
      show: false
    },
    {
      isB: true,
      icon: 'mui-icon-mobile',
      name: '手机号码',
      valid: 'mobile',
      inputType: 'tel',
      field: 'linkmanMobile',
      value: '',
      show: false
    }
  ]
};

// 定义store, store可以被多个组件引用
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  APIS: APIS,
  state: {
    hasRepeat: '',
    nowTotal: 0,
    totalSize: 0,
    selectId: '',
    selectParentId: '',
    selectList: [],
    selectLi: [],
    selectTitle: '',
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
    },
    seaTotalAll: 0,
    detailData: {},
    tabIndex: 0,
    contactList: [],
    addData: {},
    addIsHide: false,
    editData: {},
    isLeader: {
      isAjax: false,
      flag: false
    },
    isCc: true,
    duplicationData: {
      'lists': [],
      'showText': '',
      'isTwo': 0,
      'showHide': false
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
    },
    'parentCustomer': {
      dataList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'q': '',
      'isEncrypt': 0,
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
      'isEncrypt': 0,
      'orderType': 0,
      'isSelf': 0,
      'adcode': '',
      'customerLevelIds': [],
      'startCreatedOn': '',
      'endCreatedOn': '',
      'employeeId': [],
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
    },
    parentCustomer: {
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
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      url: APIS.customer,
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
  getParent: function (loadType) {
    var self = this;
    var obj = 'parentCustomer';
    nativeApi.initAjax({
      url: selectUrl[obj],
      param: self.param[obj],
      type: 'get',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            if (self.state.selectParentId === lists[i].id) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
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
  search: function (loadType) {
    var self = this;
    var obj = 'search';
    nativeApi.initAjax({
      url: APIS.customer,
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
  cleanAdd: function (result) {
    var self = this;
    self.state.addData = fieldList;
    var arrField = self.state.addData;
    var cusArr = arrField.customer;
    var conArr = arrField.contact;
    for (var i = 0; i < cusArr.length; i++) {
      cusArr[i].value = '';
      if (cusArr[i].valueCode) {
        cusArr[i].valueCode = '';
      }
    }
    for (var m = 0; m < conArr.length; m++) {
      conArr[m].value = '';
      if (conArr[m].valueCode) {
        conArr[m].valueCode = '';
      }
    }
    /* 名片扫描数据*/
    if (result) {
      cusArr[0].value = result.company;
      self.setShortName(result.company, 'addData');
      cusArr[6].value = result.telephone;
      cusArr[7].value = result.email;
      conArr[0].value = result.name;
      conArr[1].value = result.mobile;
    }

    /* 默认获取当前位置*/
    nativeApi.getQDLocationInfo({
      callback: function (result) {
        self.setAddress(result, 'addData');
      }
    });
    self.state.addIsHide = false;
    self.state.selectParentId = '';
  },
  setAddress: function (result, type) {
    var arrField = this.state[type].customer;
    for (var i = 0; i < arrField.length; i++) {
      if (arrField[i].field === 'address') {
        arrField[i].value = result.address || '';
        if (type === 'addData') {
          arrField[i].valueData.id = '';
        }
        arrField[i].valueData.address = result.address || '';
        arrField[i].valueData.province = result.province || '';
        arrField[i].valueData.city = result.city || '';
        arrField[i].valueData.district = result.district || '';
        arrField[i].valueData.adcode = result.adcode || '';
        arrField[i].valueData.cityCode = result.cityCode || '';
        arrField[i].valueData.longitude = result.longitude || '';
        arrField[i].valueData.latitude = result.latitude || '';
      }
    }
  },
  setShortName: function (name, type) {
    var num = 0;
    /* 截取“省”前面的文字*/
    num = name.indexOf('省') + 1;
    name = name.substring(num, name.length);
    /* 截取“市”前面的文字*/
    num = name.indexOf('市') + 1;
    name = name.substring(num, name.length);
    /* 截掉“责任有限公司”*/
    name = name.replace(/有限责任公司/g, '');
    /* 截掉“股份有限公司”*/
    name = name.replace(/股份有限公司/g, '');
    /* 截掉“集团有限公司”*/
    name = name.replace(/集团有限公司/g, '');
    /* 截掉“有限公司”*/
    name = name.replace(/有限公司/g, '');
    /* 截掉“集团公司”*/
    name = name.replace(/集团公司/g, '');
    /* 截掉“集团”*/
    name = name.replace(/集团/g, '');

    var arrField = this.state[type].customer;
    for (var i = 0; i < arrField.length; i++) {
      if (arrField[i].field === 'shortname') {
        arrField[i].value = name || '';
      }
    }
  },
  saveAdd: function (cb, linkBack) {
    var self = this;
    var customer = self.state.addData.customer;
    var contact = self.state.addData.contact;
    var param = self.state.hasRepeat ? {
      'linkman': {},
      'hasRepeat': '1'
    } : {
      'linkman': {}
    };
    var arr = customer.concat(contact);
    for (var i = 0; i < arr.length; i++) {
      var field = arr[i].field;
      var pattern = '';
      if (arr[i].isB && !arr[i].value) {
        mui.alert('请输入' + arr[i].name + '！');
        return;
      }
      if (arr[i].inputType === 'tel' && arr[i].value) {
        if (arr[i].valid === 'phone') {
          /* 座机号码*/
          pattern = '((\\d{11})|^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$)';
        } else if (arr[i].valid === 'mobile') {
          /* 手机号码默认*/
          pattern = '^1\\d{10}$';
        } else {
          /* 手机号码默认*/
          pattern = '^[0-9]*$';
        }
      }
      if (arr[i].inputType === 'email' && arr[i].value) {
        /* 电子邮件*/
        pattern = '^[a-z0-9._%-]+@([a-z0-9-]+\\.)+[a-z]{2,4}$';
      }
      if (pattern && !new RegExp(pattern).test(arr[i].value)) {
        mui.alert(arr[i].name + '格式不匹配！');
        return;
      }
      if (arr[i].valueCode) {
        param[field + 'Id'] = arr[i].valueCode;
      } else if (arr[i].valueData) {
        param[field] = arr[i].valueData;
      } else {
        if (field === 'linkmanName') {
          param.linkman.name = arr[i].value;
        } else if (field === 'linkmanMobile') {
          param.linkman.mobile = arr[i].value;
        } else {
          param[field] = arr[i].value;
        }
      }
    }
    self.state.duplicationData.lists = [];
    self.state.duplicationData.showText = '';
    self.state.duplicationData.isTwo = 0;
    self.state.duplicationData.showHide = false;
    nativeApi.initAjax({
      'type': 'post',
      'url': APIS.customerDetail.substring(0, APIS.customerDetail.length - 1),
      'param': param,
      callback: function (result) {
        if (result && result.code === 200) {
          var linkman = result.data;
          if (result.data[0].hasRepeat === 'customerOwn' || result.data[0].hasRepeat === 'customerOther') {
            self.state.duplicationData.lists = linkman;
            self.state.duplicationData.showText = '客户信息已存在，不可重复创建。';
            self.state.duplicationData.isTwo = 0;
            self.state.duplicationData.showHide = true;
          } else if (result.data[0].hasRepeat === 'customer') {
            self.state.duplicationData.lists = linkman;
            self.state.duplicationData.showText = '客户信息可能存在，共有' + (linkman.length - 1) + '条匹配记录，是否继续创建？';
            self.state.duplicationData.isTwo = 1;
            self.state.duplicationData.showHide = true;
          } else if (result.data[0].hasRepeat === 'outOfMaxCount') {
            mui.alert('因客户数量限制，保存不成功！请联系管理员.', '提示');
          } else {
            if (result.data[0].hasRepeat === 'linkman') {
              mui.alert('客户创建成功,但因为电话号码重复,联系人创建失败。', '提示', function () {
                if (typeof cb === 'function') {
                  linkBack();
                }
              });
            } else {
              if (typeof cb === 'function') {
                cb();
              }
            }
          }
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
    var selectType = 'level';
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
      url: selectUrl[urlPath],
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          var arr = [{
            'id': '',
            'name': urlPath === 'level' ? '所有' : ''
          }];
          if (selected === '' || selected === undefined) {
            arr[0].selected = true;
          } else {
            arr[0].selected = false;
          }
          for (var i = 0; i < lists.length; i++) {
            var obj = lists[i];
            if (selected === obj.id) {
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
  selectFn: function (field, selectId, title, cb) {
    selectId = selectId + '';
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: selectUrl[field],
      param: self.param[field] || '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            var id = lists[i].id || lists[i].itemCode;
            if (selectId === id) {
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
  updateField: function (field, data, type) {
    var self = this;
    var dataArr = self.state[type + 'Data'].customer;
    if (type === 'search') {
      self.state.searchData[field] = data;
    } else {
      for (var i = 0; i < dataArr.length; i++) {
        if (dataArr[i].field === field) {
          dataArr[i].value = data.name;
          if (dataArr[i].valueCode === '' || dataArr[i].valueCode > 0 || dataArr[i].valueCode.length > 0) {
            dataArr[i].valueCode = data.id;
          }
        }
      }
    }
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
            self.state.salesPriceList = [];
            self.state.contactList = [];
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  setEdit: function (cb) {
    var self = this;
    var detail = this.state.detailData;
    self.state.editData = fieldList;
    var arrField = self.state.editData;
    var cusArr = arrField.customer;

    for (var i = 0; i < cusArr.length; i++) {
      var field = cusArr[i].field;
      if (field === 'address') {
        cusArr[i].value = detail[cusArr[i].field].address;
        cusArr[i].valueData = detail[cusArr[i].field];
      } else if (field === 'customerLevel') {
        cusArr[i].value = detail.customerLevelName;
        cusArr[i].valueCode = detail.customerLevelId;
      } else if (field === 'industry') {
        cusArr[i].value = detail.industryName;
        cusArr[i].valueCode = detail.industryId;
      } else if (field === 'parent') {
        cusArr[i].value = detail.parentName;
        cusArr[i].valueCode = detail.parentId;
        self.state.selectParentId = detail.parentId;
      } else {
        cusArr[i].value = detail[cusArr[i].field] || '';
        if (field === 'shortname') {
          cusArr[i].name = '简称';
        }
      }
    }
    cb();
  },
  saveEdit: function (cb, linkBack) {
    var self = this;
    var id = self.state.detailData.id;
    var arr = self.state.editData.customer;
    var param = self.state.hasRepeat ? {
      'linkman': {},
      'hasRepeat': '1'
    } : {
      'linkman': {}
    };
    for (var i = 0; i < arr.length; i++) {
      var field = arr[i].field;
      var pattern = '';
      if (arr[i].isB && !arr[i].value) {
        mui.alert('请输入' + arr[i].name + '！');
        return;
      }
      if (arr[i].inputType === 'tel' && arr[i].value) {
        if (arr[i].valid === 'phone') {
          /* 座机号码*/
          pattern = '((\\d{11})|^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$)';
        } else if (arr[i].valid === 'mobile') {
          /* 手机号码默认*/
          pattern = '^1\\d{10}$';
        } else {
          /* 手机号码默认*/
          pattern = '^[0-9]*$';
        }
      }
      if (arr[i].inputType === 'email' && arr[i].value) {
        /* 电子邮件*/
        pattern = '^[a-z0-9._%-]+@([a-z0-9-]+\\.)+[a-z]{2,4}$';
      }
      if (pattern && !new RegExp(pattern).test(arr[i].value)) {
        mui.alert(arr[i].name + '格式不匹配！');
        return;
      }
      if (arr[i].valueCode) {
        param[field + 'Id'] = arr[i].valueCode;
      } else if (arr[i].valueData) {
        param[field] = arr[i].valueData;
      } else {
        param[field] = arr[i].value;
      }
    }
    self.state.duplicationData.lists = [];
    self.state.duplicationData.showText = '';
    self.state.duplicationData.isTwo = 0;
    self.state.duplicationData.showHide = false;
    nativeApi.initAjax({
      type: 'put',
      url: APIS.customerDetail + id,
      param: param,
      callback: function (result) {
        if (result && result.code === 200) {
          var linkman = result.data;
          if (result.data[0].hasRepeat === 'customerOwn' || result.data[0].hasRepeat === 'customerOther') {
            self.state.duplicationData.lists = linkman;
            self.state.duplicationData.showText = '客户信息已存在，不可编辑。';
            self.state.duplicationData.isTwo = 0;
            self.state.duplicationData.showHide = true;
          } else if (result.data[0].hasRepeat === 'customer') {
            self.state.duplicationData.lists = linkman;
            self.state.duplicationData.showText = '客户信息可能存在，共有' + (linkman.length - 1) + '条匹配记录，是否继续编辑？';
            self.state.duplicationData.isTwo = 1;
            self.state.duplicationData.showHide = true;
          } else {
            if (result.data[0].hasRepeat === 'linkman') {
              mui.alert('客户编辑成功,但因为电话号码重复,联系人创建失败。', '提示', function () {
                if (typeof cb === 'function') {
                  linkBack();
                }
              });
            } else {
              if (typeof cb === 'function') {
                cb();
              }
            }
          }
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  updateAddress: function (result) {
    var self = this;
    var addressId = self.state.detailData.address.id;
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
      'cityCode': result.cityCode,
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
          self.state.detailData.address = param;
          self.state.detailData.address.id = addressId;
        } else {
          mui.alert(resultData.msg || '位置修改失败！', '提示');
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
  disposeDataCon: function (result) {
    var lists = result;
    var conLists = [];
    var self = this;
    for (var i = 0; i < lists.length; i++) {
      lists[i].indexed = lists[i].pinyin.substring(0, 1);
    }
    for (var m = 0; m < lists.length; m++) {
      lists[m].selected = false;
      conLists.push(lists[m]);
    }
    self.state.contactAddList = conLists;
    self.state.arrIndexed = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
  },
  disposeData: function (listData) {
    var ele = [];
    var yearMonth = '';
    var list = [];
    var bl = false;
    var self = this;
    for (var i = 0; i < listData.length; i++) {
      var dataEle = listData[i];
      var str = dataEle.startTime.split(' ');
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
  getToday: function () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    return year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((day < 10) ? ('0' + day) : day);
  }
};
