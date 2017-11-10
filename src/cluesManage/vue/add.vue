/* *
* @file
* @author hj
* @date 2016-11-22
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav newCustomer">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class=" mui-icon crm-scan crm-icon " @tap="scanCard"></a>
      <a class="mui-btn mui-btn-blue mui-btn-link mui-pull-right" v-text="currentHeader.name" @tap="save"> </a>
    </header>
    <style>

    </style>
    <div id="af_action_mask"></div>
    <div id="afui"></div>
    <div class="mui-content addClue">
      <div class="mui-scroll-wrapper" style="top:44px;">
        <div class="mui-scroll">
          <div class="add_ac">
            <ul>
              <li>
                <input type="text" placeholder="需求描述(必填)" v-model="addData.needs" @focus="inputFocus('needs')">
              </li>
              <li>
                <textarea placeholder="备注(非必填)" v-model="addData.remark" @focus="inputFocus('remark')"></textarea>
              </li>
            </ul>
          </div>
          <ul style="padding:0px; background:#fff;">
            <li class="mui-table-view-cell crm-listIcon">
              <a :class="{'mui-navigate-right': addData.addType!='customer'}"
                 @tap="addData.addType!='customer'?goTo('customer', 0):''">
                <span class="mui-icon mui-icon-cName redColor"> </span>
                <input v-if="addData.addType!='customer'" type="text" placeholder="客户名称" v-model="addData.customerName">
                <div v-if="addData.addType=='customer'" v-text="addData.customerName"></div>
              </a>
            </li>
            <li class="mui-table-view-cell crm-listIcon">
              <a>
                <span class="mui-icon mui-icon-name redColor"> </span>
                <input type="text" placeholder="联系人" v-model="addData.linkman.name" @focus="inputFocus('linkman.name')">
              </a>
            </li>
            <li class="mui-table-view-cell crm-listIcon">
              <a>
                <span class="mui-icon crm-phone redColor"> </span>
                <input type="text" placeholder="手机" v-model="addData.linkman.mobile"
                       @focus="inputFocus('linkman.mobile')">
              </a>
            </li>
            <li class="mui-table-view-cell crm-listIcon">
              <a>
                <span class="mui-icon mui-icon-phone"> </span>
                <input type="text" placeholder="座机" v-model="addData.linkman.telephone"
                       @focus="inputFocus('linkman.telephone')">
              </a>
            </li>
            <li class="mui-table-view-cell crm-listIcon">
              <a class="mui-navigate-right" @tap="goTo('getQDLocationInfo', 2)">
                <span class="mui-icon crm-addr "> </span>
                <div class="div-e" :class="[addData.address.address ? '' : 'not']">{{addData.address.address || "地址"}}
                </div>
              </a>
            </li>
          </ul>
          <ul style="padding:0px; background:#fff;">
            <li class="mui-table-view-cell crm-listIcon">
              <a :class="{'mui-navigate-right': addData.fromEntityType!='MARKETING_ACTIVITY'}" @tap="addData.fromEntityType=='MARKETING_ACTIVITY'?'':goTo('source', 0)">
                <span class="mui-icon mui-icon-cluesource redColor"> </span>
                <div class="div-e" :class="[addData.source ? '' : 'not']">{{addData.source || "线索来源"}}</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="showHide">
      <mui-duplication :duplication="duplicationData"></mui-duplication>
    </div>
  </div>
</template>
<script>
  import store from '../clue-store';
  var nativeApi = require('nativeApi');
  import {FastClick} from 'fastclick';
  import duplication from '../../public/components/duplication/duplication.vue';
  export default {
    components: {
      'mui-duplication': duplication
    },
    data: function () {
      return {
        addData: store.state.addData,
        show: false,
        currentHeader: {
          title: '新增线索',
          name: '保存'
        },
        testList: [{
          isB: true,
          icon: 'mui-icon-contact',
          name: '需求描述(必填)',
          value: ''
        }, {
          isB: true,
          name: '备注(非必填)',
          value: ''
        }],
        testList1: [
          {
            isB: true,
            icon: 'mui-icon-cName',
            name: '客户名称',
            value: ''
          }, {
            isB: true,
            icon: 'mui-icon-name',
            name: '联系人',
            value: ''
          }, {
            isB: true,
            icon: 'crm-phone',
            name: '联系电话',
            value: ''
          }, {
            isB: true,
            icon: 'crm-addr',
            href: ' ',
            name: '地址',
            value: ''
          }],
        testList2: [{
          isB: true,
          icon: 'mui-icon-cluesource',
          name: '线索来源',
          value: '',
          href: ' '
        }],
        onlyAdrMsg: {},
        duplicationData: {},
        showHide: false
      };
    },
    events: {
      continueSubmit: function () {
        store.save_clue_add_commit(function () {
          mui.alert('保存成功', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'cluesManage'
                }
              });
            } else {
              history.go(-1);
            }
          });
        }, function () {
        });
        this.showHide = false;
      },
      cancelHide: function () {
        this.showHide = false;
      }
    },
    methods: {
      back: function (index) {
        if (window.initPage) {
          nativeApi.goNative({
            'apiJson': {
              'fn': 'cluesManage'
            }
          });
        }
      },
      inputFocus: function (field) {
        var setVal = this.addData;
        nativeApi.showKeyboard({
          callback: function (result) {
            if (field === 'linkman.name') {
              setVal.linkman.name = result.result;
            } else if (field === 'linkman.mobile') {
              setVal.linkman.mobile = result.result;
            } else if (field === 'linkman.telephone') {
              setVal.linkman.telephone = result.result;
            } else {
              setVal[field] = result.result;
            }
          }
        });
      },
      save: function () {
        var self = this;
        var param = self.addData;
        if (!param.needs) {
          mui.alert('请输入需求描述！', '提示');
          return;
        }
        if (!param.customerName) {
          mui.alert('请输入客户名称！', '提示');
          return;
        }
        if (!param.linkman.name) {
          mui.alert('请输入联系人！', '提示');
          return;
        }
        if (!param.linkman.telephone && !param.linkman.mobile) {
          mui.alert('请输入手机号码或座机号码！', '提示');
          return;
        }
        if (param.linkman.mobile && !self.checkTel(param.linkman.mobile)) {
          mui.alert('请输入正确的电话号码！', '提示');
          return;
        }
        if (!param.source) {
          mui.alert('请选择线索来源！', '提示');
          return;
        }
        store.save_clue_add(function () {
          mui.alert('保存成功', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'cluesManage'
                }
              });
            } else {
              history.go(-1);
            }
          });
        }, function (linkman) {
          self.showHide = true;
          self.duplicationData = {
            'lists': linkman,
            'isTwo': 1,
            'showText': '线索信息可能存在,共有' + linkman.length + '条匹配记录：是否继续新建？'
          };
        });
      },
      add: function () {
        var oUl = document.getElementById('addMore');
        this.show = !this.show;
        if (this.show === true) {
          oUl.style.height = this.testList.length * 42 + 'px';
        }
      },
      goTo: function (fn, type) {
        var self = this;
        if (type === 1) {
          /* 拍照、录音*/
          nativeApi[fn]({
            'apiJson': {
              'backType': '2',
              'wDivisor': '1024',
              'hDivisor': '780'
            },
            callback: function (result) {
              self.editData.actData.appendixs.push({
                'type': result.imgPath ? 'image' : 'sound',
                'path': result.imgPath || result.recordPath
              });
            }
          });
        } else if (type === 0) {
          /* 客户、联系人、机会选择*/
          var selectId = self.addData[fn + 'Id'];
          if (fn === 'customer') {
            store.state.selectId = selectId;
            self.$router.go('/customerPage/' + fn + '_addc');
            return;
          }
          store.selectFn(fn, selectId, '线索来源');
          self.$router.go('/selectPage/' + fn + '_add');
        } else {
          nativeApi.correctLocation({
            'apiJson': {
              'longitude': self.onlyAdrMsg.longitude,
              'latitude': self.onlyAdrMsg.latitude,
              'title': '',
              'address': self.onlyAdrMsg.address,
              'showMap': false
            },
            callback: function (result) {
              /* 位置纠偏*/
              self.onlyAdrMsg = result;
              self.addData.address = result;
            }
          });
        }
      },
      getFirstAdr: function () {
        var self = this;
        nativeApi.getQDLocationInfo({
          callback: function (result) {
            self.addData.address = result;
            self.onlyAdrMsg = result;
          }
        });
      },
      checkTel: function (tel) {
        var mobile = /^1[3|4|5|6|7|8|9]\d{9}$/;
        var phone = /^0\d{2,3}-?\d{7,8}$/;
        return mobile.test(tel) || phone.test(tel);
      },
      scanCard: function () {
        nativeApi.bcardScan({
          'apiJson': {
            'bcardType': 'capture',
            'uploadUrl': store.APIS.upload_file
          },
          callback: function (result) {
            var name = result.name || '';
            var address = result.address || '';
            var email = result.email || '';
            var tel = result.tel || '';
            var mobile = result.mobile || '';
            var duty = result.duty || '';
            var company = result.company || '';
            if (company.indexOf('()') > -1) {
              company = company.substring(0, company.indexOf('()'));
            }
            if (name.indexOf('()') > -1) {
              name = name.substring(0, name.indexOf('()'));
            }
            if (address.indexOf('()') > -1) {
              address = address.substring(0, address.indexOf('()'));
            }
            if (email.indexOf('()') > -1) {
              email = email.substring(0, email.indexOf('()'));
            }
            if (tel.indexOf('()') > -1) {
              tel = tel.split('()');
              if (tel.length > 1) {
                tel = tel[0];
              } else {
                tel = tel[0];
              }
            }
            if (duty.indexOf('()') > -1) {
              duty = duty.substring(0, duty.indexOf('()'));
            }
            var resultData = {
              'company': company,
              'name': name,
              'address': address,
              'email': email,
              'mobile': mobile,
              'duty': duty,
              'telephone': tel,
              'addHeadId': result.fId
            };
            store.cleanAdd(resultData);
          }
        });
      }
    },
    created: function () {
      var self = this;
      var localKey = self.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toAdd';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      var fromNative = this.$route.params.fromNative;
      if (fromNative) {
        window.initPage = 'toAdd';
      }
      if (window.initParam) {
        if (window.initParam.type === 'customer') {
          self.addData.customerId = window.initParam.customerId;
          self.addData.customerName = window.initParam.customerName;
          self.addData.addType = 'customer';
        } else {
          self.addData.sourceId = window.initParam.id;
          self.addData.source = '市场活动';
          self.addData.fromEntityType = 'MARKETING_ACTIVITY';
        }
      }
    },
    route: {
      data: function () {
        var self = this;
        if (!self.addData.address.address) {
          self.getFirstAdr();
        }
      }
    },
    ready: function () {
      FastClick.attach(document.body);
      mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005  // flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
      });
    }
  };
</script>
