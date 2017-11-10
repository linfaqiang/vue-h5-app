<template>
  <div id="employee-select">
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()">确定</a>
    </header>

    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <search-select></search-select>
      <router-view keep-alive></router-view>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import './index.css';
</style>
<script>
  require('db.sqlite');
  // 公共的数据
  import store from './em-store';
  // 加载搜索+选择框
  import SearchSelected from './search-selected.vue';

  export default {
    components: {
      'search-select': SearchSelected
    },
    data: function () {
      return {
        currentHeader: {
          title: '人员选择'
        },
        index: store.state,
        currentIndex: 0
      };
    },
    methods: {
      confirm: function () {
        var self = this;
        var param = self.$route.params.fun;
        var lists = store.state.personSelectList;
        var deptList = store.state.deptList;
        var deptSelectList = [];
        if (lists.length === 0) {
          mui.alert('请选择人员！', '提示', function () {
          });
          return;
        }
        window[param](lists);
        for (var i = 0; i < deptList.length; i++) {
          if (deptList[i].selected) {
            deptSelectList.push(deptList[i]);
          }
        }
        sessionStorage.setItem(param, JSON.stringify({
          'emp': lists,
          'dept': deptSelectList
        }));
        if (this.$route.path.indexOf('/employee-select/' + param + '/person-list') > -1) {
          history.go(-2);
        } else {
          history.go(-1);
        }
      }
    },
    created: function () {
    },
    route: {
      activate: function () {
        /* 只在新进入该页面时调用 */
        var self = this;
        var param = self.$route.params.fun;
        var dataJson = JSON.parse(sessionStorage.getItem(param) || '{}');
        store.initSetDeptEmp(dataJson);
      }
    },
    ready: function () {
    }
  };
</script>
