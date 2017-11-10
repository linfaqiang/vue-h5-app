/**
* @file 分配 人员和部门
* @author hj
* @date 2016-11-22
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav myCustomersHeader">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="goBack()"></a>
      <h1 class="mui-title" v-text="title"></h1>
    </header>
    <div class="mui-content" style="padding: 0;">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="select_person_dept">
            <ul>
              <li v-for="pd in personDept.personDeptArr" @tap="selectFn($index)">
                <span class="check" :class="{not: !pd.selected}"></span>
                <span v-text="pd.deptName||pd.text"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../report-store';
  export default {
    data: function () {    // 组件的数据格式
      return {
        title: '',
        personDept: store.state
      };
    },
    methods: {
      goBack: function () {
        history.go(-1);
      },
      selectFn: function (index) {
        var personDeptData = this.personDept.personDeptArr[index];
        var dataType = this.$route.params.dataType || '';
        if (dataType === 'staff') {
          store.updateField('employee', personDeptData.text);
          store.updateField('employeeId', personDeptData.id);
        } else if (dataType === 'dept') {
          store.updateField('depth', personDeptData.deptName);
          store.updateField('depthId', personDeptData.deptId);
        }
        history.go(-1);
      }
    },
    created: function () {
      var dataType = this.$route.params.dataType || '';
      if (dataType === 'staff') {
        this.title = '选择人员';
      } else if (dataType === 'dept') {
        this.title = '选择部门';
      }
    },
    ready: function () {
      mui.init();
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
