<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @click="back" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">维护客户层级</h1>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <div class="add_form">
            <ul style="margin-top: 10px">
              <li class="mui-icon" style="padding-bottom: 18px; padding-top: 18px">
                <span>当前客户</span>
                <span class="right-customer">{{current.currentName}}</span>
              </li>
            </ul>
            <ul>
              <li class="mui-icon">
                <span>父客户</span>
                <span class="addChildren" v-if="!lists.parent.id" @tap="searchParent"><span
                  class="big">+</span>新增</span>
              </li>
              <li class="mui-icon" v-if="lists.parent.id">
                        <span @tap="editParent()" class="parent-edit">
                            <span class="f_14">{{lists.parent.name}}</span>
                            <span class="remarks">备注:{{lists.parent.remark}}</span>
                        </span>
                <span class="mui-icon mui-icon-dustbin mui-must" @tap="deleteCustomers(current.currentId)"></span>
              </li>
            </ul>
            <ul>
              <li class="mui-icon ">
                <span>子客户</span>
                <span class="addChildren" @tap="searchChild"><span class="big">+</span>新增</span>
              </li>
              <li class="mui-icon" v-for="list in lists.subdirectories">
                        <span @tap="editParent(list)" class="parent-edit">
                            <span class="f_14">{{list.name}}</span>
                            <span class="remarks">备注:{{list.remark}}</span>
                        </span>
                <span class="mui-icon mui-icon-dustbin mui-must" @tap="deleteCustomers(list.id)"></span>
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
  export default{
    data: function () {
      return {
        lists: store.state.lists,
        current: store.state.current
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      searchParent: function () {
        this.$router.go('/hierarchy-search');
      },
      searchChild: function () {
        this.$router.go('/hierarchy-search/1');
      },

      deleteCustomers: function (id) {
        var self = this;
        mui.alert('确定要解除关系吗?', '提示', function () {
          store.removeCustomers(id, function () {
            store.init(self.current.currentId);
          });
        });
      },
      editParent: function (type) {
        if (type) {
          store.state.isParent = 1;
          var remarks = type.remark ? type.remark : null;
          this.$router.go('/hierarchy-parent/' + type.id + '/' + type.name + '/' + remarks);
        } else {
          this.$router.go('/hierarchy-parent');
        }
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    },
    route: {
      activate: function (transition) {
        store.state.isParent = 0;
        transition.next();
      }
    }
  };
</script>
