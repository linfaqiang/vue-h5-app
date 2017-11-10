<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @click="back" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">维护客户层级</h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveParent()">保存</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <div class="add_form">
            <ul>
              <li class="mui-icon">
                <span v-if="isParent.isParent==0">父客户</span>
                <span v-else>子客户</span>
                <span class="right-customer">{{data.name}}</span>
              </li>
              <li class="mui-icon">
                <span class="f_14" style="display: inline">备注</span>
                <textarea class="parent-beizhu texTarea" @focus="inputFocus" v-model="data.remark"></textarea>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from './hierarchy-store.js';
  var nativeApi = require('nativeApi');
  export default{
    data: function () {
      return {
        isParent: store.state,
        current: store.state.current,
        lists: store.state.lists,
        data: {
          name: '',
          remark: ''
        }
      };
    },
    route: {
      activate: function (transition) {
        if (this.$route.params.id) {
          this.data.name = this.$route.params.name;
          if (this.$route.params.remark === 'null') {
            this.data.remark = '';
          } else {
            this.data.remark = this.$route.params.remark;
          }
        } else {
          this.data.name = store.state.lists.parent.name;
          this.data.remark = store.state.lists.parent.remark;
        }
        transition.next();
      }
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.lists.parent.remark = result.result;
          }
        });
      },
      editParent: function (id) {
        this.$router.go('/hierarchy-parent/' + id);
      },
      saveParent: function () {
        var self = this;
        var obj = {};
        if (self.$route.params.id) {
          obj = {
            id: self.$route.params.id,
            name: self.$route.params.name,
            parentRemark: self.data.remark
          };
        } else {
          obj = {
            id: self.current.currentId,
            name: self.current.currentName,
            parentRemark: self.data.remark
          };
        }
        store.setCustomers(obj, function () {
          store.init(self.current.currentId, function () {
            history.go(-1);
          });
        });
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
