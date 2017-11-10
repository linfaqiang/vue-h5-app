<template>
	<div class="date-container">
	  <div class="date-list-container">
	    <ul>
	      <li v-for="active in activelist" @tap="toDetailLink(active)">
          <div class="lf-icon">
              <span class="mui-icon crm-birthday" v-if="active.scheduleType === 1"></span>
              <span class="mui-icon crm-schedule" v-if="active.scheduleType === 0"></span>
              <span class="mui-icon crm-task" v-if="active.scheduleType === 3"></span>
              <span class="mui-icon crm-sales-activities" v-if="active.scheduleType === 4"></span>
              <span> {{active.scheduleTypeName}} </span>
          </div>
          <div class="rt-content">
            <h4> {{active.subject}} </h4>
            <p> {{active.taskTime}} </p>
          </div>
	      </li>
	    </ul>
	  </div>
	</div>
</template>
<script>
  import {APIS} from 'configPort';
  export default {
    data: function () {
      return {
        activelist: []
      };
    },
    created: function () {
      var _this = this;
      this.$http.get(APIS.my_schedule_today).then(
        function (res) {
          _this.activelist = res.data.data;
        }
      );
    },
    methods: {
      toLink: function (path) {
        window.location.href = path;
      },
      toDetailLink: function (active) {
        if (active.scheduleType === 0) {
          window.location.href = '../schedule/index.html#scheduleDetail/' + active.myScheduleId;
        } else if (active.scheduleType === 1) {
          window.location.href = '../schedule/index.html#birthdayDetail/' + active.myScheduleId;
        } else if (active.scheduleType === 3) {
          window.location.href = '../taskManage/index.html#nativeDetail/' + active.myScheduleId;
        } else if (active.scheduleType === 4) {
          window.location.href = '../activity/index.html#nativeDetail/' + active.myScheduleId;
        }
      }
    }
  };
</script>
