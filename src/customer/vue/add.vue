<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backGo()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @click="saveAdd()">保存</a>
      <a class="mui-icon-scan mui-icon mui-pull-right second_a" @click="scanCard()"></a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="the_add">
            <ul class="mui-table-view">
              <crm-listicon v-for="list in add.addData.customer" :list.sync="list"
                            :hide.sync="add.addIsHide"></crm-listicon>
            </ul>
            <ul class="mui-table-view">
              <crm-listicon v-for="list in add.addData.contact" :list.sync="list"></crm-listicon>
            </ul>
          </div>
          <div style="height: 10px;"></div>
        </div>
        <div class="add_more" v-if="!add.addIsHide" @click="clickHide()"><span class="mui-icon crm-plus"></span>添加更多信息
        </div>
      </div>
    </div>
    <div v-if="add.duplicationData.showHide">
      <mui-duplication :duplication="add.duplicationData"></mui-duplication>
    </div>
  </div>
</template>
<script>
  import listicon from '../../public/components/listsingle/crm-listicon.vue';
  import store from '../customer-store';
  import duplication from '../../public/components/duplication/duplication.vue';
  var nativeApi = require('nativeApi');
  export default{
    components: {
      'crm-listicon': listicon,
      'mui-duplication': duplication
    },
    data: function () {
      return {
        currentHeader: {
          title: '新建客户'
        },
        add: store.state,
        showHide: false
      };
    },
    events: {
      formBack: function (param) {
        var self = this;
        if (param.field === 'parent') {
          store.scroll.parentCustomer.searchName = '';
          self.$router.go('/parentCustomer/add');
        } else {
          if (typeof store[param.field] === 'function') {
            store.state.selectId = this.addFields.fieldTwo[0].valueCode;
            self.$router.go('/' + param.field + 'Page/' + param.field + '_add');
          } else {
            store.selectFn(param.field, param.valueCode, param.name, function () {
              self.$router.go('/selectPage/' + param.field + '_add');
            });
          }
        }
      },
      setShortName: function (val) {
        store.setShortName(val, 'addData');
      },
      getAdrMsg: function (fieldData) {
        nativeApi.correctLocation({
          'apiJson': fieldData.valueData,
          callback: function (result) {
            /* 位置纠偏*/
            store.setAddress(result, 'addData');
          }
        });
      },
      continueSubmit: function () {
        this.add.duplicationData.showHide = false;
        store.state.hasRepeat = '1';
        store.saveAdd(function () {
          mui.alert('客户新建成功', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative();
            } else {
              history.go(-1);
              setTimeout(function () {
                store.listRefresh('list');
              }, 50);
            }
          });
        });
      },
      cancelHide: function () {
        this.add.duplicationData.showHide = false;
      }
    },
    methods: {
      backGo: function () {
        var self = this;
        if (window.initPage) {
          nativeApi.goNative();
        } else {
          if (mui.os.ios || mui.os.android) {
            setTimeout(function () {
              self.$router.go('/');
            }, 10);
          }
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
            store.cleanAdd(resultData);
          }
        });
      },
      saveAdd: function () {
        store.state.hasRepeat = '';
        store.saveAdd(function () {
          mui.alert('客户新建成功', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative();
            } else {
              history.go(-1);
              setTimeout(function () {
                store.listRefresh('list');
              }, 50);
            }
          });
        }, function () {
          if (window.initPage) {
            nativeApi.goNative();
          } else {
            history.go(-1);
            setTimeout(function () {
              store.listRefresh('list');
            }, 50);
          }
        });
      },
      clickHide: function () {
        store.state.addIsHide = true;
      }
    },
    created: function () {
      var fromNative = this.$route.params.fromNative;
      if (fromNative) {
        window.initPage = 'toAdd';
        store.cleanAdd();
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
