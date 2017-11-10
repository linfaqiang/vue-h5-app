/**
* @file
* @author hj
* @date 2016-11-
*/
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
            <crm-list-single :list="list" v-for=" list in fields.fieldListOne"></crm-list-single>
          </ul>
          <ul class="mui-table-view">
            <crm-list-single :list="list" v-for=" list in fields.fieldListTwo"></crm-list-single>
          </ul>
          <ul class="mui-table-view">
            <crm-list-single :list="list" v-for=" list in fields.fieldListThree"></crm-list-single>
          </ul>
        </div>
        <div class="switch_li">
          <ul>
            <li>
              <label>导出到通讯录</label>
              <div>
                <div @tap="switchFn()" :class="{'mui-switch':true, 'mui-switch-mini': true, 'mui-active': switch}">
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
</template>
<script>
  import store from '../contact-store';
  var nativeApi = require('nativeApi');
  import editListSingle from '../../public/components/listsingle/crm-listsingle.vue';
  export default {
    components: {
      'crm-list-single': editListSingle
    },
    data: function () {
      return {
        currentHeader: {
          title: '编辑联系人'
        },
        fields: store.state,
        switch: false
      };
    },
    events: {
      formBack: function (param) {
        if (typeof store[param.field] === 'function') {
          store.state.selectId = this.fields.fieldListTwo[0].valueCode;
          this.$router.go('/' + param.field + 'Page/' + param.field + '_edit');
        } else {
          store.selectFn(param.field, param.valueCode, param.name);
          this.$router.go('/selectPage/' + param.field + '_edit');
        }
      }
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      switchFn: function () {
        if (this.switch) {
          this.switch = false;
        } else {
          this.switch = true;
        }
      },
      saveEdit: function () {
        var self = this;
        store.saveEdit(function () {
          if (self.switch) {
            nativeApi.insertContact({
              'apiJson': {
                'id': '',
                'name': self.fields.fieldListOne[0].value,
                'mobile': self.fields.fieldListOne[2].value,
                'phone': self.fields.fieldListOne[3].value,
                'duty': self.fields.fieldListOne[1].value,
                'customer': self.fields.fieldListTwo[0].value
              },
              callback: function (result) {
              }
            });
          }
          if (window.initPage) {
            window.isEdit = true;
          }
          mui.alert('联系人编辑成功', '提示', function () {
            history.go(-1);
          });
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
