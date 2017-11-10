/**
 * @file
 * @author
 */
// 定义store, store可以被多个组件引用
var nativeApi = require('nativeApi');
import {APIS} from 'configPort';
var loadNext = {
  'list': 'init',
  'search': 'search',
  'chance': 'renderChance',
  'product': 'renderProduct'
};
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  flagList: [],
  APIS: APIS,
  state: {
    addressData: {
      data: {}
    },
    searchList: [],
    editAdrMsg: {},
    moreShow: true,
    moreHeight: '0px',
    lists: [],
    detail: {
      detailId: '',
      address: {
        address: ''
      },
      chanceList: [],
      id: '',
      competitorName: ''
    },
    detailData: {},
    conSeaList: [],
    inLists: {
      show: false
    },
    fieldOne: [
      {
        isB: true,
        icon: 'competitor-icon',
        name: '公司名称',
        field: 'name',
        fieldName: 'competitorName',
        inputType: 'text',
        value: ''
      },
      {
        isB: true,
        icon: 'mui-icon-address',
        href: '2',
        name: '地址',
        inputType: 'address',
        field: 'address',
        fieldName: 'address',
        value: ''
      },
      {
        isB: false,
        icon: 'mui-icon-phone',
        name: '电话',
        inputType: 'tel',
        field: 'phone',
        fieldName: 'competitorPhone',
        value: ''
      },
      {
        isB: false,
        icon: 'height-50',
        name: '备注',
        field: 'beizhu',
        fieldName: 'remark',
        inputType: 'text',
        value: ''
      }
    ],
    fieldTwo: [
      {
        isB: false,
        icon: 'mui-icon-name',
        name: '联系人姓名',
        field: 'contactname',
        fieldName: 'name',
        inputType: 'text',
        value: ''
      },
      {
        isB: false,
        icon: 'mui-icon-dep',
        name: '部门',
        field: 'dep',
        fieldName: 'department',
        inputType: 'text',
        value: ''
      },
      {
        isB: false,
        icon: 'mui-icon-duty',
        name: '职位',
        field: 'duty',
        fieldName: 'title',
        inputType: 'text',
        value: ''
      },
      {
        isB: false,
        icon: 'mui-icon-mobile',
        name: '手机号码',
        field: 'mobile',
        fieldName: 'mobile',
        inputType: 'tel',
        value: ''
      },
      {
        isB: false,
        icon: 'mui-icon-wx',
        name: '微信',
        field: 'weixin',
        fieldName: 'wechat',
        inputType: 'text',
        value: ''
      },
      {
        isB: false,
        icon: 'mui-icon-mail',
        name: '电子邮箱',
        field: 'email',
        fieldName: 'email',
        inputType: 'email',
        value: ''
      },
      {
        isB: false,
        icon: 'mui-icon-birthday',
        href: '1',
        name: '生日',
        fieldName: 'birthday',
        field: 'birthday',
        inputType: 'date',
        value: ''
      }
    ],
    fieldThree: [
      {
        isB: true,
        icon: 'competitor-icon',
        name: '公司名称',
        field: 'name',
        fieldName: 'competitorName',
        inputType: 'text',
        value: ''
      },
      {
        isB: true,
        icon: 'mui-icon-address',
        href: '2',
        name: '地址',
        inputType: 'address',
        field: 'address',
        fieldName: 'address',
        value: ''
      },
      {
        isB: false,
        icon: 'mui-icon-phone',
        name: '电话',
        inputType: 'tel',
        field: 'phone',
        fieldName: 'competitorPhone',
        value: ''
      }
    ],
    products: [],
    contactList: [],
    getCustomerDetail: {
      data: {
        title: {
          title: ''
        },
        testList: [{
          name: '公司名称',
          key: 'competitorName',
          field: 'name',
          inputType: 'text',
          value: ''
        }, {
          icon: 'mui-icon-phone',
          name: '公司电话',
          key: 'mobile',
          field: 'telephone',
          inputType: 'phone',
          value: ''
        }, {
          icon: 'mui-icon-address-api',
          name: '公司地址',
          key: 'address',
          field: 'address',
          inputType: 'address',
          href: '1',
          value: ''
        }, {
          name: '竞争总金额',
          key: 'totalAmount',
          field: '',
          inputType: 'text',
          isB: true,
          value: ''
        }]
      }
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
      scroll: {},
      searchName: ''
    },
    'chance': {
      chanceList: [],
      hasMore: true,
      scroll: {}
    },
    'product': {
      productList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
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
    product: {
      'pageNo': 1,
      'pageSize': 10
    }
  },
  haveRender: false,
  // 在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据
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
  // 客户分配列表
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    var params = self.param[obj];
    nativeApi.initAjax({
      type: 'get',
      url: APIS.competitors_list,
      param: params,
      callback: function (result) {
        if (result && result.code === 200) {
          self.pullList(result, loadType, 'conList', obj);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  clean: function () {
    for (var i = 0; i < this.state.fieldOne.length; i++) {
      this.state.fieldOne[i].value = '';
    }
    for (var j = 0; j < this.state.fieldTwo.length; j++) {
      this.state.fieldTwo[j].value = '';
    }
    this.state.moreShow = true;
    this.state.moreHeight = '0px';
  },
  cleanSearch: function () {
    this.scroll.search.searchName = '';
    this.scroll.search.searchLi = [];
  },
  search: function (loadType) {
    var self = this;
    var obj = 'search';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.competitors_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          self.pullList(result, loadType, 'searchLi', obj);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  // 获取竞争对手详情
  renderDetail: function (id, cb) {
    var This = this;
    nativeApi.initAjax({
      url: APIS.competitors_detail + id,
      type: 'get',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.detailData = result.data;
          for (var i = 0; i < This.state.getCustomerDetail.data.testList.length; i++) {
            if (This.state.getCustomerDetail.data.testList[i].key === 'address') {
              This.state.getCustomerDetail.data.testList[i].value =
                result.data[This.state.getCustomerDetail.data.testList[i].key].address;
            } else if (This.state.getCustomerDetail.data.testList[i].key === 'mobile') {
              This.state.getCustomerDetail.data.testList[i].value =
                result.data.competitorPhone;
            } else if (This.state.getCustomerDetail.data.testList[i].key === 'totalAmount') {
              This.state.getCustomerDetail.data.testList[i].value =
                '￥' + result.data[This.state.getCustomerDetail.data.testList[i].key];
            } else {
              This.state.getCustomerDetail.data.testList[i].value =
                result.data[This.state.getCustomerDetail.data.testList[i].key];
            }
          }
          This.state.addressData.data = result.data.address;
          This.state.detail.id = result.data.id;
          This.state.detail.detailId = result.data.id;
          This.state.detail.competitorName = result.data.competitorName;
          This.renderChance();
          if (typeof cb === 'function') {
            cb();
          }
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
          }, 100);
        } else {
          mui.alert('获取数据失败', '提示');
        }
      }
    });
  },
  renderChance: function (loadType) {
    var self = this;
    var obj = 'chance';
    var params = self.param[obj];
    var id = self.state.detail.id;
    nativeApi.initAjax({
      url: APIS.competitors_detail + id + '/chances',
      type: 'get',
      param: params,
      callback: function (result) {
        if (result && result.code === 200) {
          for (var i = 0; i < result.data.length; i++) {
            var ids = result.data[i].id;
            self.state.inLists[ids] = [];
          }
          self.pullList(result, loadType, 'chanceList', obj);
        } else {
          mui.alert(result.msg || '获取数据失败', '提示');
        }
      }
    });
  },
  renderProduct: function (loadType) {
    var self = this;
    var obj = 'product';
    var params = self.param[obj];
    var id = self.state.detail.detailId;
    nativeApi.initAjax({
      url: APIS.competitors_detail + id + '/products',
      type: 'get',
      param: params,
      callback: function (result) {
        if (result && result.code === 200) {
          self.pullList(result, loadType, 'productList', obj);
        } else {
          mui.alert('获取数据失败', '提示');
        }
      }
    });
  },
  renderContactList: function () {
    var This = this;
    var id = This.state.detail.detailId;
    nativeApi.initAjax({
      url: APIS.competitors_detail + id + '/linkman',
      type: 'get',
      param: '',
      callback: function (result) {
        This.state.contactList = result.data;
      }

    });
  },
  renderEdit: function () {
    var self = this;
    var detailData = self.state.detailData;
    self.state.editAdrMsg = detailData.address;
    for (var i = 0; i < self.state.fieldThree.length; i++) {
      for (var attr in detailData) {
        if (attr === self.state.fieldThree[i].fieldName) {
          if (attr === 'address') {
            self.state.fieldThree[i].value = detailData[attr].address;
          } else {
            self.state.fieldThree[i].value = detailData[attr];
          }
        }
      }
    }
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
          for (var i = 0; i < self.state.getCustomerDetail.data.testList.length; i++) {
            if (self.state.getCustomerDetail.data.testList[i].key === 'address') {
              self.state.getCustomerDetail.data.testList[i].value = result.address;
            }
          }
        } else {
          mui.alert(resultData.msg || '位置修改失败！', '提示');
        }
      }
    });
  },
  pullList: function (result, loadType, field, obj) {
    var lists = result.data;
    var self = this;
    if (loadType === 'refresh') {
      self.scroll[obj].hasMore = true;
      self.scroll[obj][field] = lists;
    } else if (loadType === 'loadMore') {
      self.scroll[obj][field] = self.scroll[obj][field].concat(lists);
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
      }
    }
    /* 判断是否有下一页*/
    var arrList = self.scroll[obj][field];
    if (lists.length < 10 || arrList.length === result.totalSize) {
      self.scroll[obj].scroll.enablePullupToRefresh();
      if (self.param[obj].pageNo === 0) {
        self.scroll[obj].scroll.scrollTo(0, 0, 100);
      }
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
  }
};
