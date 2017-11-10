/**
* @file 创建新的日程 页面
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <div>
      <crm-newpage :num="num" :items="listdata" :title="title" v-on:hide-newpage="hideNewPage"></crm-newpage>
    </div>
  </div>
</template>
<script>
  import store from '../addschedule-store';
  import crmNewPage from '../../public/components/crm-new/crm-newpage.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'crm-newpage': crmNewPage
    },
    data: function () {
      return {
        isB: false,
        isShow: false,
        isShowPage: null,
        num: 2,
        name: '更多详细信息',
        title: '创建一个新的...',
        currentHeader: {},
        listdata: [{
          icon: 'crm-birthday',
          name: '生日',
          type: 'back',
          function: 'birthdayNew'
        }, {
          icon: 'crm-schedule',
          name: '日程',
          type: 'back',
          function: 'scheduleNew'

        }, {
          icon: 'crm-task',
          name: '任务',
          function: 'taskManage',
          page: 'toAdd',
          param: {}
        }, {
          icon: 'crm-sales-activities',
          name: '活动',
          function: 'activity',
          page: 'toAdd',
          param: {}
        }]
      };
    },
    events: {
      'parent-show': function () {
        nativeApi.goNative({
          'apiJson': {
            'fn': 'schedule'
          }
        });
      },
      'goTo': function (fn) {
        store.cleanAdd();
        if (fn === 'scheduleNew') {
          this.$router.go('/scheduleAdd');
        } else if (fn === 'birthdayNew') {
          this.$router.go('/birthdayAdd');
        }
        this.isShow = false;
      }
    },
    methods: {
      back: function () {
        nativeApi.goNative({
          'apiJson': {
            'fn': 'schedule'
          }
        });
      },
      showNewpage: function (num) {
        // num  2 显示两列   3 显示3列
        this.num = num;
        this.isShow = true;
      },
      hideNewPage: function (bool) {
        this.$emit('send-hidenewpage', bool);
      }
    },
    ready: function () {
    }
  };
</script>
