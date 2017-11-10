<template>
  <div class="mui-scroll-wrapper" style="top: 130px;">
    <div class="mui-scroll">
      <ul class="mui-table-view dept-list">
        <li v-for="list in dept.deptList" class="mui-table-view-cell">
          <span @click="select($index)" class="mui-icon"
                :class="{'crm-circle': !list.selected,'crm-solid-check': list.selected,'selected': list.selected}"></span>
          <a @click="selectTo($index)"><span class="up_dep">{{list.upDept}}</span><span>{{list.deptName}}</span><span
            class="mui-icon mui-icon-arrowright arrow"></span></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  // 公共的数据
  import store from './em-store';
  export default{
    data: function () {
      return {
        dept: store.state
      };
    },
    methods: {
      'select': function (idx) {
        var self = this;
        var selected = self.dept.deptList[idx].selected;
        if (selected) {
          self.dept.deptList[idx].selected = false;
          store.deleteDeptEmp(self.dept.deptList[idx].deptId, function () {
            setTimeout(function () {
              self.$nextTick(function () {
                self.scroller && self.scroller.refresh();
                if (self.scroller.maxScrollX < -50)self.scroller.scrollTo(self.scroller.maxScrollX, 0, 500);
              });
            }, 100);
          });
        } else {
          self.dept.deptList[idx].selected = true;
          store.addDeptEmp(self.dept.deptList[idx].deptId, function () {
            setTimeout(function () {
              self.$nextTick(function () {
                self.scroller && self.scroller.refresh();
                if (self.scroller.maxScrollX < -50)self.scroller.scrollTo(self.scroller.maxScrollX, 0, 500);
              });
            }, 100);
          });
        }
      },
      'selectTo': function (idx) {
        var self = this;
        var param = this.$route.params.fun;
        store.deptEmp(self.dept.deptList[idx].deptId, function () {
          self.$router.go('/employee-select/' + param + '/person-list');
          setTimeout(function () {
            self.$nextTick(function () {
              self.scroller && self.scroller.refresh();
              if (self.scroller.maxScrollX < -50)self.scroller.scrollTo(self.scroller.maxScrollX, 0, 500);
            });
          }, 100);
        });
      }
    },
    created: function () {
      store.initDeptEmp();
    },
    ready: function () {
      this.scroller = mui('.search-box .top-bar-wrapper').scroll({
        scrollY: false,
        scrollX: true,
        indicators: true
      });
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
