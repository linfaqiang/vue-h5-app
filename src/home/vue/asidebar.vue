<template>
	<aside class="mui-off-canvas-left">
    <div class="mui-scroll-wrapper">
      <div class="mui-scroll">
        <!-- 菜单具体展示内容 -->
        <div class="head-portrait" @tap="goLink('/account')">
        	<img :src="asides.imageAddress" >
        	<span>{{asides.userName}}</span>
        </div>
        <ul class="slide-list-ul">
        	<li class="icon1">
            <a @tap="toLink('/taskManage/index.html')">
              任务
              <i v-show="unreadMsg.taskCount > 0"> {{ unreadMsg.taskCount }} </i>
            </a>
          </li>
          <li class="icon2">
            <a @tap="toLink('/schedule/index.html')">
              日程
              <i v-show="unreadMsg.auditCount > 0"> {{ unreadMsg.auditCount }} </i>
            </a>
          </li>
          <li class="icon3">
            <a @tap="toLink('/priceApproval/index.html')">
              审批
            </a>
          </li>
        </ul>
        <ul class="slide-list-ul settting-ul">
        	<li><a @tap="toLink('/setting/index.html#!/')"></span>设置</a></li>
        </ul>
      </div>
    </div>
  </aside>
</template>
<script>
  import {APIS} from 'configPort';
  export default {
    data: function () {
      return {
        unreadMsg: {},
        asides: {}
      };
    },
    created: function () {
      var _this = this;
      this.$http.get(APIS.message_unread).then(
        function (res) {
          _this.unreadMsg = res.data.data;
        },
        function (res) {
          mui.alert('请求出错了！');
        }
      );
      var jsonBenches = window.localStorage.getItem('benches');
      this.asides = JSON.parse(jsonBenches).emp;
    },
    methods: {
      toLink: function (path) {
        window.location.href = path;
      },
      goLink: function (path) {
        this.$router.go(path);
      }
    }
  };
</script>

