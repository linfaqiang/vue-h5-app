/**
* @file 分配 人员和部门
* @author hj
* @date 2016-11-22
*/
<template>
  <div>
    <header id='header' class='mui-bar mui-bar-nav myCustomersHeader'>
      <a class='mui-icon mui-icon-left-nav mui-pull-left' @tap='goBack()'></a>
      <h1 class='mui-title'>选择分配对象</h1>
      <a class='mui-btn mui-btn-link mui-pull-right' @tap='saveDistribute'>确定</a>
    </header>
    <div class='mui-content' style='padding: 0;'>
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class='select_person_dept'>
            <ul>
              <li v-for='pd in personDept.personDeptArr' @tap='selectFn($index)'>
                <span class='check' :class='{not: !pd.selected}'></span>
                <span v-text='pd.name'></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../clue-store';
  export default {
    data: function () {    // 组件的数据格式
      return {
        personDept: store.state
      };
    },
    methods: {
      goBack: function () {
        history.go(-1);
      },
      saveDistribute: function () {
        var btnArray = ['取消', '确定'];
        var self = this;
        mui.confirm('是否确定分配？', '提示', btnArray, function (e) {
          if (e.index === 1) {
            var personDeptArr = self.personDept.personDeptArr;
            var personDeptData = {};
            for (var i = 0; i < personDeptArr.length; i++) {
              if (personDeptArr[i].selected === true) {
                personDeptData = personDeptArr[i];
              }
            }
            var param = {};
            var detailData = self.personDept.detailData;
            if (personDeptData.type === 'dept') {
              param = {
                'fromDeptId': detailData.ownerDeptId || 0,
                'fromUserId': detailData.ownerStaffId || 0,
                'toDeptId': personDeptData.id,
                'toOrgId': 0,
                'toStaffId': 0,
                'assignType': 0,
                'assignReason': '分配给' + personDeptData.name
              };
            } else if (personDeptData.type === 'staff') {
              param = {
                'fromDeptId': detailData.ownerDeptId || 0,
                'fromUserId': detailData.ownerStaffId || 0,
                'toDeptId': 0,
                'toOrgId': 0,
                'toStaffId': personDeptData.id,
                'assignType': 1,
                'assignReason': '分配给' + personDeptData.name
              };
            } else if (personDeptData.type === 'parent') {
              param = {
                'fromDeptId': detailData.ownerDeptId || 0,
                'fromUserId': detailData.ownerStaffId || 0,
                'toDeptId': personDeptData.id,
                'toOrgId': 0,
                'toStaffId': personDeptData.id,
                'assignType': 0,
                'assignReason': '分配给' + personDeptData.name
              };
            } else {
              param = {
                'fromDeptId': detailData.ownerDeptId || 0,
                'fromUserId': detailData.ownerStaffId || 0,
                'toDeptId': 0,
                'toOrgId': 0,
                'toStaffId': 0,
                'assignType': 3,
                'assignReason': '分配给资源池'
              };
            }
            store.distributionClue(detailData.id, param, function () {
              store.listRefresh('list');
              history.go(-2);
            });
          }
        });
      },
      selectFn: function (index) {
        var personDeptArr = this.personDept.personDeptArr;
        for (var i = 0; i < personDeptArr.length; i++) {
          if (personDeptArr[i].selected === true) {
            personDeptArr[i].selected = false;
          }
        }
        personDeptArr[index].selected = true;
        this.personDept.personDeptArr = personDeptArr;
      }
    },
    created: function () {
    },
    ready: function () {
      mui.init();
      mui('.mui-scroll-wrapper').scroll({
        indicators: true
      });
    }
  };
</script>
