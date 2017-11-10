/**
* @file 新建联系人
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveAdd()">保存</a>
      <a class="mui-icon-scan mui-icon mui-pull-right second_a" @tap="scanCard()"></a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="the_add">
            <ul class="mui-table-view">
              <crm-listicon v-for="list in addFields.fieldOne" :list.sync="list"></crm-listicon>
            </ul>
            <ul class="mui-table-view">
              <crm-listicon v-for="list in addFields.fieldTwo" :list.sync="list"></crm-listicon>
            </ul>
            <ul class="mui-table-view">
              <crm-listicon v-for="list in addFields.fieldThree" :list.sync="list"></crm-listicon>
            </ul>
          </div>
          <div class="switch_li">
            <ul>
              <li>
                <label>导出到通讯录</label>
                <div>
                  <div @tap="switchFn()"
                       :class="{'mui-switch':true, 'mui-switch-mini': true, 'mui-active': detailData.switch}">
                    <div class="mui-switch-handle"></div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div style="height: 30px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../contact-store';
  var nativeApi = require('nativeApi');
  import newListIcon from '../../public/components/listsingle/crm-listicon.vue';
  export default {
    components: {
      'crm-listicon': newListIcon
    },
    data: function () {
      return {
        currentHeader: {
          title: '新建联系人'
        },
        addFields: store.state,
        detailData: {
          'switch': false
        }
      };
    },
    events: {
      formBack: function (param) {
        if (typeof store[param.field] === 'function') {
          store.state.selectId = this.addFields.fieldTwo[0].valueCode;
          this.$router.go('/' + param.field + 'Page/' + param.field + '_add');
        } else {
          store.selectFn(param.field, param.valueCode, param.name);
          this.$router.go('/selectPage/' + param.field + '_add');
        }
      }
    },
    methods: {
      back: function () {
        if (window.initPage) {
          nativeApi.goNative({
            'apiJson': {
              'fn': 'contact'
            }
          });
        } else {
          history.go(-1);
        }
      },
      switchFn: function () {
        if (this.detailData.switch) {
          this.detailData.switch = false;
        } else {
          this.detailData.switch = true;
        }
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
            store.clean(resultData);
          }
        });
      },
      saveAdd: function () {
        var self = this;
        store.saveAdd(function () {
          if (self.detailData.switch) {
            nativeApi.insertContact({
              'apiJson': {
                'id': '',
                'name': self.addFields.fieldOne[0].value,
                'mobile': self.addFields.fieldOne[2].value,
                'phone': self.addFields.fieldOne[3].value,
                'duty': self.addFields.fieldOne[1].value,
                'customer': self.addFields.fieldTwo[0].value
              },
              callback: function (result) {
              }
            });
          }
          mui.alert('联系人新建成功', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'contact',
                  'callFun': 'refreshContact',
                  'param': ''
                }
              });
            } else {
              history.go(-1);
            }
          });
        });
      }
    },
    created: function () {
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toAdd';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      var fromNative = this.$route.params.fromNative;
      if (fromNative) {
        window.initPage = 'toAdd';
      }
      if (window.initPage) {
        store.clean();
      }
    },
    route: {
      data: function () {
        this.detailData.switch = false;
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
