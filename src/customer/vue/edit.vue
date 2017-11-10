<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveEdit()">保存</a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
      <div class="mui-scroll">
        <div class="the_add">
          <ul class="mui-table-view">
            <crm-list-single v-for="list in edit.editData.customer" :list="list"></crm-list-single>
          </ul>
        </div>
        <div style="height: 10px;"></div>
      </div>
    </div>
    <div v-if="edit.duplicationData.showHide">
      <mui-duplication :duplication="edit.duplicationData"></mui-duplication>
    </div>
  </div>
</template>
<script>
  import listsingle from '../../public/components/listsingle/crm-listsingle.vue';
  import store from '../customer-store';
  var nativeApi = require('nativeApi');
  import duplication from '../../public/components/duplication/duplication.vue';
  export default{
    components: {
      'crm-list-single': listsingle,
      'mui-duplication': duplication
    },
    data: function () {
      return {
        currentHeader: {
          title: '编辑客户'
        },
        edit: store.state
      };
    },
    events: {
      continueSubmit: function () {
        this.edit.duplicationData.showHide = false;
        store.state.hasRepeat = '1';
        store.saveEdit(function () {
          mui.alert('客户编辑成功', '提示', function () {
            history.go(-1);
            setTimeout(function () {
              store.getDetail('', function () {
                store.listRefresh('list');
              });
            }, 50);
          });
        });
      },
      cancelHide: function () {
        this.edit.duplicationData.showHide = false;
      },
      formBack: function (param) {
        var self = this;
        if (param.field === 'parent') {
          self.$router.go('/parentCustomer/edit');
        } else {
          if (typeof store[param.field] === 'function') {
            store.state.selectId = this.addFields.fieldTwo[0].valueCode;
            self.$router.go('/' + param.field + 'Page/' + param.field + '_edit');
          } else {
            store.selectFn(param.field, param.valueCode, param.name, function () {
              self.$router.go('/selectPage/' + param.field + '_edit');
            });
          }
        }
      },
      getAdrMsg: function (fieldData) {
        nativeApi.correctLocation({
          'apiJson': fieldData.valueData,
          callback: function (result) {
            /* 位置纠偏*/
            store.setAddress(result, 'editData');
          }
        });
      }
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      saveEdit: function () {
        store.state.hasRepeat = '';
        store.saveEdit(function () {
          mui.alert('客户编辑成功', '提示', function () {
            history.go(-1);
            setTimeout(function () {
              store.getDetail('', function () {
                store.listRefresh('list');
              });
            }, 50);
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
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
