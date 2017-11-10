/* *
 * @file  联系人 数据中转站
 * @author  hj
 */
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');
var fieldListOne = [
  {
    isB: true,
    icon: 'mui-icon-name',
    name: '姓名',
    field: 'name',
    valid: '',
    inputType: 'text',
    value: ''
  },
  {
    isB: true,
    icon: 'mui-icon-duty',
    name: '职位',
    valid: '',
    inputType: 'text',
    field: 'title',
    value: ''
  },
  {
    isB: true,
    icon: 'mui-icon-mobile',
    name: '手机',
    inputType: 'tel',
    valid: 'tel',
    field: 'mobile',
    value: ''
  },
  {
    isB: false,
    icon: 'mui-icon-phone',
    name: '座机',
    field: 'telephone',
    valid: '',
    inputType: 'tel',
    value: ''
  }
];
var fieldListTwo = [
  {
    isB: true,
    icon: 'mui-icon-customer',
    href: '1',
    name: '公司',
    field: 'customer',
    inputType: 'select',
    value: '',
    valueCode: ''
  },
  {
    isB: false,
    icon: 'mui-icon-dep',
    name: '部门',
    valid: '',
    inputType: 'text',
    field: 'department',
    value: ''
  }
];
var fieldListThree = [
  {
    isB: false,
    icon: 'mui-icon-birthday',
    name: '生日',
    href: '1',
    inputType: 'date',
    field: 'birthday',
    value: ''
  },
  {
    isB: false,
    icon: 'mui-icon-qq',
    name: 'QQ',
    field: 'qq',
    valid: 'qq',
    inputType: 'tel',
    value: ''
  },
  {
    isB: false,
    icon: 'mui-icon-wx',
    name: '微信',
    field: 'wechat',
    valid: '',
    inputType: 'text',
    value: ''
  },
  {
    isB: false,
    icon: 'mui-icon-mail',
    name: 'MAIL',
    field: 'email',
    valid: '',
    inputType: 'email',
    value: ''
  }
];
/* 翻页函数*/
var loadNext = {
  'customer': 'customer'
};
// 定义store, store可以被多个组件引用
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  APIS: APIS,
  state: {
    conList: [],
    arrIndexed: [],
    conDetail: {},
    detailType: '',
    notesList: [],
    conSeaList: [],
    bookList: [],
    fieldListOne: [],
    fieldListTwo: [],
    fieldListThree: [],
    fieldOne: [],
    fieldTwo: [],
    fieldThree: [],
    textNotes: '',
    selectTitle: '',
    selectLi: [],
    selectId: '',
    addHeadId: ''
  },
  scroll: {
    'customer': {
      customerLi: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    customer: {
      'q': '',
      'isEncrypt': 0,
      'isSelf': 1,
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
  // 在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据
  init: function () {
    var self = this;
    /* 创建联系人表*/
    /* nativeApi.executeQuery({
     'apiJson' : {
     'sql': 'drop table contact',
     'param': ''
     },
     callback: function (result) {}
     });
     return;*/
    nativeApi.executeQuery({
      'apiJson': {
        'sql': 'create table if not exists contact (' +
        "'id' INTEGER primary key," +
        "'dbId' VARCHAR(20)," + /* 数据库ID*/
        "'name' VARCHAR(20)," + /* 联系人名字*/
        "'telephone' VARCHAR(20)," + /* 座机*/
        "'mobile' VARCHAR(20)," + /* 手机*/
        "'qq' VARCHAR(20)," + /* qq*/
        "'pinyin' VARCHAR(40)," + /* 全拼*/
        "'py' VARCHAR(2)," + /* 首字母*/
        "'wechat' VARCHAR(40)," + /* 微信*/
        "'customerId' VARCHAR(10)," + /* 客户ID*/
        "'customerName' VARCHAR(40)," + /* 客户名称*/
        "'address' VARCHAR(100)," + /* 地址*/
        "'birthday' VARCHAR(20)," + /* 生日*/
        "'department' VARCHAR(20)," + /* 部门*/
        "'title' VARCHAR(20)," + /* 职务*/
        "'email' VARCHAR(20)," + /* 邮箱*/
        "'headPhotoId' VARCHAR(10)," + /* 头像ID*/
        "'headPhotoUrl' VARCHAR(100)" + /* 头像路径*/
        ')',
        'param': ''
      },
      callback: function (result) {
        self.refreshData();
      }
    });
  },
  refreshData: function (cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.contact_list,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          nativeApi.executeQuery({
            'apiJson': {
              'sql': 'delete from contact'
            },
            callback: function () {
              /* 数据插入*/
              var sql = 'insert into contact(dbId, name, telephone, mobile, qq, pinyin, py, wechat, customerId, customerName, address, headPhotoId, headPhotoUrl,birthday,department,title,email) values';
              var lists = result.data;
              if (mui.os.android) {
                var sqlArr = [];
                for (var i = 0; i < lists.length; i++) {
                  sqlArr.push(sql + "('" + (lists[i].id || '') + "','" + (lists[i].name || '') + "','" + (lists[i].telephone || '') + "','" + (lists[i].mobile || '') + "','" + (lists[i].qq || '') + "','" + (lists[i].pinyin || '') + "', '" + (lists[i].py.toUpperCase() || '') + "','" + (lists[i].wechat || '') + "','" + (lists[i].customerId || '') + "','" + (lists[i].customerName || '') + "','" + (lists[i].address || '') + "','" + (lists[i].headPhotoId || '') + "','" + (lists[i].headPhotoUrl || '') + "','" + (lists[i].birthday || '') + "','" + (lists[i].department || '') + "','" + (lists[i].title || '') + "','" + (lists[i].email || '') + "')");
                }
                nativeApi.executeSqls({
                  'apiJson': {
                    'sql': sqlArr,
                    'param': ''
                  },
                  callback: function () {
                    nativeApi.executeQuery({
                      'apiJson': {
                        'sql': 'select dbId as id,name,telephone,mobile,qq,py as indexed,wechat,customerId,customerName,address,headPhotoId,headPhotoUrl,birthday,department,title,email from contact order by py asc',
                        'param': ''
                      },
                      callback: function (result) {
                        self.disposeData(result);
                        if (typeof cb === 'function') {
                          cb();
                        }
                      }
                    });
                  }
                });
              } else {
                self.sqLiteInsert(sql, lists, 0, function () {
                  nativeApi.executeQuery({
                    'apiJson': {
                      'sql': 'select dbId as id,name,telephone,mobile,qq,py as indexed,wechat,customerId,customerName,address,headPhotoId,headPhotoUrl,birthday,department,title,email from contact order by py asc',
                      'param': ''
                    },
                    callback: function (result) {
                      self.disposeData(result);
                      if (typeof cb === 'function') {
                        cb();
                      }
                    }
                  });
                });
              }
            }
          });
        } else {
          mui.alert(result.msg || '没有获取到数据！', '提示');
        }
      }
    });
  },
  sqLiteInsert: function (sql, arr, num, cb) {
    num = !num ? 0 : num;
    var pageS = 500;
    var liSQL = sql;
    var self = this;
    var maxNum = (num + 1) * pageS;
    var flag = false;
    if (maxNum > arr.length) {
      maxNum = arr.length;
      flag = true;
    }

    for (var i = 0; i < arr.length; i++) {
      if (i >= (num * pageS) && i < maxNum) {
        liSQL += "('" + (arr[i].id || '') + "','" + (arr[i].name || '') + "','" + (arr[i].telephone || '') + "','" + (arr[i].mobile || '') + "','" + (arr[i].qq || '') + "','" + (arr[i].pinyin || '') + "', '" + (arr[i].py.toUpperCase() || '') + "','" + (arr[i].wechat || '') + "','" + (arr[i].customerId || '') + "','" + (arr[i].customerName || '') + "','" + (arr[i].address || '') + "','" + (arr[i].headPhotoId || '') + "','" + (arr[i].headPhotoUrl || '') + "','" + (arr[i].birthday || '') + "','" + (arr[i].department || '') + "','" + (arr[i].title || '') + "','" + (arr[i].email || '') + "')";
        if (i === (maxNum - 1)) {
          liSQL += ';';
        } else {
          liSQL += ',';
        }
      }
    }
    nativeApi.executeSqls({
      'apiJson': {
        'sql': liSQL,
        'param': ''
      },
      callback: function () {
        if (!flag) {
          num++;
          self.sqLiteInsert(sql, arr, num, cb);
        } else {
          if (typeof cb === 'function') {
            cb();
          }
        }
      }
    });
  },
  disposeData: function (result) {
    var lists = result;
    var conList = [];
    var self = this;
    for (var i = 0; i < lists.length; i++) {
      if (i === 0 || (i > 0 && lists[i].indexed !== lists[i - 1].indexed)) {
        conList.push({
          'isGroup': true,
          'indexedGroup': lists[i].indexed
        });
      }
      conList.push(lists[i]);
    }
    self.state.conList = JSON.stringify(conList);
    self.state.conList = JSON.parse(self.state.conList);
    self.state.arrIndexed = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
  },
  search: function (searchName) {
    var self = this;
    if (!searchName) {
      self.state.conSeaList = [];
      self.state.bookList = [];
      return;
    }
    nativeApi.executeQuery({
      'apiJson': {
        'sql': "select dbId as id,name,telephone,mobile,qq,py as indexed,wechat,email,customerId,customerName,address,headPhotoId,headPhotoUrl,birthday,department,title from contact where name like '%" + searchName + "%' order by py asc",
        'param': ''
      },
      callback: function (result) {
        self.state.conSeaList = JSON.stringify(result);
        self.state.conSeaList = JSON.parse(self.state.conSeaList);
        self.state.bookList = [];
      }
    });
  },
  cleanSearch: function () {
    this.state.conSeaList = [];
    this.state.bookList = [];
  },
  searchBook: function (books) {
    this.state.conSeaList = [];
    this.state.bookList = books;
  },
  clean: function (resultData) {
    resultData = resultData || {};
    if (resultData.addHeadId) {
      this.state.addHeadId = resultData.addHeadId;
    }
    for (var i = 0; i < fieldListOne.length; i++) {
      fieldListOne[i].value = resultData[fieldListOne[i].field] || '';
    }
    for (var m = 0; m < fieldListTwo.length; m++) {
      fieldListTwo[m].value = resultData[fieldListTwo[m].field] || '';
      if (fieldListTwo[m].valueCode) {
        fieldListTwo[m].valueCode = resultData[fieldListTwo[m].field] || '';
      }
    }
    for (var n = 0; n < fieldListThree.length; n++) {
      fieldListThree[n].value = resultData[fieldListThree[n].field] || '';
    }
    this.state.detailType = window.initParam ? window.initParam.type : '';
    this.state.fieldOne = fieldListOne;
    this.state.fieldTwo = fieldListTwo;
    this.state.fieldThree = fieldListThree;
    if (this.state.detailType === 'clue') {
      /* 跟线索关联*/
      this.state.fieldTwo[0].name = '线索';
      this.state.fieldTwo[0].field = 'clue';
      this.state.fieldTwo[0].value = window.initParam.name;
      this.state.fieldTwo[0].valueCode = window.initParam.id;
      this.state.fieldTwo[0].href = 'not';
    } else if (this.state.detailType === 'competitor') {
      /* 跟竞争对手关联*/
      this.state.fieldTwo[0].name = '竞争对手';
      this.state.fieldTwo[0].field = 'competitor';
      this.state.fieldTwo[0].value = window.initParam.name;
      this.state.fieldTwo[0].valueCode = window.initParam.id;
      this.state.fieldTwo[0].href = 'not';
    } else if (this.state.detailType === 'customer') {
      /* 跟客户关联*/
      this.state.fieldTwo[0].name = '公司';
      this.state.fieldTwo[0].field = 'customer';
      this.state.fieldTwo[0].value = window.initParam.customerName;
      this.state.fieldTwo[0].valueCode = window.initParam.customerId;
      this.state.fieldTwo[0].href = 'not';
    }
  },
  detail: function (id, cb) {
    var self = this;
    nativeApi.executeQuery({
      'apiJson': {
        'sql': 'create table if not exists contact (' +
        "'id' INTEGER primary key," +
        "'dbId' VARCHAR(20)," + /* 数据库ID*/
        "'name' VARCHAR(20)," + /* 联系人名字*/
        "'telephone' VARCHAR(20)," + /* 座机*/
        "'mobile' VARCHAR(20)," + /* 手机*/
        "'qq' VARCHAR(20)," + /* qq*/
        "'pinyin' VARCHAR(40)," + /* 全拼*/
        "'py' VARCHAR(2)," + /* 首字母*/
        "'wechat' VARCHAR(40)," + /* 微信*/
        "'customerId' VARCHAR(10)," + /* 客户ID*/
        "'customerName' VARCHAR(40)," + /* 客户名称*/
        "'address' VARCHAR(100)," + /* 地址*/
        "'birthday' VARCHAR(20)," + /* 生日*/
        "'department' VARCHAR(20)," + /* 部门*/
        "'title' VARCHAR(20)," + /* 职务*/
        "'email' VARCHAR(20)," + /* 邮箱*/
        "'headPhotoId' VARCHAR(10)," + /* 头像ID*/
        "'headPhotoUrl' VARCHAR(100)" + /* 头像路径*/
        ')',
        'param': ''
      },
      callback: function (result) {
        nativeApi.executeQuery({
          'apiJson': {
            'sql': "select dbId as id,name,telephone,mobile,qq,py as indexed,wechat,email,customerId,customerName as customer,address,headPhotoId,headPhotoUrl,birthday,department,title from contact where dbId='" + parseInt(id) + "'"
          },
          callback: function (result) {
            if (result && result.length === 0) {
              self.ajaxDetail(id);
              return;
            }
            self.state.conDetail = JSON.stringify(result[0]);
            self.state.conDetail = JSON.parse(self.state.conDetail);
            self.state.conDetail.isChance = false;
            if (window.initParam && window.initParam.type === 'chance') {
              self.state.conDetail.isChance = true;
            }
            if (window.initParam && window.initParam.type) {
              self.state.detailType = window.initParam.type;
              fieldListTwo[0].href = 'not';
            }
            if (typeof cb === 'function') {
              cb();
            }
          }
        });
      }
    });
  },
  ajaxDetail: function (id) {
    var self = this;
    nativeApi.initAjax({
      'type': 'get',
      'url': APIS.contact_detail + '/' + id + '/customer', // clue、competitor
      'param': '',
      callback: function (result) {
        if (result && result.code === 200) {
          result.data.customer = result.data.customerName;
          self.state.conDetail = JSON.stringify(result.data);
          self.state.conDetail = JSON.parse(self.state.conDetail);
          self.state.conDetail.isChance = false;
          if (window.initParam && window.initParam.type === 'chance') {
            self.state.conDetail.isChance = true;
          }
          if (window.initParam && window.initParam.type) {
            self.state.detailType = window.initParam.type;
            fieldListTwo[0].href = 'not';
          }
        } else {
          mui.alert(result.msg || '没有获取到数据！', '提示');
        }
      }
    });
  },
  showDetail: function (param) {
    this.state.detailType = param.type;
    this.state.conDetail = param.data;
    if (this.state.detailType === 'clue') {
      /* 跟线索关联*/
      fieldListTwo[0].name = '线索';
      fieldListTwo[0].field = 'clue';
      fieldListTwo[0].href = 'not';
      this.state.conDetail.clue = this.state.conDetail.customerName;
    } else if (this.state.detailType === 'competitor') {
      /* 跟竞争对手关联*/
      fieldListTwo[0].name = '竞争对手';
      fieldListTwo[0].field = 'competitor';
      fieldListTwo[0].href = 'not';
      this.state.conDetail.competitor = this.state.conDetail.competitorName;
    } else if (this.state.detailType === 'customer') {
      /* 跟客户关联*/
      fieldListTwo[0].name = '公司';
      fieldListTwo[0].field = 'customer';
      fieldListTwo[0].href = 'not';
      this.state.conDetail.customer = this.state.conDetail.customerName;
    }
  },
  removeContact: function (cb) {
    var self = this;
    nativeApi.initAjax({
      'type': 'delete',
      'url': APIS.chance_contact_delete.replace('{id}', self.state.conDetail.id) + '?chanceId=' + window.initParam.chanceId,
      'param': '',
      callback: function (result) {
        if (result && result.code === 200) {
          cb();
        } else {
          mui.alert(result.msg || '移除失败！', '提示');
        }
      }
    });
  },
  saveHeadPhoto: function (headPhoto) {
    var self = this;
    var id = self.state.conDetail.id;
    var url = APIS.contact_update_head + '/' + id;
    if (self.state.detailType === 'clue') {
      url = APIS.clue_contact_head_save.replace('{id}', id);
    } else if (self.state.detailType === 'competitor') {
      url = APIS.competitors_contact_save + '/' + id;
    }
    nativeApi.initAjax({
      'type': 'put',
      'url': url,
      'param': {
        'headPhotoId': headPhoto.fId
      },
      callback: function (result) {
        if (result && result.code === 200) {
          if (self.state.detailType === 'clue' || self.state.detailType === 'competitor' || self.state.detailType === 'customer') {
            self.state.conDetail.headPhotoId = headPhoto.fId;
            self.state.conDetail.headPhotoUrl = headPhoto.fileUrl;
          } else {
            nativeApi.executeQuery({
              'apiJson': {
                'sql': "update contact set headPhotoId='" + headPhoto.fId + "',headPhotoUrl='" + headPhoto.fileUrl + "' where dbId='" + id + "'"
              },
              callback: function (result) {
                self.state.conDetail.headPhotoId = headPhoto.fId;
                self.state.conDetail.headPhotoUrl = headPhoto.fileUrl;
              }
            });
          }
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
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
          for (var i = 0; i < lists.length; i++) {
            if (self.state.selectId === lists[i].id) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          if (loadType === 'refresh') {
            self.scroll[obj].customerLi = lists;
          } else if (loadType === 'loadMore') {
            self.scroll[obj].customerLi = self.scroll[obj].customerLi.concat(lists);
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].customerLi = lists;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].customerLi = lists;
              /* 当前显示数量*/
              self.state.seaTotal = lists.length;
              self.state.seaTotalAll = result.totalSize;
            }
          }
          if (self.param[obj].pageNo === 1) {
            self.scroll[obj].scroll.scrollTo(0, 0, 100);
          }
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].customerLi.length === result.totalSize) {
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
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  saveAdd: function (cb) {
    var self = this;
    var fieldOne = self.state.fieldOne;
    var fieldTwo = self.state.fieldTwo;
    var fieldThree = self.state.fieldThree;
    var arr = fieldOne.concat(fieldTwo);
    var url = APIS.contact_list;
    var param = {};
    arr = arr.concat(fieldThree);
    for (var i = 0; i < arr.length; i++) {
      var field = arr[i].field;
      var pattern = '';
      if (arr[i].isB && !arr[i].value) {
        mui.alert('请输入' + arr[i].name + '！');
        return;
      }
      if (arr[i].inputType === 'tel' && arr[i].value) {
        if (arr[i].valid === 'qq') {
          /* qq的验证*/
          pattern = '^\\d{5,12}$';
        } else {
          /* 手机号码默认*/
          pattern = '^1\\d{10}$';
        }
      }
      if (arr[i].inputType === 'email' && arr[i].value) {
        /* 电子邮件*/
        pattern = '^[a-z0-9._%-]+@([a-z0-9-]+\\.)+[a-z]{2,4}$';
      }
      if (arr[i].field === 'telephone' && arr[i].value) {
        /* 座机号码*/
        pattern = '((\\d{11})|^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$)';
      }
      if (pattern && !new RegExp(pattern).test(arr[i].value)) {
        mui.alert(arr[i].name + '格式不匹配！');
        return;
      }
      if (field === 'customer') {
        param[field + 'Id'] = arr[i].valueCode;
      } else if (field === 'clue') {
        param[field + 'Id'] = arr[i].valueCode;
        url = APIS.clue_contact_save;
      } else if (field === 'competitor') {
        param[field + 'Id'] = arr[i].valueCode;
        url = APIS.competitors_contact_save;
      } else {
        param[field] = arr[i].value;
      }
    }
    param.headPhotoId = self.state.addHeadId;
    nativeApi.initAjax({
      'type': 'post',
      'url': url,
      'param': param,
      callback: function (result) {
        if (result && result.code === 200) {
          cb();
          if (!window.initPage) {
            self.refreshData();
          }
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  getDateTime: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    return year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day) + ' ' + (hour < 10 ? ('0' + hour) : hour) + ':' + (minutes < 10 ? ('0' + minutes) : minutes);
  },
  toEdit: function (cb) {
    var self = this;
    var detail = self.state.conDetail;
    var fieldsOne = fieldListOne;
    var fieldsTwo = fieldListTwo;
    var fieldsThree = fieldListThree;
    for (var i = 0; i < fieldsOne.length; i++) {
      fieldsOne[i].value = detail[fieldsOne[i].field] || '';
    }
    for (var m = 0; m < fieldsTwo.length; m++) {
      fieldsTwo[m].value = detail[fieldsTwo[m].field] || '';
      if (detail[fieldsTwo[m].field + 'Id']) {
        fieldsTwo[m].valueCode = detail[fieldsTwo[m].field + 'Id'];
      }
    }
    for (var n = 0; n < fieldsThree.length; n++) {
      fieldsThree[n].value = detail[fieldsThree[n].field] || '';
    }
    self.state.fieldListOne = fieldsOne;
    self.state.fieldListTwo = fieldsTwo;
    self.state.fieldListThree = fieldsThree;
    if (typeof cb === 'function') {
      cb();
    }
  },
  saveEdit: function (cb) {
    var self = this;
    var fieldOne = self.state.fieldListOne;
    var fieldTwo = self.state.fieldListTwo;
    var fieldThree = self.state.fieldListThree;
    var arr = fieldOne.concat(fieldTwo);
    var id = self.state.conDetail.id;
    var url = APIS.contact_list + '/' + id;
    var param = {};
    arr = arr.concat(fieldThree);
    for (var i = 0; i < arr.length; i++) {
      var field = arr[i].field;
      var pattern = '';
      if (arr[i].isB && !arr[i].value) {
        mui.alert('请输入' + arr[i].name + '！');
        return;
      }
      if (arr[i].inputType === 'tel' && arr[i].value) {
        if (arr[i].valid === 'qq') {
          /* qq的验证*/
          pattern = '^\\d{5,12}$';
        } else {
          /* 手机号码默认*/
          pattern = '^1\\d{10}$';
        }
      }
      if (arr[i].inputType === 'email' && arr[i].value) {
        /* 电子邮件*/
        pattern = '^[a-z0-9._%-]+@([a-z0-9-]+\\.)+[a-z]{2,4}$';
      }
      if (arr[i].field === 'telephone' && arr[i].value) {
        /* 座机号码*/
        pattern = '((\\d{11})|^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$)';
      }
      if (pattern && !new RegExp(pattern).test(arr[i].value)) {
        mui.alert(arr[i].name + '格式不匹配！');
        return;
      }
      if (field === 'customer') {
        param[field + 'Id'] = arr[i].valueCode;
      } else if (field === 'clue') {
        param[field + 'Id'] = arr[i].valueCode;
        url = APIS.clue_contact_save + '/' + id;
      } else if (field === 'competitor') {
        param[field + 'Id'] = arr[i].valueCode;
        url = APIS.competitors_contact_save + '/' + id;
      } else {
        param[field] = arr[i].value;
      }
    }
    nativeApi.initAjax({
      'type': 'put',
      'url': url,
      'param': param,
      callback: function (result) {
        if (result && result.code === 200) {
          if (!self.state.detailType) {
            self.refreshData(function () {
              self.detail(self.state.conDetail.id);
            });
          } else {
            self.refreshDetail(param);
          }
          cb();
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  refreshDetail: function (param) {
    var self = this;
    self.state.conDetail.name = param.name;
    self.state.conDetail.birthday = param.birthday;
    self.state.conDetail.department = param.department;
    self.state.conDetail.title = param.title;
    self.state.conDetail.email = param.email;
    self.state.conDetail.wechat = param.wechat;
    self.state.conDetail.telephone = param.telephone;
    self.state.conDetail.qq = param.qq;
    self.state.conDetail.mobile = param.mobile;
  },
  updateField: function (field, valData, type) {
    var self = this;
    var arr = [];
    if (type === 'add') {
      arr = self.state.fieldTwo;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].field === field) {
          arr[i].value = valData.name;
          arr[i].valueCode = valData.id;
        }
      }
    } else if (type === 'edit') {
      arr = self.state.fieldListTwo;
      for (var m = 0; m < arr.length; m++) {
        if (arr[m].field === field) {
          arr[m].value = valData.name;
          arr[m].valueCode = valData.id;
        }
      }
      self.state.fieldListTwo = arr;
    }
  }
};
